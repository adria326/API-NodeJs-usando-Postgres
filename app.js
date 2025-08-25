const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('API Tareas funcionando!');
  });

// GET /tareas - listar todas
app.get('/tareas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// GET /tareas/:id - por id
app.get('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Tarea no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// POST /tareas - crear tarea
app.post('/tareas', async (req, res) => {
  const { titulo, descripcion } = req.body;
  try {
    await pool.query(
      'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2)',
      [titulo, descripcion]
    );
    const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// PUT /tareas/:id - actualizar tarea
app.put('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, hecho } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tareas SET titulo=$1, descripcion=$2, hecho=$3, actualizado_en=NOW() WHERE id=$4 RETURNING *',
      [titulo, descripcion, hecho, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Tarea no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// DELETE /tareas/:id - eliminar tarea
app.delete('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tareas WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Tarea no encontrada');
    res.send('Tarea eliminada correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});