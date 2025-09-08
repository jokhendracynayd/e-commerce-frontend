'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { AnalyticsProvider } from './AnalyticsContext';
import { AuthModalProvider } from './AuthModalContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { CategoryProvider } from './CategoryContext';
import { CheckoutProvider } from './CheckoutContext';

interface CompositeProviderProps {
  children: ReactNode;
}

/**
 * Composite provider that combines all context providers
 * This reduces nesting and can improve performance by batching re-renders
 */
export function CompositeProvider({ children }: CompositeProviderProps) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <AuthModalProvider>
          <CartProvider>
            <WishlistProvider>
              <CategoryProvider>
                <CheckoutProvider>
                  {children}
                </CheckoutProvider>
              </CategoryProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthModalProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

// Alternative approach: Parallel providers for independent contexts
interface ParallelProviderProps {
  children: ReactNode;
}

/**
 * Alternative provider structure that groups related contexts together
 * and separates independent ones to reduce unnecessary re-renders
 */
export function ParallelProvider({ children }: ParallelProviderProps) {
  return (
    <AuthProvider>
      {/* Auth-dependent providers */}
      <AnalyticsProvider>
        <CartProvider>
          <WishlistProvider>
            {/* Independent providers */}
            <AuthModalProvider>
              <CategoryProvider>
                {children}
              </CategoryProvider>
            </AuthModalProvider>
          </WishlistProvider>
        </CartProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
} 