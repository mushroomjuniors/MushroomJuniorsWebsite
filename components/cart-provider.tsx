"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Product = {
  id: string; // Supabase uses string IDs (UUIDs)
  name: string;
  price?: number; // Price is now optional
  image: string;
  category?: string; // CHANGED: Made optional
  isNew?: boolean;   // CHANGED: Made optional
  quantity?: number;
};

type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void; // CHANGED: productId is now string
  updateQuantity: (productId: string, quantity: number) => void; // CHANGED: productId is now string
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Load cart from localStorage on client side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Only set item if cartItems is not empty and has been initialized
    if (cartItems && cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else if (cartItems && cartItems.length === 0 && localStorage.getItem("cart")) {
      // If cart becomes empty, remove it from localStorage
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) } : item, // Also consider product.quantity if provided
        );
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => { // CHANGED: productId is now string
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => { // CHANGED: productId is now string
    if (quantity < 1) {
      removeFromCart(productId); // If quantity is less than 1, remove item
      return;
    }
    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  // const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  // For "Enquire for price" model, numeric subtotal is not applicable for customer view.
  // We'll set it to 0 for now to maintain type compatibility if other parts of the system expect a number.
  // The display components (cart, checkout) will show "To be quoted" or similar.
  const subtotal = 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
