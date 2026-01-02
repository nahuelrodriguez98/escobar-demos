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

      <h2 className="empleado-titulo">Panel del Empleado</h2>

      {/* TABS */}
      <div className="tabs">
        <button
          className={tab === "registrar" ? "tab active" : "tab"}
          onClick={() => setTab("registrar")}
        >
          Registrar uso
        </button>

        <button
          className={tab === "registros" ? "tab active" : "tab"}
          onClick={() => setTab("registros")}
        >
          Mis registros
        </button>

        <button
          className={tab === "finalizar" ? "tab active" : "tab"}
          onClick={() => setTab("finalizar")}
        >
          Finalizar viaje
        </button>
      </div>

      <div className="empleado-card">
        {tab === "registrar" && <RegistrarUso />}
        {tab === "registros" && <MisRegistros />}
        {tab === "finalizar" && <FinalizarViaje />}
        
                <FooterAdmin />
      </div>
    </div>
  );
}
