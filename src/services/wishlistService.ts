import wishlistApi from '@/lib/api/wishlist-api';
import { ProductDetail } from '@/types/product';
import { 
  ApiWishlistResponse, 
  WishlistItemWithProduct, 
  AddToWishlistRequest 
} from '@/types/wishlist';
import { isAuthenticated } from '@/lib/api/axios-client';
import axios, { AxiosError, CancelTokenSource } from 'axios';

// Cancel tokens for pending requests
const cancelTokens: {
  getWishlist: CancelTokenSource | null;
  addToWishlist: CancelTokenSource | null;
  removeFromWishlist: CancelTokenSource | null;
} = {
  getWishlist: null,
  addToWishlist: null,
  removeFromWishlist: null
};

/**
 * Max retry attempts for API requests
 */
const MAX_RETRIES = 3;

/**
 * Delay between retries in milliseconds
 */
const RETRY_DELAY = 500;

/**
 * Cache implementation for wishlist data
 */
type WishlistCache = {
  data: {
    items: WishlistItemWithProduct[];
    total: number;
  } | null;
  timestamp: number;
  productIdMap: Map<string, boolean>;
  expiryTime: number;
};

const wishlistCache: WishlistCache = {
  data: null,
  timestamp: 0,
  productIdMap: new Map<string, boolean>(),
  expiryTime: 30000 // 30 seconds cache expiry
};

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
  if (!wishlistCache.data) return false;
  return Date.now() - wishlistCache.timestamp < wishlistCache.expiryTime;
}

/**
 * Update cache with new wishlist data
 */
function updateCache(data: { items: WishlistItemWithProduct[]; total: number }): void {
  wishlistCache.data = data;
  wishlistCache.timestamp = Date.now();
  
  // Update the product ID map for quick lookups
  wishlistCache.productIdMap.clear();
  for (const item of data.items) {
    wishlistCache.productIdMap.set(item.productId, true);
  }
}

/**
 * Invalidate cache
 */
function invalidateCache(): void {
  wishlistCache.data = null;
  wishlistCache.timestamp = 0;
  wishlistCache.productIdMap.clear();
}

/**
 * Check if the user is authenticated
 */
function validateAuthentication(): boolean {
  try {
    return isAuthenticated();
  } catch (error) {
    console.error('Error validating authentication:', error);
    return false;
  }
}

/**
 * Creates a new cancel token and cancels any existing one
 * @param tokenType The type of token to create
 * @returns The new cancel token source
 */
function createCancelToken(tokenType: 'getWishlist' | 'addToWishlist' | 'removeFromWishlist'): CancelTokenSource {
  // Cancel existing token if it exists
  if (cancelTokens[tokenType]) {
    cancelTokens[tokenType]!.cancel('Operation canceled due to new request');
  }
  
  // Create and store new token
  const newToken = axios.CancelToken.source();
  cancelTokens[tokenType] = newToken;
  return newToken;
}

/**
 * Generic function to retry API calls on failure
 * @param apiCall - The API call function to retry
 */
