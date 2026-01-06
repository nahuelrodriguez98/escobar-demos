import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/misregistros.css";

export default function MisRegistros() {
  const empleado = JSON.parse(localStorage.getItem("empleado"));
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);

  const load = async () => {
    try {
      setCargando(true);
      const r = await axios.get(
        `${import.meta.env.VITE_API_URL}/registros/por-empleado/${empleado.id}`
      );
      // El log confirmó que r.data es un array con objetos en camelCase
      setRegistros(r.data);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (empleado?.id) {
      load();
    } else {
      setCargando(false);
    }
  }, [empleado?.id]);

  return (
    <div className="misreg-container">
      <h3 className="misreg-title">Mis registros de vehículos</h3>

      {cargando ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Cargando registros...</p>
        </div>
      ) : registros.length === 0 ? (
        <p className="misreg-empty">No hay registros de vehículos para mostrar.</p>
      ) : (
        <div className="misreg-table-wrapper">
          <table className="misreg-table">
            <thead>
              <tr>
                <th>Fecha salida</th>
                <th>Vehículo</th>
                <th>Patente</th>
                <th>Destino</th>
                <th>Salida (km)</th>
                <th>Retorno (km)</th>
                <th>Fecha retorno</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((x) => (
                <tr key={x.id}>
                  {/* CORRECCIÓN: Usamos camelCase según tu log */}
                  
                  <td data-label="Fecha salida">
                    {/* El log muestra: "2026-01-06T18:14:00.000Z" */}
                    {x.fechaSalida ? new Date(x.fechaSalida).toLocaleString() : "—"}
                  </td>
                  
                  <td data-label="Vehículo">{x.modelo}</td>
                  <td data-label="Patente">{x.patente}</td>
                  <td data-label="Destino">{x.destino}</td>
                  
                  <td data-label="Salida (km)">
                      {x.kilometrajeSalida} km
                  </td>
                  
                  <td data-label="Retorno (km)">
                    {x.kilometrajeRetorno ? `${x.kilometrajeRetorno} km` : "—"}
                  </td>
                  
                  <td data-label="Fecha retorno">
                    {x.fechaRetorno
                      ? new Date(x.fechaRetorno).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}