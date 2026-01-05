export default function Footer() {
  return (
    <>
      <footer className="bg-white border-top border-primary mt-5 text-center text-lg-start">
        <div className="container p-4">
          <div className="row">
            <div className="col-lg-6 col-md-12 mb-4">
              <h5 className="logo-footer ">Plathery</h5>
              <div className="d-flex flex-column text-primary gmail-footer">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-envelope-heart me-2 fs-4"></i>
                  <a href="mailto:plathery.info@gmail.com">
                    plathery.info@gmail.com
                  </a>
                </div>

                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone me-2 fs-4"></i>
                  <a href="tel:+34123456789">+34 698 92 16 72</a>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="text-uppercase">Legal</h5>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="/privacy" className="text-dark">
                    Aviso de Privacidad
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-dark">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-dark">
                    Política de Cookies
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <h5 className="text-uppercase">Síguenos</h5>
              <a
                href="https://github.com/hecatxe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary fs-4 me-3"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="URL_DE_INSTAGRAM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary fs-4 me-3"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="URL_DE_TWITTER"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary fs-4 "
              >
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="container py-1 text-center ">
          <p className="mb-0 text-muted">
            &copy; {new Date().getFullYear()} Plathery. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
