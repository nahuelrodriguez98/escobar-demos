import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import Swal from "sweetalert2";


export default function Concesionarias() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ nombre: '', direccion: '' });

  const load = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/concesionarias`);
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const crear = async () => {
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/concesionarias`, form);

      Swal.fire({
        icon: "success",
        title: "Concesionaria creada",
        text:`El concesionario ${res.data.concesionaria?.nombre || ''} fue creado con exito.`, 
        timer: 1500,
        showConfirmButton: false
      });

      setForm({
        nombre:'',
        direccion:''
      })

      await load()

    } catch (err){
      console.error("Error creando concesionaria", err);
      const msg = err.response?.data?.mensaje || err.response?.data?.error || err.message;

      Swal.fire({
        icon: "error",
        title:"Error al intentar crear concesionaria",
        text: msg
      })

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
        Swal.fire(
          'Eliminada',
          'La concesionaria ha sido borrada con éxito.',
          'success'
        );

        load();

      } catch (error) {
        Swal.fire(
          '¡Error!',
          'Hubo un problema al intentar borrar la concesionaria.',
          'error'
        );
        console.error(error);
      }
    }
  };

  return (
    <AdminLayout>
      <h2 className="title-vehiculos">Concesionarias</h2>

      {/* FORMULARIO DE CREACIÓN */}
      <div className="card">
        <div className="form-row">
          <input
            placeholder="Nombre de la sucursal"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            placeholder="Dirección completa"
            value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })}
          />
          <button type='submit' className="btn btn-primary" onClick={crear}>
            Crear Concesionaria
          </button>
        </div>
      </div>

      {/* LISTADO */}
      <div className="card">
        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id}>
                  <td data-label="Nombre">
                    <strong>{c.nombre}</strong>
                  </td>
                  <td data-label="Dirección">
                    {c.direccion || <span className="text-muted-small">Sin dirección</span>}
                  </td>
                  <td data-label="Acciones" className="text-right">
                    <button className="btn btn-danger" onClick={() => borrar(c.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-state">
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
