import React, { useState } from "react";
import RegistrarUso from "../pages/empleado/RegistrarUso";
import MisRegistros from "../pages/empleado/MisRegistros";
import FinalizarViaje from "../pages/empleado/FinalizarViaje";
import FooterAdmin from "../components/Navbar";


import "./styles/empleadoDashboard.css";

export default function EmpleadoDashboard() {
  const [tab, setTab] = useState("registrar");

  return (
    <div className="empleado-dashboard">
      {/* HEADER SECCIÓN */}
      <header className="dashboard-header">
        <div className="header-content">
          <span className="welcome-text">Bienvenido de nuevo,</span>
          <h1 className="empleado-titulo">Escobar Demos</h1>
        </div>
      </header>

      {/* TABS CON ESTILO PILL */}
      <nav className="tabs-container">
        <div className="tabs-wrapper">
          <button
            className={tab === "registrar" ? "tab active" : "tab"}
            onClick={() => setTab("registrar")}
          >
            <span className="tab-icon">📋</span>
            Registrar
          </button>

          <button
            className={tab === "registros" ? "tab active" : "tab"}
            onClick={() => setTab("registros")}
          >
            <span className="tab-icon">🕒</span>
            Historial
          </button>

          <button
            className={tab === "finalizar" ? "tab active" : "tab"}
            onClick={() => setTab("finalizar")}
          >
            <span className="tab-icon">🏁</span>
            Finalizar
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="empleado-card">
        <div className="tab-content-anim">
          {tab === "registrar" && <RegistrarUso />}
          {tab === "registros" && <MisRegistros />}
          {tab === "finalizar" && <FinalizarViaje />}
        </div>
      </main>
      
      <FooterAdmin />
    </div>
  );
}