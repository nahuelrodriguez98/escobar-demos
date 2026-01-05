require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");      
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const empleadosRoutes = require("./routes/empleados");
const concesionariasRoutes = require("./routes/concesionarias");
const vehiculosRoutes = require("./routes/vehiculos");
const registrosRoutes = require("./routes/registros");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/concesionarias", concesionariasRoutes);
app.use("/vehiculos", vehiculosRoutes);
app.use("/registros", registrosRoutes);
app.use("/qrs", express.static("qrs"));

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

module.exports = app;

