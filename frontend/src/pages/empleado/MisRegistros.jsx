import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/misregistros.css";

export default function MisRegistros() {
  const empleado = JSON.parse(localStorage.getItem("empleado"));
  const [registros, setRegistros] = useState([]);
  
  // 1. Agregamos un estado para saber si está cargando
  const [cargando, setCargando] = useState(true);

  const load = async () => {
    try {
      setCargando(true); // Empieza la carga
      const r = await axios.get(
        `${import.meta.env.VITE_API_URL}/registros/por-empleado/${empleado.id}`
      );
      setRegistros(r.data);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
    } finally {
      // 2. Terminó la carga (sea éxito o error), quitamos el loading
      setCargando(false);
    }
  };

  useEffect(() => {
    if (empleado?.id) {
      load();
    } else {
        setCargando(false); // Si no hay empleado, no se queda cargando infinito
    }
  }, [empleado?.id]);

  return (
    <div className="misreg-container">
      <h3 className="misreg-title">Mis registros de vehículos</h3>

      {/* 3. Lógica de visualización mejorada */}
      
      {cargando ? (
        /* Muestra esto mientras espera al servidor */
        <div className="loading-container" style={{ textAlign: "center", padding: "20px" }}>
          <p>Cargando registros...</p>
           {/* Aquí podrías poner un spinner (giratorio) si tenés uno */}
        </div>
      ) : registros.length === 0 ? (
        /* Solo muestra esto si TERMINÓ de cargar y NO trajo nada */
        <p className="misreg-empty">No hay registros de vehículos para mostrar.</p>
      ) : (
        /* Muestra la tabla si hay datos */
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
                  {/* Recordá usar los nombres de columnas de la BD (snake_case) */}
                  <td data-label="Fecha salida">
                    {x.fecha_salida ? new Date(x.fecha_salida).toLocaleString() : "—"}
                  </td>
                  <td data-label="Vehículo">{x.modelo}</td>
                  <td data-label="Patente">{x.patente}</td>
                  <td data-label="Destino">{x.destino}</td>
                  <td data-label="Salida (km)">{x.kilometraje_salida} km</td>
                  <td data-label="Retorno (km)">
                    {x.kilometraje_retorno ? `${x.kilometraje_retorno} km` : "—"}
                  </td>
                  <td data-label="Fecha retorno">
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