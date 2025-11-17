import { useState, useEffect } from 'react';
import { getTodosPedidos } from '/src/api/api.js';
import '../admin/adminPage.css';

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTodosPedidos();
      
      // 🔥 FILTRAR: Solo mostrar pedidos finalizados (Entregado o Cancelado)
      const pedidosFinalizados = data.filter(p => 
        p.estado === 'Entregado' || p.estado === 'Cancelado'
      );
      
      // Transformar los datos
      const pedidosTransformados = pedidosFinalizados.map(pedido => ({
        id: pedido.id_pedido,
        cliente: pedido.cliente?.nombre_completo || 'Cliente',
        email: pedido.cliente?.email || '',
        telefono: pedido.cliente?.telefono || '',
        direccion: pedido.cliente?.direccion || 'Sin dirección',
        productos: pedido.detalles?.map(d => 
          `${d.producto?.nombre || 'Producto'} x${d.cantidad}`
        ).join(', ') || 'Sin productos',
        estado: pedido.estado,
        total: pedido.total,
        notas: pedido.notas,
        fecha: formatearFecha(pedido.fecha)
      }));

      setPedidos(pedidosTransformados);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error al cargar historial:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoClass = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  if (loading) {
    return (
      <main className="pedidos-main">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando historial...</span>
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
            onClick={cargarHistorial}
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
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="todos">Todos</option>
            <option value="Entregado">Entregados</option>
            <option value="Cancelado">Cancelados</option>
          </select>
          <button 
            className="btn btn-primary btn-sm"
            onClick={cargarHistorial}
            title="Refrescar"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refrescar
          </button>
        </div>
      </div>

      <section className="pedidos-section">
        <div className="pedidos-container">
          {pedidosFiltrados.length === 0 ? (
            <div className="pedidos-empty">
              <i className="bi bi-inbox fs-1 mb-3"></i>
              <h3>No hay pedidos finalizados</h3>
              <p>Los pedidos completados o cancelados aparecerán aquí</p>
            </div>
          ) : (
            <div className="pedidos-grid">
              {pedidosFiltrados.map((pedido) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-card-header">
                    <span className="pedido-numero">Pedido #{pedido.id}</span>
                    <span className={`badge bg-${getEstadoClass(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>
                  
                  <div className="pedido-card-body">
                    <div className="pedido-section">
                      <h6><i className="bi bi-person me-2"></i>Cliente</h6>
                      <p>{pedido.cliente}</p>
                      {pedido.telefono && (
                        <p className="text-muted small">
                          <i className="bi bi-telephone me-1"></i>
                          {pedido.telefono}
                        </p>
                      )}
                    </div>
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-geo-alt me-2"></i>Dirección</h6>
                      <p>{pedido.direccion}</p>
                    </div>
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-bag me-2"></i>Productos</h6>
                      <p>{pedido.productos}</p>
                    </div>

                    {pedido.notas && (
                      <div className="pedido-section">
                        <h6><i className="bi bi-chat-left-text me-2"></i>Notas</h6>
                        <p className="text-muted">{pedido.notas}</p>
                      </div>
                    )}
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-clock me-2"></i>Fecha</h6>
                      <p className="text-muted small">{pedido.fecha}</p>
                    </div>
                    
                    <div className="pedido-section">
                      <h6><i className="bi bi-cash me-2"></i>Total</h6>
                      <p className="fw-bold text-success">
                        ${parseFloat(pedido.total).toLocaleString('es-AR')}
                      </p>
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