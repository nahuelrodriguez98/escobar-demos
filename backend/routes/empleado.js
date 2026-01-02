const express = require("express");
const router = express.Router();
const { query } = require("../config/db");
const { registrarUsoVehiculo } = require("../controllers/empleadosController");

// Vehículos por concesionaria
router.get("/vehiculos/:concesionariaId", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT id, patente, marca, modelo
      FROM vehiculos
      WHERE concesionaria_id = $1
        AND activo = true
      `,
      [Number(req.params.concesionariaId)]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /empleados/vehiculos", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Registrar uso rápido
router.post("/registro", async (req, res) => {
  const { empleado_id, vehiculo_id } = req.body;

  try {
    await query(
      `
      INSERT INTO registros_uso
        (empleado_id, vehiculo_id, fecha_salida)
      VALUES ($1, $2, NOW())
      `,
      [empleado_id, vehiculo_id]
    );

    res.json({ ok: true, message: "Uso registrado correctamente" });
  } catch (err) {
    console.error("POST /empleados/registro", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

router.post("/registrar-uso", registrarUsoVehiculo);

module.exports = router;
