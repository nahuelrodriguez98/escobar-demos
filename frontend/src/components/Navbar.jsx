import React, { useMemo } from "react";
import "../pages/styles/footer.css";

export default function FooterAdmin() {

  const empleado = useMemo(() => {
    try {
      const data = localStorage.getItem("empleado");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error leyendo datos del empleado", error);
      return null;
    }
  }, []);

  const nombreUsuario = empleado?.nombre || empleado?.email?.split('@')[0] || "Invitado";

  return (
    <footer className="admin-footer">
      <div className="footer-left">
        <span className="label-panel">PANEL DE</span>
        <strong className="rol-badge">
          {empleado?.rol || "USUARIO"}
        </strong>
      </div>

      <div className="footer-right">
        <div className="status-container">
          <span className="status-dot"></span>
          <span className="status-pulse"></span>
        </div>
        <span className="user-info">
          ID: <strong>{nombreUsuario}</strong>
        </span>
      </div>
    </footer>
  );
}