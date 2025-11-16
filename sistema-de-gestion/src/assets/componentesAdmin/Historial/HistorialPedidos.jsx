import { useState } from 'react';
import './historialPedidos.css';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  // Función para agregar un nuevo pedido (se llamará cuando llegue un pedido)
  const agregarPedido = (nuevoPedido) => {
    setPedidos([...pedidos, nuevoPedido]);
  };

  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Entregado':
        return 'success';
      case 'En proceso':
        return 'warning';
      case 'Pendiente':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <main className="pedidos-main">
      <section className="pedidos-section">
        <div className="pedidos-container">
          {pedidos.length === 0 ? (
            <div className="pedidos-empty">
              <h3>No hay pedidos pendientes</h3>
              <p>Las tarjetas aparecerán cuando lleguen nuevos pedidos</p>
            </div>
          ) : (
            <div className="pedidos-grid">
              {pedidos.map((pedido, index) => (
                <div key={index} className="pedido-card">
                  <div className="pedido-card-body">
                    <div className="pedido-section">
                      <h6>Hora y nombre</h6>
                      <p>{pedido.horaYNombre}</p>
                    </div>
                    
                    <div className="pedido-section">
                      <h6>Productos</h6>
                      <p>{pedido.productos}</p>
                    </div>
                    
                    <div className="pedido-section">
                      <h6>Dirección</h6>
                      <p>{pedido.direccion}</p>
                    </div>
                    
                    <div className="pedido-section pedido-estado">
                      <h6>Estado</h6>
                      <span className={`pedido-badge ${getEstadoClass(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Botón de prueba para agregar pedidos */}
      <button 
        className="btn-agregar-pedido"
        onClick={() => agregarPedido({
          horaYNombre: `${new Date().toLocaleTimeString()} - Cliente ${pedidos.length + 1}`,
          productos: 'Producto de ejemplo',
          direccion: 'Dirección de ejemplo',
          estado: 'Pendiente'
        })}
        title="Agregar pedido de prueba"
      >
        <i className="bi bi-plus-lg"></i>
      </button>
    </main>
  );
}