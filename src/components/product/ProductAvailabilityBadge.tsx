'use client';

import { useProductAvailability } from '@/hooks/useProductAvailability';

interface ProductAvailabilityBadgeProps {
  productId: string;
  compact?: boolean;
}

export default function ProductAvailabilityBadge({ 
  productId,
  compact = false
}: ProductAvailabilityBadgeProps) {
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

  // Render different badge based on stock status
  switch (availability.stockStatus) {
    case 'IN_STOCK':
      // In stock items don't show any badge now
      return null;
      /* Commented out as per requirement
      return compact ? (
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[8px] xs:text-[10px] font-medium px-1 py-0.5 rounded-sm">
          In Stock
        </span>
      ) : (
        <div className="mt-1 flex items-center text-[10px] xs:text-xs text-green-600 dark:text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          In Stock
        </div>
      );
      */
      
    case 'LOW_STOCK':
      // Show prominent low stock warning with quantity
      return compact ? (
        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[8px] xs:text-[10px] font-medium px-1 py-0.5 rounded-sm">
          Low Stock
        </span>
      ) : (
        <div className="mt-1 flex items-center text-[10px] xs:text-xs text-yellow-600 dark:text-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Only {availability.availableQuantity} left
        </div>
      );
      
    case 'OUT_OF_STOCK':
      return compact ? (
        <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[8px] xs:text-[10px] font-medium px-1 py-0.5 rounded-sm">
          Out of Stock
        </span>
      ) : (
        <div className="mt-1 flex items-center text-[10px] xs:text-xs text-red-600 dark:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Out of Stock
        </div>
      );
      
    default:
      return null;
  }
} 