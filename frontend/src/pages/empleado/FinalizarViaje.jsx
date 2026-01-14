import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/finalizarviaje.css";

export default function FinalizarViaje() {
  const [empleado] = useState(() => {
    try {
      const item = localStorage.getItem("empleado");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });

  const [viajes, setViajes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Estado para controlar el checkbox
  const [sinObservaciones, setSinObservaciones] = useState(false);

  const [form, setForm] = useState({
    registroId: "",
    kilometrajeRetorno: "",
    fechaRetorno: "",
    observaciones: "",
  });

  const load = async () => {
    if (!empleado?.id) return;
    try {
      const r = await axios.get(`${API_URL}/registros/abiertos/${empleado.id}`);
      setViajes(Array.isArray(r.data) ? r.data : [r.data]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador exclusivo para el checkbox
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSinObservaciones(isChecked);
    
    setForm((prev) => ({
      ...prev,
      observaciones: isChecked ? "Sin observaciones" : "" 
    }));
  };

  const handleDateChange = (e) => {
    // ... (Misma lógica de fecha anterior)
    const inputElement = e.target;
    let value = inputElement.value;
    const parts = value.split("-");
    const year = parts[0];

    if (year && year.length > 4) {
      parts[0] = year.substring(0, 4);
      value = parts.join("-");
      setForm((prev) => ({ ...prev, fechaRetorno: value }));
      requestAnimationFrame(() => {
        inputElement.selectionStart = 4;
        inputElement.selectionEnd = 4;
      });
    } else {
      setForm((prev) => ({ ...prev, fechaRetorno: value }));
    }
  };

  const finalizar = async () => {
    // 1. Validar ID
    if (!form.registroId) {
      return Swal.fire("Atención", "Seleccione un viaje.", "warning");
    }

    // 2. Validar Campos numéricos y fechas
    if (!form.kilometrajeRetorno || !form.fechaRetorno) {
      return Swal.fire("Atención", "Complete el kilometraje y fecha.", "warning");
    }

    // 3. NUEVA VALIDACIÓN: Observaciones obligatorias
    if (!form.observaciones || form.observaciones.trim() === "") {
      return Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Debe escribir una observación o marcar la casilla 'Sin observaciones'.",
      });
    }

    try {
      await axios.put(`${API_URL}/registros/finalizar/${form.registroId}`, form);

      Swal.fire("¡Listo!", "Viaje finalizado correctamente.", "success");

      setForm({
        registroId: "",
        kilometrajeRetorno: "",
        fechaRetorno: "",
        observaciones: "",
      });
      setSinObservaciones(false); // Resetear checkbox

      load();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e.response?.data?.error || "Error desconocido", "error");
    }
  };

  if (!empleado) return <div>No hay empleado identificado.</div>;

  return (
    <div className="finalizar-viaje-content">
      <div className="finalizar-viaje">
        <h3>Finalizar viaje</h3>

        <div className="form-row">
          <select
            name="registroId"
            value={form.registroId}
            onChange={handleChange}
            className="custom-select"
          >
            <option value="">Seleccione un viaje</option>
            {viajes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.patente} - {v.destino}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="kilometrajeRetorno"
            placeholder="Km retorno"
            value={form.kilometrajeRetorno}
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="fechaRetorno"
            value={form.fechaRetorno}
            onInput={handleDateChange}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            className="custom-input"
            placeholder="Observaciones"
            disabled={sinObservaciones} // Se deshabilita si el check está activo
          />
          
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              id="chkSinObs" 
              checked={sinObservaciones}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="chkSinObs">Sin observaciones</label>
          </div>

        </div>

        <button className="boton-finalizar" onClick={finalizar}>
          Finalizar viaje
        </button>
      </div>
    </div>
  );
}