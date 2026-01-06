import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/vehiculos.css"


export default function Vehiculos() {
  const [list, setList] = useState([]);
  const [conces, setConces] = useState([]);
  const [form, setForm] = useState({
    patente: "",
    marca: "",
    modelo: "",
    concesionaria_id: "",
    activo: true,
  });

  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("patente");

  const load = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        const r = await axios.get(`${import.meta.env.VITE_API_URL}/vehiculos`);
        setList(r.data);
        return;
      }

      const r = await axios.get(`${import.meta.env.VITE_API_URL}/vehiculos`, {
        params: {
          concesionaria_id: storedUser.concesionaria_id,
          rol: storedUser.rol
        }
      });

      setList(r.data);
    } catch (err) {
      console.error('Error cargando vehiculos', err);
    }
  };

  const loadConces = async () => {
    const r = await axios.get(`${import.meta.env.VITE_API_URL}/concesionarias`);
    setConces(r.data);
  };

  const crear = async () => {
    try {
      const payload = {
        ...form,
        concesionaria_id: form.concesionaria_id ? Number(form.concesionaria_id) : null,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/vehiculos`, payload);

      Swal.fire({
        icon: "success",
        title: "Vehículo creado",
        text: `Patente ${res.data.vehiculo.patente} creada correctamente.`,
        timer: 1500,
        showConfirmButton: false
      });

      // reset form y recargar la lista
      setForm({ patente: "", marca: "", modelo: "", concesionaria_id: "", activo: true });
      await load();
    } catch (err) {
      console.error("Error creando vehículo", err);
      const msg = err.response?.data?.mensaje || err.response?.data?.error || err.message;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg
      });
    }
  };


  const borrar = async (id) => {
    if (!confirm("¿Borrar vehículo?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/vehiculos/${id}`);

      Swal.fire({
        icon: "success",
        title: "Vehículo eliminado",
        timer: 1200,
        showConfirmButton: false
      });

      load();
    } catch (err) {
      console.error("Error eliminando vehículo", err);

      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Error desconocido";

      Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: msg,
      });
    }
  };


  useEffect(() => {
    load();
    loadConces();
  }, []);

  const filteredVehiculos = list.filter((v) => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      return true;
    }

    let valueToFilter = '';

    switch (filterBy) {
      case 'patente':
        valueToFilter = v.patente;
        break;
      case 'marca':
        valueToFilter = v.marca;
        break;
      case 'modelo':
        valueToFilter = v.modelo;
        break;
      case 'concesionaria':
        valueToFilter = v.concesionaria;
        break;
      default:
        return true;
    }

    return valueToFilter?.toLowerCase().includes(searchTerm);
  });

    return (
    <AdminLayout>
      <div className="vehiculos-container">
        <h2 className="title-vehiculos">Vehículos</h2>
        <div className="card">
          <div className="form-row">
            <input placeholder="Patente" value={form.patente} onChange={(e) => setForm({ ...form, patente: e.target.value })} />
            <input placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
            <input placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
            <select value={form.concesionaria_id} onChange={(e) => setForm({ ...form, concesionaria_id: e.target.value })}>
              <option value="">Elegir concesionaria</option>
              {conces.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={crear}>
              Crear
            </button>
          </div>
        </div>
        <div className="card">

          {/* FILTROS */}
          <div className="filtro-container">

            <div className="filtro-group">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="form-select"
              >
                <option value="patente">Buscar por Patente</option>
                <option value="marca">Buscar por Marca</option>
                <option value="modelo">Buscar por Modelo</option>
                <option value="concesionaria">Buscar por Concesionaria</option>
              </select>

              <input
                type="text"
                placeholder={`Buscar por ${filterBy}`}
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setSearch("")}
              disabled={!search}
            >
              Limpiar filtro
            </button>

          </div>

          {/* TABLA */}
          <div className="table-container">
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Patente</th>
                  <th>Concesionaria</th>
                  <th>Activo</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehiculos.map((v) => (
                  <tr key={v.id}>
                    <td data-label="Marca">{v.marca}</td>
                    <td data-label="Modelo">{v.modelo}</td>
                    <td data-label="Patente">{v.patente}</td>
                    <td data-label="Concesionaria">{v.concesionaria}</td>
                    <td data-label="Activo">
                      <span className={`status-badge ${v.activo ? 'active' : 'inactive'}`}>
                        {v.activo ? "Sí" : "No"}
                      </span>
                    </td>
                    <td data-label="Acciones" className="text-center">
                      <button className="btn btn-danger" onClick={() => borrar(v.id)}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVehiculos.length === 0 && (
              <div className="empty-state">No se encontraron vehículos.</div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}