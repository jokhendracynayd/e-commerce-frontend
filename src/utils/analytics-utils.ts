/**
 * Analytics utility functions
 * Handles session management, device detection, and other analytics helpers
 */

import { DeviceType } from '../types/analytics';

// Constants
export const ANALYTICS_CONFIG = {
  SESSION_STORAGE_KEY: 'analytics_session_id',
  USER_ID_STORAGE_KEY: 'analytics_user_id',
  DEFAULT_BATCH_SIZE: 10,
  DEFAULT_FLUSH_INTERVAL: 30000, // 30 seconds
  SESSION_EXPIRY_HOURS: 24,
} as const;

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `sess_${timestamp}_${randomStr}`;
}

/**
 * Get or create session ID from storage
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId();
  }

  try {
    const stored = sessionStorage.getItem(ANALYTICS_CONFIG.SESSION_STORAGE_KEY);
    if (stored) {
      // Validate session ID format
      if (stored.startsWith('sess_') && stored.length > 10) {
        return stored;
      }
    }
  } catch (error) {
    console.warn('Failed to retrieve session ID from storage:', error);
  }

  // Generate new session ID
  const newSessionId = generateSessionId();
  setSessionId(newSessionId);
  return newSessionId;
}

/**
 * Set session ID in storage
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(ANALYTICS_CONFIG.SESSION_STORAGE_KEY, sessionId);
  } catch (error) {
    console.warn('Failed to store session ID:', error);
  }
}

/**
 * Clear session ID from storage
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(ANALYTICS_CONFIG.SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear session ID:', error);
  }
}

/**
 * Get user ID from storage (when user is logged in)
 */
export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(ANALYTICS_CONFIG.USER_ID_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to retrieve user ID from storage:', error);
    return null;
  }
}

/**
 * Set user ID in storage
 */
export function setStoredUserId(userId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ANALYTICS_CONFIG.USER_ID_STORAGE_KEY, userId);
  } catch (error) {
    console.warn('Failed to store user ID:', error);
  }
}

/**
 * Clear user ID from storage
 */
export function clearStoredUserId(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(ANALYTICS_CONFIG.USER_ID_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear user ID:', error);
  }
}

/**
 * Detect device type based on user agent and screen size
 */
export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'unknown';

  try {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.screen.width;

    // Mobile devices
    if (/android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    }

    // Tablets
    if (/ipad|tablet|(android(?!.*mobile))|kindle|silk/i.test(userAgent)) {
      return 'tablet';
    }

    // Screen size based detection
    if (screenWidth <= 768) {
      return 'mobile';
    } else if (screenWidth <= 1024) {
      return 'tablet';
    }

    // Desktop
    return 'desktop';
  } catch (error) {
    console.warn('Failed to detect device type:', error);
    return 'unknown';
  }
}

/**
 * Get current page URL
 */
export function getCurrentPageUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname + window.location.search;
}

/**
 * Get referrer URL
 */
export function getReferrerUrl(): string {
  if (typeof window === 'undefined') return '';
  return document.referrer || '';
}

/**
 * Debounce function for batching analytics events
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttle function for limiting event frequency
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Calculate page duration
 */
export function calculatePageDuration(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

/**
 * Sanitize metadata to remove sensitive information
 */
export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const sanitized = { ...metadata };
  
  // Remove potentially sensitive fields
  const sensitiveFields = [
    'password',
    'token',
    'authorization',
    'auth',
    'secret',
    'key',
    'email',
    'phone',
    'address',
    'payment',
    'card',
    'cvv',
    'ssn',
  ];
  
  function removeSensitive(obj: any, path = ''): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map((item, index) => removeSensitive(item, `${path}[${index}]`));
    }
    
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      const lowerKey = key.toLowerCase();
      
      // Check if key contains sensitive information
      const isSensitive = sensitiveFields.some(field => 
        lowerKey.includes(field) || fullPath.toLowerCase().includes(field)
      );
      
      if (isSensitive) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = removeSensitive(value, fullPath);
      }
    }
    
    return cleaned;
  }
  
  return removeSensitive(sanitized);
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  return typeof sessionId === 'string' && 
         sessionId.startsWith('sess_') && 
         sessionId.length >= 15 && 
         sessionId.length <= 100;
}

/**
 * Create analytics headers for API requests
 */
export function createAnalyticsHeaders(userId?: string, sessionId?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (sessionId && isValidSessionId(sessionId)) {
    headers['X-Session-ID'] = sessionId;
  }
  
  if (userId) {
    headers['X-User-ID'] = userId;
  }
  
  return headers;
}

/**
 * Extract product information from URL or pathname
 */
export function extractProductInfoFromUrl(url: string): { productId?: string; productSlug?: string } {
  try {
    // Match patterns like /product/[id] or /products/[slug]
    const productIdMatch = url.match(/\/product\/([a-f0-9-]{36})/i);
    const productSlugMatch = url.match(/\/products\/([^/?]+)/i);
    
    return {
      productId: productIdMatch ? productIdMatch[1] : undefined,
      productSlug: productSlugMatch ? productSlugMatch[1] : undefined,
    };
  } catch (error) {
    console.warn('Failed to extract product info from URL:', error);
    return {};
  }
}

/**
 * Extract category information from URL
 */
export function extractCategoryInfoFromUrl(url: string): { categoryId?: string; categorySlug?: string } {
  try {
    // Match patterns like /category/[id] or /categories/[slug]
    const categoryIdMatch = url.match(/\/category\/([a-f0-9-]{36})/i);
    const categorySlugMatch = url.match(/\/categories\/([^/?]+)/i);
    
    return {
      categoryId: categoryIdMatch ? categoryIdMatch[1] : undefined,
      categorySlug: categorySlugMatch ? categorySlugMatch[1] : undefined,
    };
  } catch (error) {
    console.warn('Failed to extract category info from URL:', error);
    return {};
  }
}

/**
 * Extract brand information from URL
 */
export function extractBrandInfoFromUrl(url: string): { brandId?: string; brandSlug?: string } {
  try {
    // Match patterns like /brand/[id] or /brands/[slug]
    const brandIdMatch = url.match(/\/brand\/([a-f0-9-]{36})/i);
    const brandSlugMatch = url.match(/\/brands\/([^/?]+)/i);
    
    return {
      brandId: brandIdMatch ? brandIdMatch[1] : undefined,
      brandSlug: brandSlugMatch ? brandSlugMatch[1] : undefined,
    };
  } catch (error) {
    console.warn('Failed to extract brand info from URL:', error);
    return {};
  }
}

/**
 * Get search query from URL
 */
export function extractSearchQueryFromUrl(url: string): string | undefined {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || undefined;
  } catch (error) {
    console.warn('Failed to extract search query from URL:', error);
    return undefined;
  }
}

/**
 * Format timestamp for analytics
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Check if analytics should be enabled (privacy, consent, etc.)
 */
export function shouldEnableAnalytics(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check for Do Not Track
    if (navigator.doNotTrack === '1') {
      return false;
    }
    
    // Check for consent (can be extended with proper consent management)
    const consent = localStorage.getItem('analytics_consent');
    if (consent === 'false') {
      return false;
    }
    
    // Check for development environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    const enableInDev = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV === 'true';
    
    if (isDevelopment && !enableInDev) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Failed to check analytics enablement:', error);
    return false;
  }
} 