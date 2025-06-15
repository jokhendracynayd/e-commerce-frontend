'use client';

import { useProductAvailability } from '@/hooks/useProductAvailability';

interface ProductAvailabilityIndicatorProps {
  productId: string;
  viewMode?: 'grid' | 'list';
  showCentered?: boolean;
}

/**
 * A reusable component for displaying prominent availability warnings
 * Can be used in any product display component that needs visual indicators
 */
export default function ProductAvailabilityIndicator({
  productId,
  viewMode = 'grid',
  showCentered = true
}: ProductAvailabilityIndicatorProps) {
  // Use the shared hook to get availability data
  const { 
    loading, 
    productAvailability
  } = useProductAvailability({
    productIds: [productId],
    refreshInterval: 60000 // 1 minute
  });

  // Get the availability data for this product
  const availability = productAvailability[productId];

  if (loading || !availability) {
    return null;
  }

  // Only show for low stock or out of stock
  if (availability.stockStatus === 'IN_STOCK' && availability.availableQuantity >= 5) {
    return null;
  }

  const hasLowStock = availability.availableQuantity < 5 && availability.availableQuantity > 0;
  const isOutOfStock = availability.stockStatus === 'OUT_OF_STOCK';
  
  if (!hasLowStock && !isOutOfStock) {
    return null;
  }

  // For centered overlay style indicators
  if (showCentered) {
    if (hasLowStock) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`bg-yellow-500/80 dark:bg-yellow-600/80 text-white font-bold px-2 py-1 rounded-full shadow-lg transform -rotate-12 backdrop-blur-sm ${
            viewMode === 'list' 
              ? 'text-[8px] xs:text-[10px]' 
              : 'text-xs xs:text-sm'
          }`}>
            Only {availability.availableQuantity} left!
          </div>
        </div>
      );
    }
    
    if (isOutOfStock) {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
          <div className={`bg-red-500/80 text-white font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-12 backdrop-blur-sm ${
            viewMode === 'list' 
              ? 'text-[8px] xs:text-[10px]' 
              : 'text-xs xs:text-sm'
          }`}>
            Out of Stock
          </div>
        </div>
      );
    }
  }
  
  return null;
} 