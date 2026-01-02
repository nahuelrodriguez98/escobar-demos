import React from 'react';
import { NavLink } from 'react-router-dom';
export default function Sidebar() {

  return (
    <aside className="sidebar">
      <h3 className="brand">Escobar Santa Fe</h3>
      
      <nav>
        <ul>
          <li><NavLink to="/admin/concesionarias">Concesionarias</NavLink></li>
          <li><NavLink to="/admin/vehiculos">Vehículos</NavLink></li>
          <li><NavLink to="/admin/empleados">Empleados</NavLink></li>
          <li><NavLink to="/admin/registros">Registros de uso</NavLink></li>
          <li><NavLink to="/empleado">Panel de empleado</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}
