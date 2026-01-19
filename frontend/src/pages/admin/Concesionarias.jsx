import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import Swal from "sweetalert2";

export default function Concesionarias() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ nombre: '', direccion: '' });

  const load = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/concesionarias`);
      setList(res.data);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => { load(); }, []);

  const crear = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/concesionarias`, form);

      Swal.fire({
        icon: "success",
        title: "Concesionaria creada",
        text: `El concesionario ${res.data.concesionaria?.nombre || ''} fue creado con exito.`,
        timer: 1500,
        showConfirmButton: false
      });

      setForm({ nombre: '', direccion: '' });
      await load();

    } catch (err) {
      console.error("Error creando concesionaria", err);
      const msg = err.response?.data?.mensaje || err.response?.data?.error || err.message;

      Swal.fire({
        icon: "error",
        title: "Error al intentar crear concesionaria",
        text: msg
      });
    }
  }

  const borrar = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede revertir! La concesionaria será eliminada permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡borrar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/concesionarias/${id}`);
        Swal.fire('Eliminada', 'La concesionaria ha sido borrada con éxito.', 'success');
        load();
      } catch (error) {
        Swal.fire('¡Error!', 'Hubo un problema al intentar borrar la concesionaria.', 'error');
        console.error(error);
      }
    }
  };

  // --- ESTILOS ---
  // Estilo base para celdas (th y td) para garantizar alineación perfecta
  const cellStyle = {
    padding: '12px 15px',
    textAlign: 'left', // Alinea todo a la izquierda por defecto
    borderBottom: '1px solid #ddd'
  };

  const headerStyle = {
    ...cellStyle,
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
    color: '#495057'
  };

  return (
    <AdminLayout>
      <h2 className="title-vehiculos" style={{ marginBottom: '20px', color: '#333' }}>
        Concesionarias
      </h2>

      {/* FORMULARIO DE CREACIÓN */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
        <div className="form-row" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="Nombre de la sucursal"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="form-control"
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            placeholder="Dirección completa"
            value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })}
            className="form-control"
            style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type='submit' 
            className="btn btn-primary" 
            onClick={crear}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Crear Concesionaria
          </button>
        </div>
      </div>

      {/* LISTADO */}
      <div className="card" style={{ padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={headerStyle}>Nombre</th>
                <th style={headerStyle}>Dirección</th>
                {/* La última columna alineada a la derecha para los botones */}
                <th style={{ ...headerStyle, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id} style={{ transition: 'background-color 0.2s' }}>
                  <td style={cellStyle}>
                    <strong>{c.nombre}</strong>
                  </td>
                  <td style={cellStyle}>
                    {c.direccion || <span style={{ color: '#999', fontStyle: 'italic' }}>Sin dirección</span>}
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'right' }}>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => borrar(c.id)}
                      style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              
              {list.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                    No hay concesionarias registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </AdminLayout>
  );
}