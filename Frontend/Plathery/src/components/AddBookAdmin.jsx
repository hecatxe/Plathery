import React, { useState } from "react";

function AddBookAdmin({ user }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    isbn: "",
    genre: "",
    synopsis: "",
    coverImage: "",
    linkAmazon: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API = import.meta.env.VITE_API_BACKEND_URL;
      const res = await fetch(`${API}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      alert("Libro añadido con ID: " + data.id);
      setFormData({
        title: "",
        author: "",
        year: "",
        isbn: "",
        genre: "",
        synopsis: "",
        coverImage: "",
        linkAmazon: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al añadir libro");
    }
  };

  if (user?.role !== "admin") {
    return <p>No tienes permisos para añadir libros.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded position-relative">
      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="title"
          className="form-control floating-input"
          placeholder=" "
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label htmlFor="title" className="floating-label">
          Título
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="author"
          className="form-control floating-input"
          placeholder=" "
          value={formData.author}
          onChange={handleChange}
          required
        />
        <label htmlFor="autor" className="floating-label">
          Autor
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="year"
          className="form-control floating-input"
          placeholder=" "
          value={formData.year}
          onChange={handleChange}
          required
        />
        <label htmlFor="Año de publicación" className="floating-label">
          Año de publicación
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="isbn"
          className="form-control floating-input"
          placeholder=" "
          value={formData.isbn}
          onChange={handleChange}
          required
        />
        <label htmlFor="isbn" className="floating-label">
          ISBN
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="genre"
          className="form-control floating-input"
          placeholder=" "
          value={formData.genre}
          onChange={handleChange}
          required
        />
        <label htmlFor="genero" className="floating-label">
          Género literario
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="synopsis"
          className="form-control floating-input"
          placeholder=" "
          value={formData.synopsis}
          onChange={handleChange}
          required
        />
        <label htmlFor="sinopsis" className="floating-label">
          Sinopsis
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="linkAmazon"
          className="form-control floating-input"
          placeholder=" "
          value={formData.linkAmazon}
          onChange={handleChange}
          required
        />
        <label htmlFor="linkAmazon" className="floating-label">
          Link a Amazon
        </label>
      </div>

      <div className="form-group mb-4 position-relative w-100 w-sm-75 w-md-50 mx-auto">
        <input
          name="coverImage"
          className="form-control floating-input"
          placeholder=" "
          value={formData.coverImage}
          onChange={handleChange}
          required
        />
        <label htmlFor="coverImage" className="floating-label">
          Link de imágen
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 w-sm-75 w-md-50 mt-2 d-block mx-auto"
      >
        Guardar libro
      </button>
    </form>
  );
}

export default AddBookAdmin;
