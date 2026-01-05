import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import QrScanner from "../lectorQR";
import "../styles/registros.css";

/* ===================== HELPERS ===================== */

function convertirFechaSQL(fechaRaw) {
  if (!fechaRaw) return null;
  const d = new Date(fechaRaw);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

const getFechaHoraActual = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 16);
};

const cargarEmpleado = async () => {
  try {
    const r = await axios.get(`${import.meta.env.VITE_API_URL}/auth/userinfo`, {
      withCredentials: true,
    });
    if (r.data?.id) return r.data;
  } catch (e) {
    console.warn("No se pudo cargar empleado por API, revisando localStorage...");
  }

  const local = JSON.parse(localStorage.getItem("empleado"));
  if (local?.id) return local;

  return null;
};

/* ===================== COMPONENTES ===================== */

const FuelGauge = ({ combustible, maxCombustible = 70, setCombustible }) => {
  const percentage = (combustible / maxCombustible) * 100;
  const rotationDegrees = (percentage / 100) * 180 - 90;

  let color = "var(--fuel-full-color)";
  if (percentage < 25) color = "var(--fuel-low-color)";
  else if (percentage < 50) color = "var(--fuel-medium-color)";

  return (
    <div className="gauge-container">
      <label className="input-label">Combustible (Litros)</label>

      <div className="gauge">
        <div className="gauge-semicircle">
          <div
            className="gauge-needle"
            style={{
              transform: `translateX(-50%) rotate(${rotationDegrees}deg)`,
            }}
          />
        </div>

        <div className="gauge-center" style={{ color }}>
          <span>{combustible} L</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={maxCombustible}
        step="1"
        value={combustible}
        onChange={(e) => setCombustible(Number(e.target.value))}
        className="gauge-slider"
      />

      <div className="fuelbar-indicator">
        {combustible} L / {maxCombustible} L ({percentage.toFixed(0)}%)
      </div>
    </div>
  );
};

/* ===================== MAIN ===================== */

