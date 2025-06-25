import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import {
  ProductAvailability,
  VariantAvailability,
  BatchAvailabilityRequest,
  BatchAvailabilityResponse
} from '@/types/inventory';

// Inventory API functions
export const inventoryApi = {
  /**
   * Get real-time availability for a product
   * @param productId - The product ID to check
   * @returns Product availability data
   */
  getProductAvailability: async (productId: string): Promise<ProductAvailability> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.INVENTORY.PRODUCT_AVAILABILITY(productId)
      );
      
      // Handle different response structures
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get real-time availability for a product variant
   * @param variantId - The variant ID to check
   * @returns Variant availability data
   */
  getVariantAvailability: async (variantId: string): Promise<VariantAvailability> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.INVENTORY.VARIANT_AVAILABILITY(variantId)
      );
      
      // Handle different response structures
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get real-time availability for multiple products and variants in a single request
   * @param request - The batch request containing product and variant IDs
   * @returns Batch availability response
   */
  getBatchAvailability: async (request: BatchAvailabilityRequest): Promise<BatchAvailabilityResponse> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.INVENTORY.BATCH_AVAILABILITY,
        request
      );
      
      // Handle different response structures
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 