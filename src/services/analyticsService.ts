import { 
  UserActivityType, 
  CreateUserActivityDto,
  CreateBatchActivityDto,
  UserActivityResponseDto,
  BrowsingHistoryResponseDto
} from '@/types/analytics';
import { analyticsApi } from '@/lib/api/analytics-api';

// Cache for analytics data to prevent repeated API calls
const analyticsCache = {
  browsing: new Map<string, { data: BrowsingHistoryResponseDto[], timestamp: number }>(),
  activities: new Map<string, { data: UserActivityResponseDto[], timestamp: number }>(),
  // Cache expiration time in milliseconds (2 minutes for analytics data)
  expirationTime: 2 * 60 * 1000
};

// In-flight requests tracking to prevent duplicate API calls
const inFlightRequests = {
  browsing: new Map<string, Promise<BrowsingHistoryResponseDto[]>>(),
  activities: new Map<string, Promise<UserActivityResponseDto[]>>(),
  tracking: new Map<string, Promise<void>>()
};

// Check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < analyticsCache.expirationTime;
};

// Generate cache keys
const generateBrowsingCacheKey = (userId?: string, sessionId?: string, limit?: number): string => {
  return `${userId || 'anonymous'}|${sessionId || ''}|${limit || 10}`;
};

const generateActivitiesCacheKey = (userId?: string, sessionId?: string, limit?: number, activityType?: UserActivityType): string => {
  return `${userId || 'anonymous'}|${sessionId || ''}|${limit || 20}|${activityType || 'all'}`;
};

/**
 * Service to handle analytics-related operations
 * This service provides business logic on top of the raw API calls
 */
export const analyticsService = {
  /**
   * Track a single user activity
   * @param activity - The activity data to track
   * @returns Activity response data
   */
  trackActivity: async (activity: CreateUserActivityDto): Promise<UserActivityResponseDto | null> => {
    try {
      // Check if there's already an in-flight request for this exact activity
      const trackingKey = `${activity.activityType}|${activity.entityId || ''}|${Date.now()}`;
      
      if (inFlightRequests.tracking.has(trackingKey)) {
        await inFlightRequests.tracking.get(trackingKey);
        return null; // Don't return data for duplicate requests
      }
      
      // Create a new request and track it
      const request = async () => {
        try {
          return await analyticsApi.trackActivity(activity);
        } finally {
          // Remove from in-flight requests when done
          inFlightRequests.tracking.delete(trackingKey);
        }
      };
      
      // Store the promise in the in-flight requests map
      const promise = request();
      inFlightRequests.tracking.set(trackingKey, promise.then(() => {}));
      
      return await promise;
    } catch (error) {
      // Don't throw errors for tracking - just log them
      console.warn('Failed to track activity:', error);
      return null;
    }
  },

  /**
   * Track multiple activities in batch
   * @param activities - Array of activities to track
   * @returns Batch response data
   */
     trackBatchActivities: async (activities: CreateUserActivityDto[]): Promise<{ success: boolean; count: number; message: string } | null> => {
     try {
       const batchData: CreateBatchActivityDto = { activities };
       return await analyticsApi.trackBatchActivities(activities);
    } catch (error) {
      // Don't throw errors for tracking - just log them
      console.warn('Failed to track batch activities:', error);
      return null;
    }
  },

  /**
   * Get browsing history for a user or session
   * @param userId - Optional user ID
   * @param sessionId - Optional session ID
   * @param limit - Number of items to return
   * @param includeProduct - Whether to include product details
   * @returns Browsing history data
   */
  getBrowsingHistory: async (
    userId?: string,
    sessionId?: string,
    limit = 10,
    includeProduct = true
  ): Promise<BrowsingHistoryResponseDto[]> => {
    const cacheKey = generateBrowsingCacheKey(userId, sessionId, limit);
    
    // Check cache first
    const cached = analyticsCache.browsing.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.browsing.has(cacheKey)) {
      return inFlightRequests.browsing.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await analyticsApi.getBrowsingHistory(userId, sessionId, limit, includeProduct);
        
        // Update cache
        analyticsCache.browsing.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.browsing.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.browsing.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get user activities
   * @param userId - Optional user ID
   * @param sessionId - Optional session ID
   * @param limit - Number of items to return
   * @param activityType - Optional activity type filter
   * @returns User activities data
   */
  getUserActivities: async (
    userId?: string,
    sessionId?: string,
    limit = 20,
    activityType?: UserActivityType
  ): Promise<UserActivityResponseDto[]> => {
    const cacheKey = generateActivitiesCacheKey(userId, sessionId, limit, activityType);
    
    // Check cache first
    const cached = analyticsCache.activities.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.activities.has(cacheKey)) {
      return inFlightRequests.activities.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await analyticsApi.getUserActivities(userId, sessionId, limit, activityType);
        
        // Update cache
        analyticsCache.activities.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.activities.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.activities.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Mark conversion for purchase tracking
   * @param userId - Optional user ID
   * @param sessionId - Optional session ID
   * @param productId - Optional product ID
   * @returns Conversion response
   */
  markConversion: async (
    userId?: string,
    sessionId?: string,
    productId?: string
  ): Promise<{ success: boolean; message: string } | null> => {
    try {
      return await analyticsApi.markConversion(userId, sessionId, productId);
    } catch (error) {
      // Don't throw errors for tracking - just log them
      console.warn('Failed to mark conversion:', error);
      return null;
    }
  },

  /**
   * Clear analytics cache (useful for logout or session changes)
   */
  clearCache: () => {
    analyticsCache.browsing.clear();
    analyticsCache.activities.clear();
  },

  /**
   * Get cache statistics (for debugging)
   */
  getCacheStats: () => {
    return {
      browsingCacheSize: analyticsCache.browsing.size,
      activitiesCacheSize: analyticsCache.activities.size,
      inFlightBrowsingRequests: inFlightRequests.browsing.size,
      inFlightActivitiesRequests: inFlightRequests.activities.size,
      inFlightTrackingRequests: inFlightRequests.tracking.size
    };
  }
}; 