import { useCart } from '/src/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './carrito.css';
import { crearPedido } from "/src/api/api.js";

const Carrito = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Función para limpiar el precio
  const parsePrice = (precio) => {
    if (typeof precio === 'number') return precio;
    return parseFloat(String(precio).replace(/[$.]/g, '').replace(',', '.')) || 0;
  };

  const handleRealizarPedido = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        alert('⚠️ Debes iniciar sesión para realizar un pedido');
        navigate('/login');
        return;
      }

      // ✅ Validar que haya items en el carrito
      if (cartItems.length === 0) {
        alert('⚠️ El carrito está vacío');
        setLoading(false);
        return;
      }

      const detalles = cartItems.map((item) => {
        const precioLimpio = parsePrice(item.precio);
        
        return {
          id_producto: item.id_producto || item.id,
          cantidad: item.cantidad,
          subtotal: precioLimpio * item.cantidad
        };
      });

      const total = getCartTotal();

      // ✅ Validar que el total sea válido
      if (total <= 0) {
        alert('⚠️ Error: Total inválido');
        setLoading(false);
        return;
      }

      // ✅ SUPER SIMPLIFICADO: Solo lo esencial
      const pedido = {
        total: total,
        detalles: detalles
        // El método de pago se elige al momento de entregar/pagar
        // La dirección ya está guardada en el perfil del cliente
      };

      console.log("📦 Enviando pedido:", pedido);
      
      const respuesta = await crearPedido(userId, pedido);

      console.log("✅ Respuesta del backend:", respuesta);

      clearCart();
      alert("✅ Pedido realizado con éxito!");
      navigate('/pedidos');

    } catch (error) {
      console.error("❌ Error al enviar pedido:", error);
      alert(`❌ Error al procesar el pedido: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <i className="bi bi-cart-x"></i>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el menú</p>
          <button 
            className="btn-checkout" 
            onClick={() => navigate('/carta')}
          >
            Ver Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1 className="carrito-title">Tu Carrito</h1>

      <div className="carrito-items">
        {cartItems.map((item, index) => {
          const precioNumerico = parsePrice(item.precio);
          const subtotal = (precioNumerico * item.cantidad);

          return (
            <div key={`${item.id_producto || item.id}-${index}`} className="carrito-item">
              <img src={item.imagen} alt={item.nombre} className="carrito-item-img" />

              <div className="carrito-item-info">
                <h3>{item.nombre}</h3>
                <p className="carrito-item-desc">{item.descripcion}</p>
                <p className="carrito-item-precio">${precioNumerico.toLocaleString('es-AR')}</p>
              </div>

              <div className="carrito-item-controls">
                <button
                  className="btn-quantity"
                  onClick={() => removeFromCart(item.id_producto || item.id)}
                  disabled={loading}
                >
                  <i className="bi bi-dash"></i>
                </button>

                <span className="carrito-item-cantidad">{item.cantidad}</span>

                <button
                  className="btn-quantity"
                  onClick={() => addToCart(item)}
                  disabled={loading}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              <div className="carrito-item-subtotal">
                ${subtotal.toLocaleString('es-AR')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="carrito-footer">
        <div className="carrito-total">
          <h3>Total:</h3>
          <h2>${getCartTotal().toLocaleString('es-AR')}</h2>
        </div>

        <div className="carrito-actions">
          <button 
            className="btn-clear" 
            onClick={clearCart}
            disabled={loading}
          >
            Vaciar Carrito
          </button>
          <button
            className="btn-checkout"
            onClick={handleRealizarPedido}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="bi bi-hourglass-split"></i> Procesando...
              </>
            ) : (
              'Realizar Pedido'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;