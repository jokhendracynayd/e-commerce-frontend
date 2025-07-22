import { axiosClient } from '@/lib/api/axios-client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/api/error-handler';
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewStats,
  EligibleProductForReview,
  PaginatedReviewsResponse,
  ReviewFilterParams,
} from '@/types/review';

export const reviewService = {
  /**
   * Get all reviews with filtering
   */
  getReviews: async (params: ReviewFilterParams = {}): Promise<PaginatedReviewsResponse> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REVIEWS.BASE, { params });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user's reviews
   */
  getMyReviews: async (params: ReviewFilterParams = {}): Promise<PaginatedReviewsResponse> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REVIEWS.MY_REVIEWS, { params });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single review by ID
   */
  getReviewById: async (id: string): Promise<Review> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REVIEWS.DETAIL(id));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new review
   */
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.REVIEWS.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing review
   */
  updateReview: async (id: string, data: UpdateReviewRequest): Promise<Review> => {
    try {
      const response = await axiosClient.patch(ENDPOINTS.REVIEWS.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: string): Promise<{ id: string; deleted: boolean; message: string }> => {
    try {
      const response = await axiosClient.delete(ENDPOINTS.REVIEWS.DELETE(id));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get product review statistics
   */
  getProductReviewStats: async (productId: string): Promise<ReviewStats> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REVIEWS.PRODUCT_STATS(productId));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get products eligible for review
   */
  getEligibleProducts: async (): Promise<EligibleProductForReview[]> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REVIEWS.ELIGIBLE_PRODUCTS);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Check if user can review a specific product from an order
   */
  canReviewProduct: async (orderId: string, productId: string): Promise<boolean> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REVIEWS.CAN_REVIEW(orderId, productId));
      return response.data.data.canReview;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 