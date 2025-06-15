import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { 
  ApiProduct as Product, 
  ProductListParams, 
  ApiProductListResponse as ProductListResponse,
  CreateReviewRequest,
  ApiProductSpecification as ProductSpecification,
  ApiProductReview as ProductReview,
  ApiProductImage as ProductImage,
  ApiProductVariant as ProductVariant,
  ApiBrand as Brand,
  ApiCategory as Category,
  ApiTag as Tag,
  CategoryProductsParams
} from '@/types/product';

// Re-export types for backward compatibility
export type { 
  Product,
  ProductImage,
  ProductVariant, 
  ProductSpecification,
  Brand,
  Category,
  Tag,
  ProductReview,
  CreateReviewRequest,
  ProductListParams,
  ProductListResponse
};

// Additional types that might be used in documentation but not moved to centralized types yet
export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  // Other fields as needed
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  price?: number;
  // Other fields as needed
}

// Product API functions
export const productsApi = {
  /**
   * Get a list of products with filtering, pagination and sorting
   */
  getProducts: async (params: ProductListParams = {}): Promise<ProductListResponse> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.BASE,
        { params }
      );
      
      console.log('API response raw:', response.data);
      
      // Handle different response structures
      const responseData = response.data;
      
      // If the response contains a data property with the actual products
      if (responseData && responseData.data) {
        console.log('Using data property for products');
        responseData.products = responseData.data;
      }
      
      // If the response uses total instead of totalCount
      if (responseData && responseData.total && responseData.totalCount === undefined) {
        responseData.totalCount = responseData.total;
      }
      
      console.log('API response processed:', responseData);
      
      return responseData;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get products by category slug with recursive option
   * This uses the enhanced /products API endpoint instead of the category-specific one
   * 
   * @param categorySlug - The slug of the category
   * @param recursive - Whether to include products from subcategories
   * @param params - Other filter parameters
   */
  getProductsByCategorySlug: async (
    categorySlug: string, 
    recursive: boolean = true, 
    params: CategoryProductsParams = {}
  ): Promise<ProductListResponse> => {
    try {
      // Build query parameters
      const queryParams = {
        ...params,
        categorySlug,
        recursive,
      };
      
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.BASE,
        { params: queryParams }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single product by ID
   */
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.DETAIL(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get a single product by slug
   */
  getProductBySlug: async (slug: string): Promise<Product> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.BY_SLUG(slug)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get trending products
   */
  getTrendingProducts: async (limit?: number, page: number = 1): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.DEALS.BY_TYPE.TRENDING,
        { 
          params: { 
            limit,
            page,
            status: 'Active'
          } 
        }
      );
      
      // The API structure has changed, data is now in response.data.products
      if (response.data && response.data.products) {
        return response.data.products;
      } else if (response.data && response.data.data && response.data.data.products) {
        // Handle nested data structure if needed
        return response.data.data.products;
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get deal of the day products
   */
  getDealOfTheDay: async (): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.DEALS.BY_TYPE.DEAL_OF_DAY,
        { 
          params: { 
            limit: 1,
            status: 'Active'
          } 
        }
      );
      
      // The API structure has changed, data is now in response.data.products
      if (response.data && response.data.products) {
        return response.data.products;
      } else if (response.data && response.data.data && response.data.data.products) {
        // Handle nested data structure if needed
        return response.data.data.products;
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.FEATURED,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get new arrivals
   */
  getNewArrivals: async (limit?: number): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.NEW_ARRIVALS,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get related products
   */
  getRelatedProducts: async (id: string, limit?: number): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.RELATED(id),
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Search products by keyword
   */
  searchProducts: async (query: string, limit?: number): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.SEARCH,
        { params: { q: query, limit } }
      );
      
      // Handle the nested data structure from the backend
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      // Check for data.products structure
      if (response.data && response.data.products) {
        return response.data.products;
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get product specifications
   */
  getProductSpecifications: async (productId: string): Promise<ProductSpecification[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.SPECIFICATIONS(productId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get product reviews
   */
  getProductReviews: async (productId: string): Promise<ProductReview[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.REVIEWS(productId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add a product review
   */
  addProductReview: async (productId: string, data: CreateReviewRequest): Promise<ProductReview> => {
    try {
      const response: AxiosResponse = await axiosClient.post(
        ENDPOINTS.PRODUCTS.ADD_REVIEW(productId),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default productsApi; 