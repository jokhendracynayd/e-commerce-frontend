import { 
  ProductAvailability, 
  VariantAvailability, 
  BatchAvailabilityRequest, 
  BatchAvailabilityResponse,
  inventoryApi
} from '@/lib/api/inventory-api';

// Cache for availability data to prevent repeated API calls
const availabilityCache = {
  products: new Map<string, { data: ProductAvailability, timestamp: number }>(),
  variants: new Map<string, { data: VariantAvailability, timestamp: number }>(),
  // Cache expiration time in milliseconds (increased from 10 seconds to 5 minutes)
  expirationTime: 5 * 60 * 1000
};

  // In-flight requests tracking to prevent duplicate API calls
const inFlightRequests = {
  products: new Map<string, Promise<ProductAvailability>>(),
  variants: new Map<string, Promise<VariantAvailability>>(),
  batch: new Map<string, Promise<void>>()
};

// Check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < availabilityCache.expirationTime;
};

// Generate a cache key for batch requests
const generateBatchCacheKey = (request: BatchAvailabilityRequest): string => {
  const productIds = request.productIds?.sort().join(',') || '';
  const variantIds = request.variantIds?.sort().join(',') || '';
  return `${productIds}|${variantIds}`;
};

/**
 * Service to handle inventory-related operations
 * This service provides business logic on top of the raw API calls
 */
