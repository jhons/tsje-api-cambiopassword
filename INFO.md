3️⃣ ¿Qué opción es mejor?

```bash
Opción              Ideal para              Recomendación
---------------------------------------------------------------------
.env + dotenv       Desarrollo y pruebas    ✔ Usá con nodemon o node
ecosystem.config.js  Producción con PM2      ✔ Usá en servidores
---------------------------------------------------------------------
```

4️⃣ Comandos útiles PM2

```bash
  pm2 start ecosystem.config.js
  pm2 restart app-cambio-password
  pm2 logs app-cambio-password
  pm2 stop app-cambio-password
```

Compilar CSS

```bash
npx @tailwindcss/cli -i ./src/app.css -o ./public/app.css --watch --minify
```

Compilar JS

```bash
uglifyjs ./src/app.js -o ./public/app.js -c -m
```

```bash
uglifyjs ./src/app.js -o ./public/app.js -c -m toplevel --comments=false
```

Whatsapp para cambios
+595 982 77 13 83

```php
$hash = password_hash($nuevaPassword, PASSWORD_BCRYPT, ['cost' => 10]);
```

```nodejs
const hashedPass = await bcrypt.hash(nuevaPassword, 10);
```
