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
      const r = await axios.get(
        `${API_URL}/registros/abiertos/${empleado.id}`
      );

      setViajes(Array.isArray(r.data) ? r.data : [r.data]);
    } catch (err) {
      console.error("Error cargando viajes abiertos", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const finalizar = async () => {
    if (!form.registroId) {
    
      Swal.fire({
        icon: "warning",
        title: "Atencion!",
        text: "Debe seleccionar un viaje antes de continuar.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      await axios.put(
        `${API_URL}/registros/finalizar/${form.registroId}`,
        form
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

      load();
    } catch (e) {
      console.error(e);

      // Mostrar el error del backend 
      if (e.response && e.response.data && e.response.data.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.error,
          confirmButtonText: "Entendido",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error desconocido",
          text: "Error desconocido al finalizar el viaje.",
          confirmButtonText: "Salir",
        });
      }
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
          placeholder="Kilometraje retorno"
          value={form.kilometrajeRetorno}
          onChange={(e) =>
            setForm({ ...form, kilometrajeRetorno: e.target.value })
          }
        />

        <input
          type="datetime-local"
          value={form.fechaRetorno}
          onInput={(e) => {
            const inputElement = e.target;
            let value = inputElement.value;

            const parts = value.split("-");
            let year = parts[0];

            if (year && year.length > 4) {
              parts[0] = year.substring(0, 4);
              value = parts.join("-");
              setForm({ ...form, fechaRetorno: value });

              requestAnimationFrame(() => {
                inputElement.selectionStart = 4;
                inputElement.selectionEnd = 4;
              });
            } else {
              setForm({ ...form, fechaRetorno: value });
            }
          }}
        />
      </div>

      <button className="btn btn-primary" onClick={finalizar}>
        Finalizar viaje
      </button>
    </div>
    </div>
  );
}
