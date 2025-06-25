import React, { createContext, useState, useContext } from 'react';

// 1. Crea el contexto
const CartContext = createContext();

// 2. Crea un proveedor para el contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (productToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id_producto === productToAdd.id_producto);
      if (existingItem) {
        // Si el producto ya existe, incrementa la cantidad
        return prevItems.map(item =>
          item.id_producto === productToAdd.id_producto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un producto nuevo, añádelo con cantidad 1
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id_producto !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id_producto !== productId);
      }
      return prevItems.map(item =>
        item.id_producto === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular el total del carrito
  const cartTotal = cartItems.reduce((total, item) => total + (item.precio_unitario * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};