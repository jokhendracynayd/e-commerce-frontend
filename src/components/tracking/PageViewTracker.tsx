'use client';

import { useEffect, useRef } from 'react';
import { useActivityTrackingContext } from '@/context/ActivityTrackingContext';
import { usePathname, useSearchParams } from 'next/navigation';

interface PageViewTrackerProps {
  /**
   * Custom page identifier (optional)
   */
  pageId?: string;
  
  /**
   * Page category for analytics grouping
   */
  pageCategory?: 'product' | 'category' | 'search' | 'checkout' | 'profile' | 'home' | 'other';
  
  /**
   * Additional metadata to track with the page view
   */
  metadata?: Record<string, any>;
  
  /**
   * Custom page title (optional, will use document.title if not provided)
   */
  pageTitle?: string;
  
  /**
   * Whether to track this page view (default: true)
   */
  enabled?: boolean;
  
  /**
   * Delay before tracking the page view (overrides global config)
   */
  trackingDelay?: number;
}

/**
 * PageViewTracker Component
 * 
 * A declarative component for tracking page views with rich metadata.
 * Place this component in any page where you want to track views.
 * 
 * Example usage:
 * ```tsx
 * <PageViewTracker 
 *   pageCategory="product"
 *   metadata={{ productId: '123', category: 'electronics' }}
 * />
 * ```
 */
export const PageViewTracker: React.FC<PageViewTrackerProps> = ({
  pageId,
  pageCategory = 'other',
  metadata = {},
  pageTitle,
  enabled = true,
  trackingDelay,
}) => {
  const { trackPageView, config, isInitialized } = useActivityTrackingContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTracked = useRef(false);
  const trackingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isInitialized || hasTracked.current) return;

    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    // Clear any existing timeout
    if (trackingTimeout.current) {
      clearTimeout(trackingTimeout.current);
    }

    const delay = trackingDelay ?? config.pageTrackingDelay;

    trackingTimeout.current = setTimeout(() => {
      const enrichedMetadata = {
        ...metadata,
        pageId: pageId || pathname,
        pageCategory,
        pageTitle: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
        url: currentUrl,
        timestamp: new Date().toISOString(),
        // Browser information
        viewport: typeof window !== 'undefined' ? {
          width: window.innerWidth,
          height: window.innerHeight,
        } : undefined,
        // Search parameters
        searchParams: searchParams.toString() || undefined,
      };

      trackPageView(currentUrl, enrichedMetadata);
      hasTracked.current = true;
    }, delay);

    return () => {
      if (trackingTimeout.current) {
        clearTimeout(trackingTimeout.current);
      }
    };
  }, [
    enabled,
    isInitialized,
    pathname,
    searchParams,
    pageId,
    pageCategory,
    metadata,
    pageTitle,
    trackingDelay,
    config.pageTrackingDelay,
    trackPageView,
  ]);

  // Reset tracking flag when route changes
  useEffect(() => {
    hasTracked.current = false;
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

/**
 * Higher-Order Component for automatic page view tracking
 * 
 * Example usage:
 * ```tsx
 * const TrackedProductPage = withPageViewTracking(ProductPage, {
 *   pageCategory: 'product',
 *   metadata: { section: 'product-detail' }
 * });
 * ```
 */
export function withPageViewTracking<P extends object>(
  Component: React.ComponentType<P>,
  trackerProps: Omit<PageViewTrackerProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <>
        <PageViewTracker {...trackerProps} />
        <Component {...props} />
      </>
    );
  };

  WrappedComponent.displayName = `withPageViewTracking(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for manual page view tracking
 * Use this when you need more control over when page views are tracked
 */
export const usePageViewTracking = () => {
  const { trackPageView, isInitialized } = useActivityTrackingContext();
  const pathname = usePathname();

  const trackCustomPageView = (customMetadata?: Record<string, any>) => {
    if (!isInitialized) return;

    const metadata = {
      ...customMetadata,
      manualTracking: true,
      timestamp: new Date().toISOString(),
    };

    trackPageView(pathname, metadata);
  };

  return {
    trackCustomPageView,
    isInitialized,
  };
}; 