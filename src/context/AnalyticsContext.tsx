/**
 * Analytics Context Provider
 * Provides global analytics state and functions throughout the application
 */

'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  UserActivityType,
  AnalyticsConfig,
  TrackEventParams,
  UseAnalyticsOptions,
  DeviceType,
  BrowsingHistoryResponseDto,
  UserActivityResponseDto,
} from '../types/analytics';

// Analytics context interface
interface AnalyticsContextType {
  // State
  isInitialized: boolean;
  isEnabled: boolean;
  sessionId: string;
  userId?: string;
  deviceType: DeviceType;
  pendingActivitiesCount: number;

  // Core functions
  track: (params: TrackEventParams) => Promise<void>;
  setUserId: (userId?: string) => void;
  resetSession: () => void;
  flushPendingActivities: () => Promise<void>;

  // Convenience tracking functions
  trackPageView: (pageUrl?: string) => Promise<void>;
  trackProductView: (
    productId: string,
    productSlug?: string,
    source?: string,
    duration?: number,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackCategoryView: (
    categoryId: string,
    categorySlug?: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackBrandView: (
    brandId: string,
    brandSlug?: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackSearch: (
    query: string,
    resultsCount?: number,
    filters?: Record<string, any>,
    sortBy?: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackAddToCart: (
    productId: string,
    variantId?: string,
    quantity?: number,
    price?: number,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackRemoveFromCart: (
    productId: string,
    variantId?: string,
    quantity?: number,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackAddToWishlist: (
    productId: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackRemoveFromWishlist: (
    productId: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackCheckoutStart: (
    totalAmount?: number,
    itemCount?: number,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackCheckoutStep: (
    step: number,
    stepName: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackCheckoutComplete: (
    orderId: string,
    totalAmount: number,
    paymentMethod?: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackProductClick: (
    productId: string,
    source: string,
    position?: number,
    metadata?: Record<string, any>
  ) => Promise<void>;
  trackFilterUse: (
    filterType: string,
    filterValue: string | string[],
    activeFilters?: Record<string, any>,
    resultsCount?: number,
    metadata?: Record<string, any>
  ) => Promise<any>;
  trackSortUse: (
    sortBy: string,
    resultsCount?: number,
    metadata?: Record<string, any>
  ) => Promise<any>;
  trackPagination: (
    page: number,
    totalPages?: number,
    resultsCount?: number,
    metadata?: Record<string, any>
  ) => Promise<any>;

  // Data retrieval functions
  getBrowsingHistory: (limit?: number, includeProduct?: boolean) => Promise<any>;
  getUserActivities: (limit?: number, activityType?: UserActivityType) => Promise<any>;
  markConversion: (productId?: string) => Promise<any>;
}

// Create context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Provider props
interface AnalyticsProviderProps {
  children: ReactNode;
  config?: UseAnalyticsOptions;
}

/**
 * Analytics Provider Component
 */
export function AnalyticsProvider({ children, config = {} }: AnalyticsProviderProps) {
  const { user } = useAuth();
  const analytics = useAnalytics(config);

  // Sync user ID with authentication state
  useEffect(() => {
    if (user?.id !== analytics.userId) {
      analytics.setUserId(user?.id);
    }
  }, [user?.id, analytics.userId, analytics.setUserId]);

  // Reset session when user logs out
  useEffect(() => {
    if (!user && analytics.userId) {
      analytics.resetSession();
    }
  }, [user, analytics.userId, analytics.resetSession]);

  const contextValue: AnalyticsContextType = {
    // State
    isInitialized: analytics.isInitialized,
    isEnabled: analytics.isEnabled,
    sessionId: analytics.sessionId,
    userId: analytics.userId,
    deviceType: analytics.deviceType,
    pendingActivitiesCount: analytics.pendingActivitiesCount,

    // Core functions
    track: analytics.track,
    setUserId: analytics.setUserId,
    resetSession: analytics.resetSession,
    flushPendingActivities: analytics.flushPendingActivities,

    // Convenience tracking functions
    trackPageView: analytics.trackPageView,
    trackProductView: analytics.trackProductView,
    trackCategoryView: analytics.trackCategoryView,
    trackBrandView: analytics.trackBrandView,
    trackSearch: analytics.trackSearch,
    trackAddToCart: analytics.trackAddToCart,
    trackRemoveFromCart: analytics.trackRemoveFromCart,
    trackAddToWishlist: analytics.trackAddToWishlist,
    trackRemoveFromWishlist: analytics.trackRemoveFromWishlist,
    trackCheckoutStart: analytics.trackCheckoutStart,
    trackCheckoutStep: analytics.trackCheckoutStep,
    trackCheckoutComplete: analytics.trackCheckoutComplete,
    trackProductClick: analytics.trackProductClick,
    trackFilterUse: analytics.trackFilterUse,
    trackSortUse: analytics.trackSortUse,
    trackPagination: analytics.trackPagination,

    // Data retrieval functions
    getBrowsingHistory: analytics.getBrowsingHistory,
    getUserActivities: analytics.getUserActivities,
    markConversion: analytics.markConversion,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook to use analytics context
 */
export function useAnalyticsContext(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  
  return context;
}

/**
 * HOC to provide analytics context to a component
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { analytics?: AnalyticsContextType }> {
  const WrappedComponent = (props: P) => {
    const analytics = useAnalyticsContext();
    
    return <Component {...props} analytics={analytics} />;
  };
  
  WrappedComponent.displayName = `withAnalytics(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Export default
export default AnalyticsContext; 