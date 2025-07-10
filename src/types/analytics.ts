/**
 * Analytics types for user activity tracking
 * Matches backend DTOs and Prisma enums
 */

// User Activity Types enum matching backend
export enum UserActivityType {
  PAGE_VIEW = 'PAGE_VIEW',
  PRODUCT_VIEW = 'PRODUCT_VIEW',
  CATEGORY_VIEW = 'CATEGORY_VIEW',
  BRAND_VIEW = 'BRAND_VIEW',
  SEARCH = 'SEARCH',
  FILTER_USE = 'FILTER_USE',
  SORT_USE = 'SORT_USE',
  PAGINATION = 'PAGINATION',
  ADD_TO_CART = 'ADD_TO_CART',
  REMOVE_FROM_CART = 'REMOVE_FROM_CART',
  ADD_TO_WISHLIST = 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST',
  CHECKOUT_START = 'CHECKOUT_START',
  CHECKOUT_STEP = 'CHECKOUT_STEP',
  CHECKOUT_COMPLETE = 'CHECKOUT_COMPLETE',
  PRODUCT_CLICK = 'PRODUCT_CLICK',
  PRODUCT_SHARE = 'PRODUCT_SHARE',
  REVIEW_SUBMITTED = 'REVIEW_SUBMITTED',
  COUPON_APPLIED = 'COUPON_APPLIED',
}

// Device Types
export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'unknown';

// Entity Types
export type EntityType = 'product' | 'category' | 'brand' | 'search' | 'order' | 'coupon' | 'review';

/**
 * Create User Activity DTO - matches backend CreateUserActivityDto
 */
export interface CreateUserActivityDto {
  activityType: UserActivityType;
  sessionId: string;
  entityId?: string;
  entityType?: EntityType;
  metadata?: Record<string, any>;
  pageUrl?: string;
  deviceType?: DeviceType;
  duration?: number;
  referrer?: string;
}

/**
 * Create Batch Activity DTO - matches backend CreateBatchActivityDto
 */
export interface CreateBatchActivityDto {
  activities: CreateUserActivityDto[];
}

/**
 * User Activity Response DTO - matches backend UserActivityResponseDto
 */
export interface UserActivityResponseDto {
  id: string;
  userId?: string;
  sessionId: string;
  activityType: UserActivityType;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  pageUrl?: string;
  deviceType?: string;
  duration?: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Browsing History Response DTO - matches backend BrowsingHistoryResponseDto
 */
export interface BrowsingHistoryResponseDto {
  id: string;
  userId?: string;
  sessionId: string;
  productId: string;
  viewedAt: string;
  lastViewedAt: string;
  viewCount: number;
  timeSpent?: number;
  source?: string;
  deviceType?: string;
  conversion: boolean;
  conversionAt?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number;
    images: Array<{
      imageUrl: string;
      altText?: string;
    }>;
  };
}

/**
 * Analytics API Response types
 */
export interface TrackActivityResponse {
  success: boolean;
  data?: UserActivityResponseDto;
  message?: string;
}

export interface TrackBatchActivityResponse {
  success: boolean;
  count: number;
  message: string;
}

export interface GetBrowsingHistoryResponse {
  success: boolean;
  data: BrowsingHistoryResponseDto[];
  message?: string;
}

export interface GetUserActivitiesResponse {
  success: boolean;
  data: UserActivityResponseDto[];
  message?: string;
}

export interface MarkConversionResponse {
  success: boolean;
  message: string;
}

/**
 * Frontend-specific analytics interfaces
 */

// Analytics context state
export interface AnalyticsState {
  sessionId: string;
  userId?: string;
  deviceType: DeviceType;
  isInitialized: boolean;
  pendingActivities: CreateUserActivityDto[];
  batchSize: number;
  flushInterval: number;
}

// Analytics configuration
export interface AnalyticsConfig {
  batchSize?: number;
  flushInterval?: number;
  enableBatching?: boolean;
  enableDebugLogs?: boolean;
  sessionStorageKey?: string;
}

// Page view tracking data
export interface PageViewData {
  pageUrl: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

// Product interaction data
export interface ProductInteractionData {
  productId: string;
  productSlug?: string;
  productTitle?: string;
  source?: string;
  position?: number;
  metadata?: Record<string, any>;
}

// Search interaction data
export interface SearchInteractionData {
  query: string;
  resultsCount?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  metadata?: Record<string, any>;
}

// Cart interaction data
export interface CartInteractionData {
  productId: string;
  variantId?: string;
  quantity?: number;
  price?: number;
  metadata?: Record<string, any>;
}

// Checkout interaction data
export interface CheckoutInteractionData {
  step?: number;
  stepName?: string;
  orderId?: string;
  totalAmount?: number;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

// Filter interaction data
export interface FilterInteractionData {
  filterType: string;
  filterValue: string | string[];
  activeFilters?: Record<string, any>;
  resultsCount?: number;
  metadata?: Record<string, any>;
}

// Analytics event data union type
export type AnalyticsEventData = 
  | PageViewData
  | ProductInteractionData
  | SearchInteractionData
  | CartInteractionData
  | CheckoutInteractionData
  | FilterInteractionData
  | Record<string, any>;

/**
 * Analytics hook options
 */
export interface UseAnalyticsOptions {
  enableBatching?: boolean;
  batchSize?: number;
  flushInterval?: number;
  enableDebugLogs?: boolean;
}

/**
 * Analytics track function parameters
 */
export interface TrackEventParams {
  activityType: UserActivityType;
  entityId?: string;
  entityType?: EntityType;
  duration?: number;
  metadata?: Record<string, any>;
} 