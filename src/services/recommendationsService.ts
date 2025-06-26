import { 
  RecommendationResponseDto,
  RecommendationQueryDto
} from '@/types/recommendations';
import { recommendationsApi } from '@/lib/api/recommendations-api';

// Cache for recommendations data to prevent repeated API calls
const recommendationsCache = {
  similar: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  frequentlyBought: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  personalized: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  trending: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  recentlyViewed: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  topRated: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  bestsellers: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  newArrivals: new Map<string, { data: RecommendationResponseDto[], timestamp: number }>(),
  // Cache expiration time in milliseconds (5 minutes for recommendations)
  expirationTime: 5 * 60 * 1000
};

// In-flight requests tracking to prevent duplicate API calls
const inFlightRequests = {
  similar: new Map<string, Promise<RecommendationResponseDto[]>>(),
  frequentlyBought: new Map<string, Promise<RecommendationResponseDto[]>>(),
  personalized: new Map<string, Promise<RecommendationResponseDto[]>>(),
  trending: new Map<string, Promise<RecommendationResponseDto[]>>(),
  recentlyViewed: new Map<string, Promise<RecommendationResponseDto[]>>(),
  topRated: new Map<string, Promise<RecommendationResponseDto[]>>(),
  bestsellers: new Map<string, Promise<RecommendationResponseDto[]>>(),
  newArrivals: new Map<string, Promise<RecommendationResponseDto[]>>()
};

// Check if cached data is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < recommendationsCache.expirationTime;
};

// Generate cache keys
const generateCacheKey = (type: string, params: Record<string, any>): string => {
  return `${type}|${JSON.stringify(params)}`;
};

/**
 * Service to handle recommendations-related operations
 * This service provides business logic on top of the raw API calls
 */
