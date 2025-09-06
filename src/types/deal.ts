// Deal Types for E-commerce Frontend
export interface Deal {
  id: string;
  title: string;
  description?: string;
  type: DealType;
  status: DealStatus;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products?: ProductDeal[];
  limits?: DealLimits;
  stats?: DealStats;
}

export interface ProductDeal {
  id: string;
  dealId: string;
  productId: string;
  product?: Product;
  deal?: Deal;
  createdAt: string;
  updatedAt: string;
}

export interface DealUsage {
  id: string;
  productDealId: string;
  productId: string;
  userId: string;
  orderId?: string;
  usedAt: string;
  productDeal?: ProductDeal;
  product?: Product;
  user?: User;
  order?: Order;
}

export interface DealLimits {
  id: string;
  productDealId: string;
  maxTotalUsage?: number;
  maxUserUsage?: number;
  currentUsage: number;
  createdAt: string;
  updatedAt: string;
}

export interface DealStats {
  totalUsage: number;
  uniqueUsers: number;
  totalRevenue: number;
  conversionRate: number;
  limits?: {
    maxTotalUsage?: number;
    maxUserUsage?: number;
    currentUsage: number;
  };
}

export interface ApplyDealRequest {
  userId: string;
  productIds: string[];
  orderValue?: number;
}

export interface ApplyDealResponse {
  success: boolean;
  discountAmount: number;
  finalAmount: number;
  message: string;
  dealId: string;
}

export interface DealLimitsRequest {
  maxTotalUsage?: number;
  maxUserUsage?: number;
}

export interface AddProductValidationRequest {
  productIds: string[];
  validateStock?: boolean;
  validateAvailability?: boolean;
}

// Enums
export enum DealType {
  FLASH = 'FLASH',
  TRENDING = 'TRENDING',
  DEAL_OF_DAY = 'DEAL_OF_DAY',
  SEASONAL = 'SEASONAL',
  CLEARANCE = 'CLEARANCE',
}

export enum DealStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  UPCOMING = 'UPCOMING',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

// Deal Filter Types
export interface DealFilters {
  type?: DealType[];
  status?: DealStatus[];
  discountType?: DiscountType[];
  minDiscount?: number;
  maxDiscount?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Deal Sort Options
export enum DealSortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  HIGHEST_DISCOUNT = 'highest_discount',
  LOWEST_DISCOUNT = 'lowest_discount',
  MOST_POPULAR = 'most_popular',
  ENDING_SOON = 'ending_soon',
}

// Deal Timer Props
export interface DealTimerProps {
  endDate: string;
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

// Deal Card Props
export interface DealCardProps {
  deal: any; // Can be Deal or Product with deal info
  variant?: 'default' | 'compact' | 'featured';
  showTimer?: boolean;
  showStats?: boolean;
  onApply?: (dealId: string) => void;
  onDealClick?: (deal: any) => void;
  className?: string;
}

// Deal Grid Props
export interface DealGridProps {
  deals: any[]; // Can be Deal[] or Product[] with deal info
  loading?: boolean;
  error?: string;
  onDealClick?: (deal: any) => void;
  onApplyDeal?: (dealId: string) => void;
  className?: string;
}

// Deal Filters Props
export interface DealFiltersProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  sortOption: DealSortOption;
  onSortChange: (sort: DealSortOption) => void;
  className?: string;
}

// Deal Stats Props
export interface DealStatsProps {
  stats: DealStats;
  className?: string;
}

// Deal Usage Props
export interface DealUsageProps {
  usage: DealUsage[];
  loading?: boolean;
  className?: string;
}

// Import related types
import { Product } from './product';
import { User } from './user';
import { OrderResponse as Order } from './order';
