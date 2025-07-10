/**
 * Core category interfaces for the e-commerce application
 */

import { ColorVariant } from './product';

/**
 * Represents a category in the hierarchical category structure
 */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  children?: CategoryNode[];
}

/**
 * API response structure for category endpoints
 */
export interface CategoryResponse {
  statusCode: number;
  message: string;
  data: CategoryNode[];
  timestamp: string;
  path: string;
}

/**
 * Parameters for filtering and paginating category lists
 */
export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Represents a simple category reference (used in products, etc)
 */
export interface CategoryReference {
  id: string;
  name: string;
  slug: string;
}



/**
 * Exchange offer interface
 */
export interface ExchangeOffer {
  available: boolean;
  maxDiscount: number;
  terms?: string;
  brands?: string[];
}

/**
 * Bank offer interface
 */
export interface BankOffer {
  available: boolean;
  discount: number;
  bankName?: string;
  terms?: string;
  validUntil?: string;
}

/**
 * Product type for category product listings - Enhanced with ProductCard features
 */
export interface CategoryProductType {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  link: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  currency?: string;
  isAssured?: boolean;
  deliveryInfo?: string;
  hasFreeDel: boolean;
  discount?: string;
  
  // Enhanced fields for ProductCard
  subtitle?: string;
  colorVariants?: ColorVariant[];
  bankOffer?: BankOffer;
  exchangeOffer?: ExchangeOffer;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSponsored?: boolean;
  sponsoredTag?: boolean;
  isLimitedDeal?: boolean;
}

/**
 * Category with associated products for display
 */
export interface CategoryWithProducts {
  id: string;
  title: string;
  products: CategoryProductType[];
  viewAllLink?: string;
} 