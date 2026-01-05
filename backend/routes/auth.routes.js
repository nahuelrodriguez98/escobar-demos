const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// =======================
// Login Microsoft
// =======================
router.get(
  "/microsoft",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/login",
  })
);

// =======================
// Callback Microsoft
// =======================
router.get(
  "/callback",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const email = req.user._json.preferred_username;
    const nombre = req.user.displayName;
    const azure_id = req.user.oid;

    console.log("LOGIN MICROSOFT:", { email, nombre, azure_id });

    // Buscar empleado existente
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
      const empleado = existing.rows[0];
      empleadoId = empleado.id;
      rol = empleado.rol;

      if (!empleado.azure_id) {
        await db.query(
          `UPDATE empleados SET azure_id = $1 WHERE id = $2`,
          [azure_id, empleadoId]
        );
      }
    } else {
      const defaultRol = "empleado";
      const defaultConcesionariaId = 23;

      const insert = await db.query(
        `
        INSERT INTO empleados
          (nombre, email, azure_id, rol, concesionaria_id)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [nombre, email, azure_id, defaultRol, defaultConcesionariaId]
      );

      empleadoId = insert.rows[0].id;
      rol = defaultRol;
    }

    // Guardar sesión
    req.session.user = {
      id: empleadoId,
      nombre,
      email,
      azure_id,
      rol,
    };

    console.log("SESION GUARDADA:", req.session.user);

    // Generar token
    const token = jwt.sign(
      req.session.user,
      process.env.JWT_SECRET || "mi_token_secreto_admin_escobar",
      { expiresIn: "3h" }
    );

    return res.redirect(
      `${import.meta.env.FRONTEND_URL}/auth/success?token=${token}`
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
  let user = req.session.user;

  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      user = jwt.verify(
        token,
        process.env.JWT_SECRET || "mi_token_secreto_admin_escobar"
      );
    } catch {
      return res.status(401).json({ error: "Token inválido" });
    }
  }

  if (!user) {
    return res.status(401).json({ error: "No hay sesión activa" });
  }

  res.json(user);
});

module.exports = router;
