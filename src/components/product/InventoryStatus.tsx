'use client';

import { useEffect, useState, useCallback } from 'react';
import { inventoryApi, ProductAvailability, VariantAvailability } from '@/lib/api/inventory-api';

interface InventoryStatusProps {
  productId?: string;
  variantId?: string;
  refreshInterval?: number; // in milliseconds, default 60 seconds
  onAvailabilityChange?: (availability: ProductAvailability | VariantAvailability) => void;
}

export default function InventoryStatus({ 
  productId, 
  variantId, 
  refreshInterval = 60000,
  onAvailabilityChange
}: InventoryStatusProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<ProductAvailability | VariantAvailability | null>(null);

  // Memoize fetchAvailability function to prevent recreation on each render
  const fetchAvailability = useCallback(async () => {
    // Skip if no IDs are provided
    if (!productId && !variantId) {
      setLoading(false);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      let data: ProductAvailability | VariantAvailability;
      
      if (variantId) {
        data = await inventoryApi.getVariantAvailability(variantId);
      } else if (productId) {
        data = await inventoryApi.getProductAvailability(productId);
      } else {
        throw new Error('Either productId or variantId must be provided');
      }
      
      setAvailability(data);
      
      if (onAvailabilityChange) {
        onAvailabilityChange(data);
      }
    } catch (err) {
      console.error('Error fetching inventory status:', err);
      setError('Unable to fetch inventory status');
    } finally {
      setLoading(false);
    }
  }, [productId, variantId, onAvailabilityChange]);

  useEffect(() => {
    // Only set up interval if we have an ID to fetch
    if (productId || variantId) {
      // Initial fetch
      fetchAvailability();
      
      // Set up periodic refresh only if we have valid IDs
      const intervalId = setInterval(fetchAvailability, refreshInterval);
      
      // Clean up interval on unmount or when IDs change
      return () => clearInterval(intervalId);
    } else {
      // Reset loading state if no IDs are provided
      setLoading(false);
    }
  }, [fetchAvailability, refreshInterval]);

  if (loading) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">Checking availability...</span>;
  }

  if (error) {
    return null; // Don't show errors to users, just silently fail
  }

  if (!availability) {
    return null;
  }

  // Render different UI based on stock status
  const getStatusContent = () => {
    switch (availability.stockStatus) {
      case 'IN_STOCK':
        return (
          <span className="text-green-600 dark:text-green-400 flex items-center text-xs sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            In Stock
          </span>
        );
        
      case 'LOW_STOCK':
        return (
          <span className="text-yellow-600 dark:text-yellow-400 flex items-center text-xs sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Only {availability.availableQuantity} left
          </span>
        );
        
      case 'OUT_OF_STOCK':
        return (
          <span className="text-red-600 dark:text-red-400 flex items-center text-xs sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Out of Stock
          </span>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="inventory-status">
      {getStatusContent()}
    </div>
  );
} 