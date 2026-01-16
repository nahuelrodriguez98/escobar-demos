import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/styles/notfound.css"

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="errorCode">404</h1>
      <h2 className="title">Página no encontrada</h2>
      <p className="text">
        Lo sentimos, la ruta a la que intentas acceder no existe o no tienes permisos para verla.
      </p>
      
      <div className="buttonContainer">
        <button onClick={() => navigate("/")} className="button">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

