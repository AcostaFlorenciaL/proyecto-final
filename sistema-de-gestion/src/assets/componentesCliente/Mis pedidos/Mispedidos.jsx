import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mispedidos.css";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      // Verificar que el usuario esté logueado
      const userId = sessionStorage.getItem('userId');
      
      if (!userId) {
        alert('⚠️ Debes iniciar sesión para ver tus pedidos');
        navigate('/login');
        return;
      }

      console.log('📦 Cargando pedidos del usuario:', userId);

      // Llamar a la API
      const response = await fetch(`http://localhost:8000/api/pedidos/usuario/${userId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar pedidos');
      }

      const data = await response.json();
      console.log('✅ Pedidos recibidos:', data);

      // Adaptar los datos al formato del componente
      const pedidosAdaptados = data.map(pedido => ({
        id: pedido.id_pedido,
        estado: pedido.estado,
        productos: pedido.detalles?.map(d => 
          `${d.producto?.nombre || 'Producto'} x${d.cantidad}`
        ) || ['Sin productos'],
        fecha: formatearFecha(new Date(pedido.fecha)),
        total: parseFloat(pedido.total)
      }));

      setPedidos(pedidosAdaptados);
      setCargando(false);

    } catch (err) {
      console.error('❌ Error al cargar pedidos:', err);
      setError(err.message);
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    
    return `${dia}/${mes}/${año}, ${hora}:${minutos}:${segundos}`;
  };

  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case "entregado":
        return "estado entregado";
      case "pendiente":
        return "estado pendiente";
      case "en_preparacion":
        return "estado preparacion";
      case "listo":
        return "estado listo";
      default:
        return "estado";
    }
  };

  if (cargando) {
    return (
      <div className="mis-pedidos-container">
        <h2>MIS PEDIDOS</h2>
        <p>Cargando tus pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-pedidos-container">
        <h2>MIS PEDIDOS</h2>
        <p className="error">Error: {error}</p>
        <button onClick={cargarPedidos}>Reintentar</button>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="mis-pedidos-container">
        <h2>MIS PEDIDOS</h2>
        <div className="pedidos-vacio">
          <p>No tienes pedidos realizados aún</p>
          <button onClick={() => navigate('/carta')}>Ver Menú</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-container">
      <h2>MIS PEDIDOS</h2>

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="pedido-card">
          <div className={getEstadoClass(pedido.estado)}>
            {pedido.estado.toUpperCase()}
          </div>

          <p className="pedido-id">#{String(pedido.id).padStart(3, "0")}</p>
          <p className="pedido-productos">
            {pedido.productos.join(", ")}
          </p>
          <p className="pedido-fecha">{pedido.fecha}</p>
          <p className="pedido-total">${pedido.total.toLocaleString("es-AR")}</p>
        </div>
      ))}
    </div>
  );
};

export default MisPedidos;