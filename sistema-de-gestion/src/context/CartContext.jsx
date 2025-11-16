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

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.nombre === item.nombre);
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.nombre === item.nombre
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      
      return [...prevItems, { ...item, cantidad: 1 }];
    });
  };

  const removeFromCart = (nombre) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.nombre === nombre);
      
      if (existingItem.cantidad === 1) {
        return prevItems.filter((i) => i.nombre !== nombre);
      }
      
      return prevItems.map((i) =>
        i.nombre === nombre
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

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = parseFloat(item.precio.replace(/[$\.]/g, '').replace(',', '.'));
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