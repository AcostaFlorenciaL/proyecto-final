import React, { useState, useEffect } from "react";
import { getPedidosActivos, actualizarEstadoPedido, actualizarPedido } from '/src/api/api.js';
import '../admin/adminPage.css';

export default function GestionVentas() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  
  const [formData, setFormData] = useState({
    total: "",
    notas: "",
    estado: "Pendiente",
  });

  // Cargar pedidos activos al montar
  useEffect(() => {
    cargarPedidosActivos();
  }, []);

  const cargarPedidosActivos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getPedidosActivos();
      
      // Transformar datos del backend
      const pedidosTransformados = data.map(pedido => ({
        id: pedido.id_pedido,
        cliente: pedido.cliente?.nombre_completo || 'Cliente',
        email: pedido.cliente?.email || '',
        telefono: pedido.cliente?.telefono || '',
        direccion: pedido.cliente?.direccion || 'Sin dirección',
        productos: pedido.detalles?.map(d => 
          `${d.producto?.nombre || 'Producto'} x${d.cantidad}`
        ).join(', ') || 'Sin productos',
        total: parseFloat(pedido.total),
        estado: pedido.estado,
        fecha: formatearFecha(pedido.fecha),
        notas: pedido.notas || ''
      }));

      setPedidos(pedidosTransformados);
    } catch (err) {
      console.error('❌ Error al cargar pedidos activos:', err);
      setError(err.message);
    } finally {
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

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      
      // Si cambia a Entregado o Cancelado, se mueve al historial
      if (nuevoEstado === 'Entregado' || nuevoEstado === 'Cancelado') {
        alert(`✅ Pedido #${id} movido al historial`);
        await cargarPedidosActivos(); // Recargar para que desaparezca de la lista
      } else {
        // Actualizar localmente
        setPedidos(pedidos.map(p => 
          p.id === id ? { ...p, estado: nuevoEstado } : p
        ));
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error al actualizar estado del pedido');
    }
  };

  const editarPedido = (pedido) => {
    setPedidoEditando(pedido);
    setFormData({
      total: pedido.total,
      notas: pedido.notas,
      estado: pedido.estado,
    });
    setMostrarModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarPedido = async () => {
    try {
      await actualizarPedido(pedidoEditando.id, {
        total: parseFloat(formData.total),
        notas: formData.notas,
        estado: formData.estado
      });

      // Si cambia a Entregado o Cancelado
      if (formData.estado === 'Entregado' || formData.estado === 'Cancelado') {
        alert(`✅ Pedido #${pedidoEditando.id} finalizado y movido al historial`);
        await cargarPedidosActivos();
      } else {
        // Actualizar localmente
        setPedidos(pedidos.map(p =>
          p.id === pedidoEditando.id
            ? { ...p, ...formData, total: parseFloat(formData.total) }
            : p
        ));
      }

      setMostrarModal(false);
      setError(null);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error al guardar cambios');
    }
  };

  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pedidos activos...</p>
      </div>
    );
  }

  return (
    <div className="gestion-ventas">
      <div className="header">
        <h1>Gestión de Ventas</h1>
        <button className="btn-primary" onClick={cargarPedidosActivos}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refrescar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros">
        <label>Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En preparación">En preparación</option>
          <option value="Listo">Listo</option>
        </select>
        <span className="ms-3 text-muted">
          Total: {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla de pedidos */}
      <div className="tabla-container">
        <div className="tabla-scroll">
          <table className="tabla-pedidos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha/Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No hay pedidos activos
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido, index) => (
                  <tr key={pedido.id} className={index % 2 === 0 ? "fila-par" : ""}>
                    <td>#{pedido.id}</td>
                    <td>
                      <div>
                        <strong>{pedido.cliente}</strong>
                        {pedido.telefono && (
                          <div className="text-muted small">
                            <i className="bi bi-telephone me-1"></i>
                            {pedido.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{pedido.direccion}</td>
                    <td>{pedido.productos}</td>
                    <td className="total">${pedido.total.toLocaleString()}</td>
                    <td>
                      <select
                        className={`estado-select estado-${pedido.estado.replace(" ", "-")}`}
                        value={pedido.estado}
                        onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Listo">Listo</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="fecha">{pedido.fecha}</td>
                    <td>
                      <button
                        className="btn-editar"
                        onClick={() => editarPedido(pedido)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Editar Pedido #{pedidoEditando.id}</h5>
              <button
                className="btn-cerrar"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label><strong>Cliente:</strong> {pedidoEditando.cliente}</label>
              </div>
              <div className="form-group">
                <label><strong>Dirección:</strong> {pedidoEditando.direccion}</label>
              </div>
              <div className="form-group">
                <label><strong>Productos:</strong></label>
                <p>{pedidoEditando.productos}</p>
              </div>
              <div className="form-group">
                <label>Total ($)</label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En preparación">En preparación</option>
                  <option value="Listo">Listo</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-primary" onClick={guardarPedido}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}