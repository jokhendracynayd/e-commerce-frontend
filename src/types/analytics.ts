// Analytics Types - Following the backend implementation
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
  COUPON_APPLIED = 'COUPON_APPLIED'
}

export interface CreateUserActivityDto {
  activityType: UserActivityType;
  sessionId: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  pageUrl?: string;
  deviceType?: string;
  duration?: number;
  referrer?: string;
}

export interface CreateBatchActivityDto {
  activities: CreateUserActivityDto[];
}

export interface UserActivityResponseDto {
  id: string;
  userId?: string;
  sessionId: string;
  activityType: UserActivityType;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  pageUrl?: string;
  deviceType?: string;
  duration?: number;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface BrowsingHistoryResponseDto {
  id: string;
  productId: string;
  viewedAt: string;
  lastViewedAt: string;
  viewCount: number;
  timeSpent?: number;
  source?: string;
  deviceType?: string;
  conversion?: boolean;
  product?: {
    id: string;
    title: string;
    price: number;
    discountPrice?: number;
    images: string[];
    slug: string;
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
    brand?: {
      id: string;
      name: string;
    };
    category?: {
      id: string;
      name: string;
    };
  };
} 