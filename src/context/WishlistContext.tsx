'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { WishlistItemWithProduct } from '@/types/wishlist';
import { getWishlist, addToWishlist, removeFromWishlist, isProductInWishlist } from '@/services/wishlistService';
import { useAuth } from './AuthContext';
import axiosClient from '@/lib/api/axios-client';

interface WishlistContextType {
  items: WishlistItemWithProduct[];
  count: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  addItem: (productId: string) => Promise<{ success: boolean; error?: string }>;
  removeItem: (productId: string) => Promise<{ success: boolean; error?: string }>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<WishlistItemWithProduct[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update count whenever items change
  useEffect(() => {
    setCount(items.length);
  }, [items]);

  // Load wishlist when user authenticates
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First try to load from cache without forcing refresh
      const cachedResult = await getWishlist(false);
      
      if (cachedResult.error && cachedResult.requiresAuth) {
        setError(cachedResult.error);
        setItems([]);
        setLoading(false);
        return;
      }
      
      // If we have cached data, use it immediately
      if (!cachedResult.error && cachedResult.items.length > 0) {
        console.log('Loading cached wishlist data into context:', cachedResult.items.length, 'items');
        setItems(cachedResult.items);
        setLoading(false);
        
        // Optionally refresh in background to ensure data is up to date
        try {
          const freshResult = await getWishlist(true);
          if (!freshResult.error && freshResult.items.length !== cachedResult.items.length) {
            console.log('Updating with fresh wishlist data:', freshResult.items.length, 'items');
            setItems(freshResult.items);
          }
        } catch (err) {
          console.error('Error refreshing wishlist in background:', err);
          // Don't update error state since we already have cached data
        }
      } else {
        // No cached data, fetch fresh data
        const result = await getWishlist(true);
        
        if (result.error) {
          setError(result.error);
          setItems([]);
        } else {
          setItems(result.items);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist');
      setItems([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load wishlist count efficiently (for header display)
  const loadWishlistCount = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }

    try {
      const response = await axiosClient.get('/wishlist/count');
      setCount(response.data.data.count || 0);
    } catch (err) {
      console.error('Error loading wishlist count:', err);
      // Don't show error for count loading failures
      setCount(0);
    }
  }, [isAuthenticated]);

  // Load wishlist when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // Load full wishlist data initially
      loadWishlist();
    } else {
      // Clear wishlist when user logs out
      setItems([]);
      setCount(0);
      setError(null);
    }
  }, [isAuthenticated, loadWishlist]);

  // Initialize with cached data on component mount (for faster loading)
  useEffect(() => {
    const initializeCache = async () => {
      try {
        // Try to load cached data without authentication check first
        // This is just for initializing the UI quickly
        const cachedResult = await getWishlist(false);
        if (!cachedResult.error && cachedResult.items.length > 0) {
          console.log('Initializing context with cached wishlist data:', cachedResult.items.length, 'items');
          setItems(cachedResult.items);
          setLoading(false); // Set loading to false since we have data
        } else if (cachedResult.requiresAuth) {
          // If auth is required, wait for AuthContext to be ready
          console.log('Auth required for wishlist, waiting for AuthContext...');
        } else {
          // No cached data available
          console.log('No cached wishlist data available');
          setLoading(false);
        }
      } catch (err) {
        console.log('No cached data available on initialization:', err);
        setLoading(false);
      }
    };
    
    initializeCache();
  }, []); // Only run once on mount

  // Add item to wishlist
  const addItem = useCallback(async (productId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      const result = await addToWishlist(productId);
      
      if (result.success) {
        // Refresh wishlist to get updated data
        await loadWishlist();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to add item' };
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      return { success: false, error: 'Failed to add item to wishlist' };
    }
  }, [isAuthenticated, loadWishlist]);

  // Remove item from wishlist
  const removeItem = useCallback(async (productId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      const result = await removeFromWishlist(productId);
      
      if (result.success) {
        // Update local state immediately for better UX
        setItems(prevItems => prevItems.filter(item => item.productId !== productId));
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to remove item' };
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      return { success: false, error: 'Failed to remove item from wishlist' };
    }
  }, [isAuthenticated]);

  // Check if product is in wishlist (using local state for performance)
  const isInWishlist = useCallback((productId: string): boolean => {
    return items.some(item => item.productId === productId);
  }, [items]);

  // Refresh wishlist data
  const refreshWishlist = useCallback(async () => {
    await loadWishlist();
  }, [loadWishlist]);

  // Clear wishlist (for logout)
  const clearWishlist = useCallback(() => {
    setItems([]);
    setCount(0);
    setError(null);
  }, []);

  const value: WishlistContextType = useMemo(() => ({
    items,
    count,
    loading,
    error,
    addItem,
    removeItem,
    isInWishlist,
    refreshWishlist,
    clearWishlist,
  }), [
    items,
    count,
    loading,
    error,
    addItem,
    removeItem,
    isInWishlist,
    refreshWishlist,
    clearWishlist,
  ]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 