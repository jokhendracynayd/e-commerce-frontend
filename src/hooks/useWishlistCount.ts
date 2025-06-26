'use client';

import { useState, useEffect } from 'react';
import { getWishlist } from '@/services/wishlistService';
import { isAuthenticated } from '@/lib/api/axios-client';

interface UseWishlistCountReturn {
  count: number;
  loading: boolean;
  error: string | null;
  refreshCount: () => Promise<void>;
}

export function useWishlistCount(): UseWishlistCountReturn {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlistCount = async () => {
    if (!isAuthenticated()) {
      setCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getWishlist();
      if (result.error) {
        setError(result.error);
        setCount(0);
      } else {
        setCount(result.total);
      }
    } catch (err) {
      console.error('Error fetching wishlist count:', err);
      setError('Failed to load wishlist count');
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      fetchWishlistCount();
    };

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    // Initial fetch
    fetchWishlistCount();

    // Listen for auth events
    window.addEventListener('auth:login', handleAuthChange);
    window.addEventListener('auth:logout', handleAuthChange);
    
    // Listen for wishlist updates (custom events)
    window.addEventListener('wishlist:updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('auth:login', handleAuthChange);
      window.removeEventListener('auth:logout', handleAuthChange);
      window.removeEventListener('wishlist:updated', handleWishlistUpdate);
    };
  }, []);

  const refreshCount = async () => {
    await fetchWishlistCount();
  };

  return {
    count,
    loading,
    error,
    refreshCount
  };
} 