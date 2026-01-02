const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// =======================
// Listar empleados
// =======================
router.get("/", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT 
        e.id,
        e.nombre,
        e.azure_id,
        e.email,
        e.rol,
        e.concesionaria_id,
        c.nombre AS concesionaria
      FROM empleados e
      LEFT JOIN concesionarias c 
        ON e.concesionaria_id = c.id
      ORDER BY e.nombre
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /empleados", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// =======================
// Obtener por id
// =======================
router.get("/:id", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT id, azure_id, nombre, email, concesionaria_id, rol
      FROM empleados
      WHERE id = $1
      `,
      [Number(req.params.id)]
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    console.error("GET /empleados/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// =======================
// Crear empleado
// =======================
router.post("/", async (req, res) => {
  const {
    azure_id = "",
    nombre,
    email,
    concesionaria_id,
    rol,
    contrasenia = "",
  } = req.body;

  try {
    const result = await query(
      `
      INSERT INTO empleados
        (azure_id, nombre, email, concesionaria_id, rol, contrasenia)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [
        azure_id,
        nombre,
        email,
        Number(concesionaria_id),
        rol,
        contrasenia,
      ]
    );

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error("POST /empleados", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// =======================
// Actualizar empleado
// =======================
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, email, concesionaria_id, rol, contrasenia } = req.body;

  try {
    await query(
      `
      UPDATE empleados
      SET
        nombre = $1,
        email = $2,
        concesionaria_id = $3,
        rol = $4,
        contrasenia = $5
      WHERE id = $6
      `,
      [
        nombre,
        email,
        Number(concesionaria_id),
        rol,
        contrasenia,
        id,
      ]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /empleados/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// =======================
// Eliminar empleado
// =======================
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await query(
      `DELETE FROM empleados WHERE id = $1`,
      [id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /empleados/:id", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

module.exports = router;
