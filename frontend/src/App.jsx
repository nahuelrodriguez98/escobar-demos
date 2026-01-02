import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmpleadoDashboard from "./pages/EmpleadoDashboard.jsx";
import Concesionarias from './pages/admin/Concesionarias';
import Vehiculos from './pages/admin/Vehiculos';
import Empleados from './pages/admin/Empleados';
import Registros from './pages/admin/Registros';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Ingreso from "./pages/ingreso.jsx";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/auth/success" element={<Ingreso />} />
      <Route path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/concesionarias"
        element={
          <ProtectedRoute role="admin">
            <Concesionarias />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/vehiculos"
        element={
          <ProtectedRoute role="admin">
            <Vehiculos />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/empleados"
        element={
          <ProtectedRoute role="admin">
            <Empleados />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/registros"
        element={
          <ProtectedRoute role="admin">
            <Registros />
          </ProtectedRoute>
        }
      />
      <Route path="/empleado" 
        element={
          <ProtectedRoute role="empleado">
            <EmpleadoDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
