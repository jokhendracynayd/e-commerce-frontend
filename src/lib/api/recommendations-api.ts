import { axiosClient } from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import {
  RecommendationType,
  RecommendationQueryDto,
  RecommendationResponseDto
} from '@/types/recommendations';

class RecommendationsAPI {
  /**
   * Universal recommendations endpoint with flexible type-based routing
   */
  async getRecommendations({
    type,
    userId,
    sessionId,
    productId,
    categoryId,
    limit = 10,
    includeProduct = true
  }: RecommendationQueryDto): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.BASE, {
        params: { type, userId, sessionId, productId, categoryId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=900' // 15 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get similar products using advanced similarity algorithms
   */
  async getSimilarProducts(
    productId: string, 
    limit = 10, 
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.SIMILAR(productId), {
        params: { limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=1800' // 30 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get frequently bought together products using market basket analysis
   */
  async getFrequentlyBoughtTogether(
    productId: string,
    limit = 5,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.FREQUENTLY_BOUGHT_TOGETHER(productId), {
        params: { limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=1800' // 30 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get personalized recommendations using hybrid approach
   */
  async getPersonalizedRecommendations(
    userId?: string,
    sessionId?: string,
    limit = 20,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.PERSONALIZED, {
        params: { userId, sessionId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=900' // 15 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get trending products with real-time trend detection
   */
  async getTrendingProducts(
    categoryId?: string,
    limit = 20,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.TRENDING, {
        params: { categoryId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=1800' // 30 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get recently viewed products with intelligent filtering
   */
  async getRecentlyViewed(
    userId?: string,
    sessionId?: string,
    limit = 10,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.RECENTLY_VIEWED, {
        params: { userId, sessionId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=300' // 5 minute cache for real-time feel
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get top rated products
   */
  async getTopRated(
    categoryId?: string,
    limit = 20,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.TOP_RATED, {
        params: { categoryId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=3600' // 60 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get bestseller products
   */
  async getBestsellers(
    categoryId?: string,
    limit = 20,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.BESTSELLERS, {
        params: { categoryId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=3600' // 60 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get new arrival products
   */
  async getNewArrivals(
    categoryId?: string,
    limit = 20,
    includeProduct = true
  ): Promise<RecommendationResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.RECOMMENDATIONS.NEW_ARRIVALS, {
        params: { categoryId, limit, includeProduct },
        headers: {
          'Cache-Control': 'max-age=1800' // 30 minute cache
        }
      });
      return response.data.data || response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const recommendationsApi = new RecommendationsAPI();
export default recommendationsApi; 