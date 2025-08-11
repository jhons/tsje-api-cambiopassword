const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const https = require('https');
// const http = require('http');
const fs = require('fs');

require('dotenv').config();


const sslOptions = {
  key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
  cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH)),
  ca: fs.readFileSync(path.resolve(process.env.SSL_CA_PATH))
};

const app = express();
const port = 3000;

// Conexión PostgreSQL
const pool = new Pool({
  host: 'app2025-db.tsje.gov.py',
  port: 5432,
  database: 'portal_empleados',
  user: 'app',
  password: '6daa4c58299dd6557f8d87f2adeba008',
  ssl: { rejectUnauthorized: false }
});

app.use(bodyParser.json());

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint: Validar usuario y contraseña
app.post('/validar', async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const userRes = await pool.query(
      `SELECT se_usuarioweb_id, se_usuarioweb_pass FROM view_usuarios_web WHERE se_usuarioweb_user = $1`,
      [usuario]
    );

    if (userRes.rowCount === 0 || userRes.rows[0].se_usuarioweb_pass !== password) {
      return res.status(400).json({ message: 'Usuario y/o contraseña incorrectos.' });
    }

    const passRes = await pool.query(
      `SELECT 1 FROM se_apppasswords WHERE se_apppassword_usuario = $1`,
      [usuario]
    );

    if (passRes.rowCount > 0) {
      return res.status(400).json({ message: 'El usuario ya generó su contraseña. Para cambiarla comuníquese con CIA.' });
    }

    res.json({ message: 'OK', usuario_id: userRes.rows[0].se_usuarioweb_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor.', error: err.message });
  }
});

// Endpoint: Cambiar contraseña
app.post('/cambiar', async (req, res) => {
  const { usuario, nuevaPassword } = req.body;

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/.test(nuevaPassword)) {
    return res.status(400).json({ message: 'La contraseña no cumple con los criterios de seguridad.' });
  }

  try {
    const userRes = await pool.query(
      `SELECT se_usuarioweb_id FROM view_usuarios_web WHERE se_usuarioweb_user = $1`,
      [usuario]
    );

    if (userRes.rowCount === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    const hashedPass = await bcrypt.hash(nuevaPassword, 10);

    await pool.query(
      `INSERT INTO se_apppasswords (se_apppassword_fecha, se_apppassword_usuario, se_apppassword_password, se_usuario_id, se_apppassword_origen)
       VALUES (now(), $1, $2, $3, 'CAMBIO')`,
      [usuario, hashedPass, userRes.rows[0].se_usuarioweb_id]
    );

    res.json({ message: 'Contraseña cambiada exitosamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor.', error: err.message });
  }
});

// Endpoint: Sugerir contraseña
app.get('/sugerir', (req, res) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;';
  let password = '';
  while (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/.test(password)) {
    password = Array.from({ length: 12 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('');
  }
  res.json({ password });
});

app.get('/chpsw/:hash', async (req, res) => {
  const { hash } = req.params;
  try {
    // Verificar si el hash es válido
    const hashRes = await pool.query(
      `SELECT usuario FROM se_apppassword_hashes WHERE hash = $1 AND modificado IS NULL`,
      [hash]
    );

    // Si no se encuentra el hash o ya fue modificado
    if (hashRes.rowCount === 0) {
      return res.status(404).sendFile(path.join(__dirname, 'public', 'invalid.html'));
    }

    // Si el hash es válido, servir la página de cambio de contraseña
    res.sendFile(path.join(__dirname, 'public', 'reset.html'));

  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor.');
  }
});

app.post('/chpsw/:hash', async (req, res) => {
  const { hash } = req.params;
  const { nuevaPassword } = req.body;

  // Validar la nueva contraseña
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/.test(nuevaPassword)) {
    return res.status(400).json({ message: 'La contraseña no cumple con los criterios de seguridad.' });
  }

  try {
    // Verificar si el hash es válido
    const hashRes = await pool.query(
      `SELECT usuario FROM se_apppassword_hashes WHERE hash = $1 AND modificado IS NULL`,
      [hash]
    );

    // Si no se encuentra el hash o ya fue modificado
    if (hashRes.rowCount === 0) {
      return res.status(400).json({ message: 'El enlace ya no es válido.' });
    }

    // Obtener el usuario asociado al hash
    const usuario = hashRes.rows[0].usuario;
    // Encriptar la nueva contraseña
    const hashedPass = await bcrypt.hash(nuevaPassword, 10);

    // Obtener el ID del usuario
    const userID = await pool.query(
      `SELECT se_usuarioweb_id FROM view_usuarios_web WHERE se_usuarioweb_user = $1`,
      [usuario]
    );

    const usuarioId = userID.rows[0].se_usuarioweb_id;

    // Insertar la nueva contraseña en la base de datos
    await pool.query(
      `INSERT INTO se_apppasswords (se_apppassword_fecha, se_apppassword_usuario, se_usuario_id, se_apppassword_password, se_apppassword_origen)
      VALUES (now(), $1, $2, $3, 'RESET')`,
      [usuario, usuarioId, hashedPass]
    );

    // Marcar el hash como modificado
    await pool.query(
      `UPDATE se_apppassword_hashes SET modificado = now() WHERE hash = $1`,
      [hash]
    );

    res.json({ message: 'Contraseña cambiada exitosamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Levantar servidor
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${port}`);
});

// http.createServer((req, res) => {
//   res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
//   res.end();
// }).listen(80);
