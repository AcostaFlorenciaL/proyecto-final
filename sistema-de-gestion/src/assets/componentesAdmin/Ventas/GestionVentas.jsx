import React, { useState } from "react";
import "./GestionVentas.css";

export default function GestionVentas() {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      productos: "Pizza Napolitana x2, Coca Cola x1",
      total: 3500,
      empleado: "María López",
      estado: "pendiente",
      fecha: "2025-11-11 12:30",
    },
    {
      id: 2,
      cliente: "Ana García",
      productos: "Hamburguesa completa, Papas fritas",
      total: 2800,
      empleado: "Carlos Díaz",
      estado: "en preparación",
      fecha: "2025-11-11 12:45",
    },
    {
      id: 3,
      cliente: "Pedro Martínez",
      productos: "Milanesa napolitana, Ensalada",
      total: 4200,
      empleado: "Julián Pérez",
      estado: "pendiente",
      fecha: "2025-11-11 13:00",
    },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  
  const [formData, setFormData] = useState({
    cliente: "",
    productos: "",
    total: "",
    empleado: "",
    estado: "pendiente",
  });

  const cambiarEstado = (id, nuevoEstado) => {
    setPedidos(
      pedidos.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  const eliminarPedido = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      setPedidos(pedidos.filter((p) => p.id !== id));
    }
  };

  const editarPedido = (pedido) => {
    setPedidoEditando(pedido);
    setFormData({
      cliente: pedido.cliente,
      productos: pedido.productos,
      total: pedido.total,
      empleado: pedido.empleado,
      estado: pedido.estado,
    });
    setMostrarModal(true);
  };

  const abrirModalNuevo = () => {
    setPedidoEditando(null);
    setFormData({
      cliente: "",
      productos: "",
      total: "",
      empleado: "",
      estado: "pendiente",
    });
    setMostrarModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarPedido = () => {
    if (pedidoEditando) {
      setPedidos(
        pedidos.map((p) =>
          p.id === pedidoEditando.id
            ? { ...pedidoEditando, ...formData, total: parseFloat(formData.total) }
            : p
        )
      );
    } else {
      const nuevoPedido = {
        id: Math.max(...pedidos.map((p) => p.id)) + 1,
        ...formData,
        total: parseFloat(formData.total),
        fecha: new Date().toLocaleString("es-AR"),
      };
      setPedidos([...pedidos, nuevoPedido]);
    }
    setMostrarModal(false);
  };

  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  return (
    <div className="gestion-ventas">
      <div className="header">
        <h1>Gestión de Ventas</h1>
        <button className="btn-primary" onClick={abrirModalNuevo}>
          + Nuevo Pedido
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros">
        <label>Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="en preparación">En preparación</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Tabla de pedidos */}
      <div className="tabla-container">
        <div className="tabla-scroll">
          <table className="tabla-pedidos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Empleado</th>
                <th>Estado</th>
                <th>Fecha/Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido, index) => (
                <tr key={pedido.id} className={index % 2 === 0 ? "fila-par" : ""}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.productos}</td>
                  <td className="total">${pedido.total.toLocaleString()}</td>
                  <td>{pedido.empleado}</td>
                  <td>
                    <select
                      className={`estado-select estado-${pedido.estado.replace(" ", "-")}`}
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en preparación">En preparación</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="fecha">{pedido.fecha}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => editarPedido(pedido)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarPedido(pedido.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{pedidoEditando ? "Editar Pedido" : "Nuevo Pedido"}</h5>
              <button
                className="btn-cerrar"
                onClick={() => setMostrarModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Cliente</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Productos</label>
                <textarea
                  name="productos"
                  value={formData.productos}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Total ($)</label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Empleado encargado</label>
                <input
                  type="text"
                  name="empleado"
                  value={formData.empleado}
                  onChange={handleInputChange}
                />
              </div>
              {pedidoEditando && (
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en preparación">En preparación</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-primary" onClick={guardarPedido}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}