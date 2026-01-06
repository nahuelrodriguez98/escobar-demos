import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/misregistros.css";

export default function MisRegistros() {
  const empleado = JSON.parse(localStorage.getItem("empleado"));
  const [registros, setRegistros] = useState([]);

  const load = async () => {
    try {
      const r = await axios.get(
        `${import.meta.env.VITE_API_URL}/registros/por-empleado/${empleado.id}`
      );
      setRegistros(r.data);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
    }
  };

  useEffect(() => {
    if (empleado?.id) {
      load();
    }
  }, [empleado?.id]);

  return (
    <div className="misreg-container">
      <h3 className="misreg-title">Mis registros de vehículos</h3>

      {registros.length === 0 ? (
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
                  <td data-label="Fecha salida">
                    {/* CORRECCIÓN: usar x.fecha_salida (con guion bajo) */}
                    {x.fecha_salida ? new Date(x.fecha_salida).toLocaleString() : "—"}
                  </td>
                  <td data-label="Vehículo">{x.modelo}</td>
                  <td data-label="Patente">{x.patente}</td>
                  <td data-label="Destino">{x.destino}</td>
                  <td data-label="Salida (km)">
                    {/* CORRECCIÓN: usar x.kilometraje_salida */}
                    {x.kilometraje_salida} km
                  </td>
                  <td data-label="Retorno (km)">
                    {/* CORRECCIÓN: usar x.kilometraje_retorno */}
                    {x.kilometraje_retorno ? `${x.kilometraje_retorno} km` : "—"}
                  </td>
                  <td data-label="Fecha retorno">
                    {/* CORRECCIÓN: usar x.fecha_retorno */}
                    {x.fecha_retorno
                      ? new Date(x.fecha_retorno).toLocaleString()
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
