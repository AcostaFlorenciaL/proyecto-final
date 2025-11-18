import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPedidos } from "/src/api/api.js"; // <-- Importar desde api.js
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
      const userId = sessionStorage.getItem('userId');
      
      if (!userId) {
        alert('⚠️ Debes iniciar sesión para ver tus pedidos');
        navigate('/login');
        return;
      }

      console.log('📦 Cargando pedidos del usuario:', userId);

      // Usar la función de la API
      const data = await getPedidos(userId);
      
      console.log('✅ Pedidos recibidos:', data);

      // Adaptar los datos (la respuesta del backend ya está bien estructurada)
      const pedidosAdaptados = data.map(pedido => ({
        id: pedido.id_pedido,
        estado: pedido.estado,
        // El backend nos da los detalles con el producto anidado
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
    
    // Devolvemos un formato más limpio
    return `${dia}/${mes}/${año}, ${hora}:${minutos} hs`;
  };

  // ✅ Función para formatear precio: 7000 -> $7.000
  const formatearPrecio = (precio) => {
    let num = typeof precio === 'number' ? precio : parseFloat(precio);
    // Si el número es muy grande (> 100), dividirlo por 100
    if (num > 100) {
      num = num / 100;
    }
    return `$${Math.round(num).toLocaleString('es-AR')}`;
  };

  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case "entregado":
        return "estado entregado";
      case "pendiente":
        return "estado pendiente";
      case "en_preparacion": // El backend puede usar "en_preparacion"
      case "en preparación": // O el frontend puede usar "en preparación"
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
            {/* Reemplazar guiones bajos para mostrar */}
            {pedido.estado.replace('_', ' ').toUpperCase()}
          </div>

          <p className="pedido-id">PEDIDO #{String(pedido.id).padStart(4, "0")}</p>
          <p className="pedido-productos">
            {pedido.productos.join(", ")}
          </p>
          <p className="pedido-fecha">{pedido.fecha}</p>
          <p className="pedido-total">{formatearPrecio(pedido.total)}</p>
        </div>
      ))}
    </div>
  );
};

export default MisPedidos;