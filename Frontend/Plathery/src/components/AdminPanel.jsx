import React, { useState } from "react";
import AddBookAdmin from "./AddBookAdmin";
import { useUser } from "../service/UserContext";
import Menu from "./Menu.jsx";
import lab from "../assets/Lab2.png";

function AdminPanel() {
  const { user, loading } = useUser();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return <p>Cargando datos de usuario...</p>;
  }

  if (!user || user.role !== "admin") {
    return <p>No tienes permisos para acceder al panel de administración.</p>;
  }

  return (
    <>
      <Menu />
      <section className="container my-5">
        <div className="label-container-section mb-5">
          <img src={lab} alt="Lab" className="label-img" />
          <h2 className="fw-bold text-primary label-text-section">
            Panel de administración
          </h2>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cerrar formulario" : "Añadir libro"}
          </button>
          {showForm && <AddBookAdmin user={user} />}
        </div>
      </section>
    </>
  );
}

export default AdminPanel;
