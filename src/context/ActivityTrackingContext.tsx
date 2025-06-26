'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useSessionId } from '@/hooks/useSessionId';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { UserActivityType } from '@/types/analytics';

interface ActivityTrackingConfig {
  enableTracking: boolean;
  enablePageTracking: boolean;
  enableScrollTracking: boolean;
  enableTimeTracking: boolean;
  pageTrackingDelay: number; // Delay before tracking page view (ms)
  scrollThresholds: number[]; // Scroll depth percentages to track
  timeTrackingInterval: number; // Interval for time tracking (ms)
}

interface ActivityTrackingContextType {
  config: ActivityTrackingConfig;
  isInitialized: boolean;
  updateConfig: (newConfig: Partial<ActivityTrackingConfig>) => void;
  trackPageView: (url?: string, metadata?: Record<string, any>) => void;
  trackPageExit: (timeSpent?: number) => void;
}

const defaultConfig: ActivityTrackingConfig = {
  enableTracking: true,
  enablePageTracking: true,
  enableScrollTracking: true,
  enableTimeTracking: true,
  pageTrackingDelay: 500, // Wait 500ms before tracking to avoid rapid navigation
  scrollThresholds: [25, 50, 75, 90], // Track at 25%, 50%, 75%, 90% scroll
  timeTrackingInterval: 30000, // Track time every 30 seconds
};

const ActivityTrackingContext = createContext<ActivityTrackingContextType | undefined>(undefined);

export const useActivityTrackingContext = () => {
  const context = useContext(ActivityTrackingContext);
  if (!context) {
    throw new Error('useActivityTrackingContext must be used within ActivityTrackingProvider');
  }
  return context;
};

interface ActivityTrackingProviderProps {
  children: React.ReactNode;
  config?: Partial<ActivityTrackingConfig>;
}

export const ActivityTrackingProvider: React.FC<ActivityTrackingProviderProps> = ({
  children,
  config: initialConfig = {},
}) => {
  const [config, setConfig] = useState<ActivityTrackingConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();
  const sessionId = useSessionId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Use the activity tracking hook for actual tracking
  const {
    trackPageView: baseTrackPageView,
    trackActivity,
  } = useActivityTracking({
    enableBatching: true,
    batchSize: 8,
    batchTimeoutMs: 3000,
  });

  // Page tracking state
  const pageStartTime = useRef<number>(Date.now());
  const scrollThresholdsTracked = useRef<Set<number>>(new Set());
  const timeTrackingInterval = useRef<NodeJS.Timeout | null>(null);
  const pageTrackingTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTrackedUrl = useRef<string>('');

  // Initialize tracking when session is ready
  useEffect(() => {
    if (sessionId && config.enableTracking) {
      setIsInitialized(true);
    }
  }, [sessionId, config.enableTracking]);

  // Track page changes
  useEffect(() => {
    if (!isInitialized || !config.enablePageTracking) return;

    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    // Avoid tracking the same URL repeatedly
    if (lastTrackedUrl.current === currentUrl) return;
    
    // Clear any pending page tracking
    if (pageTrackingTimeout.current) {
      clearTimeout(pageTrackingTimeout.current);
    }

    // Track previous page exit if there was one
    if (lastTrackedUrl.current) {
      trackPageExit(Date.now() - pageStartTime.current);
    }

    // Reset tracking state for new page
    pageStartTime.current = Date.now();
    scrollThresholdsTracked.current.clear();
    lastTrackedUrl.current = currentUrl;

    // Delay page view tracking to avoid rapid navigation
    pageTrackingTimeout.current = setTimeout(() => {
      trackPageView(currentUrl, {
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
      });
    }, config.pageTrackingDelay);

    return () => {
      if (pageTrackingTimeout.current) {
        clearTimeout(pageTrackingTimeout.current);
      }
    };
  }, [pathname, searchParams, isInitialized, config.enablePageTracking, config.pageTrackingDelay]);

  // Set up scroll tracking
  useEffect(() => {
    if (!isInitialized || !config.enableScrollTracking || typeof window === 'undefined') {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

          // Track scroll thresholds
          config.scrollThresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !scrollThresholdsTracked.current.has(threshold)) {
              scrollThresholdsTracked.current.add(threshold);
              trackActivity(UserActivityType.PAGE_VIEW, {
                metadata: {
                  scrollDepth: threshold,
                  actualScrollPercent: scrollPercent,
                  pageUrl: pathname,
                }
              });
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInitialized, config.enableScrollTracking, config.scrollThresholds, pathname, trackActivity]);

  // Set up time tracking
  useEffect(() => {
    if (!isInitialized || !config.enableTimeTracking) return;

    timeTrackingInterval.current = setInterval(() => {
      const timeSpent = Date.now() - pageStartTime.current;
      trackActivity(UserActivityType.PAGE_VIEW, {
        duration: Math.round(timeSpent / 1000), // Convert to seconds
        metadata: {
          timeTracking: true,
          pageUrl: pathname,
        }
      });
    }, config.timeTrackingInterval);

    return () => {
      if (timeTrackingInterval.current) {
        clearInterval(timeTrackingInterval.current);
      }
    };
  }, [isInitialized, config.enableTimeTracking, config.timeTrackingInterval, pathname, trackActivity]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeTrackingInterval.current) {
        clearInterval(timeTrackingInterval.current);
      }
      if (pageTrackingTimeout.current) {
        clearTimeout(pageTrackingTimeout.current);
      }
      // Track final page exit
      if (lastTrackedUrl.current) {
        trackPageExit(Date.now() - pageStartTime.current);
      }
    };
  }, []);

  const updateConfig = (newConfig: Partial<ActivityTrackingConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const trackPageView = (url?: string, metadata?: Record<string, any>) => {
    if (!isInitialized) return;
    
    const pageUrl = url || pathname;
    baseTrackPageView(pageUrl);
    
    // Track additional metadata if provided
    if (metadata) {
      trackActivity(UserActivityType.PAGE_VIEW, {
        pageUrl,
        metadata: {
          ...metadata,
          userId: user?.id,
          sessionId,
        }
      });
    }
  };

  const trackPageExit = (timeSpent?: number) => {
    if (!isInitialized) return;

    trackActivity(UserActivityType.PAGE_VIEW, {
      pageUrl: lastTrackedUrl.current,
      duration: timeSpent ? Math.round(timeSpent / 1000) : undefined,
      metadata: {
        pageExit: true,
        finalScrollDepth: Math.max(...Array.from(scrollThresholdsTracked.current), 0),
      }
    });
  };

  const contextValue: ActivityTrackingContextType = {
    config,
    isInitialized,
    updateConfig,
    trackPageView,
    trackPageExit,
  };

  return (
    <ActivityTrackingContext.Provider value={contextValue}>
      {children}
    </ActivityTrackingContext.Provider>
  );
}; 