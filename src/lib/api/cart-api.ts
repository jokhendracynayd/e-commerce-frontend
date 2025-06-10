import { AxiosResponse, CancelToken, AxiosError } from 'axios';
import axios from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { Product, ProductVariant } from './products-api';
import { 
  ApiCart, 
  ApiCartItem, 
  AddToCartRequest, 
  UpdateCartItemRequest, 
  AppliedCoupon 
} from '@/types/cart';

// Default timeout for API requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

/**
 * Validates cart API request parameters
 * @param params Parameters to validate
 * @throws Error if validation fails
 */
const validateParams = {
  addToCart: (params: AddToCartRequest): void => {
    if (!params.productId) {
      throw new Error('Product ID is required');
    }
    
    if (!params.quantity || params.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  },
  
  updateCartItem: (itemId: string, params: UpdateCartItemRequest): void => {
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    
    if (!params.quantity || params.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  },
  
  removeCartItem: (itemId: string): void => {
    if (!itemId) {
      throw new Error('Item ID is required');
    }
  }
};

// Cart API functions
export const cartApi = {
  /**
   * Get the current user's cart
   */
  getCart: async (cancelToken?: CancelToken): Promise<ApiCart> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.CART.GET,
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract cart from the nested data property
      const responseData = response.data;
      const cart = responseData.data; // Access the nested data property
      
      if (!cart) {
        throw new Error('Invalid cart response from server');
      }
      
      // Ensure items array exists
      if (!Array.isArray(cart.items)) {
        cart.items = [];
      }
      
      return cart;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add an item to the cart
   */
  addToCart: async (data: AddToCartRequest, cancelToken?: CancelToken): Promise<ApiCart> => {
    try {
      // Validate input
      validateParams.addToCart(data);
      
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.CART.ADD_ITEM,
        data,
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract cart from the nested data property
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update a cart item's quantity
   */
  updateCartItem: async (itemId: string, data: UpdateCartItemRequest, cancelToken?: CancelToken): Promise<ApiCart> => {
    try {
      // Validate input
      validateParams.updateCartItem(itemId, data);
      
      const response: AxiosResponse = await axiosClient.patch(
        ENDPOINTS.CART.UPDATE_ITEM(itemId),
        data,
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract cart from the nested data property
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Remove an item from the cart
   */
  removeFromCart: async (itemId: string, cancelToken?: CancelToken): Promise<ApiCart> => {
    try {
      // Validate input
      validateParams.removeCartItem(itemId);
      
      const response: AxiosResponse = await axiosClient.delete(
        ENDPOINTS.CART.REMOVE_ITEM(itemId),
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract cart from the nested data property
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Clear the cart (remove all items)
   */
  clearCart: async (cancelToken?: CancelToken): Promise<ApiCart> => {
    try {
      const response: AxiosResponse = await axiosClient.delete(
        ENDPOINTS.CART.CLEAR,
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract cart from the nested data property
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Validate a coupon code
   */
  validateCoupon: async (couponCode: string, cancelToken?: CancelToken): Promise<{ isValid: boolean; discount: number; message?: string }> => {
    try {
      if (!couponCode) {
        throw new Error('Coupon code is required');
      }
      
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.COUPONS.VALIDATE,
        { code: couponCode },
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract data from the nested response
      return response.data.data || { isValid: false, discount: 0, message: 'Invalid response' };
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Merge anonymous cart with user cart
   */
  mergeAnonymousCart: async (anonymousCartItems: AddToCartRequest[], cancelToken?: CancelToken): Promise<ApiCart> => {
    try {
      if (!anonymousCartItems || anonymousCartItems.length === 0) {
        throw new Error('No items to merge');
      }
      
      // Ensure the items structure matches what the backend expects (standardize to variantId)
      const itemsToSend = anonymousCartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        // Always use variantId as the field name for consistency with backend
        variantId: item.variantId,
        additionalInfo: item.additionalInfo
      }));
      
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.CART.MERGE,
        { items: itemsToSend },
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT * 2 // Double timeout for this operation as it might take longer
        }
      );
      
      // Extract cart from the nested data property
      const responseData = response.data;
      const cart = responseData.data;
      
      if (!cart) {
        throw new Error('Invalid cart response from server after merge');
      }
      
      // Ensure items array exists
      if (!Array.isArray(cart.items)) {
        cart.items = [];
      }
      
      return cart;
    } catch (error: unknown) {
      // Add more specific error handling for merge operations
      // Check if this is an Axios error with a response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        throw new Error(`Cart merge failed: ${errorMessage}`);
      }
      
      // For all other errors, use the standard error handler
      throw handleApiError(error);
    }
  }
};

export default cartApi; 