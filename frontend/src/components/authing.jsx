import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Authing() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/userinfo`, {
          withCredentials: true
        });

        localStorage.setItem("empleado", JSON.stringify(res.data));

        if (res.data.rol === "admin") navigate("/admin");
        else navigate("/empleado");

      } catch (err) {
        navigate("/");
      }
    };

    checkUser();
  }, []);

  return <div>Cargando...</div>;
}
