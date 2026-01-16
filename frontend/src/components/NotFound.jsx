// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.title}>Página no encontrada</h2>
      <p style={styles.text}>
        Lo sentimos, la ruta a la que intentas acceder no existe o no tienes permisos para verla.
      </p>
      
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate("/")} style={styles.button}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

// Estilos simples dentro del mismo archivo para no complicarte con CSS externo
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    textAlign: "center",
    padding: "20px",
  },
  errorCode: {
    fontSize: "120px",
    margin: "0",
    color: "#e74c3c", // Rojo suave
    lineHeight: "1",
    fontWeight: "bold",
  },
  title: {
    fontSize: "32px",
    margin: "10px 0 20px",
  },
  text: {
    fontSize: "18px",
    color: "#6c757d",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#007bff", // Azul estándar
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.3s",
  },
};