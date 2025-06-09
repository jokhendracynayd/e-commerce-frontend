import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { CategoryNode, CategoryResponse, CategoryListParams } from '@/types/categories';
import { ProductListResponse, ProductFilterParams, RecursiveCategoryProductsResponse } from '@/types/product';

// Categories API functions
export const categoriesApi = {
  /**
   * Get category tree - hierarchical structure of all categories
   */
  getCategoryTree: async (): Promise<CategoryNode[]> => {
    try {
      const response: AxiosResponse<CategoryResponse> = await axiosClient.get(
        ENDPOINTS.CATEGORIES.TREE
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get all categories as a flat list
   */
  getCategories: async (params: CategoryListParams = {}): Promise<CategoryNode[]> => {
    try {
      const response: AxiosResponse<CategoryResponse> = await axiosClient.get(
        ENDPOINTS.CATEGORIES.BASE,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single category by ID
   */
  getCategoryById: async (id: string): Promise<CategoryNode> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.CATEGORIES.DETAIL(id)
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single category by slug
   */
  getCategoryBySlug: async (slug: string): Promise<CategoryNode> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.CATEGORIES.BY_SLUG(slug)
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get products belonging to a category
   */
  getCategoryProducts: async (categoryId: string, params: ProductFilterParams = {}): Promise<ProductListResponse> => {
    try {
      const response: AxiosResponse<ProductListResponse> = await axiosClient.get(
        ENDPOINTS.CATEGORIES.PRODUCTS(categoryId),
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get products from a category and all its subcategories recursively
   * Products are returned in a single flat array with pagination
   * 
   * @param categoryId - The ID of the parent category
   * @param params - Optional filter parameters:
   *   - page: Page number (default: 1)
   *   - limit: Items per page (default: 20)
   *   - sortBy: Field to sort by ('price', 'title', 'rating')
   *   - sortOrder: Sort direction ('asc' or 'desc')
   *   - minPrice: Minimum price filter
   *   - maxPrice: Maximum price filter
   *   - search: Search term for product title
   *   - featured: Filter by featured status (boolean)
   */
  getCategoryProductsRecursive: async (categoryId: string, params: ProductFilterParams = {}): Promise<RecursiveCategoryProductsResponse> => {
    try {
      const response: AxiosResponse<RecursiveCategoryProductsResponse> = await axiosClient.get(
        ENDPOINTS.CATEGORIES.RECURSIVE_PRODUCTS(categoryId),
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default categoriesApi; 