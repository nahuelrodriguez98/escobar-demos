import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";
import "../styles/registrosadmin.css";
import Swal from "sweetalert2";

export default function Registros() {
  const [list, setList] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("empleado");
  const [form, setForm] = useState({
    empleadoId: "",
    vehiculoId: "",
    fechaSalida: "",
    kilometrajeSalida: "",
    destino: "",
    combustibleCargado: "",
    observaciones: "",
  });

  // Helper para obtener el config con el Token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const load = async () => {
    try {
      const r = await axios.get(`${import.meta.env.VITE_API_URL}/registros`, getAuthHeader());
      
      console.log("Datos que llegan del servidor:", r.data); // <--- AGREGA ESTO
      
      setList(r.data);
    } catch (error) {
      console.error("Error al cargar registros:", error);
    }
  };

  const loadEmpl = async () => {
    try {
      const r = await axios.get(`${import.meta.env.VITE_API_URL}/empleados`, getAuthHeader());
      setEmpleados(r.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const loadVeh = async () => {
    try {
      const r = await axios.get(`${import.meta.env.VITE_API_URL}/vehiculos`, getAuthHeader());
      setVehiculos(r.data);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  };

  const crear = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/registros`, form, getAuthHeader());
      Swal.fire("Éxito", "Registro creado", "success");
      setForm({
        empleadoId: "",
        vehiculoId: "",
        fechaSalida: "",
        kilometrajeSalida: "",
        destino: "",
        combustibleCargado: "",
        observaciones: "",
      });
      load();
    } catch (error) {
      console.error("Error al crear registro:", error);
      Swal.fire("Error", "No se pudo crear el registro", "error");
    }
  };

  const borrar = async (id) => {
    const result = await Swal.fire({
      title: "¿Borrar registro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/registros/${id}`, getAuthHeader());
      Swal.fire("Eliminado", "El registro ha sido borrado", "success");
      load();
    } catch (err) {
      console.error("Error al borrar registro:", err);
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const filteredRegistros = list.filter((r) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;

    if (filterBy === "empleado") {
      return r.empleado?.toLowerCase().includes(searchTerm);
    }
    if (filterBy === "vehiculo") {
      return r.patente?.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  useEffect(() => {
    load();
    loadEmpl();
    loadVeh();
  }, []);

  return (
    <AdminLayout>
      <h2 className="title-vehiculos">Registros de uso (Admin)</h2>

      {/* ========== FORMULARIO ========== */}
      <div className="card">
        <div className="form-row">
          <select
            value={form.empleadoId}
            onChange={(e) => setForm({ ...form, empleadoId: e.target.value })}
            className="form-control"
          >
            <option value="">Seleccionar Empleado</option>
            {empleados.map((x) => (
              <option key={x.id} value={x.id}>{x.nombre}</option>
            ))}
          </select>

          <select
            value={form.vehiculoId}
            onChange={(e) => setForm({ ...form, vehiculoId: e.target.value })}
            className="form-control"
          >
            <option value="">Seleccionar Vehículo</option>
            {vehiculos.map((x) => (
              <option key={x.id} value={x.id}>{x.patente} - {x.modelo}</option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={form.fechaSalida}
            onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })}
            className="form-control"
          />

          <input
            type="number"
            placeholder="Kilometraje Salida"
            value={form.kilometrajeSalida}
            onChange={(e) => setForm({ ...form, kilometrajeSalida: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="form-row" style={{ marginTop: '10px' }}>
          <input
            placeholder="Destino"
            value={form.destino}
            onChange={(e) => setForm({ ...form, destino: e.target.value })}
            className="form-control"
          />
          <input
            type="number"
            placeholder="Combustible (L)"
            value={form.combustibleCargado}
            onChange={(e) => setForm({ ...form, combustibleCargado: e.target.value })}
            className="form-control"
          />
          <input
            placeholder="Observaciones"
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            className="form-control"
          />
          <button className="btn btn-primary" onClick={crear}>
            Crear registro
          </button>
        </div>
      </div>

      {/* ========== LISTADO ========== */}
      <div className="card">
        <div className="filtro-container">
          <div className="filtro-group">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="form-select"
            >
              <option value="empleado">Buscar por empleado</option>
              <option value="vehiculo">Buscar por patente</option>
            </select>
            <input
              type="text"
              placeholder={`Escriba para buscar...`}
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" onClick={() => setSearch("")} disabled={!search}>
            Limpiar
          </button>
        </div>

        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Fecha salida</th>
                <th>Empleado</th>
                <th>Vehículo</th>
                <th>Destino</th>
                <th>Kilometraje</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistros.map((r) => (
                <tr key={r.id}>
                  <td data-label="Fecha salida">
                    {/* Intenta leer fechaSalida O fecha_salida */}
                    {(r.fechaSalida || r.fecha_salida)
                      ? new Date(r.fechaSalida || r.fecha_salida).toLocaleString()
                      : "—"}
                  </td>
                  <td data-label="Empleado"><strong>{r.empleado}</strong></td>
                  <td data-label="Vehículo">{r.patente} {r.modelo ? `- ${r.modelo}` : ''}</td>
                  <td data-label="Destino">{r.destino || "N/A"}</td>
                  <td data-label="Kilometraje">
                    <span className="km-badge">
                      {/* Intenta leer kilometrajeSalida O kilometraje_salida */}
                      {r.kilometrajeSalida || r.kilometraje_salida} km
                    </span>
                  </td>
                  <td data-label="Acciones" className="text-center">
                    <button className="btn btn-danger" onClick={() => borrar(r.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRegistros.length === 0 && (
            <div className="empty-state">No se encontraron registros.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}