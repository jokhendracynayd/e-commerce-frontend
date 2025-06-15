'use client';

import { useEffect } from 'react';
import { useProductAvailability } from '@/hooks/useProductAvailability';

interface CartItemAvailabilityProps {
  productId: string;
  variantId?: string;
  quantity: number;
  onStatusChange?: (isAvailable: boolean) => void;
}

export default function CartItemAvailability({ 
  productId, 
  variantId, 
  quantity,
  onStatusChange 
}: CartItemAvailabilityProps) {
  // Use the shared hook to access availability data
  const { 
    loading,
    productAvailability,
    variantAvailability,
    isProductAvailable,
    isVariantAvailable
  } = useProductAvailability({
    productIds: productId ? [productId] : [],
    variantIds: variantId ? [variantId] : [],
    refreshInterval: 30000 // 30 seconds
  });

  // Determine availability based on the data from the hook
  const availability = variantId 
    ? variantAvailability[variantId]
    : productId ? productAvailability[productId] : null;
  
  // Check if requested quantity is available
  const isAvailable = variantId
    ? isVariantAvailable(variantId) && (variantAvailability[variantId]?.availableQuantity >= quantity)
    : isProductAvailable(productId) && (productAvailability[productId]?.availableQuantity >= quantity);

  // Notify parent component about availability status changes
  useEffect(() => {
    if (onStatusChange && !loading) {
      onStatusChange(isAvailable);
    }
  }, [isAvailable, onStatusChange, loading]);

  if (loading) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">Checking...</span>;
  }

  if (!availability) {
    return null;
  }

  if (!isAvailable) {
    return (
      <div className="text-red-600 dark:text-red-400 text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {availability.stockStatus === 'OUT_OF_STOCK' 
          ? 'Out of stock' 
          : `Only ${availability.availableQuantity} available`}
      </div>
    );
  }

  return (
    <div className="text-green-600 dark:text-green-400 text-xs flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      In stock
    </div>
  );
} 