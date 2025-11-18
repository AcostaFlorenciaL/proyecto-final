import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '/src/context/CartContext';
import Buscador from '../Buscador/Buscador';
import './nav.css';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Detecta la ruta actual
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, [location]); // Se actualiza cuando cambia la ruta

  const handleSearch = (searchTerm) => {
    console.log('Búsqueda:', searchTerm);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

    if (location.pathname === '/admin' || location.pathname === '/login' || location.pathname === '/registro') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid px-4">

        <a
          className="navbar-brand d-flex align-items-center"
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
        >
          <div className="logo-text">
            La Esquina
            <span className="logo-subtitle">BAR</span>
          </div>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <div className="mx-auto my-3 my-lg-0">
            <Buscador onSearch={handleSearch} />
          </div>

          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <a
                className={`nav-link-custom ${isActive('/')}`}
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
              >
                INICIO
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link-custom ${isActive('/carta')}`}
                href="/carta"
                onClick={(e) => { e.preventDefault(); navigate('/carta'); }}
              >
                CARTA
              </a>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <a
                  className={`nav-link-custom ${isActive('/pedidos')}`}
                  href="/pedidos"
                  onClick={(e) => { e.preventDefault(); navigate('/pedidos'); }}
                >
                  MIS PEDIDOS
                </a>
              </li>
            )}
            <li className="nav-item">
              <a
                className={`nav-link-custom ${isActive('/info')}`}
                href="/info"
                onClick={(e) => { e.preventDefault(); navigate('/info'); }}
              >
                INFO
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center ms-lg-3">
            <button
              className="icon-btn position-relative"
              onClick={() => navigate('/carrito')}
              aria-label="Carrito de compras"
            >
              <i className="bi bi-cart3"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>
            {isLoggedIn ? (
              <button
                className="icon-btn"
                onClick={() => navigate('/perfil')}
                aria-label="Perfil de usuario"
              >
                <i className="bi bi-person-circle"></i>
              </button>
            ) : (
              <button
                className="icon-btn"
                onClick={() => navigate('/login')}
                aria-label="Iniciar sesión"
              >
                <i className="bi bi-box-arrow-in-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;