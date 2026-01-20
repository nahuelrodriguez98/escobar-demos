const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { initMicrosoftStrategy } = require("../auth/microsoft");
// =======================
// Login Microsoft
// =======================
router.get("/microsoft", (req, res, next) => {
  initMicrosoftStrategy(); 
  
  try {
      passport.authenticate("azuread-openidconnect")(req, res, next);
  } catch (e) {
      console.error("Error al intentar autenticar con Microsoft", e);
      res.status(500).send("Error de configuración en el servidor (Microsoft Auth no disponible).");
  }
});

// =======================
// Callback Microsoft
// =======================
router.get(
  "/callback",
  (req, res, next) => {
    initMicrosoftStrategy();
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/login"
    })(req, res, next);
  },
  async (req, res) => {
    const email = req.user._json.preferred_username;
    const nombre = req.user.displayName;
    const azure_id = req.user.oid;

    const existing = await db.query(
      `
      SELECT id, rol, azure_id
      FROM empleados
      WHERE azure_id = $1 OR email = $2
      LIMIT 1
      `,
      [azure_id, email]
    );

    let empleadoId;
    let rol;

    if (existing.rows.length > 0) {
      empleadoId = existing.rows[0].id;
      rol = existing.rows[0].rol;

      if (!existing.rows[0].azure_id) {
        await db.query(
          `UPDATE empleados SET azure_id = $1 WHERE id = $2`,
          [azure_id, empleadoId]
        );
      }
    } else {
      const insert = await db.query(
        `
        INSERT INTO empleados
          (nombre, email, azure_id, rol, concesionaria_id)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [nombre, email, azure_id, "empleado", 23]
      );

      empleadoId = insert.rows[0].id;
      rol = "empleado";
    }

    const payload = {
      id: empleadoId,
      nombre,
      email,
      azure_id,
      rol
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${token}`
    );
  }
);
// =======================
// Login clásico
// =======================
router.post("/login", async (req, res) => {
  const { email, contrasenia } = req.body;

  try {
    const result = await db.query(
      `
      SELECT id, nombre, email, rol, concesionaria_id
      FROM empleados
      WHERE email = $1 AND contrasenia = $2
      `,
      [email, contrasenia]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ERROR LOGIN:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =======================
// User info
// =======================
router.get("/userinfo", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No se proporcionó token de autenticación" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json(decoded);
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
});

module.exports = router;
