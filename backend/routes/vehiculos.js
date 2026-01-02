const express = require("express");
const router = express.Router();
const { query } = require("../config/db");
const generarQR = require("../utils/generarQR");

/* ===============================
   GET /vehiculos
================================ */
router.get("/", async (req, res) => {
  try {
    const result = await query(`
      SELECT v.id, v.patente, v.marca, v.modelo, v.activo,
             v.concesionaria_id, c.nombre AS concesionaria
      FROM vehiculos v
      LEFT JOIN concesionarias c ON v.concesionaria_id = c.id
      ORDER BY v.patente
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET /vehiculos", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* ===============================
   GET /vehiculos/todos
================================ */
router.get("/todos", async (req, res) => {
  try {
    const result = await query(`
      SELECT v.id, v.patente, v.marca, v.modelo, v.activo,
             v.concesionaria_id, c.nombre AS concesionaria
      FROM vehiculos v
      LEFT JOIN concesionarias c ON v.concesionaria_id = c.id
      ORDER BY v.patente
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET /vehiculos/todos", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* ===============================
   GET /vehiculos/:id
================================ */
router.get("/:id", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM vehiculos WHERE id = $1",
      [Number(req.params.id)]
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    console.error("GET /vehiculos/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* ===============================
   POST /vehiculos
================================ */
router.post("/", async (req, res) => {
  try {
    const { patente, modelo, marca, concesionaria_id, activo, anio } = req.body;

    const result = await query(
      `
      INSERT INTO vehiculos
        (patente, modelo, marca, concesionaria_id, activo, anio)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        patente,
        modelo,
        marca,
        concesionaria_id || null,
        activo ? true : false,
        anio ? Number(anio) : null
      ]
    );

    const creado = result.rows[0];
    const filePath = await generarQR(creado);

    res.json({ vehiculo: creado, qr: filePath });

  } catch (err) {
    console.error("POST /vehiculos ERROR:", err);

    // Duplicado en PostgreSQL
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Error de Duplicidad",
        mensaje: `Ya existe un vehículo con la patente: ${req.body.patente}.`,
        codigo: err.code
      });
    }

    res.status(500).json({ error: "Error servidor", detalle: err.message });
  }
});

/* ===============================
   PUT /vehiculos/:id
================================ */
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { patente, modelo, marca, concesionaria_id, activo } = req.body;

  try {
    await query(
      `
      UPDATE vehiculos
      SET patente = $1,
          marca = $2,
          modelo = $3,
          concesionaria_id = $4,
          activo = $5
      WHERE id = $6
      `,
      [
        patente,
        marca,
        modelo,
        concesionaria_id || null,
        activo ? true : false,
        id
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /vehiculos/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

/* ===============================
   DELETE /vehiculos/:id
================================ */
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await query("DELETE FROM vehiculos WHERE id = $1", [id]);
    res.json({ ok: true });

  } catch (err) {
    console.error("DELETE /vehiculos/:id ERROR:", err);

    // FK violation en PostgreSQL
    if (err.code === "23503") {
      return res.status(400).json({
        error: "No se puede eliminar",
        mensaje: "Este vehículo tiene registros asociados y no puede ser borrado."
      });
    }

    res.status(500).json({
      error: "Error en el servidor",
      detalle: err.message
    });
  }
});

/* ===============================
   GET /vehiculos/por-concesionaria/:id
================================ */
router.get("/por-concesionaria/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await query(
      `
      SELECT v.id, v.patente, v.marca, v.modelo, v.activo,
             v.concesionaria_id, c.nombre AS concesionaria
      FROM vehiculos v
      LEFT JOIN concesionarias c ON v.concesionaria_id = c.id
      WHERE v.concesionaria_id = $1
        AND NOT EXISTS (
          SELECT 1
          FROM registros_uso r
          WHERE r.vehiculo_id = v.id
            AND r.fecha_retorno IS NULL
        )
      ORDER BY v.patente
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /vehiculos/por-concesionaria", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

module.exports = router;
