const pool = require('../config/db');

// 1. OBTENER TODOS LOS CLIENTES (GET)
const obtenerClientes = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cliente ORDER BY id_cliente ASC');
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

// 2. OBTENER UN CLIENTE POR ID (GET por ID)
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    // Consulta preparada evita inyección SQL al separar el parámetro de la query
    const query = 'SELECT * FROM cliente WHERE id_cliente = $1';
    const resultado = await pool.query(query, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el cliente' });
  }
};

// 3. CREAR CLIENTE (POST)
const crearCliente = async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const query = 'INSERT INTO cliente (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *';
    const resultado = await pool.query(query, [nombre, email, telefono]);
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    // Manejo de error específico por si el email ya existe (llave única)
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

// 4. ACTUALIZAR CLIENTE (PUT)
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;
  try {
    const query = 'UPDATE cliente SET nombre = $1, email = $2, telefono = $3 WHERE id_cliente = $4 RETURNING *';
    const resultado = await pool.query(query, [nombre, email, telefono, id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

// 5. ELIMINAR CLIENTE (DELETE)
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *';
    const resultado = await pool.query(query, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.status(200).json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};
