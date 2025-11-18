import React from 'react';
import { useCart } from '/src/context/CartContext';

function Carta({ id_producto, nombre, descripcion, precio, imagen }) {  // ← AGREGAR id_producto
  const { addToCart } = useCart();

  // Formatear precio para mostrar: 7000 -> 7.000
  const formatearPrecio = (p) => {
    let num = typeof p === 'number' ? p : parseFloat(p);
    // Convertir a número entero y formatear con separador de miles
    return `$${Math.round(num).toLocaleString('es-AR')}`;
  };

  const handleAddToCart = () => {
    addToCart({
      id_producto,  // ← AGREGAR ESTO
      id: id_producto,  // ← Por compatibilidad
      nombre,
      descripcion,
      precio,  // ← Pasar el precio sin formatear
      imagen
    });
  };

  return (
    <div className="menu-card">
      <img src={imagen} alt={nombre} className="menu-image" />
      <div className="menu-info">
        <h3 className="menu-name">{nombre}</h3>
        <p className="menu-description">{descripcion}</p>
        <p className="menu-price">{formatearPrecio(precio)}</p>
      </div>
      <button
        className="add-btn"
        onClick={handleAddToCart}
        title="Agregar al carrito"
      >
        +
      </button>
    </div>
  );
}

export default Carta;