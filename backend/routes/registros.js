const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// Registros por empleado
router.get("/por-empleado/:empleadoId", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT r.*, v.patente, v.modelo
      FROM registros_uso r
      LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
      WHERE r.empleado_id = $1
      ORDER BY r.fecha_salida DESC
      `,
      [Number(req.params.empleadoId)]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /registros/por-empleado", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Registros abiertos
router.get("/abiertos/:empleadoId", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT r.*, v.patente, v.modelo
      FROM registros_uso r
      LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
      WHERE r.empleado_id = $1
        AND r.fecha_retorno IS NULL
      ORDER BY r.fecha_salida DESC
      `,
      [Number(req.params.empleadoId)]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /registros/abiertos", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Crear registro
router.post("/", async (req, res) => {
  try {
    const {
      empleadoId,
      vehiculoId,
      fechaSalida,
      kilometrajeSalida,
      destino,
      combustibleCargado,
      observaciones,
    } = req.body;

    if (!fechaSalida || !kilometrajeSalida) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    await query(
      `
      INSERT INTO registros_uso
      (empleado_id, vehiculo_id, fecha_salida, kilometraje_salida, destino, combustible_cargado, observaciones)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        Number(empleadoId),
        Number(vehiculoId),
        fechaSalida,
        Number(kilometrajeSalida),
        destino || null,
        Number(combustibleCargado) || 0,
        observaciones || null,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("POST /registros", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Finalizar registro
router.put("/finalizar/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Convertimos explícitamente a Number para evitar errores de comparación
    const kilometrajeRetorno = Number(req.body.kilometrajeRetorno);
    const { fechaRetorno, observaciones } = req.body;

    // 1. Verificar si el registro existe
    const datos = await query(
      `SELECT * FROM registros_uso WHERE id = $1`,
      [id]
    );

    if (datos.rows.length === 0) {
      return res.status(404).json({ error: "El registro no existe" });
    }

    const r = datos.rows[0];

    // 2. Verificar si ya fue finalizado
    if (r.fecha_retorno) {
      return res.status(400).json({ error: "El registro ya está finalizado" });
    }

    // 3. Validar kilometraje (Ahora comparamos Number vs Number)
    if (isNaN(kilometrajeRetorno) || kilometrajeRetorno <= r.kilometraje_salida) {
      return res.status(400).json({
        error: `El kilometraje de retorno (${kilometrajeRetorno}) debe ser mayor al de salida (${r.kilometraje_salida})`,
      });
    }

    // 4. Ejecutar el UPDATE
    await query(
      `
      UPDATE registros_uso
      SET kilometraje_retorno = $1,
          fecha_retorno = $2,
          observaciones = $3
      WHERE id = $4
      `,
      [kilometrajeRetorno, fechaRetorno, observaciones || null, id]
    );

    res.json({ mensaje: "Viaje finalizado correctamente" });
  } catch (err) {
    console.error("PUT /registros/finalizar", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// Listar todos
router.get("/", async (req, res) => {
  try {
    const result = await query(
      `
      SELECT r.id, r.empleado_id, e.nombre AS empleado,
             r.vehiculo_id, v.patente, v.modelo,
             r.fecha_salida, r.fecha_retorno,
             r.kilometraje_salida, r.kilometraje_retorno,
             r.destino, r.combustible_cargado, r.observaciones
      FROM registros_uso r
      LEFT JOIN empleados e ON r.empleado_id = e.id
      LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
      ORDER BY r.fecha_salida DESC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /registros", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    await query(`DELETE FROM registros_uso WHERE id = $1`, [
      Number(req.params.id),
    ]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /registros", err);
    res.status(500).json({ error: "Error servidor" });
  }
});

module.exports = router;
