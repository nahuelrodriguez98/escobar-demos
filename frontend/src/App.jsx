import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "./pages/Login.jsx";
import Ingreso from "./pages/ingreso.jsx"; 
import NotFound from "./components/NotFound.jsx"; 

// Dashboards
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmpleadoDashboard from "./pages/EmpleadoDashboard.jsx";

// Sub-páginas Admin
import Concesionarias from "./pages/admin/Concesionarias";
import Vehiculos from "./pages/admin/Vehiculos";
import Empleados from "./pages/admin/Empleados";
import Registros from "./pages/admin/Registros";

// Seguridad
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/auth/success" element={<Ingreso />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="registros" replace />} /> 
        
        <Route path="concesionarias" element={<Concesionarias />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="registros" element={<Registros />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ====== EMPLEADO (Ruta Protegida) ====== */}
      <Route
        path="/empleado"
        element={
          <ProtectedRoute role="empleado">
            <EmpleadoDashboard />
          </ProtectedRoute>
        }
      />

      {/* (Ruta 404) */}

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}