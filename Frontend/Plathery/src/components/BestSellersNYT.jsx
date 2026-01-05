import React, { useEffect, useState } from "react";
import { getBestSellersNYT } from "../service/booksService.js";
import arrowLeft from "../assets/chevron-left.svg";
import arrowRight from "../assets/chevron-right.svg";
import lab from "../assets/Lab2.png";

const BestSellersNYT = () => {
  const [books, setBooks] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  // Coge los bestsellers del NYT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBestSellersNYT();
        setBooks(data);
      } catch (err) {
        console.error("Error cargando bestsellers NYT:", err);
      }
    };
    fetchData();
  }, []);
  // Cambio de tamaño de pantalla para el carrusel
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const chunkSize = isMobile ? 1 : 3;
  const chunkedBooks = [];
  for (let i = 0; i < books.length; i += chunkSize) {
    chunkedBooks.push(books.slice(i, i + chunkSize));
  }

  return (
    <section className="container my-5 reveal">
      <div className="label-container-section mb-3">
        <img src={lab} alt="Lab" className="label-img" />
        <h2 className="mb-4 fw-bold text-primary label-text-section">
          Más Vendidos
        </h2>
      </div>
      <div
        id="nytBestSellersCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {chunkedBooks.map((group, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={`group-${index}`}
            >
              <div className="row justify-content-center g-4">
                {group.map((book) => (
                  <div
                    className="col-10 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
                    key={book.primary_isbn13 || `${book.title}-${book.author}`}
                  >
                    <div className="card book-card h-100 border-0 shadow-sm small-card">
                      <div className="card-img-container p-1">
                        {book.book_image && (
                          <img
                            src={book.book_image}
                            alt={book.title}
                            className="card-img-top book-cover rounded"
                          />
                        )}
                      </div>
                      <div className="card-body text-center">
                        <h6 className="card-title fw-semibold">{book.title}</h6>
                        <p className="card-text text-muted small">
                          {book.author}
                        </p>
                        <a
                          href={book.amazon_product_url}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver más
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#nytBestSellersCarousel"
          data-bs-slide="prev"
        >
          <span className="custom-carousel-icon" aria-hidden="true">
            <img src={arrowLeft} alt="prev" />
          </span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#nytBestSellersCarousel"
          data-bs-slide="next"
        >
          <span className="custom-carousel-icon" aria-hidden="true">
            <img src={arrowRight} alt="next" />
          </span>
        </button>
      </div>
    </section>
  );
};

export default BestSellersNYT;
