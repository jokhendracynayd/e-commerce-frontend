import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';

// Product-related types
export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  currency: string;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  brand?: Brand;
  category?: Category;
  subCategory?: Category;
  tags?: Tag[];
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  variantName: string;
  sku: string;
  price: number;
  stockQuantity: number;
  additionalPrice: number;
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  group?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  userName: string;
  userImage?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'popularity' | 'rating' | 'newest';
  sortDirection?: 'asc' | 'desc';
  featured?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
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
  getTrendingProducts: async (limit?: number): Promise<Product[]> => {
    try {
      const response: AxiosResponse = await axiosClient.get(
        ENDPOINTS.PRODUCTS.TRENDING,
        { params: { limit } }
      );
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