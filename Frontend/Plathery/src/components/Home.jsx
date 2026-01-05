import Menu from "./Menu.jsx";
import BestSellers from "./BestSellersNYT.jsx";
import heroImage from "../assets/hero.png";
import ScrollVelocity from "./ScrollVelocity.jsx";
import NewReleases from "./NewReleases.jsx";
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";
import { useEffect } from "react";
export const Home = () => {
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

  return (
    <>
      <Menu />
      <section className="hero-section reveal">
        <div className="hero-text">
          <h2 className="hero-title noto-serif-font fs-1 reveal">
            Empieza tu viaje{" "}
            <span className="noto-serif-font-italic text-primary">
              literario
            </span>
            ,<br></br> descubre tu{" "}
            <span className="noto-serif-font-italic text-primary">
              comunidad
            </span>
          </h2>
          <p className="hero-subtitle reveal">
            Explora miles de libros, comparte tus reseñas y construye tu
            biblioteca personal.<br></br> Marca tu progreso, descubre lecturas
            afines y únete a una comunidad de amantes de los libros.
          </p>
          <Link to="/collection">
            <button className="btn btn-primary rounded-5 fs-5 px-4 reveal">
              Explorar colección
            </button>
          </Link>
        </div>
        <img src={heroImage} alt="Imagen de inicio" className="hero-image" />
      </section>
      <div className="scroll-container">
        <ScrollVelocity
          texts={["Plathery\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0"]}
          velocity={50}
          className="custom-scroll-text"
        />
      </div>
      <BestSellers />
      <NewReleases />
      <Footer />
    </>
  );
};
export default Home;
