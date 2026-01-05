import React, { useEffect, useState } from "react";
import Menu from "./Menu.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../service/UserContext.jsx";
import Footer from "./Footer.jsx";
import lab from "../assets/Lab2.png";
import ModalMessage from "./ModalMessage.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  //Abrir y cerrar modal
  const showModal = (type, title, message) => {
    setModal({ show: true, type, title, message });
  };
  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        console.log("Usuario autenticado:", data.user);
        navigate("/");
      } else {
        alert(data.error || "Error en el login");
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      showModal(
        "error",
        "Error",
        "No se puede conectar con el servidor ahora mismo. Inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <>
      <Menu />

      <div className="body vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundcolor: "#ffffff",
            opacity: "0.2",
            backgroundSize: "20px 20px",
            backgroundImage:
              "repeating-linear-gradient(to right, #243187, #243187 0.6000000000000001px, #ffffff 0.6000000000000001px, #ffffff)",
          }}
        />

        <form
          onSubmit={handleLogin}
          className="p-4 rounded position-relative login-container reveal"
        >
          <div className="label-container-login mb-5">
            <img src={lab} alt="Lab" className="label-img" />
            <h2 className="fw-bold text-primary label-text-section">
              Iniciar Sesión
            </h2>
          </div>
          <span className="d-flex justify-content-center pb-4">
            ¿Todavía no tienes cuenta?
            <Link to="/register" className="ps-2">
              Registrate aquí
            </Link>
          </span>
          <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
            <input
              type="text"
              id="username"
              className="form-control floating-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="username" className="floating-label">
              Usuario
            </label>
          </div>

          <div className="form-group mb-3 position-relative w-100 w-sm-75 w-md-50 mx-auto">
            <input
              type="password"
              id="password"
              className="form-control floating-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="password" className="floating-label">
              Contraseña
            </label>
          </div>

          <div className="pb-4">
            <button
              type="submit"
              className="btn btn-primary w-100 w-sm-75 w-md-50 mt-2 d-block mx-auto"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
      <ModalMessage
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
      <Footer />
    </>
  );
};

export default Login;
