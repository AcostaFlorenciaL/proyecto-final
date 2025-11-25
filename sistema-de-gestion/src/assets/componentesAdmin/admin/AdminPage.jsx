import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Productos from '../productos/Productos';
import Empleados from '../Empleados/Empleados';
import Turnos from '../Empleados/Turnos';
import Accesos from '../accesos/Accesos';
import GestionVentas from '../Ventas/GestionVentas';
import HistorialPedidos from "../Historial/HistorialPedidos";
import './adminPage.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("productos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRol = sessionStorage.getItem('userRol');
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');

    if (!isLoggedIn || userRol !== 'admin') {
      alert('⚠️ Acceso denegado. Solo administradores pueden acceder.');
      navigate('/login');
      return;
    }

    setUsuario({
      email: userEmail || 'admin@sistema.com',
      rol: userRol || 'admin',
      nombre: userName || 'Administrador'
    });
  }, [navigate]);

  const menuItems = [
    { id: "productos", label: "Productos", icon: "bi-box-seam" },
    { id: "empleados", label: "Empleados", icon: "bi-people" },
    { id: "turnos", label: "Turnos", icon: "bi-calendar3" },
    { id: "accesos", label: "Accesos", icon: "bi-key" },
    { id: "ventas", label: "Ventas", icon: "bi-cart" },
    { id: "historial", label: "Historial", icon: "bi-clock-history" },
  ];

  const handleMenuClick = (id) => {
    setActive(id);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      sessionStorage.clear();
      localStorage.clear();
      navigate('/login');
    }
  };

  if (!usuario) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Validando acceso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <i className="bi bi-shop"></i>
          Panel Admin
        </div>
        
        <nav className="admin-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`admin-menu-item ${active === item.id ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-user-info">
          <div className="admin-user-card">
            <span className="admin-user-label">Sesión iniciada como:</span>
            <p className="admin-user-email">
              <i className="bi bi-person-circle"></i>
              {usuario.email}
            </p>
            <p className="admin-user-role">
              <i className="bi bi-shield-check"></i>
              {usuario.rol}
            </p>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {active === "productos" && <Productos />}
        {active === "empleados" && <Empleados />}
        {active === "turnos" && <Turnos />}
        {active === "accesos" && <Accesos />}
        {active === "ventas" && <GestionVentas />}
        {active === "historial" && <HistorialPedidos />}
      </main>

      <button 
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <i className={`bi ${sidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
      </button>
    </div>
  );
}