import { cartApi } from '@/lib/api/cart-api';
import { ProductDetail, ColorVariant } from '@/types/product';
import { 
  ApiCart, 
  AddToCartRequest, 
  CartSummary, 
  CartItemWithProduct 
} from '@/types/cart';
import { useAuth } from '@/context/AuthContext';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { isAuthenticated } from '@/lib/api/axios-client';

// Cancel tokens for pending requests
const cancelTokens: {
  getCart: CancelTokenSource | null;
  addToCart: CancelTokenSource | null;
  updateCartItem: CancelTokenSource | null;
  removeFromCart: CancelTokenSource | null;
  clearCart: CancelTokenSource | null;
  applyCoupon: CancelTokenSource | null;
} = {
  getCart: null,
  addToCart: null,
  updateCartItem: null,
  removeFromCart: null,
  clearCart: null,
  applyCoupon: null,
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
 * Check if the user is authenticated
 */
function validateAuthentication(): boolean {
  return isAuthenticated();
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
 * Fetch the current user's cart
 * @returns The user's cart with products
 */
export async function getCart(): Promise<{
  items: CartItemWithProduct[];
  summary: CartSummary;
  error: string | null;
}> {
  // Cancel any existing get cart request
  if (cancelTokens.getCart) {
    cancelTokens.getCart.cancel('Operation canceled due to new request');
  }
  
  // Create a new cancel token
  cancelTokens.getCart = axios.CancelToken.source();
  
  try {
    // Check authentication
    if (!validateAuthentication()) {
      return {
        items: [],
        summary: {
          itemsCount: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: 0,
          currency: 'INR'
        },
        error: 'Authentication required'
      };
    }
    
    const response = await withRetry(() => cartApi.getCart(cancelTokens.getCart!.token));
    

    console.log(response,"🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌🙌")
    // Transform API cart items to our component's expected format
    const cartItems = response.items.map((item) => {
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
        inStock: true, // Assume it's in stock since it's in the cart
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

      // Map to the expected cart item format
      return {
        id: item.id,
        productId: item.product.id,
        product: productDetails,
        quantity: item.quantity,
        // Use variantId consistently for variant reference
        variantId: item.variant?.id,
        selectedColor: item.variant ? {
          id: item.variant.id,
          color: item.variant.variantName,
          hex: '#000000', // Default color
          image: item.product.imageUrl || '',
        } : undefined,
        additionalInfo: item.additionalInfo,
      };
    });
    
    // Calculate summary
    const summary: CartSummary = {
      itemsCount: response.itemCount,
      subtotal: response.subtotal,
      shipping: 0, // Add shipping cost logic if needed
      tax: 0, // Add tax calculation logic if needed
      discount: 0, // Add discount logic if needed
      total: response.subtotal,
      currency: 'INR',
    };
    
    return {
      items: cartItems,
      summary,
      error: null
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    
    let errorMessage = 'Failed to fetch cart';
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    
    return {
      items: [],
      summary: {
        itemsCount: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
        currency: 'INR'
      },
      error: errorMessage
    };
  } finally {
    // Clear the cancel token reference
    cancelTokens.getCart = null;
  }
}

/**
 * Add an item to the cart
 * @param productId - ID of the product to add
 * @param quantity - Quantity to add
 * @param variantId - Optional product variant ID
 * @param additionalInfo - Optional additional information
 * @returns The updated cart
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId?: string,
  additionalInfo?: any
): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Cancel any existing add to cart request
  if (cancelTokens.addToCart) {
    cancelTokens.addToCart.cancel('Operation canceled due to new request');
  }
  
  // Create a new cancel token
  cancelTokens.addToCart = axios.CancelToken.source();
  
  try {
    // Input validation
    if (!productId) {
      throw new Error('Product ID is required');
    }
    
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    
    // Check authentication
    if (!validateAuthentication()) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    const request: AddToCartRequest = {
      productId,
      quantity,
      // Only use variantId for consistency with backend
      variantId: variantId || undefined,
      ...(additionalInfo && { additionalInfo }),
    };
    
    await withRetry(() => cartApi.addToCart(request, cancelTokens.addToCart!.token));
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    let errorMessage = 'Failed to add item to cart';
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    // Clear the cancel token reference
    cancelTokens.addToCart = null;
  }
}

/**
 * Update a cart item's quantity
 * @param itemId - ID of the cart item to update
 * @param quantity - New quantity
 * @returns Success/failure status with error message if applicable
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Cancel any existing update cart item request
  if (cancelTokens.updateCartItem) {
    cancelTokens.updateCartItem.cancel('Operation canceled due to new request');
  }
  
  // Create a new cancel token
  cancelTokens.updateCartItem = axios.CancelToken.source();
  
  try {
    // Input validation
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    
    // Check authentication
    if (!validateAuthentication()) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    await withRetry(() => cartApi.updateCartItem(itemId, { quantity }, cancelTokens.updateCartItem!.token));
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    
    let errorMessage = 'Failed to update cart item';
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    // Clear the cancel token reference
    cancelTokens.updateCartItem = null;
  }
}

/**
 * Remove an item from the cart
 * @param itemId - ID of the cart item to remove
 * @returns Success/failure status with error message if applicable
 */
export async function removeFromCart(
  itemId: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Cancel any existing remove from cart request
  if (cancelTokens.removeFromCart) {
    cancelTokens.removeFromCart.cancel('Operation canceled due to new request');
  }
  
  // Create a new cancel token
  cancelTokens.removeFromCart = axios.CancelToken.source();
  
  try {
    // Input validation
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    
    // Check authentication
    if (!validateAuthentication()) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    await withRetry(() => cartApi.removeFromCart(itemId, cancelTokens.removeFromCart!.token));
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    
    let errorMessage = 'Failed to remove item from cart';
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    // Clear the cancel token reference
    cancelTokens.removeFromCart = null;
  }
}

/**
 * Clear the cart (remove all items)
 * @returns Success/failure status with error message if applicable
 */
export async function clearCart(): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Cancel any existing clear cart request
  if (cancelTokens.clearCart) {
    cancelTokens.clearCart.cancel('Operation canceled due to new request');
  }
  
  // Create a new cancel token
  cancelTokens.clearCart = axios.CancelToken.source();
  
  try {
    // Check authentication
    if (!validateAuthentication()) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }
    
    await withRetry(() => cartApi.clearCart(cancelTokens.clearCart!.token));
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    
    let errorMessage = 'Failed to clear cart';
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    // Clear the cancel token reference
    cancelTokens.clearCart = null;
  }
}

/**
 * Check if the user is authenticated before making cart operations
 * @returns Whether the user is authenticated
 */
export function isUserAuthenticated(): boolean {
  return validateAuthentication();
} 