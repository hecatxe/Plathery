import React, { useEffect, useMemo, useState } from "react";
import { getArticles } from "../service/articlesService.js";
import { Link } from "react-router-dom";
import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";
import lab from "../assets/Lab2.png";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const parseSpanishDate = (str) => {
    const meses = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };

    const partes = str.toLowerCase().replace(/ de /g, " ").split(" ");
    const dia = parseInt(partes[0], 10);
    const mes = meses[partes[1]];
    const año = parseInt(partes[2], 10);

    return new Date(año, mes, dia);
  };
  const sortedArticles = useMemo(() => {
    const sortableArticles = [...articles];

    sortableArticles.sort((a, b) => {
      const dateA = parseSpanishDate(a.date);
      const dateB = parseSpanishDate(b.date);

      if (isNaN(dateA) || isNaN(dateB)) return 0;

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return sortableArticles;
  }, [articles, sortOrder]);
  useEffect(() => {
  if (articles.length === 0) return;

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
}, [articles]);


  return (
    <>
      <Menu />
      <section className="container my-5 reveal">
        <div className="label-container-section mb-5">
          <img src={lab} alt="Lab" className="label-img" />
          <h2 className="fw-bold text-primary label-text-section">Artículos</h2>
        </div>

        <div className="d-flex justify-content-end mb-4 align-items-center gap-2">
          <label
            htmlFor="sortSelect"
            className="form-label mb-0 small text-muted d-none d-sm-block"
          >
            Ordenar por:
          </label>
          <select
            id="sortSelect"
            className="form-select form-select-sm w-auto"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Más Nuevos</option>
            <option value="oldest">Más Antiguos</option>
          </select>
        </div>

        <div className="row g-4">
          {sortedArticles.map((article) => (
            <div className="col-12 col-md-6" key={article.id}>
              <div className="card h-100 shadow-sm border-0 card-img-top hover-lift reveal">
                <img
                  src={article.image}
                  alt={article.title}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                  <p className="text-muted small">{article.date}</p>
                  <h5 className="card-title card-article-title">
                    {article.title}
                  </h5>
                  <div className="card-text-container mb-3 flex-grow-1">
                    <p className="card-text">{article.summary}</p>
                  </div>
                  <Link
                    to={`/articles/${article.id}`}
                    className="btn btn-primary btn-sm mt-auto me-auto"
                  >
                    Leer más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Articles;
