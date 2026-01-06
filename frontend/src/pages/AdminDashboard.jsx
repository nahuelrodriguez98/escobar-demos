import { useState } from "react";
import Sidebar from "../components/sidebar";
import FooterAdmin from "../components/Navbar";
import "../pages/styles/admindashboard.css";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="contenedor-admin">
      {/* Overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <div className="admin-main">
        {/* Navbar */}
        <div className="navbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h3 className="navbar-title">Panel de administración</h3>
        </div>

        <div className="admin-main-content">
          <Outlet />
        </div>
        
        <FooterAdmin />
      </div>
    </div>
  );
}
