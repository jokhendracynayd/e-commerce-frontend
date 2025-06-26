'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSessionId } from './useSessionId';
import { analyticsService } from '@/services/analyticsService';
import { 
  UserActivityType, 
  CreateUserActivityDto 
} from '@/types/analytics';

interface ActivityQueue {
  activities: CreateUserActivityDto[];
  timeout?: NodeJS.Timeout;
}

interface UseActivityTrackingOptions {
  enableBatching?: boolean;
  batchSize?: number;
  batchTimeoutMs?: number;
  enableErrorLogging?: boolean;
}

export const useActivityTracking = (options: UseActivityTrackingOptions = {}) => {
  const { 
    enableBatching = true,
    batchSize = 10,
    batchTimeoutMs = 5000,
    enableErrorLogging = true
  } = options;

  const { user } = useAuth();
  const sessionId = useSessionId();
  const queueRef = useRef<ActivityQueue>({ activities: [] });
  const pageStartTime = useRef<number>(Date.now());

  // Batch activities for performance (send every 5 seconds or 10 activities)
  const flushQueue = useCallback(async () => {
    const queue = queueRef.current;
    if (queue.activities.length === 0) return;

    const activitiesToSend = [...queue.activities];
    queue.activities = [];

    if (queue.timeout) {
      clearTimeout(queue.timeout);
      queue.timeout = undefined;
    }

    try {
      if (activitiesToSend.length === 1) {
        await analyticsService.trackActivity(activitiesToSend[0]);
      } else {
        await analyticsService.trackBatchActivities(activitiesToSend);
      }
    } catch (error) {
      if (enableErrorLogging) {
        console.warn('Failed to send analytics data:', error);
      }
    }
  }, [enableErrorLogging]);

  const trackActivity = useCallback((
    activityType: UserActivityType,
    options: Partial<CreateUserActivityDto> = {}
  ) => {
    if (!sessionId) return; // Don't track if session ID not ready

    // Merge user ID into metadata if user is logged in
    const metadata = { 
      ...(options.metadata || {}),
      ...(user?.id ? { userId: user.id } : {})
    };

    const activity: CreateUserActivityDto = {
      activityType,
      sessionId,
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
      deviceType: getDeviceType(),
      referrer: typeof window !== 'undefined' ? document.referrer : '',
      ...options,
      metadata
    };

    if (!enableBatching) {
      // Send immediately
      analyticsService.trackActivity(activity).catch(error => {
        if (enableErrorLogging) {
          console.warn('Failed to track activity:', error);
        }
      });
      return;
    }

    const queue = queueRef.current;
    queue.activities.push(activity);

    // Auto-flush on batch size or set timeout
    if (queue.activities.length >= batchSize) {
      flushQueue();
    } else if (!queue.timeout) {
      queue.timeout = setTimeout(flushQueue, batchTimeoutMs);
    }
  }, [sessionId, user?.id, flushQueue, enableBatching, batchSize, batchTimeoutMs, enableErrorLogging]);

  // Specific tracking methods for common activities
  const trackPageView = useCallback((pageUrl?: string) => {
    pageStartTime.current = Date.now();
    trackActivity(UserActivityType.PAGE_VIEW, { 
      pageUrl: pageUrl || (typeof window !== 'undefined' ? window.location.pathname : '')
    });
  }, [trackActivity]);

  const trackProductView = useCallback((productId: string, source?: string) => {
    trackActivity(UserActivityType.PRODUCT_VIEW, {
      entityId: productId,
      entityType: 'product',
      metadata: { source }
    });
  }, [trackActivity]);

  const trackCategoryView = useCallback((categoryId: string, categoryName?: string) => {
    trackActivity(UserActivityType.CATEGORY_VIEW, {
      entityId: categoryId,
      entityType: 'category',
      metadata: { categoryName }
    });
  }, [trackActivity]);

  const trackBrandView = useCallback((brandId: string, brandName?: string) => {
    trackActivity(UserActivityType.BRAND_VIEW, {
      entityId: brandId,
      entityType: 'brand',
      metadata: { brandName }
    });
  }, [trackActivity]);

  const trackSearch = useCallback((query: string, resultCount?: number, filters?: Record<string, any>) => {
    trackActivity(UserActivityType.SEARCH, {
      metadata: { query, resultCount, filters }
    });
  }, [trackActivity]);

  const trackFilterUse = useCallback((filterType: string, filterValue: string, resultCount?: number) => {
    trackActivity(UserActivityType.FILTER_USE, {
      metadata: { filterType, filterValue, resultCount }
    });
  }, [trackActivity]);

  const trackSortUse = useCallback((sortType: string, sortDirection?: 'asc' | 'desc') => {
    trackActivity(UserActivityType.SORT_USE, {
      metadata: { sortType, sortDirection }
    });
  }, [trackActivity]);

  const trackAddToCart = useCallback((productId: string, quantity = 1, price?: number, variantId?: string) => {
    trackActivity(UserActivityType.ADD_TO_CART, {
      entityId: productId,
      entityType: 'product',
      metadata: { quantity, price, variantId }
    });
  }, [trackActivity]);

  const trackRemoveFromCart = useCallback((productId: string, quantity = 1, variantId?: string) => {
    trackActivity(UserActivityType.REMOVE_FROM_CART, {
      entityId: productId,
      entityType: 'product',
      metadata: { quantity, variantId }
    });
  }, [trackActivity]);

  const trackAddToWishlist = useCallback((productId: string) => {
    trackActivity(UserActivityType.ADD_TO_WISHLIST, {
      entityId: productId,
      entityType: 'product'
    });
  }, [trackActivity]);

  const trackRemoveFromWishlist = useCallback((productId: string) => {
    trackActivity(UserActivityType.REMOVE_FROM_WISHLIST, {
      entityId: productId,
      entityType: 'product'
    });
  }, [trackActivity]);

  const trackCheckoutStart = useCallback((cartTotal?: number, itemCount?: number) => {
    trackActivity(UserActivityType.CHECKOUT_START, {
      metadata: { cartTotal, itemCount }
    });
  }, [trackActivity]);

  const trackCheckoutStep = useCallback((step: string, stepData?: Record<string, any>) => {
    trackActivity(UserActivityType.CHECKOUT_STEP, {
      metadata: { step, ...stepData }
    });
  }, [trackActivity]);

  const trackCheckoutComplete = useCallback((orderId: string, orderTotal?: number, paymentMethod?: string) => {
    trackActivity(UserActivityType.CHECKOUT_COMPLETE, {
      entityId: orderId,
      entityType: 'order',
      metadata: { orderTotal, paymentMethod }
    });
  }, [trackActivity]);

  const trackProductClick = useCallback((productId: string, source: string, position?: number) => {
    trackActivity(UserActivityType.PRODUCT_CLICK, {
      entityId: productId,
      entityType: 'product',
      metadata: { source, position }
    });
  }, [trackActivity]);

  const trackProductShare = useCallback((productId: string, shareMethod: string) => {
    trackActivity(UserActivityType.PRODUCT_SHARE, {
      entityId: productId,
      entityType: 'product',
      metadata: { shareMethod }
    });
  }, [trackActivity]);

  const trackReviewSubmitted = useCallback((productId: string, rating: number, reviewId?: string) => {
    trackActivity(UserActivityType.REVIEW_SUBMITTED, {
      entityId: productId,
      entityType: 'product',
      metadata: { rating, reviewId }
    });
  }, [trackActivity]);

  const trackCouponApplied = useCallback((couponCode: string, discountAmount?: number, orderId?: string) => {
    trackActivity(UserActivityType.COUPON_APPLIED, {
      entityId: couponCode,
      entityType: 'coupon',
      metadata: { discountAmount, orderId }
    });
  }, [trackActivity]);

  const trackConversion = useCallback(async (productId?: string) => {
    try {
      await analyticsService.markConversion(user?.id, sessionId, productId);
    } catch (error) {
      if (enableErrorLogging) {
        console.warn('Failed to mark conversion:', error);
      }
    }
  }, [user?.id, sessionId, enableErrorLogging]);

  // Track page duration on unmount
  useEffect(() => {
    return () => {
      const duration = Math.round((Date.now() - pageStartTime.current) / 1000);
      if (duration > 1) { // Only track if more than 1 second
        trackActivity(UserActivityType.PAGE_VIEW, { 
          duration,
          metadata: { type: 'page_exit' }
        });
      }
      flushQueue(); // Send remaining activities
    };
  }, [trackActivity, flushQueue]);

  return {
    trackActivity,
    trackPageView,
    trackProductView,
    trackCategoryView,
    trackBrandView,
    trackSearch,
    trackFilterUse,
    trackSortUse,
    trackAddToCart,
    trackRemoveFromCart,
    trackAddToWishlist,
    trackRemoveFromWishlist,
    trackCheckoutStart,
    trackCheckoutStep,
    trackCheckoutComplete,
    trackProductClick,
    trackProductShare,
    trackReviewSubmitted,
    trackCouponApplied,
    trackConversion,
    flushQueue
  };
};

// Helper function to detect device type
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export default useActivityTracking; 