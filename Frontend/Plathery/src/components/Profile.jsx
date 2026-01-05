import { useBooks } from "../service/BooksProvider.jsx";
import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";
import lab from "../assets/Lab2.png";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ModalMessage from "./ModalMessage.jsx";

const Profile = () => {
  const { books, updateStatus, removeBook } = useBooks();
  const statusOptions = ["Leído", "Pendiente", "Leyendo", "Favorito"];
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});
  const [bookToDelete, setBookToDelete] = useState(null);

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

  const toggleDropdown = (bookId, event) => {
    event?.stopPropagation();
    setOpenDropdownId(openDropdownId === bookId ? null : bookId);
  };

  const handleStatusChange = (bookId, newStatus) => {
    updateStatus(bookId, newStatus);
    setOpenDropdownId(null);
  };

  // Para cerrar el dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDropdownId &&
        !e.target.closest(".dropdown-toggle") &&
        !e.target.closest(".dropdown-menu")
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  // Posicionar dropdown
  useEffect(() => {
    if (openDropdownId && buttonRefs.current[openDropdownId]) {
      const button = buttonRefs.current[openDropdownId];
      const dropdown = dropdownRefs.current[openDropdownId];

      if (button && dropdown) {
        const buttonRect = button.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        // Calcula la posición
        let top = buttonRect.bottom + window.scrollY;
        let left =
          buttonRect.left +
          window.scrollX -
          dropdownRect.width +
          buttonRect.width;

        // Ajusta si se sale de la pantalla
        const viewportWidth = window.innerWidth;
        if (left + dropdownRect.width > viewportWidth) {
          left = viewportWidth - dropdownRect.width - 10;
        }
        if (left < 0) left = 10;

        dropdown.style.position = "fixed";
        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
        dropdown.style.zIndex = "9999";
      }
    }
  }, [openDropdownId]);

  return (
    <>
      <Menu />
      <section className="container my-5 vh-100">
        <div className="label-container-section mb-5 reveal">
          <img src={lab} alt="Lab" className="label-img" />
          <h2 className="fw-bold text-primary label-text-section">Mi Perfil</h2>
        </div>
        <h4 className="mb-3 reveal">Mis libros guardados</h4>

        {books.length === 0 ? (
          <p className="text-muted">Todavía no has añadido ningún libro.</p>
        ) : (
          <div className="row g-4">
            {books.map((book) => (
              <div className="col-12 col-md-6" key={book.id}>
                <div className="card shadow-sm border-0 hover-lift h-100">
                  <div className="card-body p-3">
                    <div className="row g-0">
                      <div className="col-4 d-flex justify-content-start align-items-center">
                        {book.coverImage && (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="img-fluid rounded shadow-sm"
                            style={{
                              width: "80px",
                              height: "auto",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>

                      <div className="col-8 position-relative ps-3">
                        <div className="d-flex position-absolute top-0 end-0">
                          <div className="btn-group me-2">
                            <button
                              ref={(el) => (buttonRefs.current[book.id] = el)}
                              className="btn btn-sm text-secondary p-0"
                              title="Cambiar estado"
                              onClick={(e) => toggleDropdown(book.id, e)}
                            >
                              <i className="bi bi-three-dots fs-5"></i>
                            </button>
                          </div>
                          <button
                            className="btn btn-sm text-danger p-0 position-relative delete-btn"
                            onClick={() => {
                              setBookToDelete(book.id);
                              showModal(
                                "warning",
                                "Eliminar libro",
                                "¿Estás seguro de que quieres eliminar este libro de tu colección?"
                              );
                            }}
                            title="Eliminar libro"
                          >
                            <i className="bi bi-bookmark-x fs-5 icon-default"></i>
                            <i className="bi bi-bookmark-x-fill fs-5 icon-hover position-absolute top-0 start-0"></i>
                          </button>
                        </div>
                        <Link
                          to={`/book/${book.id}`}
                          className="text-decoration-none"
                        >
                          <h5 className="card-title mt-0 pt-0 me-5 text-truncate fw-bold noto-serif-font text-primary fs-4">
                            {book.title}
                          </h5>
                          <p className="text-muted small mb-3 me-5 text-truncate fs-6">
                            {book.author}
                          </p>
                          <div className="position-absolute bottom-0 end-0">
                            <span className="badge bg-primary fs-6">
                              {book.status}
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  ref={(el) => (dropdownRefs.current[book.id] = el)}
                  className={`dropdown-menu ${
                    openDropdownId === book.id ? "show" : ""
                  }`}
                  style={{
                    minWidth: "max-content",
                    whiteSpace: "nowrap",
                    display: openDropdownId === book.id ? "block" : "none",
                  }}
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      className={`dropdown-item w-100 text-start ${
                        book.status === option ? "active" : ""
                      }`}
                      onClick={() => handleStatusChange(book.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <ModalMessage
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        removeBook={removeBook}
        bookToDelete={bookToDelete}
      />

      <Footer />
    </>
  );
};

export default Profile;
