
import { useCart } from '/src/context/CartContext';
import { useNavigate } from 'react-router-dom';
import './carrito.css';
import { crearPedido } from "/src/api/api.js";

const Carrito = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleRealizarPedido = async () => {
    try {
      // Obtener userId del sessionStorage
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        alert('⚠️ Debes iniciar sesión para realizar un pedido');
        navigate('/login');
        return;
      }

      // Preparar detalles del pedido
      const detalles = cartItems.map((item) => {
        // Limpiar el precio (quitar $, puntos, etc)
        const precioLimpio = typeof item.precio === 'string'
          ? parseFloat(item.precio.replace(/[^0-9.,]/g, '').replace(',', '.'))
          : parseFloat(item.precio);

        return {
          id_producto: item.id_producto || item.id, // ← CORREGIDO
          cantidad: item.cantidad,
          subtotal: precioLimpio * item.cantidad
        };
      });

      const pedido = {
        id_cliente: parseInt(userId), // Asumiendo que id_cliente = id_usuario
        total: getCartTotal(),
        metodo_pago: "Efectivo",
        notas: "Pedido desde React",
        detalles: detalles
      };

      console.log("📦 Enviando pedido:", pedido);
      console.log("🛒 Items del carrito:", cartItems);

      const respuesta = await crearPedido(userId, pedido);

      console.log("✅ Respuesta del backend:", respuesta);

      // Limpiar carrito
      clearCart();

      // Mostrar mensaje de éxito
      alert("✅ Pedido realizado con éxito!");

      // Redirigir a Mis Pedidos
      navigate('/pedidos');

    } catch (error) {
      console.error("❌ Error al enviar pedido:", error);
      alert(`❌ Error al procesar el pedido: ${error.message}`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="carrito-container">
        <div className="carrito-vacio">
          <i className="bi bi-cart-x"></i>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el menú</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1 className="carrito-title">Tu Carrito</h1>

      <div className="carrito-items">
        {cartItems.map((item, index) => (
          <div key={`${item.id_producto || item.id}-${index}`} className="carrito-item">
            <img src={item.imagen} alt={item.nombre} className="carrito-item-img" />

            <div className="carrito-item-info">
              <h3>{item.nombre}</h3>
              <p className="carrito-item-desc">{item.descripcion}</p>
              <p className="carrito-item-precio">{item.precio}</p>
            </div>

            <div className="carrito-item-controls">
              <button
                className="btn-quantity"
                onClick={() => removeFromCart(item.nombre)}
              >
                <i className="bi bi-dash"></i>
              </button>

              <span className="carrito-item-cantidad">{item.cantidad}</span>

              <button
                className="btn-quantity"
                onClick={() => addToCart(item)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <div className="carrito-item-subtotal">
              ${(parseFloat(item.precio.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) * item.cantidad).toLocaleString('es-AR')}
            </div>
          </div>
        ))}
      </div>

      <div className="carrito-footer">
        <div className="carrito-total">
          <h3>Total:</h3>
          <h2>${getCartTotal().toLocaleString('es-AR')}</h2>
        </div>

        <div className="carrito-actions">
          <button className="btn-clear" onClick={clearCart}>
            Vaciar Carrito
          </button>
          <button
            className="btn-checkout"
            onClick={handleRealizarPedido}
          >
            Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;