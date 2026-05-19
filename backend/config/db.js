const { Pool } = require('pg');
require('dotenv').config();

// Creamos el Pool de conexiones usando las variables del archivo .env
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Probamos la conexión al iniciar el servidor
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error crítico al conectar con PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL establecida.');
  }
});

module.exports = pool;
