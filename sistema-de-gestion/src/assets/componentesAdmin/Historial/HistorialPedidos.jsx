import { useState, useEffect } from 'react';
import '../admin/adminPage.css';

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los pedidos al montar el componente
  useEffect(() => {
    cargarTodosPedidos();
  }, []);

  const cargarTodosPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔥 NUEVO: Endpoint para obtener TODOS los pedidos (necesitas crearlo en el backend)
      const response = await fetch('http://localhost:8000/api/pedidos/todos');
      
      if (!response.ok) {
        throw new Error('Error al cargar los pedidos');
      }

      const data = await response.json();
      
      // Transformar los datos del backend al formato que necesita el frontend
      const pedidosTransformados = data.map(pedido => ({
        id: pedido.id_pedido,
        horaYNombre: `${formatearFecha(pedido.fecha)} - ${pedido.cliente?.nombre_completo || 'Cliente'}`,
        productos: pedido.detalles?.map(d => 
          `${d.producto?.nombre || 'Producto'} x${d.cantidad}`
        ).join(', ') || 'Sin productos',
        direccion: pedido.cliente?.direccion || 'Sin dirección',
        estado: pedido.estado,
        clienteId: pedido.id_cliente,
        usuarioId: pedido.id_usuario,
        total: pedido.total,
        notas: pedido.notas
      }));

      setPedidos(pedidosTransformados);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error al cargar pedidos:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const hora = fecha.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return hora;
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:8000/api/pedidos/${pedidoId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      // Actualizar el estado localmente
      setPedidos(pedidos.map(p => 
        p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
      ));
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const getEstadoClass = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'entregado':
        return 'success';
      case 'en proceso':
      case 'en preparación':
        return 'warning';
      case 'pendiente':
        return 'secondary';
      case 'cancelado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <main className="pedidos-main">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando pedidos...</span>
          </div>
          <p className="mt-3">Cargando historial de pedidos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pedidos-main">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error: {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={cargarTodosPedidos}
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pedidos-main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Historial de Pedidos</h1>
        <button 
          className="btn btn-primary"
          onClick={cargarTodosPedidos}
          title="Refrescar"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refrescar
        </button>
      </div>

      <section className="pedidos-section">
        <div className="pedidos-container">
          {pedidos.length === 0 ? (
            <div className="pedidos-empty">
              <i className="bi bi-inbox fs-1 mb-3"></i>
              <h3>No hay pedidos registrados</h3>
              <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
            </div>
          ) : (
            <div className="pedidos-grid">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-card-header">
                    <span className="pedido-numero">Pedido #{pedido.id}</span>
                    <span className={`badge bg-${getEstadoClass(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>
                  
                  <div className="pedido-card-body">
                    <div className="pedido-section">
                      <h6><i className="bi bi-clock me-2"></i>Hora y Cliente</h6>
                      <p>{pedido.horaYNombre}</p>
                    </div>
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-bag me-2"></i>Productos</h6>
                      <p>{pedido.productos}</p>
                    </div>
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-geo-alt me-2"></i>Dirección</h6>
                      <p>{pedido.direccion}</p>
                    </div>

                    {pedido.notas && (
                      <div className="pedido-section">
                        <h6><i className="bi bi-chat-left-text me-2"></i>Notas</h6>
                        <p className="text-muted">{pedido.notas}</p>
                      </div>
                    )}
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-cash me-2"></i>Total</h6>
                      <p className="fw-bold text-success">
                        ${parseFloat(pedido.total).toLocaleString('es-AR')}
                      </p>
                    </div>
                    
                    <div className="pedido-section pedido-estado">
                      <h6>Cambiar Estado</h6>
                      <select
                        className={`form-select form-select-sm estado-select estado-${pedido.estado.toLowerCase().replace(' ', '-')}`}
                        value={pedido.estado}
                        onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Listo">Listo</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}