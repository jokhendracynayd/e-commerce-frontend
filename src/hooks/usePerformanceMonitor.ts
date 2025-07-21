'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  slowRenders: number;
}

interface UsePerformanceMonitorOptions {
  name: string;
  slowThreshold?: number; // ms
  enabled?: boolean;
}

/**
 * Hook to monitor component performance and detect expensive re-renders
 */
export function usePerformanceMonitor({ 
  name, 
  slowThreshold = 16, // 16ms = 60fps threshold
  enabled = process.env.NODE_ENV === 'development' 
}: UsePerformanceMonitorOptions): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowRenders: 0
  });

  const renderStartTime = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);
  const lastPropsRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Mark render start
    renderStartTime.current = performance.now();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    // Store render time (keep last 10 for average calculation)
    renderTimes.current.push(renderTime);
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    const isSlowRender = renderTime > slowThreshold;

    setMetrics(prev => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime,
      slowRenders: prev.slowRenders + (isSlowRender ? 1 : 0)
    }));

    // Log performance warnings in development
    if (isSlowRender) {
      console.warn(`🐌 Slow render detected in ${name}: ${renderTime.toFixed(2)}ms (threshold: ${slowThreshold}ms)`);
    }

    // Log render count milestones
    if (metrics.renderCount > 0 && metrics.renderCount % 100 === 0) {
      console.info(`📊 ${name} performance summary:`, {
        renders: metrics.renderCount,
        averageTime: `${averageRenderTime.toFixed(2)}ms`,
        slowRenders: metrics.slowRenders,
        slowRenderPercentage: `${((metrics.slowRenders / metrics.renderCount) * 100).toFixed(1)}%`
      });
    }
  }, [enabled, name, slowThreshold, metrics.renderCount, metrics.slowRenders]);

  return metrics;
}

/**
 * Hook to detect unnecessary re-renders by comparing props
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({...previousProps.current, ...props});
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log(`🔄 ${name} re-rendered due to:`, changedProps);
      }
    }

    previousProps.current = props;
  }, [name, props]);
}

/**
 * Hook to measure component mount time
 */
export function useMountTime(name: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const mountTime = performance.now() - startTime;
      if (mountTime > 100) { // Log if mount takes more than 100ms
        console.warn(`⏱️ ${name} took ${mountTime.toFixed(2)}ms to mount`);
      }
    };
  }, [name]);
} 