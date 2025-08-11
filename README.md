# API Cambio de Contraseña

## Descripción

Esta es una API para gestionar el cambio de contraseñas de los sistemas internos. Proporciona endpoints para validar usuarios, cambiar contraseñas y sugerir contraseñas seguras. El proyecto incluye un frontend simple para la interacción del usuario.

## Requisitos Previos

- Node.js
- npm (o un gestor de paquetes compatible)
- PostgreSQL

## Instalación

1.  Clona este repositorio:

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd api-cambiopassword
    ```

2.  Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3.  Crea un archivo de entorno `.env` a partir del archivo `.env.dev` y configura las variables necesarias, como las credenciales de la base de datos y las rutas a los certificados SSL.

    ```bash
    cp .env.dev .env
    ```

## Uso

Para iniciar el servidor en modo de desarrollo, puedes usar:

```bash
node server.js
```

Para un entorno de producción, se recomienda usar [PM2](https://pm2.keymetrics.io/) con el archivo de configuración proporcionado `ecosystem.config.js`.

```bash
pm2 start ecosystem.config.js
```

El servidor se ejecutará en `https://localhost:3000`.

## Scripts Disponibles

- `npm test`: (Actualmente no configurado) Ejecuta los tests.

## Estructura del Proyecto

```
/
├── public/             # Contiene los archivos del frontend (HTML, CSS, JS)
├── src/                # Código fuente de la aplicación (actualmente vacío)
├── .env.dev            # Archivo de ejemplo para las variables de entorno
├── .gitignore          # Archivos y carpetas ignorados por Git
├── ecosystem.config.js # Configuración para el gestor de procesos PM2
├── package.json        # Metadatos y dependencias del proyecto
├── server.js           # Archivo principal del servidor (punto de entrada)
└── README.md           # Este archivo
```

## Endpoints de la API

- `POST /validar`: Valida un usuario y contraseña existentes.
- `POST /cambiar`: Cambia la contraseña de un usuario.
- `GET /sugerir`: Devuelve una sugerencia de contraseña segura.
- `GET /chpsw/:hash`: Muestra la página para resetear la contraseña usando un hash único.
- `POST /chpsw/:hash`: Procesa el reseteo de la contraseña.

## Dependencias Principales

- [Express](https://expressjs.com/): Framework web para Node.js.
- [pg](https://node-postgres.com/): Cliente de PostgreSQL para Node.js.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Librería para hashear contraseñas.
- [dotenv](https://www.npmjs.com/package/dotenv): Carga variables de entorno desde un archivo `.env`.
- [tailwindcss](https://tailwindcss.com/): Framework de CSS.

## Autor

Jhons W.
