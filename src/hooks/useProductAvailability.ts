import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { inventoryApi, ProductAvailability, VariantAvailability } from '@/lib/api/inventory-api';

interface UseProductAvailabilityProps {
  productIds?: string[];
  variantIds?: string[];
  refreshInterval?: number; // in milliseconds, default 60 seconds
}

interface AvailabilityResult {
  loading: boolean;
  error: string | null;
  productAvailability: Record<string, ProductAvailability>;
  variantAvailability: Record<string, VariantAvailability>;
  isProductAvailable: (productId: string) => boolean;
  isVariantAvailable: (variantId: string) => boolean;
  getProductStockStatus: (productId: string) => string | null;
  getVariantStockStatus: (variantId: string) => string | null;
  refreshAvailability: () => Promise<void>;
}

// Helper function to check if two arrays have the same values
function areArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

export function useProductAvailability({
  productIds = [],
  variantIds = [],
  refreshInterval = 60000
}: UseProductAvailabilityProps): AvailabilityResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productAvailability, setProductAvailability] = useState<Record<string, ProductAvailability>>({});
  const [variantAvailability, setVariantAvailability] = useState<Record<string, VariantAvailability>>({});
  
  // Use refs to track previous arrays for comparison
  const prevProductIdsRef = useRef<string[]>([]);
  const prevVariantIdsRef = useRef<string[]>([]);
  
  // Memoize arrays only when they actually change
  const memoizedProductIds = useMemo(() => {
    if (areArraysEqual(productIds, prevProductIdsRef.current)) {
      return prevProductIdsRef.current;
    }
    prevProductIdsRef.current = productIds;
    return productIds;
  }, [productIds]);
  
  const memoizedVariantIds = useMemo(() => {
    if (areArraysEqual(variantIds, prevVariantIdsRef.current)) {
      return prevVariantIdsRef.current;
    }
    prevVariantIdsRef.current = variantIds;
    return variantIds;
  }, [variantIds]);

  // Memoize the fetch function to prevent recreating it on each render
  const fetchAvailability = useCallback(async () => {
    // Skip if there are no IDs to check
    if (memoizedProductIds.length === 0 && memoizedVariantIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await inventoryApi.getBatchAvailability({
        productIds: memoizedProductIds.length > 0 ? memoizedProductIds : undefined,
        variantIds: memoizedVariantIds.length > 0 ? memoizedVariantIds : undefined
      });

      // Convert arrays to maps for easier lookup
      const productMap: Record<string, ProductAvailability> = {};
      const variantMap: Record<string, VariantAvailability> = {};

      response.products.forEach(product => {
        productMap[product.productId] = product;
      });

      response.variants.forEach(variant => {
        variantMap[variant.variantId] = variant;
      });

      setProductAvailability(productMap);
      setVariantAvailability(variantMap);
    } catch (err) {
      console.error('Error fetching batch availability:', err);
      setError('Failed to fetch product availability');
    } finally {
      setLoading(false);
    }
  }, [memoizedProductIds, memoizedVariantIds]);

  // Initial fetch and setup interval
  useEffect(() => {
    fetchAvailability();

    // Set up refresh interval
    const intervalId = setInterval(fetchAvailability, refreshInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchAvailability, refreshInterval]);

  // Helper functions
  const isProductAvailable = useCallback((productId: string): boolean => {
    const product = productAvailability[productId];
    return product ? product.stockStatus !== 'OUT_OF_STOCK' : true; // Default to true if unknown
  }, [productAvailability]);

  const isVariantAvailable = useCallback((variantId: string): boolean => {
    const variant = variantAvailability[variantId];
    return variant ? variant.stockStatus !== 'OUT_OF_STOCK' : true; // Default to true if unknown
  }, [variantAvailability]);

  const getProductStockStatus = useCallback((productId: string): string | null => {
    const product = productAvailability[productId];
    return product ? product.stockStatus : null;
  }, [productAvailability]);

  const getVariantStockStatus = useCallback((variantId: string): string | null => {
    const variant = variantAvailability[variantId];
    return variant ? variant.stockStatus : null;
  }, [variantAvailability]);

  return {
    loading,
    error,
    productAvailability,
    variantAvailability,
    isProductAvailable,
    isVariantAvailable,
    getProductStockStatus,
    getVariantStockStatus,
    refreshAvailability: fetchAvailability
  };
} 