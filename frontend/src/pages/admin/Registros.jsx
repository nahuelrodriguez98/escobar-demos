import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";
import "../styles/registros.css";
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

  const load = async () => {
    try {
      const r = await axios.get("http://localhost:4000/registros");
      setList(r.data);
    } catch (error) {
      console.error("Error al cargar registros:", error);
    }
  };

  const loadEmpl = async () => {
    try {
      const r = await axios.get("http://localhost:4000/empleados");
      setEmpleados(r.data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const loadVeh = async () => {
    try {
      const r = await axios.get("http://localhost:4000/vehiculos");
      setVehiculos(r.data);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  };

  const crear = async () => {
    try {
      await axios.post("http://localhost:4000/registros", form);
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
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Borrar registro?")) return;
  
    try {
      await axios.delete(`http://localhost:4000/registros/${id}`);
  
      Swal.fire({
        icon: "success",
        title: "Registro eliminado",
        timer: 1200,
        showConfirmButton: false
      });
  
      load(); // refresca la lista
    } catch (err) {
      console.error("Error al borrar registro:", err);
  
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Error desconocido";
  
      Swal.fire({
        icon: "error",
        title: "No se pudo borrar",
        text: msg,
      });
    }
  };
  
  const filteredRegistros = list.filter((r) => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      // Si está vacío, muestra todos los registros
      return true;
    }

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
      <h2>Registros de uso</h2>
      <div className="card">
        <div className="form-row">
          <select
            value={form.empleadoId}
            onChange={(e) => setForm({ ...form, empleadoId: e.target.value })}
          >
            <option value="">Empleado</option>
            {empleados.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nombre}
              </option>
            ))}
          </select>

          <select
            value={form.vehiculoId}
            onChange={(e) => setForm({ ...form, vehiculoId: e.target.value })}
          >
            <option value="">Vehículo</option>
            {vehiculos.map((x) => (
              <option key={x.id} value={x.id}>
                {x.patente}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={form.fechaSalida}
            onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })}
          />

          <input
            placeholder="Kilometraje"
            value={form.kilometrajeSalida}
            onChange={(e) =>
              setForm({ ...form, kilometrajeSalida: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <input
            placeholder="Destino"
            value={form.destino}
            onChange={(e) => setForm({ ...form, destino: e.target.value })}
          />
          <input
            placeholder="Combustible (L)"
            value={form.combustibleCargado}
            onChange={(e) =>
              setForm({ ...form, combustibleCargado: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <input
            placeholder="Observaciones"
            value={form.observaciones}
            onChange={(e) =>
              setForm({ ...form, observaciones: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={crear}>
            Crear registro
          </button>
        </div>
      </div>
      
      <div className="cards table-container">
        <div className="filtro-container">
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="form-select"
          >
            <option value="empleado">Buscar por empleado</option>
            <option value="vehiculo">Buscar por vehículo (Patente)</option>
          </select>

          <input
            type="text"
            placeholder={`Buscar por ${filterBy}`}
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <button
            className="btn btn-secondary"
            onClick={() => setSearch("")}
            disabled={!search}
          >
            Limpiar Filtro 
          </button>
        </div>

        <table className="table sticky-table">
          <thead>
            <tr>
              <th>Fecha salida</th>
              <th>Empleado</th>
              <th>Vehículo</th>
              <th>Destino</th>
              <th>Kms</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistros.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.fechaSalida
                    ? new Date(r.fechaSalida).toLocaleString()
                    : ""}
                </td>
                <td>{r.empleado}</td> 
                <td>{r.patente}</td> 
                <td>{r.destino}</td>
                <td>
                  {r.kilometrajeSalida} - {r.kilometrajeRetorno}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => borrar(r.id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {filteredRegistros.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No se encontraron registros que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}