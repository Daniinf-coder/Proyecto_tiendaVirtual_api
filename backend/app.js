const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');
require('dotenv').config();

const app = express();

// Middlewares obligatorios
app.use(cors());          // Permite peticiones desde el Live Server de tu frontend
app.use(express.json());  // Permite que Express lea formatos JSON en el body de POST/PUT

// Configuración de la ruta base para la entidad cliente
app.use('/api/clientes', clienteRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
