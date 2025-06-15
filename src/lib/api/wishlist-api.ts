import { AxiosResponse, CancelToken } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { 
  ApiWishlistResponse, 
  ApiWishlistItem, 
  AddToWishlistRequest,
  WishlistAddResponse,
  WishlistRemoveResponse
} from '@/types/wishlist';

// Default timeout for API requests (in milliseconds)
const DEFAULT_TIMEOUT = 10000;

/**
 * Validates wishlist API request parameters
 * @param params Parameters to validate
 * @throws Error if validation fails
 */
const validateParams = {
  addToWishlist: (params: AddToWishlistRequest): void => {
    if (!params.productId) {
      throw new Error('Product ID is required');
    }
  },
  
  removeFromWishlist: (productId: string): void => {
    if (!productId) {
      throw new Error('Product ID is required');
    }
  }
};

// Wishlist API functions
const wishlistApi = {
  /**
   * Get the current user's wishlist
   */
  getWishlist: async (cancelToken?: CancelToken): Promise<ApiWishlistResponse> => {
    try {
      console.log('API call: getWishlist');
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.WISHLIST.BASE,
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract wishlist from the nested data property
      const responseData = response.data;
      console.log('Raw API response:', responseData);
      
      const wishlist = responseData.data; // Access the nested data property
      console.log('Extracted wishlist data:', wishlist);
      
      if (!wishlist) {
        console.error('Invalid wishlist response from server:', responseData);
        // Return empty wishlist as fallback
        return {
          items: [],
          total: 0
        };
      }
      
      // Ensure items array exists
      if (!Array.isArray(wishlist.items)) {
        console.warn('Wishlist items is not an array:', wishlist);
        wishlist.items = [];
      }
      
      // Validate each item has required fields
      const validItems = wishlist.items.filter((item: ApiWishlistItem) => {
        const isValid = item && 
                       item.id && 
                       item.productId && 
                       item.product && 
                       item.product.id && 
                       item.product.title;
                       
        if (!isValid) {
          console.warn('Invalid wishlist item found:', item);
        }
        
        return isValid;
      });
      
      console.log('Validated wishlist items:', validItems.length);
      
      return {
        items: validItems,
        total: validItems.length
      };
    } catch (error) {
      console.error('Error in getWishlist API call:', error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Add an item to the wishlist
   */
  addToWishlist: async (data: AddToWishlistRequest, cancelToken?: CancelToken): Promise<WishlistAddResponse> => {
    try {
      // Validate input
      validateParams.addToWishlist(data);
      
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.WISHLIST.ADD,
        data,
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract response data
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Remove an item from the wishlist
   */
  removeFromWishlist: async (productId: string, cancelToken?: CancelToken): Promise<WishlistRemoveResponse> => {
    try {
      // Validate input
      validateParams.removeFromWishlist(productId);
      
      const response: AxiosResponse = await axiosClient.delete(
        ENDPOINTS.WISHLIST.REMOVE(productId),
        {
          cancelToken,
          timeout: DEFAULT_TIMEOUT
        }
      );
      
      // Extract response data
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default wishlistApi;
export type { ApiWishlistItem, ApiWishlistResponse }; 