export const inventoryService = {
  /**
   * Get availability status for a product
   * @param productId - The product ID to check
   * @returns Product availability information
   */
  getProductAvailability: async (productId: string): Promise<ProductAvailability> => {
    // Check cache first
    const cachedProduct = availabilityCache.products.get(productId);
    if (cachedProduct && isCacheValid(cachedProduct.timestamp)) {
      return cachedProduct.data;
    }
    
    // Check if there's already an in-flight request for this product
    if (inFlightRequests.products.has(productId)) {
      return inFlightRequests.products.get(productId)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        // Cache miss - fetch from API
        const data = await inventoryApi.getProductAvailability(productId);
        
        // Update cache
        availabilityCache.products.set(productId, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.products.delete(productId);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.products.set(productId, promise);
    
    return promise;
  },

  /**
   * Get availability status for a product variant
   * @param variantId - The variant ID to check
   * @returns Variant availability information
   */
  getVariantAvailability: async (variantId: string): Promise<VariantAvailability> => {
    // Check cache first
    const cachedVariant = availabilityCache.variants.get(variantId);
    if (cachedVariant && isCacheValid(cachedVariant.timestamp)) {
      return cachedVariant.data;
    }
    
    // Check if there's already an in-flight request for this variant
    if (inFlightRequests.variants.has(variantId)) {
      return inFlightRequests.variants.get(variantId)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        // Cache miss - fetch from API
        const data = await inventoryApi.getVariantAvailability(variantId);
        
        // Update cache
        availabilityCache.variants.set(variantId, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.variants.delete(variantId);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.variants.set(variantId, promise);
    
    return promise;
  },

  /**
   * Get availability for multiple products and variants in a single request
   * Useful for cart pages and product listing pages
   * @param request - The batch request containing product and variant IDs
   * @returns Batch availability response
   */
  getBatchAvailability: async (request: BatchAvailabilityRequest): Promise<BatchAvailabilityResponse> => {
    // Filter out IDs that are already in the cache and still valid
    const productsToFetch: string[] = [];
    const variantsToFetch: string[] = [];
    
    // Check which products need to be fetched
    if (request.productIds && request.productIds.length > 0) {
      request.productIds.forEach(id => {
        const cached = availabilityCache.products.get(id);
        if (!cached || !isCacheValid(cached.timestamp)) {
          productsToFetch.push(id);
        }
      });
    }
    
    // Check which variants need to be fetched
    if (request.variantIds && request.variantIds.length > 0) {
      request.variantIds.forEach(id => {
        const cached = availabilityCache.variants.get(id);
        if (!cached || !isCacheValid(cached.timestamp)) {
          variantsToFetch.push(id);
        }
      });
    }
    
    // If everything is cached, return cached data
    if (productsToFetch.length === 0 && variantsToFetch.length === 0) {
      const result: BatchAvailabilityResponse = {
        products: [],
        variants: []
      };
      
      // Get products from cache
      if (request.productIds) {
        result.products = request.productIds
          .map(id => availabilityCache.products.get(id)?.data)
          .filter((item): item is ProductAvailability => item !== undefined);
      }
      
      // Get variants from cache
      if (request.variantIds) {
        result.variants = request.variantIds
          .map(id => availabilityCache.variants.get(id)?.data)
          .filter((item): item is VariantAvailability => item !== undefined);
      }
      
      return result;
    }
    
    // Make API call for items not in cache
    const fetchRequest: BatchAvailabilityRequest = {
      productIds: productsToFetch.length > 0 ? productsToFetch : undefined,
      variantIds: variantsToFetch.length > 0 ? variantsToFetch : undefined
    };
    
    // Generate a cache key for this batch request
    const batchKey = generateBatchCacheKey(fetchRequest);
    
    // Check if there's already an in-flight request for this batch
    if (inFlightRequests.batch.has(batchKey)) {
      // Wait for the existing request to complete
      await inFlightRequests.batch.get(batchKey);
    } else if (productsToFetch.length > 0 || variantsToFetch.length > 0) {
      // Create a new request and track it
      const request = async () => {
        try {
          // Only make API call if there's something to fetch
          if (productsToFetch.length > 0 || variantsToFetch.length > 0) {
            const apiResponse = await inventoryApi.getBatchAvailability(fetchRequest);
            
            // Update cache with new data
            const now = Date.now();
            
            if (apiResponse.products) {
              apiResponse.products.forEach((product: ProductAvailability) => {
                availabilityCache.products.set(product.productId, {
                  data: product,
                  timestamp: now
                });
              });
            }
            
            if (apiResponse.variants) {
              apiResponse.variants.forEach((variant: VariantAvailability) => {
                availabilityCache.variants.set(variant.variantId, {
                  data: variant,
                  timestamp: now
                });
              });
            }
          }
        } finally {
          // Remove from in-flight requests when done
          inFlightRequests.batch.delete(batchKey);
        }
      };
      
      // Store the promise in the in-flight requests map
      const promise = request();
      inFlightRequests.batch.set(batchKey, promise);
      
      // Wait for the request to complete
      await promise;
    }
    
    // Combine fetched data with cached data for complete response
    const result: BatchAvailabilityResponse = {
      products: [],
      variants: []
    };
    
    // Get all requested products (from cache or newly fetched)
    if (request.productIds) {
      result.products = request.productIds
        .map(id => availabilityCache.products.get(id)?.data)
        .filter((item): item is ProductAvailability => item !== undefined);
    }
    
    // Get all requested variants (from cache or newly fetched)
    if (request.variantIds) {
      result.variants = request.variantIds
        .map(id => availabilityCache.variants.get(id)?.data)
        .filter((item): item is VariantAvailability => item !== undefined);
    }
    
    return result;
  },

  /**
   * Prefetch availability data for products and variants
   * Useful for preloading data that will likely be needed soon
   * @param productIds - Array of product IDs to prefetch
   * @param variantIds - Array of variant IDs to prefetch
   */
  prefetchAvailability: async (productIds: string[] = [], variantIds: string[] = []): Promise<void> => {
    // Skip if nothing to prefetch
    if (productIds.length === 0 && variantIds.length === 0) {
      return;
    }
    
    // Filter out IDs that are already in the cache and still valid
    const productsToFetch = productIds.filter(id => {
      const cached = availabilityCache.products.get(id);
      return !cached || !isCacheValid(cached.timestamp);
    });
    
    const variantsToFetch = variantIds.filter(id => {
      const cached = availabilityCache.variants.get(id);
      return !cached || !isCacheValid(cached.timestamp);
    });
    
    // Skip if everything is already cached
    if (productsToFetch.length === 0 && variantsToFetch.length === 0) {
      return;
    }
    
    // Use batch availability to efficiently prefetch data
    try {
      await inventoryService.getBatchAvailability({
        productIds: productsToFetch.length > 0 ? productsToFetch : undefined,
        variantIds: variantsToFetch.length > 0 ? variantsToFetch : undefined
      });
    } catch (error) {
      // Silently handle prefetch errors - they shouldn't affect the UI
      console.warn('Error prefetching availability data:', error);
    }
  },

  /**
   * Clear the entire inventory cache
   * Useful when you want to force fresh data from the API
   */
  clearCache: (): void => {
    availabilityCache.products.clear();
    availabilityCache.variants.clear();
  },

  /**
   * Clear cache for a specific product
   * @param productId - The product ID to clear from cache
   */
  clearProductCache: (productId: string): void => {
    availabilityCache.products.delete(productId);
  },

  /**
   * Clear cache for a specific variant
   * @param variantId - The variant ID to clear from cache
   */
  clearVariantCache: (variantId: string): void => {
    availabilityCache.variants.delete(variantId);
  },

  /**
   * Check if a product is in stock based on a minimum quantity threshold
   * @param productId - The product ID to check
   * @param minQuantity - Minimum quantity required (default 1)
   * @returns Promise<boolean> - Whether the product is available in sufficient quantity
   */
  isProductAvailable: async (productId: string, minQuantity: number = 1): Promise<boolean> => {
    try {
      const availability = await inventoryService.getProductAvailability(productId);
      return availability.availableQuantity >= minQuantity;
    } catch (error) {
      console.error(`Error checking product availability for ${productId}:`, error);
      return false; // Default to unavailable if there's an error
    }
  },

  /**
   * Check if a variant is in stock based on a minimum quantity threshold
   * @param variantId - The variant ID to check
   * @param minQuantity - Minimum quantity required (default 1)
   * @returns Promise<boolean> - Whether the variant is available in sufficient quantity
   */
  isVariantAvailable: async (variantId: string, minQuantity: number = 1): Promise<boolean> => {
    try {
      const availability = await inventoryService.getVariantAvailability(variantId);
      return availability.availableQuantity >= minQuantity;
    } catch (error) {
      console.error(`Error checking variant availability for ${variantId}:`, error);
      return false; // Default to unavailable if there's an error
    }
  },

  /**
   * Check if a product has low stock (less than 5 items)
   * @param productId - The product ID to check
   * @returns Promise<boolean> - Whether the product has less than 5 items in stock
   */
  hasLowStock: async (productId: string): Promise<boolean> => {
    try {
      const availability = await inventoryService.getProductAvailability(productId);
      return availability.availableQuantity < 5 && availability.availableQuantity > 0;
    } catch (error) {
      console.error(`Error checking product low stock for ${productId}:`, error);
      return false;
    }
  },

  /**
   * Check if a variant has low stock (less than 5 items)
   * @param variantId - The variant ID to check
   * @returns Promise<boolean> - Whether the variant has less than 5 items in stock
   */
  hasVariantLowStock: async (variantId: string): Promise<boolean> => {
    try {
      const availability = await inventoryService.getVariantAvailability(variantId);
      return availability.availableQuantity < 5 && availability.availableQuantity > 0;
    } catch (error) {
      console.error(`Error checking variant low stock for ${variantId}:`, error);
      return false;
    }
  },

  /**
   * Get a friendly stock status message for display
   * @param stockStatus - The raw stock status from the API
   * @param quantity - The available quantity
   * @returns A user-friendly status message
   */
  getStockStatusMessage: (stockStatus: string, quantity: number): string => {
    switch (stockStatus) {
      case 'IN_STOCK':
        return quantity < 5 ? `Only ${quantity} left` : `In Stock (${quantity} available)`;
      case 'LOW_STOCK':
        return `Low Stock (${quantity} left)`;
      case 'OUT_OF_STOCK':
        return 'Out of Stock';
      default:
        return 'Stock status unavailable';
    }
  }
}; 