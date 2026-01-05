import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../service/UserContext.jsx";

export default function Menu() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogout = async () => {
    try {
      const API = import.meta.env.VITE_API_BACKEND_URL;
      const res = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        setShow(false);
        navigate("/login");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Navbar expand="sm" className="py-1" sticky="top">
      <Container fluid className="d-flex align-items-center ">
        {/*  El menú amburguesa */}
        <Navbar.Toggle
          aria-controls="navbarResponsive"
          className="border-0 shadow-none"
        />

        {/* Menú colapsable */}
        <Navbar.Collapse
          id="navbarResponsive"
          className="justify-content-between"
        >
          {/* Enlaces */}
          <Navbar.Brand href="#" className="logo-text d-lg-block d-none ms-3">
            <Link to="/">Plathery</Link>
          </Navbar.Brand>
          <Nav className="gap-5 mx-lg-0 mx-auto text-center m-2 me-auto fs-5">
            <Nav.Link as={Link} to="/" className="menu-link">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/articles" className="menu-link">
              Artículos
            </Nav.Link>
            <Nav.Link as={Link} to="/collection" className="menu-link">
              Colección
            </Nav.Link>
          </Nav>

          {/* Área de usuario */}
          <div className="d-flex align-items-center justify-content-center mt-2 mt-lg-0">
            <Person className="me-2 text-primary" size={20} />
            {user ? (
              <>
                <Button variant="primary" onClick={() => setShow(true)}>
                  Bienvenido/a, {user.username}
                </Button>

                <Offcanvas
                  show={show}
                  onHide={() => setShow(false)}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Tu cuenta</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <p className="text-muted mb-3">
                      Sesión iniciada como <strong>{user.username}</strong>
                    </p>

                    <div className="d-grid gap-2">
                      <Button
                        as={Link}
                        to="/profile"
                        variant="outline-primary"
                        onClick={() => setShow(false)}
                      >
                        Lista de Libros
                      </Button>
                      {/* Este botón solo aparece si el usuario es admin */}
                      {user.role === "admin" && (
                        <Button
                          as={Link}
                          to="/adminPanel"
                          variant="outline-warning"
                          onClick={() => setShow(false)}
                        >
                          Panel de Administración
                        </Button>
                      )}
                      <Button variant="outline-danger" onClick={handleLogout}>
                        Cerrar sesión
                      </Button>
                    </div>
                  </Offcanvas.Body>
                </Offcanvas>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline-primary" className="custom-login-btn">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
