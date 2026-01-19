import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/logincss.css";
import Swal from "sweetalert2";
import googleLogo from '../images/Google.png'

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    if (e) e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
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

      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-title">Iniciar Sesión</h2>

        <input className="login-input" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>

        <div className="input-with-icon">
          <input className="login-input" placeholder="Contraseña" required type={showPassword ? "text" : "password"} value={contrasenia} onChange={(e) => setContrasenia(e.target.value)}/>

          <span className="icon-eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        <button type="submit" className="login-button">
          Ingresar
        </button>

        <a className="login-google" href={`${import.meta.env.VITE_API_URL}/auth/microsoft`}>
          <button type="button" className="google-btn">
            <img src={googleLogo} alt="Google logo" />
            <span>Ingresar con Google</span>
          </button>
        </a>
      </form>
    </div>
  );
}