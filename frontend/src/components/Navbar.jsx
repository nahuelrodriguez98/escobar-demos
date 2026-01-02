import React from "react";
import "../pages/styles/footer.css";

export default function FooterAdmin() {
  const empleado = JSON.parse(localStorage.getItem("empleado"));

  return (
    <footer className="admin-footer">
      <div className="footer-left">
        <h4>Panel de {" "}
          <strong>
            {empleado?.rol || "—"}
          </strong>
        </h4>
      </div>

      <div className="footer-right">
        <span className="status-dot"></span>
        <span>
          Usuario:{" "}
          <strong>
            {empleado?.nombre || empleado?.email || "—"}
          </strong>
        </span>
      </div>
    </footer>
  );
}
