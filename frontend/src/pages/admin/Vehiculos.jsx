import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/vehiculos.css";

export default function Vehiculos() {
  const [list, setList] = useState([]);
  const [conces, setConces] = useState([]);
  const [qrGenerado, setQrGenerado] = useState(null);

  const [form, setForm] = useState({
    patente: "",
    marca: "",
    modelo: "",
    concesionaria_id: "",
    activo: true,
  });

  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("patente");

  /* ================= LOAD ================= */

  const load = async () => {
    try {
      const r = await axios.get(`${import.meta.env.VITE_API_URL}/vehiculos`);
      setList(r.data);
    } catch (err) {
      console.error("Error cargando vehículos", err);
    }
  };

  const loadConces = async () => {
    const r = await axios.get(`${import.meta.env.VITE_API_URL}/concesionarias`);
    setConces(r.data);
  };

  useEffect(() => {
    load();
    loadConces();
  }, []);

  /* ================= CREATE ================= */

  const crear = async () => {
    try {
      const payload = {
        ...form,
        concesionaria_id: Number(form.concesionaria_id),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/vehiculos`,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Vehículo creado",
        text: `Patente ${res.data.vehiculo.patente} creada correctamente.`,
        timer: 1500,
        showConfirmButton: false
      });

      setQrGenerado(res.data.qr); // 👈 QR base64
      setForm({ patente: "", marca: "", modelo: "", concesionaria_id: "", activo: true });
      await load();

    } catch (err) {
      console.error("Error creando vehículo", err);
      const msg = err.response?.data?.mensaje || err.response?.data?.error || err.message;
      Swal.fire("Error", msg, "error");
    }
  };

  /* ================= DELETE ================= */

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
      Swal.fire("Error", "No se puede eliminar", "error");
    }
  };

  /* ================= FILTER ================= */

  const filteredVehiculos = list.filter((v) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;

    let value = "";
    if (filterBy === "patente") value = v.patente;
    if (filterBy === "marca") value = v.marca;
    if (filterBy === "modelo") value = v.modelo;
    if (filterBy === "concesionaria") value = v.concesionaria;

    return value?.toLowerCase().includes(searchTerm);
  });

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <div className="vehiculos-container">
        <h2 className="title-vehiculos">Vehículos</h2>

        {/* CREAR */}
        <div className="card">
          <div className="form-row">
            <input placeholder="Patente" value={form.patente} onChange={(e) => setForm({ ...form, patente: e.target.value })} />
            <input placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} />
            <input placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} />

            <select value={form.concesionaria_id} onChange={(e) => setForm({ ...form, concesionaria_id: e.target.value })}>
              <option value="">Elegir concesionaria</option>
              {conces.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={crear}>
              Crear
            </button>
          </div>
        </div>

        {/* QR */}
        {qrGenerado && (
          <div className="card qr-card">
            <h3>QR generado</h3>
            <img src={qrGenerado} alt="QR vehículo" style={{ width: 220 }} />

            <a
              href={qrGenerado}
              download="vehiculo_qr.png"
              className="btn btn-secondary"
              style={{ marginTop: 10 }}
            >
              Descargar QR
            </a>
          </div>
        )}

        {/* LISTA */}
        <div className="card">

          <div className="filtro-container">
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="patente">Patente</option>
              <option value="marca">Marca</option>
              <option value="modelo">Modelo</option>
              <option value="concesionaria">Concesionaria</option>
            </select>

            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={() => setSearch("")} disabled={!search}>
              Limpiar
            </button>
          </div>

          <div className="table-container">
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Patente</th>
                  <th>Concesionaria</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehiculos.map((v) => (
                  <tr key={v.id}>
                    <td>{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.patente}</td>
                    <td>{v.concesionaria}</td>
                    <td>{v.activo ? "Sí" : "No"}</td>
                    <td>
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
