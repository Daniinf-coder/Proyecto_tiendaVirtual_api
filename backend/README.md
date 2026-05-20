# Proyecto_tiendaVirtual - API REST de Clientes

Este proyecto es una API REST completa y segura desarrollada con **Node.js** y **Express**, conectada a una base de datos relacional **PostgreSQL**.

## Estructura del Proyecto
* `config/db.js`: Conexión segura a PostgreSQL mediante Pool.
* `controllers/`: Lógica CRUD con consultas preparadas (Anti Inyección SQL).
* `routes/`: Endpoints de la API `/api/clientes`.

## Requisitos Previos
1. Tener instalado **Node.js** (versión LTS).
2. Tener instalado **PostgreSQL** y creada la base de datos `carrito_db`.

## Instalación y Uso Local

1. Clona este repositorio o descarga los archivos.
2. Abre la terminal en la carpeta `backend` e instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de la carpeta `backend` con tus credenciales locales:
   ```env
   PORT=3000
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_NAME=carrito_db
   DB_PORT=5432
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
