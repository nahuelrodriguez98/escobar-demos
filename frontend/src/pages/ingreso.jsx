import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function Ingreso() {
  const navigate = useNavigate();

  useEffect(() => {
    const procesarLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se recibió el token de autenticación",
        });
        navigate("/");
        return;
      }

      // Guardar session
      localStorage.setItem("token", token);

      try {
        const res = await axios.get("https://escobardemos.vercel.app/auth/userinfo", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const usuario = res.data;
        localStorage.setItem("empleado", JSON.stringify(usuario));

        if (usuario.rol === "admin") navigate("/admin");
        else navigate("/empleado");

      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo recuperar la información del usuario",
        });
        navigate("/");
      }
    };

    procesarLogin();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Procesando ingreso...</h2>
    </div>
  );
}
