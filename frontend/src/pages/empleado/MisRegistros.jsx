import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/misregistros.css";

export default function MisRegistros() {
  const empleado = JSON.parse(localStorage.getItem("empleado"));
  const [registros, setRegistros] = useState([]);

  const load = async () => {
    try {
      const r = await axios.get(
        `http://localhost:4000/registros/por-empleado/${empleado.id}`
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
    <div className="registros-container">
      <h3>Mis Registros de Vehículos</h3>

      {registros.length === 0 ? (
        <p>No hay registros de vehículos para mostrar.</p>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha Salida</th>
                <th>Vehículo</th>
                <th>Patente</th>
                <th>Destino</th>
                <th>Salida (Kms)</th>
                <th>Retorno (Kms)</th>
                <th>Fecha Retorno</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((x) => (
                <tr key={x.id}>
                  <td>{new Date(x.fechaSalida).toLocaleString()}</td>
                  <td>{x.modelo}</td>
                  <td>{x.patente}</td>
                  <td>{x.destino}</td>
                  <td>{x.kilometrajeSalida} Km</td>
                  <td>
                    {x.kilometrajeRetorno
                      ? `${x.kilometrajeRetorno} Km`
                      : "—"}
                  </td>
                  <td>
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
