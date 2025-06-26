'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSessionId } from './useSessionId';
import { recommendationsService } from '@/services/recommendationsService';
import { 
  RecommendationType, 
  RecommendationResponseDto,
  RecommendationQueryDto
} from '@/types/recommendations';

interface UseRecommendationsOptions {
  type: RecommendationType;
  productId?: string;
  categoryId?: string;
  limit?: number;
  includeProduct?: boolean;
  autoFetch?: boolean;
  enableCaching?: boolean;
  cacheTimeMs?: number;
}

interface UseRecommendationsReturn {
  recommendations: RecommendationResponseDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

// Simple in-memory cache for recommendations
interface CacheEntry {
  data: RecommendationResponseDto[];
  timestamp: number;
  key: string;
}

const cache = new Map<string, CacheEntry>();

export const useRecommendations = ({
  type,
  productId,
  categoryId,
  limit = 10,
  includeProduct = true,
  autoFetch = true,
  enableCaching = true,
  cacheTimeMs = 15 * 60 * 1000 // 15 minutes default
}: UseRecommendationsOptions): UseRecommendationsReturn => {
  const { user } = useAuth();
  const sessionId = useSessionId();
  const [recommendations, setRecommendations] = useState<RecommendationResponseDto[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentLimit, setCurrentLimit] = useState(limit);

  // Generate cache key
  const getCacheKey = useCallback((queryLimit: number) => {
    const params = {
      type,
      userId: user?.id,
      sessionId,
      productId,
      categoryId,
      limit: queryLimit,
      includeProduct
    };
    return JSON.stringify(params);
  }, [type, user?.id, sessionId, productId, categoryId, includeProduct]);

  // Check cache for existing data
  const getFromCache = useCallback((key: string): RecommendationResponseDto[] | null => {
    if (!enableCaching) return null;
    
    const entry = cache.get(key);
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > cacheTimeMs;
    if (isExpired) {
      cache.delete(key);
      return null;
    }
    
    return entry.data;
  }, [enableCaching, cacheTimeMs]);

  // Store data in cache
  const setInCache = useCallback((key: string, data: RecommendationResponseDto[]) => {
    if (!enableCaching) return;
    
    cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    });
    
    // Basic cache cleanup - remove oldest entries if cache gets too large
    if (cache.size > 50) {
      const oldestKey = Array.from(cache.keys())[0];
      cache.delete(oldestKey);
    }
  }, [enableCaching]);

  const fetchRecommendations = useCallback(async (queryLimit: number = currentLimit, append: boolean = false) => {
    if (!sessionId && !user?.id) return; // Wait for session/user data

    try {
      if (!append) {
        setLoading(true);
      }
      setError(null);

      const cacheKey = getCacheKey(queryLimit);
      
      // Check cache first
      const cachedData = getFromCache(cacheKey);
      if (cachedData && !append) {
        setRecommendations(cachedData);
        setHasMore(cachedData.length >= queryLimit);
        setLoading(false);
        return;
      }

      const queryParams: RecommendationQueryDto = {
        type,
        userId: user?.id,
        sessionId,
        productId,
        categoryId,
        limit: queryLimit,
        includeProduct
      };

      const result = await recommendationsService.getRecommendations(queryParams);

      // Store in cache
      setInCache(cacheKey, result);

      if (append) {
        setRecommendations(prev => [...prev, ...result]);
      } else {
        setRecommendations(result);
      }
      
      setHasMore(result.length >= queryLimit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recommendations';
      setError(errorMessage);
      console.error('Recommendations fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [type, user?.id, sessionId, productId, categoryId, includeProduct, currentLimit, getCacheKey, getFromCache, setInCache]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    const newLimit = currentLimit + limit;
    setCurrentLimit(newLimit);
    await fetchRecommendations(newLimit, true);
  }, [loading, hasMore, currentLimit, limit, fetchRecommendations]);

  const refetch = useCallback(async () => {
    setCurrentLimit(limit);
    await fetchRecommendations(limit, false);
  }, [limit, fetchRecommendations]);

  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations();
    }
  }, [fetchRecommendations, autoFetch]);

  return {
    recommendations,
    loading,
    error,
    refetch,
    hasMore,
    loadMore
  };
};

// Specialized hooks for common use cases
export const useSimilarProducts = (productId: string, limit = 10) => {
  return useRecommendations({
    type: RecommendationType.SIMILAR_PRODUCTS,
    productId,
    limit,
    cacheTimeMs: 30 * 60 * 1000 // 30 minutes for similar products
  });
};

export const usePersonalizedRecommendations = (limit = 20) => {
  return useRecommendations({
    type: RecommendationType.PERSONALIZED,
    limit,
    cacheTimeMs: 15 * 60 * 1000 // 15 minutes for personalized
  });
};

export const useTrendingProducts = (categoryId?: string, limit = 20) => {
  return useRecommendations({
    type: RecommendationType.TRENDING,
    categoryId,
    limit,
    cacheTimeMs: 30 * 60 * 1000 // 30 minutes for trending
  });
};

export const useRecentlyViewed = (limit = 10) => {
  return useRecommendations({
    type: RecommendationType.RECENTLY_VIEWED,
    limit,
    cacheTimeMs: 5 * 60 * 1000 // 5 minutes for recently viewed (more dynamic)
  });
};

export const useFrequentlyBoughtTogether = (productId: string, limit = 5) => {
  return useRecommendations({
    type: RecommendationType.FREQUENTLY_BOUGHT_TOGETHER,
    productId,
    limit,
    cacheTimeMs: 30 * 60 * 1000 // 30 minutes for frequently bought together
  });
};

export const useTopRated = (categoryId?: string, limit = 20) => {
  return useRecommendations({
    type: RecommendationType.TOP_RATED,
    categoryId,
    limit,
    cacheTimeMs: 60 * 60 * 1000 // 60 minutes for top rated (changes less frequently)
  });
};

export const useBestsellers = (categoryId?: string, limit = 20) => {
  return useRecommendations({
    type: RecommendationType.BESTSELLERS,
    categoryId,
    limit,
    cacheTimeMs: 60 * 60 * 1000 // 60 minutes for bestsellers
  });
};

export const useNewArrivals = (categoryId?: string, limit = 20) => {
  return useRecommendations({
    type: RecommendationType.NEW_ARRIVALS,
    categoryId,
    limit,
    cacheTimeMs: 30 * 60 * 1000 // 30 minutes for new arrivals
  });
};

export default useRecommendations; 