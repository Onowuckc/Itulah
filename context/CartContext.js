'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('itulah_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {}
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('itulah_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price || 0,
            imageUrl: product.imageUrl || '/img/logo.png',
            category: product.category,
            quantity
          }
        ];
      }
    });

    setToastMessage(`Added "${product.name}" to cart!`);
    setIsCartOpen(true);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
