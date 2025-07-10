/**
 * Analytics hook for tracking user activities
 * Provides session management, batching, and convenient tracking functions
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  CreateUserActivityDto,
  CreateBatchActivityDto,
  UserActivityType,
  AnalyticsConfig,
  TrackEventParams,
  UseAnalyticsOptions,
  DeviceType,
} from '../types/analytics';
import {
  trackActivity,
  trackBatchActivities,
  trackPageView,
  trackProductView,
  trackCategoryView,
  trackBrandView,
  trackSearch,
  trackAddToCart,
  trackRemoveFromCart,
  trackAddToWishlist,
  trackRemoveFromWishlist,
  trackCheckoutStart,
  trackCheckoutStep,
  trackCheckoutComplete,
  trackProductClick,
  trackFilterUse,
  trackSortUse,
  trackPagination,
  getBrowsingHistory,
  getUserActivities,
  markConversion,
} from '../lib/api/analytics-api';
import {
  getSessionId,
  setSessionId,
  clearSessionId,
  getStoredUserId,
  setStoredUserId,
  clearStoredUserId,
  detectDeviceType,
  getCurrentPageUrl,
  getReferrerUrl,
  debounce,
  shouldEnableAnalytics,
  sanitizeMetadata,
  ANALYTICS_CONFIG,
} from '../utils/analytics-utils';

// Hook state interface
interface UseAnalyticsState {
  sessionId: string;
  userId?: string;
  deviceType: DeviceType;
  isInitialized: boolean;
  isEnabled: boolean;
  pendingActivities: CreateUserActivityDto[];
}

// Default configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  batchSize: ANALYTICS_CONFIG.DEFAULT_BATCH_SIZE,
  flushInterval: ANALYTICS_CONFIG.DEFAULT_FLUSH_INTERVAL,
  enableBatching: true,
  enableDebugLogs: process.env.NODE_ENV === 'development',
  sessionStorageKey: ANALYTICS_CONFIG.SESSION_STORAGE_KEY,
};

/**
 * Main analytics hook
 */
