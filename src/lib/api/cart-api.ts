import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { Product, ProductVariant } from './products-api';

// Cart-related types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  productVariantId?: string;
  variant?: ProductVariant;
  additionalInfo?: any;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  // Applied promotions
  appliedCoupon?: AppliedCoupon;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountAmount: number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  message?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  productVariantId?: string;
  additionalInfo?: any;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

// Cart API functions
export const cartApi = {
  /**
   * Get the current user's cart
   */
  getCart: async (): Promise<Cart> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.CART.GET
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add an item to the cart
   */
  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.CART.ADD_ITEM,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update a cart item's quantity
   */
  updateCartItem: async (itemId: string, data: UpdateCartItemRequest): Promise<Cart> => {
    try {
      const response: AxiosResponse = await axiosClient.patch(
        ENDPOINTS.CART.UPDATE_ITEM(itemId),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Remove an item from the cart
   */
  removeCartItem: async (itemId: string): Promise<Cart> => {
    try {
      const response: AxiosResponse = await axiosClient.delete(
        ENDPOINTS.CART.REMOVE_ITEM(itemId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Clear the cart (remove all items)
   */
  clearCart: async (): Promise<Cart> => {
    try {
      const response: AxiosResponse = await axiosClient.delete(
        ENDPOINTS.CART.CLEAR
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Apply a coupon to the cart
   */
  applyCoupon: async (couponCode: string): Promise<Cart> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.COUPONS.APPLY,
        { code: couponCode }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Validate a coupon code
   */
  validateCoupon: async (couponCode: string): Promise<{ 
    valid: boolean;
    message?: string;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  }> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.COUPONS.VALIDATE,
        { code: couponCode }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default cartApi; 