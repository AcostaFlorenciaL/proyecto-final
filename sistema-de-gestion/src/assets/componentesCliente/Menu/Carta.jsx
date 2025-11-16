import React from 'react';
import { useCart } from '/src/context/CartContext';

function Carta({ id_producto, nombre, descripcion, precio, imagen }) {  // ← AGREGAR id_producto
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id_producto,  // ← AGREGAR ESTO
      id: id_producto,  // ← Por compatibilidad
      nombre,
      descripcion,
      precio,
      imagen
    });
  };

  return (
    <div className="menu-card">
      <img src={imagen} alt={nombre} className="menu-image" />
      <div className="menu-info">
        <h3 className="menu-name">{nombre}</h3>
        <p className="menu-description">{descripcion}</p>
        <p className="menu-price">{precio}</p>
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