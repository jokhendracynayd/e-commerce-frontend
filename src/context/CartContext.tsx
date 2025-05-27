'use client';

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { ProductDetail, ColorVariant } from '@/types/product';

export interface CartItem {
  product: ProductDetail;
  quantity: number;
  selectedColor?: ColorVariant;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductDetail, quantity: number, selectedColor?: ColorVariant) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const initialLoadRef = useRef(true);
  const skipNextSaveRef = useRef(false);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage', error);
        }
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Skip the first render and when explicitly skipping a save
    if (!initialLoadRef.current) {
      if (skipNextSaveRef.current) {
        skipNextSaveRef.current = false;
      } else {
        localStorage.setItem('cart', JSON.stringify(items));
      }
      
      // Calculate totals
      const itemCount = items.reduce((total, item) => total + item.quantity, 0);
      const priceTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      
      setTotalItems(itemCount);
      setTotalPrice(priceTotal);
    }
  }, [items]);
  
  const addToCart = (product: ProductDetail, quantity: number, selectedColor?: ColorVariant) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && 
        (!selectedColor || item.selectedColor?.id === selectedColor?.id)
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, { product, quantity, selectedColor }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    skipNextSaveRef.current = true; // Skip the next localStorage save
    setItems([]);
    setTotalItems(0);
    setTotalPrice(0);
    localStorage.removeItem('cart'); // Directly remove from localStorage
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
} 