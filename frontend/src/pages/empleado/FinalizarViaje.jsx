import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/finalizarviaje.css";

export default function FinalizarViaje() {
  const empleado = JSON.parse(localStorage.getItem("empleado"));
  const [viajes, setViajes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    registroId: "",
    kilometrajeRetorno: "",
    fechaRetorno: "",
  });

  const load = async () => {
    try {
      const r = await axios.get(`${API_URL}/registros/abiertos/${empleado.id}`);
      setViajes(Array.isArray(r.data) ? r.data : [r.data]);
    } catch (err) {
      console.error("Error cargando viajes abiertos", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const finalizar = async () => {
    // Validaciones básicas antes de enviar
    if (!form.registroId || !form.kilometrajeRetorno || !form.fechaRetorno) {
      Swal.fire({
        icon: "warning",
        title: "Atención!",
        text: "Todos los campos son obligatorios para finalizar el viaje.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      // PREPARACIÓN DE DATOS PARA POSTGRESQL
      const datosFinales = {
        ...form,
        kilometrajeRetorno: parseInt(form.kilometrajeRetorno, 10), // Forzar número
        fechaRetorno: new Date(form.fechaRetorno).toISOString(), // Formato ISO para DB
      };

      await axios.put(
        `${API_URL}/registros/finalizar/${form.registroId}`,
        datosFinales
      );

      Swal.fire({
        icon: "success",
        title: "¡Viaje finalizado!",
        text: "El viaje se registró correctamente.",
        confirmButtonText: "Perfecto",
      });

      setForm({
        registroId: "",
        kilometrajeRetorno: "",
        fechaRetorno: "",
      });

      load(); // Recargar la lista de viajes abiertos
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.error || "Error desconocido al finalizar el viaje.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonText: "Entendido",
      });
    }
  };

  return (
    <div className="finalizar-viaje-content">
      <div className="finalizar-viaje">
        <h3>Finalizar viaje</h3>
        <div className="form-row">
          <select
            value={form.registroId}
            onChange={(e) => setForm({ ...form, registroId: e.target.value })}
          >
            <option value="">Seleccione un viaje</option>
            {viajes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.patente} - {v.destino}
              </option>
            ))}
          </select>

          <input
            type="number" // Cambiado a type number para facilitar entrada
            placeholder="Kilometraje retorno"
            value={form.kilometrajeRetorno}
            onChange={(e) => setForm({ ...form, kilometrajeRetorno: e.target.value })}
          />

          <input
            type="datetime-local"
            value={form.fechaRetorno}
            onChange={(e) => setForm({ ...form, fechaRetorno: e.target.value })}
          />
        </div>

        <button className="boton-finalizar" onClick={finalizar}>
          Finalizar viaje
        </button>
      </div>
    </div>
  );
}