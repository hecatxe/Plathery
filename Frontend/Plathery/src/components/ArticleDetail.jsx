import React from "react";
import { Link, useParams } from "react-router-dom";
import { getArticleById } from "../service/articlesService.js";
import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";

const ArticleDetail = () => {
  const { id } = useParams();
  const article = getArticleById(id);

  // Recorre el array de párrafos y usa dangerouslySetInnerHTML
  const renderContent = (contentArray) => {
    // Aseguramos que contentArray sea un array antes de mapear
    if (!Array.isArray(contentArray)) {
      // Si content no es un array (por si acaso), lo renderizamos como un solo elemento
      return (
        <div
          className="article-paragraph"
          dangerouslySetInnerHTML={{ __html: contentArray }}
        />
      );
    }

    return contentArray.map((paragraph, index) => (
      <div
        key={index}
        className="article-paragraph mb-4"
        dangerouslySetInnerHTML={{ __html: paragraph }}
      />
    ));
  };

  if (!article) return <p>Artículo no encontrado</p>;

  return (
    <>
      <Menu />
      <section className="container my-5">
        <Link to="/articles" className=" text-primary text-decoration-none get-back-link">
          <i className="bi bi-arrow-left me-2 "></i> Volver atrás
        </Link>

        <h2 className="fw-bold article-detail-title my-4">{article.title}</h2>
        <img
          src={article.image}
          alt={article.title}
          className="img-fluid mb-4 rounded d-flex mx-auto w-75"
        />
        <p className="text-muted border-bottom pb-3 mb-4 fw-bold  w-75 mx-auto">
          {article.date} · {article.author}
        </p>
        <div className="article-content-body fs-5 w-75 mx-auto">
          {renderContent(article.content)}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ArticleDetail;
