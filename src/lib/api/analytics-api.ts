import { axiosClient } from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { ApiResponseWrapper } from '@/types/auth';
import {
  UserActivityType,
  CreateUserActivityDto,
  CreateBatchActivityDto,
  UserActivityResponseDto,
  BrowsingHistoryResponseDto
} from '@/types/analytics';

class AnalyticsAPI {
  /**
   * Track single user activity with retry mechanism
   */
  async trackActivity(activity: CreateUserActivityDto): Promise<UserActivityResponseDto> {
    try {
      // Add user ID to headers if available in metadata
      const headers: Record<string, string> = {
        'X-Session-ID': activity.sessionId
      };
      
      // Add user ID to header if available
      if (activity.metadata?.userId) {
        headers['X-User-ID'] = activity.metadata.userId;
      }

      const response = await axiosClient.post(ENDPOINTS.ANALYTICS.ACTIVITY, activity, {
        headers,
        timeout: 5000, // 5 second timeout
      });
      return response.data.data;
    } catch (error) {
      // Log error but don't throw - tracking shouldn't break UX
      console.warn('Failed to track activity:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Batch track multiple activities (performance optimization)
   */
  async trackBatchActivities(activities: CreateUserActivityDto[]): Promise<{ success: boolean; count: number; message: string }> {
    try {
      // Add user ID to headers if available from first activity
      const headers: Record<string, string> = {};
      
      if (activities.length > 0) {
        headers['X-Session-ID'] = activities[0].sessionId;
        
        // Add user ID to header if available
        if (activities[0].metadata?.userId) {
          headers['X-User-ID'] = activities[0].metadata.userId;
        }
      }

      const response = await axiosClient.post(ENDPOINTS.ANALYTICS.BATCH, { activities }, {
        headers,
        timeout: 10000,
      });
      return response.data.data;
    } catch (error) {
      // Log error but don't throw - tracking shouldn't break UX
      console.warn('Failed to track batch activities:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Get browsing history with caching
   */
  async getBrowsingHistory(
    userId?: string, 
    sessionId?: string, 
    limit = 10,
    includeProduct = true
  ): Promise<BrowsingHistoryResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.ANALYTICS.HISTORY, {
        params: { userId, sessionId, limit, includeProduct },
        // Enable caching for 5 minutes
        headers: {
          'Cache-Control': 'max-age=300'
        }
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user activities (authenticated users only)
   */
  async getUserActivities(
    userId?: string,
    sessionId?: string,
    limit = 20,
    activityType?: UserActivityType
  ): Promise<UserActivityResponseDto[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.ANALYTICS.ACTIVITIES, {
        params: { userId, sessionId, limit, activityType },
        headers: {
          'Cache-Control': 'max-age=300'
        }
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Mark conversion for purchase tracking
   */
  async markConversion(
    userId?: string,
    sessionId?: string,
    productId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.put(ENDPOINTS.ANALYTICS.CONVERSION, null, {
        params: { userId, sessionId, productId }
      });
      return response.data.data;
    } catch (error) {
      console.warn('Failed to mark conversion:', error);
      throw handleApiError(error);
    }
  }
}

export const analyticsApi = new AnalyticsAPI();
export default analyticsApi; 