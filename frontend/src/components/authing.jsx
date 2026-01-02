import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Authing() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/auth/userinfo", {
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