export const recommendationsService = {
  /**
   * Universal recommendations method with type-based routing
   * @param queryParams - The recommendation query parameters
   * @returns Recommendation data based on type
   */
  getRecommendations: async (queryParams: RecommendationQueryDto): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('universal', queryParams);
    
    // For universal recommendations, we don't cache as aggressively since it depends on many factors
    try {
      return await recommendationsApi.getRecommendations(queryParams);
    } catch (error) {
      console.warn('Failed to fetch recommendations:', error);
      return [];
    }
  },

  /**
   * Get similar products for a given product
   * @param productId - The product ID to find similar products for
   * @param limit - Maximum number of recommendations to return
   * @returns Similar products data
   */
     getSimilarProducts: async (productId: string, limit = 10): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('similar', { productId, limit });
    
    // Check cache first
    const cached = recommendationsCache.similar.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.similar.has(cacheKey)) {
      return inFlightRequests.similar.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await recommendationsApi.getSimilarProducts(productId, limit);
        
        // Update cache
        recommendationsCache.similar.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.similar.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.similar.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get frequently bought together products
   * @param productId - The product ID to find frequently bought together products for
   * @param limit - Maximum number of recommendations to return
   * @returns Frequently bought together products data
   */
     getFrequentlyBoughtTogether: async (productId: string, limit = 5): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('frequentlyBought', { productId, limit });
    
    // Check cache first
    const cached = recommendationsCache.frequentlyBought.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.frequentlyBought.has(cacheKey)) {
      return inFlightRequests.frequentlyBought.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await recommendationsApi.getFrequentlyBoughtTogether(productId, limit);
        
        // Update cache
        recommendationsCache.frequentlyBought.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.frequentlyBought.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.frequentlyBought.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get personalized recommendations for a user
   * @param userId - Optional user ID (if not provided, uses session-based recommendations)
   * @param sessionId - Optional session ID
   * @param limit - Maximum number of recommendations to return
   * @returns Personalized recommendations data
   */
  getPersonalizedRecommendations: async (
    userId?: string,
    sessionId?: string,
    limit = 20
     ): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('personalized', { userId, sessionId, limit });
    
    // Check cache first
    const cached = recommendationsCache.personalized.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.personalized.has(cacheKey)) {
      return inFlightRequests.personalized.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await recommendationsApi.getPersonalizedRecommendations(userId, sessionId, limit);
        
        // Update cache
        recommendationsCache.personalized.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.personalized.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.personalized.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get trending products
   * @param categoryId - Optional category ID to filter by
   * @param limit - Maximum number of recommendations to return
   * @returns Trending products data
   */
     getTrendingProducts: async (categoryId?: string, limit = 20): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('trending', { categoryId, limit });
    
    // Check cache first
    const cached = recommendationsCache.trending.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.trending.has(cacheKey)) {
      return inFlightRequests.trending.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await recommendationsApi.getTrendingProducts(categoryId, limit);
        
        // Update cache
        recommendationsCache.trending.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.trending.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.trending.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get recently viewed products for a user
   * @param userId - Optional user ID
   * @param sessionId - Optional session ID
   * @param limit - Maximum number of recommendations to return
   * @returns Recently viewed products data
   */
  getRecentlyViewedProducts: async (
    userId?: string,
    sessionId?: string,
    limit = 10
     ): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('recentlyViewed', { userId, sessionId, limit });
    
    // Check cache first
    const cached = recommendationsCache.recentlyViewed.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.recentlyViewed.has(cacheKey)) {
      return inFlightRequests.recentlyViewed.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
                 const data = await recommendationsApi.getRecentlyViewed(userId, sessionId, limit);
        
        // Update cache
        recommendationsCache.recentlyViewed.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.recentlyViewed.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.recentlyViewed.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get top rated products
   * @param categoryId - Optional category ID to filter by
   * @param limit - Maximum number of recommendations to return
   * @returns Top rated products data
   */
     getTopRatedProducts: async (categoryId?: string, limit = 20): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('topRated', { categoryId, limit });
    
    // Check cache first
    const cached = recommendationsCache.topRated.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.topRated.has(cacheKey)) {
      return inFlightRequests.topRated.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
                 const data = await recommendationsApi.getTopRated(categoryId, limit);
        
        // Update cache
        recommendationsCache.topRated.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.topRated.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.topRated.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get bestseller products
   * @param categoryId - Optional category ID to filter by
   * @param limit - Maximum number of recommendations to return
   * @returns Bestseller products data
   */
     getBestsellers: async (categoryId?: string, limit = 20): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('bestsellers', { categoryId, limit });
    
    // Check cache first
    const cached = recommendationsCache.bestsellers.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.bestsellers.has(cacheKey)) {
      return inFlightRequests.bestsellers.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await recommendationsApi.getBestsellers(categoryId, limit);
        
        // Update cache
        recommendationsCache.bestsellers.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.bestsellers.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.bestsellers.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Get new arrivals
   * @param categoryId - Optional category ID to filter by
   * @param limit - Maximum number of recommendations to return
   * @returns New arrivals data
   */
     getNewArrivals: async (categoryId?: string, limit = 20): Promise<RecommendationResponseDto[]> => {
    const cacheKey = generateCacheKey('newArrivals', { categoryId, limit });
    
    // Check cache first
    const cached = recommendationsCache.newArrivals.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    // Check if there's already an in-flight request
    if (inFlightRequests.newArrivals.has(cacheKey)) {
      return inFlightRequests.newArrivals.get(cacheKey)!;
    }
    
    // Create a new request and track it
    const request = async () => {
      try {
        const data = await recommendationsApi.getNewArrivals(categoryId, limit);
        
        // Update cache
        recommendationsCache.newArrivals.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        return data;
      } finally {
        // Remove from in-flight requests when done
        inFlightRequests.newArrivals.delete(cacheKey);
      }
    };
    
    // Store the promise in the in-flight requests map
    const promise = request();
    inFlightRequests.newArrivals.set(cacheKey, promise);
    
    return promise;
  },

  /**
   * Clear recommendations cache (useful for logout or session changes)
   */
  clearCache: () => {
    recommendationsCache.similar.clear();
    recommendationsCache.frequentlyBought.clear();
    recommendationsCache.personalized.clear();
    recommendationsCache.trending.clear();
    recommendationsCache.recentlyViewed.clear();
    recommendationsCache.topRated.clear();
    recommendationsCache.bestsellers.clear();
    recommendationsCache.newArrivals.clear();
  },

  /**
   * Clear user-specific cache (useful for logout)
   */
  clearUserCache: (userId: string) => {
    // Clear personalized and recently viewed caches for the specific user
    for (const [key, value] of recommendationsCache.personalized.entries()) {
      if (key.includes(userId)) {
        recommendationsCache.personalized.delete(key);
      }
    }
    for (const [key, value] of recommendationsCache.recentlyViewed.entries()) {
      if (key.includes(userId)) {
        recommendationsCache.recentlyViewed.delete(key);
      }
    }
  },

  /**
   * Get cache statistics (for debugging)
   */
  getCacheStats: () => {
    return {
      similarCacheSize: recommendationsCache.similar.size,
      frequentlyBoughtCacheSize: recommendationsCache.frequentlyBought.size,
      personalizedCacheSize: recommendationsCache.personalized.size,
      trendingCacheSize: recommendationsCache.trending.size,
      recentlyViewedCacheSize: recommendationsCache.recentlyViewed.size,
      topRatedCacheSize: recommendationsCache.topRated.size,
      bestsellersCacheSize: recommendationsCache.bestsellers.size,
      newArrivalsCacheSize: recommendationsCache.newArrivals.size,
      totalInFlightRequests: Object.values(inFlightRequests).reduce((sum, map) => sum + map.size, 0)
    };
  }
}; 