export default function RegistrarUso() {
  const [vehiculos, setVehiculos] = useState([]);
  const [empleado, setEmpleado] = useState(null);
  const [combustible, setCombustible] = useState(0);
  const [mostrarQR, setMostrarQR] = useState(false);

  const [form, setForm] = useState({
    empleadoId: "",
    vehiculoId: "",
    fechaSalida: "",
    kilometrajeSalida: "",
    destino: "",
    combustibleCargado: 0,
    observaciones: "",
  });

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    cargarEmpleado().then((emp) => {
      setEmpleado(emp);
      setForm((prev) => ({
        ...prev,
        empleadoId: emp?.id || "",
      }));
    });
  }, []);

  useEffect(() => {
    loadVehiculos();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      combustibleCargado: combustible,
    }));
  }, [combustible]);

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const verificarViajeAbierto = async (empleadoId) => {
    try {
      const r = await axios.get(
        `${import.meta.env.VITE_API_URL}/registros/abiertos/${empleadoId}`
      );
      return Array.isArray(r.data) ? r.data : [];
    } catch (err) {
      console.error("Error verificando viaje abierto", err);
      return [];
    }
  };

  const loadVehiculos = async () => {
    try {
      const emp = await cargarEmpleado();

      if (!emp) {
        Swal.fire("Error", "No se encontró el empleado logueado", "error");
        return;
      }

      let r;
      if (emp.rol === "empleado" || emp.rol === "admin") {
        r = await axios.get(`${import.meta.env.VITE_API_URL}/vehiculos/todos`);
      } else {
        r = await axios.get(
          `${import.meta.env.VITE_API_URL}/vehiculos/por-concesionaria/${emp.concesionaria_id}`
        );
      }

      setVehiculos(r.data);
    } catch (err) {
      console.error("Error cargando vehículos", err);
      Swal.fire("Error", "No se pudieron cargar los vehículos", "error");
    }
  };

  const handleScanQR = (data) => {
    setMostrarQR(false);
    if (!data) return;

    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      if (!parsed.id) {
        Swal.fire("QR inválido", "No contiene ID de vehículo", "error");
        return;
      }

      const vehiculoEncontrado = vehiculos.find(
        (v) => v.id == parsed.id
      );

      setForm((prev) => ({
        ...prev,
        vehiculoId: parsed.id,
        fechaSalida: getFechaHoraActual(),
      }));

      Swal.fire({
        icon: "success",
        title: "Vehículo detectado",
        text: `Patente: ${
          vehiculoEncontrado ? vehiculoEncontrado.patente : "Desconocida"
        }`,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "El QR no es válido", "error");
    }
  };

  const registrar = async () => {
    if (!form.empleadoId) {
      Swal.fire("Error", "No se encontró el empleado logueado", "error");
      return;
    }

    if (!form.vehiculoId) {
      Swal.fire("Atención", "Seleccioná o escaneá un vehículo", "warning");
      return;
    }

    const viajeAbierto = await verificarViajeAbierto(form.empleadoId);
    if (viajeAbierto.length > 0) {
      Swal.fire(
        "Viaje pendiente",
        `Tenés un viaje sin finalizar (ID: ${viajeAbierto[0].id})`,
        "warning"
      );
      return;
    }

    const datos = {
      ...form,
      fechaSalida: convertirFechaSQL(form.fechaSalida),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/registros`, datos);

      Swal.fire("Éxito", "Registro creado correctamente", "success");

      setForm({
        ...form,
        vehiculoId: "",
        fechaSalida: "",
        kilometrajeSalida: "",
        destino: "",
        observaciones: "",
        combustibleCargado: 0,
      });
      setCombustible(0);
    } catch (error) {
      console.error("Error en el registro:", error);
      Swal.fire("Error", "No se pudo registrar el uso", "error");
    }
  };

  return (
    <div className="register-container">
      <h3 className="section-title">Registrar Uso del Vehículo</h3>

      <div className="app-card form-container">
        {/* QR */}
        <div className="form-row qr-row">
          <button
            type="button"
            className="botonQR"
            onClick={() => setMostrarQR(true)}
          >
            <i className="fas fa-qrcode" />
            <span>Escanear QR del vehículo</span>
          </button>

          {form.vehiculoId && (
            <div className="vehiculo-seleccionado-info">
              <i className="fas fa-car" />
              <span>Vehículo:</span>
              <strong>{form.vehiculoId}</strong>
              <small>Seleccionado</small>
            </div>
          )}
        </div>

        {mostrarQR && (
          <QrScanner
            onScanSuccess={handleScanQR}
            onDecode={handleScanQR}
            onClose={() => setMostrarQR(false)}
          />
        )}

        {/* Vehículo + Fecha */}
        <div className="form-row">
          <div className="input-group">
            <label className="input-label">Vehículo</label>
            <select
              name="vehiculoId"
              value={form.vehiculoId}
              onChange={handleChange}
              className="custom-select"
              disabled={!!form.vehiculoId}
            >
              <option value="">Seleccione un vehículo</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.modelo} - {v.patente}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Fecha y Hora de Salida</label>
            <input
              type="datetime-local"
              name="fechaSalida"
              value={form.fechaSalida}
              onChange={handleChange}
              className="custom-input"
              disabled={!!form.vehiculoId}
            />
          </div>
        </div>

        {/* KM + Combustible */}
        <div className="form-row">
          <div className="input-group">
            <label className="input-label">Kilometraje de Salida (km)</label>
            <input
              type="number"
              name="kilometrajeSalida"
              value={form.kilometrajeSalida}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <FuelGauge
            combustible={combustible}
            setCombustible={setCombustible}
          />
        </div>

        {/* Destino + Obs */}
        <div className="form-row">
          <div className="input-group">
            <label className="input-label">Destino</label>
            <input
              type="text"
              name="destino"
              value={form.destino}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Observaciones</label>
            <input
              type="text"
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
        </div>

        <button className="primary-btn" onClick={registrar}>
          Registrar Uso
        </button>
      </div>
    </div>
  );
}
