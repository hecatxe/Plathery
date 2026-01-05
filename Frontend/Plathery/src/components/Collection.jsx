import React, { useEffect, useState } from "react";
import { getBooks } from "../service/booksService";
import { Link } from "react-router-dom";
import Menu from "./Menu.jsx";
import lab from "../assets/Lab2.png";
import Footer from "./Footer.jsx";

const Collection = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("novedades");
  

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  // Categorías -> la key debe coincidir con como se escribe en el formulario
  const categories = [
    { key: "novedades", label: "Novedades" },
    { key: "novela", label: "Novela" },
    { key: "ficción", label: "Ficción" },
    { key: "fantasía", label: "Fantasía" },
    { key: "romance", label: "Romance" },
    { key: "horror", label: "Terror" },
    { key: "misterio", label: "Misterio" },
    { key: "thriller", label: "Thriller" },
    { key: "historico", label: "Historia" },
    { key: "drama", label: "Drama" },
    { key: "cuento", label: "Cuento" },
    { key: "poesía", label: "Poesía" },
  ];

  useEffect(() => {
    const loadBooks = async () => {
      const data = await getBooks();
      setBooks(data);
    };
    loadBooks();
  }, []);

  // Filtrar por categoría (soporta múltiples géneros separados por coma)
  const filteredByCategory =
    category === "novedades"
      ? books
      : books.filter((b) => {
          const genres = b.genre
            ?.toLowerCase()
            .split(",")
            .map((g) => g.trim());
          return genres?.includes(category.toLowerCase());
        });

  // Filtrar por búsqueda
  const searchedResults = filteredByCategory.filter((b) => {
    const q = query.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn?.toLowerCase().includes(q)
    );
  });

  // Ordenar por año de publicación (descendente: más recientes primero)
  const orderedResults = [...searchedResults].sort((a, b) => {
    const yearA = parseInt(a.year, 10) || 0;
    const yearB = parseInt(b.year, 10) || 0;
    return yearB - yearA;
  });

  // Paginación
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = orderedResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(orderedResults.length / resultsPerPage);
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
}, [currentResults]);


  return (
    <>
      <Menu />
      <section className="container my-5 reveal">
        <div className="label-container-section mb-5">
          <img src={lab} alt="Lab" className="label-img" />
          <h2 className="fw-bold text-primary label-text-section">
            Colección de Libros
          </h2>
        </div>

        {/* Botones de categoría */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`btn btn-sm rounded-pill px-3 py-2 
                ${category === cat.key ? "btn-primary" : "btn-outline-primary"}
              `}
              onClick={() => {
                setCategory(cat.key);
                setCurrentPage(1);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-4 d-flex flex-column"
          style={{ maxWidth: "500px" }}
        >
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar por título, autor, ISBN..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </form>

        {/* Resultados */}
        <div className="row g-4 ">
          {currentResults.map((book) => (
            <div className="col-6 col-md-2 reveal" key={book.id}>
              <div className="card h-100 shadow-sm border-0 hover-lift">
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="card-img-top book-thumbnail"
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{book.title}</h6>
                  <p className="text-muted small">{book.author}</p>
                  <Link
                    to={`/book/${book.id}`}
                    className="btn btn-primary btn-sm mt-auto"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Collection;