async function withRetry<T>(apiCall: () => Promise<T>): Promise<T> {
  let attempts = 0;
  let lastError: any = null;
  
  while (attempts < MAX_RETRIES) {
    try {
      return await apiCall();
    } catch (error) {
      // Don't retry canceled requests
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        throw error;
      }
      
      attempts++;
      lastError = error;
      
      if (attempts >= MAX_RETRIES) {
        break;
      }
      
      console.warn(`API call failed, retrying (${attempts}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
    }
  }
  
  console.error(`API call failed after ${MAX_RETRIES} attempts`, lastError);
  throw lastError;
}

/**
 * Fetch the current user's wishlist
 * @param forceRefresh Force a refresh from the server, ignoring cache
 * @returns The user's wishlist with products
 */
export async function getWishlist(forceRefresh = false): Promise<{
  items: WishlistItemWithProduct[];
  total: number;
  error: string | null;
  requiresAuth: boolean;
}> {
  // Return cached data if available and not forced to refresh
  if (!forceRefresh && isCacheValid() && wishlistCache.data) {
    console.log('Using cached wishlist data:', wishlistCache.data);
    return {
      ...wishlistCache.data,
      error: null,
      requiresAuth: false
    };
  }
  
  try {
    // Check authentication
    if (!validateAuthentication()) {
      console.log('Not authenticated for wishlist');
      return {
        items: [],
        total: 0,
        error: 'Authentication required',
        requiresAuth: true
      };
    }
    
    // Create a new cancel token and get a local reference
    const cancelToken = createCancelToken('getWishlist');
    
    try {
      // Make API call with the cancel token
      console.log('Making wishlist API call with cancel token');
      const response = await wishlistApi.getWishlist(cancelToken.token);
      console.log('Raw API response:', response);
      
      // Transform API wishlist items to our component's expected format
      const wishlistItems = response.items.map((item) => {
        // Extract the basic product details from the API response
        const productDetails: ProductDetail = {
          id: item.product.id,
          title: item.product.title,
          slug: item.product.slug,
          price: Number(item.product.price),
          discountPercentage: item.product.discountPrice 
            ? Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100) 
            : undefined,
          // Default values for fields not provided by the API
          description: '',
          brand: '',
          originalPrice: Number(item.product.price),
          rating: 0,
          reviewCount: 0,
          inStock: true,
          stockCount: 100, // Default value
          isAssured: false,
          hasFreeDel: false,
          sellerName: 'Official Store',
          // Use image from the API if available, otherwise empty array
          images: [item.product.imageUrl || ''],
          // Empty arrays for these collections
          specificationGroups: [],
          highlights: [],
          reviews: [],
          categories: [],
        };

        // Map to the expected wishlist item format
        return {
          id: item.id,
          productId: item.productId,
          product: productDetails,
          addedAt: item.addedAt
        };
      });
      
      console.log('Transformed wishlist items:', wishlistItems);
      
      const result = {
        items: wishlistItems,
        total: response.total
      };
      
      // Update cache with the new data
      updateCache(result);
      
      return {
        ...result,
        error: null,
        requiresAuth: false
      };
    } catch (error) {
      // Handle errors
      if (axios.isCancel(error)) {
        // If the request was canceled, return a specific error
        console.log('Wishlist request was canceled', error.message);
        return {
          items: [],
          total: 0,
          error: 'Request canceled',
          requiresAuth: false
        };
      }
      
      // Handle other errors
      console.error('Error fetching wishlist:', error);
      
      let errorMessage = 'Failed to fetch wishlist';
      let requiresAuth = false;
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        // Check if the error is due to authentication
        if (error.response?.status === 401) {
          requiresAuth = true;
        }
      }
      
      return {
        items: [],
        total: 0,
        error: errorMessage,
        requiresAuth
      };
    } finally {
      // Only clear the token reference if it hasn't been replaced
      if (cancelTokens.getWishlist === cancelToken) {
        cancelTokens.getWishlist = null;
      }
    }
  } catch (error) {
    // Catch any unexpected errors in the entire function
    console.error('Unexpected error in getWishlist:', error);
    return {
      items: [],
      total: 0,
      error: 'An unexpected error occurred',
      requiresAuth: false
    };
  }
}

/**
 * Add a product to the wishlist
 * @param productId - The ID of the product to add
 * @returns Success status and error message if any
 */
export async function addToWishlist(
  productId: string
): Promise<{
  success: boolean;
  error: string | null;
  requiresAuth: boolean;
}> {
  try {
    // Check authentication
    if (!validateAuthentication()) {
      return {
        success: false,
        error: 'Authentication required',
        requiresAuth: true
      };
    }
    
    // Prepare request data
    const requestData: AddToWishlistRequest = {
      productId
    };
    
    // Create a new cancel token and get a local reference
    const cancelToken = createCancelToken('addToWishlist');
    
    try {
      // Make API call with the cancel token
      await wishlistApi.addToWishlist(requestData, cancelToken.token);
      
      // Invalidate cache after successful addition
      invalidateCache();
      
      // Emit wishlist update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wishlist:updated'));
      }
      
      return {
        success: true,
        error: null,
        requiresAuth: false
      };
    } catch (error) {
      // Handle cancellation
      if (axios.isCancel(error)) {
        console.log('Add to wishlist request was canceled', error.message);
        return {
          success: false,
          error: 'Request canceled',
          requiresAuth: false
        };
      }
      
      // Handle other errors
      console.error('Error adding to wishlist:', error);
      
      let errorMessage = 'Failed to add item to wishlist';
      let requiresAuth = false;
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        // Check if the error is due to authentication
        if (error.response?.status === 401) {
          requiresAuth = true;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        requiresAuth
      };
    } finally {
      // Only clear the token reference if it hasn't been replaced
      if (cancelTokens.addToWishlist === cancelToken) {
        cancelTokens.addToWishlist = null;
      }
    }
  } catch (error) {
    // Catch any unexpected errors in the entire function
    console.error('Unexpected error in addToWishlist:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      requiresAuth: false
    };
  }
}

/**
 * Remove a product from the wishlist
 * @param productId - The ID of the product to remove
 * @returns Success status and error message if any
 */
export async function removeFromWishlist(
  productId: string
): Promise<{
  success: boolean;
  error: string | null;
  requiresAuth: boolean;
}> {
  try {
    // Check authentication
    if (!validateAuthentication()) {
      return {
        success: false,
        error: 'Authentication required',
        requiresAuth: true
      };
    }
    
    // Create a new cancel token and get a local reference
    const cancelToken = createCancelToken('removeFromWishlist');
    
    try {
      // Make API call with the cancel token
      await wishlistApi.removeFromWishlist(productId, cancelToken.token);
      
      // Invalidate cache after successful removal
      invalidateCache();
      
      // Emit wishlist update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wishlist:updated'));
      }
      
      return {
        success: true,
        error: null,
        requiresAuth: false
      };
    } catch (error) {
      // Handle cancellation
      if (axios.isCancel(error)) {
        console.log('Remove from wishlist request was canceled', error.message);
        return {
          success: false,
          error: 'Request canceled',
          requiresAuth: false
        };
      }
      
      // Handle other errors
      console.error('Error removing from wishlist:', error);
      
      let errorMessage = 'Failed to remove item from wishlist';
      let requiresAuth = false;
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        // Check if the error is due to authentication
        if (error.response?.status === 401) {
          requiresAuth = true;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        requiresAuth
      };
    } finally {
      // Only clear the token reference if it hasn't been replaced
      if (cancelTokens.removeFromWishlist === cancelToken) {
        cancelTokens.removeFromWishlist = null;
      }
    }
  } catch (error) {
    // Catch any unexpected errors in the entire function
    console.error('Unexpected error in removeFromWishlist:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      requiresAuth: false
    };
  }
}

/**
 * Check if a product is in the wishlist
 * @param productId - The ID of the product to check
 * @returns True if the product is in the wishlist, false otherwise
 */
export async function isProductInWishlist(productId: string): Promise<boolean> {
  try {
    // Check authentication first
    if (!validateAuthentication()) {
      // Not authenticated, so the product can't be in wishlist
      return false;
    }
    
    // Check if we have a valid cache first
    if (isCacheValid()) {
      // Use the map for O(1) lookup instead of array iteration
      return wishlistCache.productIdMap.has(productId);
    }
    
    // If no valid cache, fetch the wishlist
    const wishlistResult = await getWishlist();
    
    // Return false if there was an error
    if (wishlistResult.error) return false;
    
    // Check if the product is in the fetched wishlist
    return wishlistResult.items.some(item => item.productId === productId);
  } catch (error) {
    // Catch any unexpected errors in the entire function
    console.error('Error checking if product is in wishlist:', error);
    return false;
  }
}

/**
 * Toggle a product in the wishlist (add if not present, remove if present)
 * Integrates with auth modal for authentication
 * 
 * @param productId - The ID of the product to toggle
 * @param showAuthModal - Function to show auth modal if not authenticated
 * @returns Success status and error message if any
 */
export async function toggleWishlistItem(
  productId: string,
  showAuthModal?: (pendingAction: () => void) => void
): Promise<{
  success: boolean;
  action: 'added' | 'removed' | null;
  error: string | null;
  requiresAuth: boolean;
}> {
  try {
    // Check authentication
    if (!validateAuthentication()) {
      if (showAuthModal) {
        // Create a function to execute after successful authentication
        const addToWishlistAfterAuth = () => {
          // Retry the add to wishlist operation after authentication
          addToWishlist(productId).then(result => {
            if (result.success) {
              console.log('Product added to wishlist after authentication');
            }
          });
        };
        
        // Show the auth modal with the pending action
        showAuthModal(addToWishlistAfterAuth);
      }
      
      return {
        success: false,
        action: null,
        error: 'Authentication required',
        requiresAuth: true
      };
    }
    
    // Check if product is already in wishlist using cached data when possible
    const isInWishlist = await isProductInWishlist(productId);
    
    if (isInWishlist) {
      // Remove from wishlist
      const result = await removeFromWishlist(productId);
      return {
        success: result.success,
        action: result.success ? 'removed' : null,
        error: result.error,
        requiresAuth: result.requiresAuth
      };
    } else {
      // Add to wishlist
      const result = await addToWishlist(productId);
      return {
        success: result.success,
        action: result.success ? 'added' : null,
        error: result.error,
        requiresAuth: result.requiresAuth
      };
    }
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    
    let errorMessage = 'Failed to update wishlist';
    let requiresAuth = false;
    
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<{message?: string}>;
      errorMessage = axiosError.response?.data?.message || errorMessage;
      
      // Check if the error is due to authentication
      if (axiosError.response?.status === 401) {
        requiresAuth = true;
      }
    }
    
    return {
      success: false,
      action: null,
      error: errorMessage,
      requiresAuth
    };
  }
} 