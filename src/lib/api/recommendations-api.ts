import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { Recommendation } from '@/types/recommendations';

export interface GetRecentlyViewedParams {
  userId?: string;
  sessionId?: string;
  limit?: number;
  includeProduct?: boolean;
}
export interface GetTrendingParams {
  categoryId?: string;
  limit?: number;
  includeProduct?: boolean;
}

export const recommendationsApi = {
  getRecentlyViewed: async (params: GetRecentlyViewedParams): Promise<Recommendation[]> => {
    try {
      const response: AxiosResponse<{ data: Recommendation[] }> = await axiosClient.get(
        ENDPOINTS.RECOMMENDATIONS.RECENTLY_VIEWED,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getTrending: async (params: GetTrendingParams): Promise<Recommendation[]> => {
    try {
      const response: AxiosResponse<{ data: Recommendation[] }> = await axiosClient.get(
        ENDPOINTS.RECOMMENDATIONS.TRENDING,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 
  