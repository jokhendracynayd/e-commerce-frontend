/**
 * Analytics API service
 * Handles all analytics tracking operations
 */

import { axiosClient } from './index';
import { ENDPOINTS } from './endpoints';
import {
  CreateUserActivityDto,
  CreateBatchActivityDto,
  TrackActivityResponse,
  TrackBatchActivityResponse,
  GetBrowsingHistoryResponse,
  GetUserActivitiesResponse,
  MarkConversionResponse,
  UserActivityType,
} from '../../types/analytics';
import { createAnalyticsHeaders } from '../../utils/analytics-utils';

/**
 * Track a single user activity
 */
export async function trackActivity(
  activityData: CreateUserActivityDto,
  userId?: string
): Promise<TrackActivityResponse> {
  try {
    const headers = createAnalyticsHeaders(userId, activityData.sessionId);
    
    const response = await axiosClient.post(ENDPOINTS.ANALYTICS.TRACK_ACTIVITY, activityData, {
      headers,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error tracking activity:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to track activity',
    };
  }
}

/**
 * Track multiple activities in batch
 */
export async function trackBatchActivities(
  batchData: CreateBatchActivityDto,
  userId?: string,
  sessionId?: string
): Promise<TrackBatchActivityResponse> {
  try {
    const headers = createAnalyticsHeaders(userId, sessionId);
    
    const response = await axiosClient.post(ENDPOINTS.ANALYTICS.TRACK_BATCH, batchData, {
      headers,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error tracking batch activities:', error);
    return {
      success: false,
      count: 0,
      message: error?.response?.data?.message || 'Failed to track batch activities',
    };
  }
}

/**
 * Get user's browsing history
 */
export async function getBrowsingHistory(
  userId?: string,
  sessionId?: string,
  limit = 10,
  includeProduct = true
): Promise<GetBrowsingHistoryResponse> {
  try {
    const params = new URLSearchParams();
    
    if (userId) params.append('userId', userId);
    if (sessionId) params.append('sessionId', sessionId);
    if (limit) params.append('limit', limit.toString());
    if (includeProduct !== undefined) params.append('includeProduct', includeProduct.toString());

    const response = await axiosClient.get(`${ENDPOINTS.ANALYTICS.BROWSING_HISTORY}?${params}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error getting browsing history:', error);
    return {
      success: false,
      data: [],
      message: error?.response?.data?.message || 'Failed to get browsing history',
    };
  }
}

/**
 * Get user's activities
 */
export async function getUserActivities(
  userId?: string,
  sessionId?: string,
  limit = 50,
  activityType?: UserActivityType
): Promise<GetUserActivitiesResponse> {
  try {
    const params = new URLSearchParams();
    
    if (userId) params.append('userId', userId);
    if (sessionId) params.append('sessionId', sessionId);
    if (limit) params.append('limit', limit.toString());
    if (activityType) params.append('activityType', activityType);

    const response = await axiosClient.get(`${ENDPOINTS.ANALYTICS.USER_ACTIVITIES}?${params}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error getting user activities:', error);
    return {
      success: false,
      data: [],
      message: error?.response?.data?.message || 'Failed to get user activities',
    };
  }
}

/**
 * Mark conversion for analytics
 */
export async function markConversion(
  userId?: string,
  sessionId?: string,
  productId?: string
): Promise<MarkConversionResponse> {
  try {
    const params = new URLSearchParams();
    
    if (userId) params.append('userId', userId);
    if (sessionId) params.append('sessionId', sessionId);
    if (productId) params.append('productId', productId);

    const response = await axiosClient.post(`${ENDPOINTS.ANALYTICS.MARK_CONVERSION}?${params}`);

    return response.data;
  } catch (error: any) {
    console.error('Error marking conversion:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to mark conversion',
    };
  }
}

// Convenience functions for common tracking scenarios

/**
 * Track page view
 */
export async function trackPageView(
  pageUrl: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.PAGE_VIEW,
    sessionId: sessionId!,
    pageUrl,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track product view
 */
export async function trackProductView(
  productId: string,
  productSlug?: string,
  source?: string,
  userId?: string,
  sessionId?: string,
  duration?: number,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.PRODUCT_VIEW,
    sessionId: sessionId!,
    entityId: productId,
    entityType: 'product',
    duration,
    metadata: {
      productSlug,
      source,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track category view
 */
export async function trackCategoryView(
  categoryId: string,
  categorySlug?: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.CATEGORY_VIEW,
    sessionId: sessionId!,
    entityId: categoryId,
    entityType: 'category',
    metadata: {
      categorySlug,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track brand view
 */
export async function trackBrandView(
  brandId: string,
  brandSlug?: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.BRAND_VIEW,
    sessionId: sessionId!,
    entityId: brandId,
    entityType: 'brand',
    metadata: {
      brandSlug,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track search
 */
export async function trackSearch(
  query: string,
  resultsCount?: number,
  filters?: Record<string, any>,
  sortBy?: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.SEARCH,
    sessionId: sessionId!,
    entityType: 'search',
    metadata: {
      query,
      resultsCount,
      filters,
      sortBy,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track add to cart
 */
export async function trackAddToCart(
  productId: string,
  variantId?: string,
  quantity?: number,
  price?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.ADD_TO_CART,
    sessionId: sessionId!,
    entityId: productId,
    entityType: 'product',
    metadata: {
      variantId,
      quantity,
      price,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track remove from cart
 */
export async function trackRemoveFromCart(
  productId: string,
  variantId?: string,
  quantity?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.REMOVE_FROM_CART,
    sessionId: sessionId!,
    entityId: productId,
    entityType: 'product',
    metadata: {
      variantId,
      quantity,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track add to wishlist
 */
export async function trackAddToWishlist(
  productId: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.ADD_TO_WISHLIST,
    sessionId: sessionId!,
    entityId: productId,
    entityType: 'product',
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track remove from wishlist
 */
export async function trackRemoveFromWishlist(
  productId: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.REMOVE_FROM_WISHLIST,
    sessionId: sessionId!,
    entityId: productId,
    entityType: 'product',
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track checkout start
 */
export async function trackCheckoutStart(
  totalAmount?: number,
  itemCount?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.CHECKOUT_START,
    sessionId: sessionId!,
    metadata: {
      totalAmount,
      itemCount,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track checkout step
 */
export async function trackCheckoutStep(
  step: number,
  stepName: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.CHECKOUT_STEP,
    sessionId: sessionId!,
    metadata: {
      step,
      stepName,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track checkout complete
 */
export async function trackCheckoutComplete(
  orderId: string,
  totalAmount: number,
  paymentMethod?: string,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.CHECKOUT_COMPLETE,
    sessionId: sessionId!,
    entityId: orderId,
    entityType: 'order',
    metadata: {
      totalAmount,
      paymentMethod,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track product click (from lists, search results, etc.)
 */
export async function trackProductClick(
  productId: string,
  source: string,
  position?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.PRODUCT_CLICK,
    sessionId: sessionId!,
    entityId: productId,
    entityType: 'product',
    metadata: {
      source,
      position,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track filter usage
 */
export async function trackFilterUse(
  filterType: string,
  filterValue: string | string[],
  activeFilters?: Record<string, any>,
  resultsCount?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.FILTER_USE,
    sessionId: sessionId!,
    metadata: {
      filterType,
      filterValue,
      activeFilters,
      resultsCount,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track sort usage
 */
export async function trackSortUse(
  sortBy: string,
  resultsCount?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.SORT_USE,
    sessionId: sessionId!,
    metadata: {
      sortBy,
      resultsCount,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
}

/**
 * Track pagination
 */
export async function trackPagination(
  page: number,
  totalPages?: number,
  resultsCount?: number,
  userId?: string,
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<TrackActivityResponse> {
  const activityData: CreateUserActivityDto = {
    activityType: UserActivityType.PAGINATION,
    sessionId: sessionId!,
    metadata: {
      page,
      totalPages,
      resultsCount,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };

  return trackActivity(activityData, userId);
} 