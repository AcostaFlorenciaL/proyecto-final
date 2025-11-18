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
    // Si ya es un número, devolverlo tal cual
    if (typeof precio === 'number') return precio;
    // Si es un string, limpiarlo y convertir
    if (typeof precio === 'string') {
      const cleaned = precio.replace(/[$.]/g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    }
    return 0;
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
      
      // ✅ Guardar el precio tal como viene (número puro)
      return [...prevItems, { 
        ...item, 
        cantidad: 1,
        precio: item.precio  // ← No parsear, guardar tal cual
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
      let precio = parsePrice(item.precio);
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