import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmpleadoDashboard from "./pages/EmpleadoDashboard.jsx";
import Concesionarias from "./pages/admin/Concesionarias";
import Vehiculos from "./pages/admin/Vehiculos";
import Empleados from "./pages/admin/Empleados";
import Registros from "./pages/admin/Registros";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Ingreso from "./pages/ingreso.jsx";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/success" element={<Ingreso />} />

      {/* ====== ADMIN LAYOUT ====== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<></>} />
        <Route path="concesionarias" element={<Concesionarias />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="empleados" element={<Empleados />} />
        <Route path="registros" element={<Registros />} />
      </Route>

      {/* ====== EMPLEADO ====== */}
      <Route
        path="/empleado"
        element={
          <ProtectedRoute role="empleado">
            <EmpleadoDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
