import React, { useState } from "react";
import Empleados from '../../componentesAdmin/Empleados/Empleados';
import GestionVentas from '../../componentesAdmin/Ventas/GestionVentas';
import HistorialPedidos from "../../componentesAdmin/Historial/HistorialPedidos";
//import './AdminPage.css';

export default function AdminPage({ usuario, onLogout }) {
  const [active, setActive] = useState("ventas");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "empleados", label: "Gestión Empleados", icon: "bi-people" },
    { id: "ventas", label: "Gestión Ventas", icon: "bi-cart" },
    { id: "historial", label: "Historial", icon: "bi-clock-history" },
  ];

  const handleMenuClick = (id) => {
    setActive(id);
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
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

        {/* User Info & Logout */}
        <div className="admin-user-info">
          <div className="admin-user-card">
            <span className="admin-user-label">Sesión iniciada como:</span>
            <p className="admin-user-email">
              <i className="bi bi-person-circle"></i>
              {usuario?.email || 'Usuario'}
            </p>
            <p className="admin-user-role">
              <i className="bi bi-shield-check"></i>
              {usuario?.rol || 'admin'}
            </p>
          </div>
          <button className="admin-logout-btn" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {active === "empleados" && <Empleados />}
        {active === "ventas" && <GestionVentas />}
        {active === "historial" && <HistorialPedidos />}
      </main>
    </div>
  );
}