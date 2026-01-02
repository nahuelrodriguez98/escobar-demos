const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// Listar todas
router.get("/", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, nombre, direccion FROM concesionarias ORDER BY nombre`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /concesionarias", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Obtener por id
router.get("/:id", async (req, res) => {
  try {
    const result = await query(
      `SELECT id, nombre, direccion FROM concesionarias WHERE id = $1`,
      [Number(req.params.id)]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error("GET /concesionarias/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Crear
router.post("/", async (req, res) => {
  const { nombre, direccion } = req.body;
  try {
    const result = await query(
      `
      INSERT INTO concesionarias (nombre, direccion)
      VALUES ($1, $2)
      RETURNING id
      `,
      [nombre, direccion]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error("POST /concesionarias", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Actualizar
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, direccion } = req.body;
  try {
    await query(
      `
      UPDATE concesionarias
      SET nombre = $1, direccion = $2
      WHERE id = $3
      `,
      [nombre, direccion, id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /concesionarias/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await query(`DELETE FROM concesionarias WHERE id = $1`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /concesionarias/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

module.exports = router;
