import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { ProductSpecification, GroupedProductSpecifications } from '@/types/specifications';

// Specifications API functions
export const specificationsApi = {
  /**
   * Get all specifications for a product
   */
  getProductSpecifications: async (
    productId: string
  ): Promise<ProductSpecification[]> => {
    try {
      const response: AxiosResponse<{ data: ProductSpecification[] }> =
        await axiosClient.get(
          ENDPOINTS.SPECIFICATIONS.PRODUCT.GET_BY_PRODUCT(productId)
        );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  /**
   * Get specifications for a product grouped by group name
   */
  getGroupedProductSpecifications: async (
    productId: string
  ): Promise<GroupedProductSpecifications[]> => {
    try {
      const response: AxiosResponse<{ data: GroupedProductSpecifications[] }> =
        await axiosClient.get(
          ENDPOINTS.SPECIFICATIONS.PRODUCT.GET_GROUPED(productId)
        );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default specificationsApi;