export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const config = { ...DEFAULT_CONFIG, ...options };
  
  // State
  const [state, setState] = useState<UseAnalyticsState>({
    sessionId: '',
    userId: undefined,
    deviceType: 'unknown',
    isInitialized: false,
    isEnabled: false,
    pendingActivities: [],
  });

  // Refs for managing timers and batching
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const lastPageUrlRef = useRef<string>('');

  // Initialize analytics
  useEffect(() => {
    const initialize = async () => {
      try {
        const isEnabled = shouldEnableAnalytics();
        const sessionId = getSessionId();
        const userId = getStoredUserId();
        const deviceType = detectDeviceType();

        console.log('🔍 Analytics Hook Debug - Initializing:', {
          isEnabled,
          sessionId,
          userId: userId || 'anonymous',
          deviceType,
          isDevelopment: process.env.NODE_ENV === 'development',
          enableInDev: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV,
          doNotTrack: typeof window !== 'undefined' ? navigator.doNotTrack : 'undefined',
          consent: typeof window !== 'undefined' ? localStorage.getItem('analytics_consent') : 'undefined'
        });

        setState(prev => ({
          ...prev,
          sessionId,
          userId: userId || undefined,
          deviceType,
          isInitialized: true,
          isEnabled,
        }));

        if (config.enableDebugLogs) {
          console.log('Analytics initialized:', {
            isEnabled,
            sessionId,
            userId: userId || 'anonymous',
            deviceType,
          });
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isEnabled: false,
        }));
      }
    };

    initialize();
  }, [config.enableDebugLogs]);

  // Set up batch flushing
  useEffect(() => {
    if (!state.isEnabled || !config.enableBatching) return;

    const startFlushTimer = () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }

      flushTimerRef.current = setTimeout(() => {
        flushPendingActivities();
      }, config.flushInterval);
    };

    startFlushTimer();

    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }
    };
  }, [state.isEnabled, config.enableBatching, config.flushInterval]);

  // Handle route changes for automatic page tracking
  useEffect(() => {
    if (!state.isEnabled || !state.isInitialized) return;

    // Track page view for current route
    const currentUrl = pathname || getCurrentPageUrl();
    
    if (currentUrl && currentUrl !== lastPageUrlRef.current) {
      trackPageViewInternal(currentUrl);
      lastPageUrlRef.current = currentUrl;
      pageStartTimeRef.current = Date.now();
    }
  }, [state.isEnabled, state.isInitialized, state.sessionId, state.userId, pathname]);

  // Flush pending activities on unmount
  useEffect(() => {
    return () => {
      if (state.pendingActivities.length > 0) {
        flushPendingActivities();
      }
    };
  }, []);

  /**
   * Flush pending activities to the server
   */
  const flushPendingActivities = useCallback(async () => {
    if (!state.isEnabled || state.pendingActivities.length === 0) return;

    try {
      const activitiesToSend = [...state.pendingActivities];
      
      // Clear pending activities immediately
      setState(prev => ({
        ...prev,
        pendingActivities: [],
      }));

      const batchData: CreateBatchActivityDto = {
        activities: activitiesToSend,
      };

      const response = await trackBatchActivities(batchData, state.userId, state.sessionId);

      if (config.enableDebugLogs) {
        console.log('Batch activities sent:', {
          count: activitiesToSend.length,
          success: response.success,
        });
      }
    } catch (error) {
      console.error('Failed to flush pending activities:', error);
      // Re-add failed activities back to pending (optional)
      // setState(prev => ({ ...prev, pendingActivities: [...prev.pendingActivities, ...activitiesToSend] }));
    }
  }, [state.isEnabled, state.pendingActivities, state.userId, state.sessionId, config.enableDebugLogs]);

  /**
   * Add activity to pending queue or send immediately
   */
  const addActivity = useCallback(async (activityData: CreateUserActivityDto) => {
    console.log('🔍 Analytics Hook Debug - addActivity called:', {
      activityType: activityData.activityType,
      entityId: activityData.entityId,
      entityType: activityData.entityType,
      isEnabled: state.isEnabled,
      isInitialized: state.isInitialized,
      enableBatching: config.enableBatching
    });

    if (!state.isEnabled || !state.isInitialized) {
      console.warn('⚠️ Analytics Hook Debug - addActivity skipped:', {
        isEnabled: state.isEnabled,
        isInitialized: state.isInitialized
      });
      return;
    }

    // Enhance activity data with common fields
    const enhancedActivity: CreateUserActivityDto = {
      ...activityData,
      sessionId: state.sessionId,
      deviceType: state.deviceType,
      pageUrl: activityData.pageUrl || getCurrentPageUrl(),
      referrer: activityData.referrer || getReferrerUrl(),
      metadata: sanitizeMetadata(activityData.metadata || {}),
    };

    console.log('🔍 Analytics Hook Debug - Enhanced activity data:', enhancedActivity);

    if (config.enableBatching) {
      // Add to pending queue
      setState(prev => ({
        ...prev,
        pendingActivities: [...prev.pendingActivities, enhancedActivity],
      }));

      console.log('📝 Analytics Hook Debug - Added to batch queue, pending count:', state.pendingActivities.length + 1);

      // Flush if batch size reached
      if (state.pendingActivities.length + 1 >= config.batchSize!) {
        console.log('🚀 Analytics Hook Debug - Batch size reached, flushing...');
        setTimeout(flushPendingActivities, 0);
      }
    } else {
      // Send immediately
      try {
        console.log('🚀 Analytics Hook Debug - Sending activity immediately...');
        const response = await trackActivity(enhancedActivity, state.userId);
        
        console.log('✅ Analytics Hook Debug - Activity sent successfully:', response);
        
        if (config.enableDebugLogs) {
          console.log('Activity tracked:', {
            type: enhancedActivity.activityType,
            success: response.success,
          });
        }
      } catch (error) {
        console.error('❌ Analytics Hook Debug - Failed to send activity:', error);
      }
    }
  }, [
    state.isEnabled,
    state.isInitialized,
    state.sessionId,
    state.deviceType,
    state.pendingActivities.length,
    state.userId,
    config.enableBatching,
    config.batchSize,
    config.enableDebugLogs,
    flushPendingActivities,
  ]);

  /**
   * Track page view internal helper
   */
  const trackPageViewInternal = useCallback(async (pageUrl?: string) => {
    const url = pageUrl || getCurrentPageUrl();
    
    await addActivity({
      activityType: UserActivityType.PAGE_VIEW,
      sessionId: state.sessionId,
      pageUrl: url,
      metadata: {
        timestamp: new Date().toISOString(),
        referrer: getReferrerUrl(),
      },
    });
  }, [addActivity, state.sessionId]);

  /**
   * Update user ID when user logs in/out
   */
  const setUserId = useCallback((userId?: string) => {
    setState(prev => ({ ...prev, userId }));
    
    if (userId) {
      setStoredUserId(userId);
    } else {
      clearStoredUserId();
    }

    if (config.enableDebugLogs) {
      console.log('Analytics user ID updated:', userId || 'anonymous');
    }
  }, [config.enableDebugLogs]);

  /**
   * Reset session (e.g., when user logs out)
   */
  const resetSession = useCallback(() => {
    const newSessionId = getSessionId();
    setState(prev => ({
      ...prev,
      sessionId: newSessionId,
      userId: undefined,
      pendingActivities: [],
    }));
    
    clearStoredUserId();
    
    if (config.enableDebugLogs) {
      console.log('Analytics session reset:', newSessionId);
    }
  }, [config.enableDebugLogs]);

  /**
   * Generic track function
   */
  const track = useCallback(async (params: TrackEventParams) => {
    await addActivity({
      activityType: params.activityType,
      sessionId: state.sessionId,
      entityId: params.entityId,
      entityType: params.entityType,
      duration: params.duration,
      metadata: params.metadata,
    });
  }, [addActivity, state.sessionId]);

  // Convenience tracking functions
  const trackProductViewHook = useCallback(async (
    productId: string,
    productSlug?: string,
    source?: string,
    duration?: number,
    metadata?: Record<string, any>
  ) => {
    console.log('🔍 Analytics Hook Debug - trackProductViewHook called:', {
      productId,
      productSlug,
      source,
      isEnabled: state.isEnabled,
      isInitialized: state.isInitialized,
      sessionId: state.sessionId,
      userId: state.userId
    });

    if (!state.isEnabled || !state.isInitialized) {
      console.warn('⚠️ Analytics Hook Debug - trackProductViewHook skipped:', {
        isEnabled: state.isEnabled,
        isInitialized: state.isInitialized
      });
      return;
    }

    await addActivity({
      activityType: UserActivityType.PRODUCT_VIEW,
      sessionId: state.sessionId,
      entityId: productId,
      entityType: 'product',
      duration,
      metadata: {
        productSlug,
        source,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId, state.isEnabled, state.isInitialized, state.userId]);

  const trackCategoryViewHook = useCallback(async (
    categoryId: string,
    categorySlug?: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.CATEGORY_VIEW,
      sessionId: state.sessionId,
      entityId: categoryId,
      entityType: 'category',
      metadata: {
        categorySlug,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackBrandViewHook = useCallback(async (
    brandId: string,
    brandSlug?: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.BRAND_VIEW,
      sessionId: state.sessionId,
      entityId: brandId,
      entityType: 'brand',
      metadata: {
        brandSlug,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackSearchHook = useCallback(async (
    query: string,
    resultsCount?: number,
    filters?: Record<string, any>,
    sortBy?: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.SEARCH,
      sessionId: state.sessionId,
      entityType: 'search',
      metadata: {
        query,
        resultsCount,
        filters,
        sortBy,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackAddToCartHook = useCallback(async (
    productId: string,
    variantId?: string,
    quantity?: number,
    price?: number,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.ADD_TO_CART,
      sessionId: state.sessionId,
      entityId: productId,
      entityType: 'product',
      metadata: {
        variantId,
        quantity,
        price,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackRemoveFromCartHook = useCallback(async (
    productId: string,
    variantId?: string,
    quantity?: number,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.REMOVE_FROM_CART,
      sessionId: state.sessionId,
      entityId: productId,
      entityType: 'product',
      metadata: {
        variantId,
        quantity,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackAddToWishlistHook = useCallback(async (
    productId: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.ADD_TO_WISHLIST,
      sessionId: state.sessionId,
      entityId: productId,
      entityType: 'product',
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackRemoveFromWishlistHook = useCallback(async (
    productId: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.REMOVE_FROM_WISHLIST,
      sessionId: state.sessionId,
      entityId: productId,
      entityType: 'product',
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackCheckoutStartHook = useCallback(async (
    totalAmount?: number,
    itemCount?: number,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.CHECKOUT_START,
      sessionId: state.sessionId,
      metadata: {
        totalAmount,
        itemCount,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackCheckoutStepHook = useCallback(async (
    step: number,
    stepName: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.CHECKOUT_STEP,
      sessionId: state.sessionId,
      metadata: {
        step,
        stepName,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackCheckoutCompleteHook = useCallback(async (
    orderId: string,
    totalAmount: number,
    paymentMethod?: string,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.CHECKOUT_COMPLETE,
      sessionId: state.sessionId,
      entityId: orderId,
      entityType: 'order',
      metadata: {
        totalAmount,
        paymentMethod,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  const trackProductClickHook = useCallback(async (
    productId: string,
    source: string,
    position?: number,
    metadata?: Record<string, any>
  ) => {
    await addActivity({
      activityType: UserActivityType.PRODUCT_CLICK,
      sessionId: state.sessionId,
      entityId: productId,
      entityType: 'product',
      metadata: {
        source,
        position,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }, [addActivity, state.sessionId]);

  return {
    // State
    isInitialized: state.isInitialized,
    isEnabled: state.isEnabled,
    sessionId: state.sessionId,
    userId: state.userId,
    deviceType: state.deviceType,
    pendingActivitiesCount: state.pendingActivities.length,

    // Core functions
    track,
    setUserId,
    resetSession,
    flushPendingActivities,

    // Convenience tracking functions
    trackPageView: trackPageViewInternal,
    trackProductView: trackProductViewHook,
    trackCategoryView: trackCategoryViewHook,
    trackBrandView: trackBrandViewHook,
    trackSearch: trackSearchHook,
    trackAddToCart: trackAddToCartHook,
    trackRemoveFromCart: trackRemoveFromCartHook,
    trackAddToWishlist: trackAddToWishlistHook,
    trackRemoveFromWishlist: trackRemoveFromWishlistHook,
    trackCheckoutStart: trackCheckoutStartHook,
    trackCheckoutStep: trackCheckoutStepHook,
    trackCheckoutComplete: trackCheckoutCompleteHook,
    trackProductClick: trackProductClickHook,

    // Additional tracking functions (these call the API directly)
    trackFilterUse: (
      filterType: string,
      filterValue: string | string[],
      activeFilters?: Record<string, any>,
      resultsCount?: number,
      metadata?: Record<string, any>
    ) => trackFilterUse(filterType, filterValue, activeFilters, resultsCount, state.userId, state.sessionId, metadata),

    trackSortUse: (
      sortBy: string,
      resultsCount?: number,
      metadata?: Record<string, any>
    ) => trackSortUse(sortBy, resultsCount, state.userId, state.sessionId, metadata),

    trackPagination: (
      page: number,
      totalPages?: number,
      resultsCount?: number,
      metadata?: Record<string, any>
    ) => trackPagination(page, totalPages, resultsCount, state.userId, state.sessionId, metadata),

    // Data retrieval functions
    getBrowsingHistory: (limit?: number, includeProduct?: boolean) => 
      getBrowsingHistory(state.userId, state.sessionId, limit, includeProduct),

    getUserActivities: (limit?: number, activityType?: UserActivityType) =>
      getUserActivities(state.userId, state.sessionId, limit, activityType),

    markConversion: (productId?: string) =>
      markConversion(state.userId, state.sessionId, productId),
  };
}

export default useAnalytics; 