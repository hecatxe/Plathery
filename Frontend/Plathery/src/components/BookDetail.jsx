import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById } from "../service/booksService.js";
import Menu from "./Menu.jsx";
import { useBooks } from "../service/BooksProvider.jsx";
import { useUser } from "../service/UserContext.jsx";
import Footer from "./Footer.jsx";
import ModalMessage from "./ModalMessage.jsx";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const { books, addBook } = useBooks();
  const { user } = useUser();
  const [modal, setModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  //Abrir y cerrar modal
  const showModal = (type, title, message) => {
    setModal({ show: true, type, title, message });
  };
  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  useEffect(() => {
    const fetchBook = async () => {
      const found = await getBookById(id);
      setBook(found);
    };

    const fetchComments = async () => {
      try {
        const API = import.meta.env.VITE_API_BACKEND_URL;
        const res = await fetch(`${API}/books/${id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    };

    fetchBook();
    fetchComments();
  }, [id]);

  const handleAddBook = () => {
    if (!user) {
      showModal(
        "info",
        "Inicio de sesión",
        "Tiene que iniciar sesión para añadir un libro a tu colección."
      );
      return;
    }
    if (!isFavorite) {
      addBook({ ...book, status: "Favorito" });
      showModal("success", "Favoritos", "Libro añadido a tus favoritos.");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      showModal(
        "info",
        "Inicio de sesión",
        "Tiene que iniciar sesión para añadir un comentario."
      );
      return;
    }
    try {
      const API = import.meta.env.VITE_API_BACKEND_URL;
      const res = await fetch(`${API}/books/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, text }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [
          ...prev,
          { id: data.id, username: user.username, rating, text, likes: 0 },
        ]);
        setRating(0);
        setText("");
        showModal("success", "Favoritos", "Comentario añadido con éxito.");
      }
    } catch (err) {
      showModal(
        "error",
        "Error",
        "No se pudo añadir el comentario. Inténtalo de nuevo."
      );

      console.error("Error añadiendo comentario:", err);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      showModal(
        "info",
        "Inicio de sesión",
        "Debes iniciar sesión para dar like a un comentario."
      );

      return;
    }

    try {
      const API = import.meta.env.VITE_API_BACKEND_URL;
      const res = await fetch(
        `${API}/books/${id}/comments/${commentId}/like`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, likes: data.likes, likedBy: data.likedBy }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };
  useEffect(() => {
  if (!book) return; // espera a que el libro esté cargado

  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  });

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, [book, comments]);


  const Synopsis = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div>
        <p className={expanded ? "" : "synopsis-truncated"}>{text}</p>
        <button
          className="btn btn-link p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
    );
  };

  if (!book) return <p className="container my-5">Cargando libro...</p>;
  const isFavorite = book ? books.some((b) => b.id === book.id) : false;

  return (
    <>
      <Menu />
      <section className="container my-5 reveal">
        <Link
          to="/collection"
          className=" text-primary text-decoration-none get-back-link mb-4 d-inline-block"
        >
          <i className="bi bi-arrow-left me-2 "></i> Volver atrás
        </Link>
        <div className="mb-4 ">
          <h2 className="fw-bold text-primary mb-2 book-detail-title">
            {book.title}
          </h2>
          <h3 className="book-detail-authors">{book.author}</h3>
        </div>

        <div className="row gy-4 ">
          <div className="col-12 col-md-4 order-md-2 d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="img-fluid rounded shadow-sm book-detail-image mb-3"
              />
            )}
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-1">
              <span className="me-md-2 mt-md-0 text-danger">
                {isFavorite ? "Añadido a favoritos" : "Añadir a favoritos"}
              </span>
              <button
                className={`
          btn
          rounded-circle
          p-0
          d-flex align-items-center justify-content-center 
          shadow-sm
          ${isFavorite ? "btn-danger" : "btn-outline-danger"}
        `}
                onClick={handleAddBook}
                disabled={isFavorite}
                style={{ width: "40px", height: "40px" }}
              >
                <span className="h5 mb-0 d-flex">
                  <i
                    className={`bi ${
                      isFavorite
                        ? "bi-bookmark-heart-fill"
                        : "bi-bookmark-heart"
                    }`}
                  ></i>
                </span>
              </button>
            </div>
            <p className="text-muted mb-1">
              <span className="fw-bold">Publicado en</span> {book.year}
            </p>
            <p className="text-muted">
              <span className="fw-bold">ISBN</span> {book.isbn}
            </p>
          </div>
          <div className="col-12 col-md-8 order-md-1 d-flex flex-column">
            <Synopsis text={book.synopsis} />
            <a
              href={book.linkAmazon}
              className="btn btn-outline-primary mt-3 align-self-start"
              target="_blank"
              rel="noreferrer"
            >
              Comprar
            </a>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mt-5 reveal">
          <h4 className="comment-section-title">Deja tu reseña</h4>
          <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold">Puntuación:</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi me-1 fs-5 ${
                    star <= rating ? "bi-star-fill text-warning" : "bi-star"
                  }`}
                  onClick={() => setRating(star)}
                  style={{ cursor: "pointer" }}
                ></i>
              ))}
              <span className="ms-2 small text-muted">({rating} / 5)</span>
            </div>
          </div>

          <textarea
            className="form-control mb-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu reseña..."
          />
          <button
            className="btn btn-primary"
            onClick={handleAddComment}
            disabled={rating === 0 || text.trim() === ""}
          >
            Enviar comentario
          </button>
        </div>

        <div className="mt-4 reveal">
          {comments.length === 0 && <p>No hay comentarios aún.</p>}

          {comments.map((c) => {
            const isLikedByUser =
              user && c.likedBy ? c.likedBy.includes(user.id) : false;

            return (
              <div key={c.id} className="card mb-3 shadow-sm border-light reveal">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-primary">{c.username}</strong>

                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi me-0 small ${
                            star <= c.rating
                              ? "bi-star-fill text-warning fs-5 ms-1"
                              : "bi-star text-muted fs-5 ms-1"
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>

                  <p className="card-text">{c.text}</p>

                  <button
                    className={`btn btn-sm  ${
                      isLikedByUser ? "btn-danger" : "btn-outline-danger"
                    }`}
                    onClick={() => handleLike(c.id)}
                  >
                    <i className="bi bi-heart fs-6"></i>
                    <span className="ms-1">{c.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
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

export default BookDetail;
