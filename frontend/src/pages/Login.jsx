import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/logincss.css";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        contrasenia,
      });
      localStorage.removeItem("empleado");
      localStorage.setItem("empleado", JSON.stringify(res.data));

      if (res.data.rol === "admin") navigate("/admin");
      else navigate("/empleado");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        confirmButtonText: "Salir",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="input-with-icon">
          <input
            className="login-input"
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"}
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
          />

          <span
            className="icon-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Ingresar
        </button>

        <a className="login-microsoft" href="http://localhost:4000/auth/microsoft">
          <button>Ingresar con Microsoft</button>
        </a>
      </div>
    </div>
  );
}
