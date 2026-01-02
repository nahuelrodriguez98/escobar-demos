import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";
import FooterAdmin from "../components/Navbar";
import "../pages/styles/admindashboard.css";

export default function AdminDashboard() {
  return (
    <div className="contenedor-admin">
      <Sidebar />

      <div className="admin-main">
        <Navbar />

        <div className="admin-main-content">
          <h2 className="titulo-admin">
            Bienvenido al Panel de Administración
          </h2>
          <p className="subtitulo-admin">
            Selecciona una opción del menú para empezar.
          </p>
        </div>

        <FooterAdmin />
      </div>
    </div>
  );
}
