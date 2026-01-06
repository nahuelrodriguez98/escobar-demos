import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import "../styles/empleado.css"

export default function Empleados() {
 const [list, setList] = useState([]);
 const [conces, setConces] = useState([]);
 const [form, setForm] = useState({ nombre:'', email:'', concesionaria_id:'', rol:'empleado', contrasenia:'', azure_id:'' });
 
 const [search, setSearch] = useState("");
 const [filterBy, setFilterBy] = useState("nombre"); 

 const load = async () => {
  const r = await axios.get(`${import.meta.env.VITE_API_URL}/empleados`);
  setList(r.data);
 };
 const loadConces = async () => {
  const r = await axios.get(`${import.meta.env.VITE_API_URL}/concesionarias`);
  setConces(r.data);
 };

 useEffect(()=>{ load(); loadConces(); }, []);

 const crear = async () => {
  await axios.post(`${import.meta.env.VITE_API_URL}/empleados`, form);
  setForm({ nombre:'', email:'', concesionaria_id:'', rol:'empleado', contrasenia:'', azure_id:'' });
  load();
 };

 const borrar = async (id) => {
  if(!confirm('Borrar empleado?')) return;
  await axios.delete(`${import.meta.env.VITE_API_URL}/empleados/${id}`);
  load();
 };

 //  Lógica de Filtrado 
 const filteredEmpleados = list.filter((e) => {
  const searchTerm = search.toLowerCase().trim();

  if (!searchTerm) {
   return true; 
  }

  let valueToFilter = '';

  switch (filterBy) {
   case 'nombre':
    valueToFilter = e.nombre;
    break;
   case 'email':
    valueToFilter = e.email;
    break;
   case 'concesionaria':
    valueToFilter = e.concesionaria; 
    break;
   default:
    return true;
  }

  return valueToFilter?.toLowerCase().includes(searchTerm);
 });

 return (
  <AdminLayout>
   <h2 className='title-vehiculos'>Empleados</h2>
   
   <div className="card">
    <div className="form-row">
     <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
     <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
     <input placeholder="Azure ID" value={form.azure_id} onChange={e=>setForm({...form,azure_id:e.target.value})} />
     <select value={form.concesionaria_id} onChange={e=>setForm({...form,concesionaria_id:e.target.value})}>
      <option value="">Concesionaria</option>
      {conces.map(c=> <option key={c.id} value={c.id}>{c.nombre}</option>)}
     </select>
     <select value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})}>
      <option value="empleado">empleado</option>
      <option value="admin">admin</option>
     </select>
    </div>
    <div className="form-row">
     <input placeholder="Contraseña temporal" value={form.contrasenia} onChange={e=>setForm({...form,contrasenia:e.target.value})} />
     <button className="btn btn-primary" onClick={crear}>Crear</button>
    </div>
   </div>
  
   <div className="card">
  {/* CONTROLES DE FILTRADO */}
  <div className="filtro-container">
    <div className="filtro-group">
      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="form-select"
      >
        <option value="nombre">Buscar por Nombre</option>
        <option value="email">Buscar por Email</option>
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
      Limpiar Filtro
    </button>
  </div>

  {/* CONTENEDOR CON SCROLL VERTICAL */}
  <div className="table-container">
    <table className="responsive-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Azure ID</th>
          <th>Concesionaria</th>
          <th>Rol</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filteredEmpleados.map((u) => (
          <tr key={u.id}>
            <td data-label="Nombre">{u.nombre}</td>
            <td data-label="Email" className="email-cell">{u.email}</td>
            <td data-label="Azure ID" className="text-muted-small">{u.azure_id}</td>
            <td data-label="Concesionaria">{u.concesionaria}</td>
            <td data-label="Rol">
               <span className="rol-badge">{u.rol}</span>
            </td>
            <td data-label="Eliminar" className="text-center">
              <button className="btn btn-danger" onClick={() => borrar(u.id)}>
                Borrar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {filteredEmpleados.length === 0 && (
      <div className="empty-state">
        No se encontraron empleados que coincidan con la búsqueda.
      </div>
    )}
  </div>
</div>
  </AdminLayout>
 );
}