module.exports = {
  apps: [{
    name: 'app-cambio-password',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      DB_HOST: 'app2025-db.tsje.gov.py',
      DB_PORT: 5432,
      DB_NAME: 'portal_empleados',
      DB_USER: 'app',
      DB_PASS: '6daa4c58299dd6557f8d87f2adeba008',
      DB_SSL: true,
      SSL_KEY_PATH: '/home/cia/CERTIFICADOSSSL/2025/tsje.key',
      SSL_CERT_PATH: '/home/cia/CERTIFICADOSSSL/2025/STAR.tsje.gov.py.crt',
      SSL_CA_PATH: '/home/cia/CERTIFICADOSSSL/2025/STAR.tsje.gov.py.ca-bundle'
    }
  }]
};
