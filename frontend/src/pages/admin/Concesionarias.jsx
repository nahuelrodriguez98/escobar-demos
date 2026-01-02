import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import Swal from "sweetalert2";


export default function Concesionarias() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ nombre:'', direccion:'' });

  const load = async () => {
    const res = await axios.get('http://localhost:4000/concesionarias');
    setList(res.data);
  };

  useEffect(()=>{ load(); }, []);

  const crear = async () => {
    await axios.post('http://localhost:4000/concesionarias', form);
    setForm({ nombre:'', direccion:'' });
    load();
  };

  const borrar = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡Esta acción no se puede revertir! La concesionaria será eliminada permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡borrar!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`http://localhost:4000/concesionarias/${id}`);
            Swal.fire(
                '¡Eliminada!',
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
      <h2>Concesionarias</h2>
      <div className="card">
        <div className="form-row">
          <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
          <input placeholder="Dirección" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} />
          <button className="btn btn-primary" onClick={crear}>Crear</button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Eliminar</th>
            </tr>
            </thead>
          <tbody>
            {list.map(c=>(
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.direccion}</td>
                <td><button className="btn btn-danger" onClick={()=>borrar(c.id)}>Borrar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
