import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("empleado"));

  if (!user) return <Navigate to="/" />;

  if (role === "empleado" && user.rol !== "empleado" && user.rol !== "admin") {
    return <Navigate to="/" />;
  }

  if (role === "admin" && user.rol !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};


export default ProtectedRoute;
