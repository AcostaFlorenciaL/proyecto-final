import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Función helper para parsear precios
  const parsePrice = (precio) => {
    if (typeof precio === 'number') return precio;
    // Elimina símbolos y convierte a número
    const cleaned = String(precio).replace(/[$.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // ✅ Buscar por id_producto en lugar de nombre
      const existingItem = prevItems.find(
        (i) => i.id_producto === item.id_producto
      );
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.id_producto === item.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      
      // ✅ Asegurar que el precio sea numérico al agregar
      return [...prevItems, { 
        ...item, 
        cantidad: 1,
        precio: parsePrice(item.precio) 
      }];
    });
  };

  const removeFromCart = (id_producto) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id_producto === id_producto);
      
      if (!existingItem) return prevItems;
      
      if (existingItem.cantidad === 1) {
        return prevItems.filter((i) => i.id_producto !== id_producto);
      }
      
      return prevItems.map((i) =>
        i.id_producto === id_producto
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  // ✅ Cálculo de total mejorado
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = parsePrice(item.precio);
      return total + (precio * item.cantidad);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};