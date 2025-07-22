// API Types (moved from lib/api/products-api.ts)
export interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  currency: string;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ApiProductImage[];
  brand?: ApiBrand;
  category?: ApiCategory;
  subCategory?: ApiCategory;
  tags?: ApiTag[];
  variants?: ApiProductVariant[];
  specifications?: ApiProductSpecification[];
  features?: string[];
  highlights?: string[];
  discount?: number;
  name?: string;
  imageSrc?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  position: number;
}

export interface ApiProductVariant {
  id: string;
  variantName: string;
  sku: string;
  price: number;
  stockQuantity: number;
  additionalPrice: number;
}

export interface ApiProductSpecification {
  id: string;
  name: string;
  value: string;
  group?: string;
}

export interface ApiBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
}

export interface ApiTag {
  id: string;
  name: string;
}

export interface ApiProductReview {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  userName: string;
  userImage?: string;
  createdAt: string;
}



export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'popularity' | 'rating' | 'newest';
  sortDirection?: 'asc' | 'desc';
  featured?: boolean;
}

export interface ApiProductListResponse {
  products: ApiProduct[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  // Additional properties for backend API compatibility
  data?: ApiProduct[];
  total?: number;
}

// Original types already in the file
export type ColorVariant = {
  id: string;
  color: string;
  hex: string;
  image: string;
};

export type Specification = {
  specKey: string;
  specValue: string;
};

export type SpecificationGroup = {
  title: string;
  specs: Specification[];
};

export type ProductReview = {
  id: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
};

export type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  discount?: string;
  discountPercentage?: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  isAssured: boolean;
  badges?: string[];
  images: string[];
  colorVariants?: ColorVariant[];
  specificationGroups: SpecificationGroup[];
  highlights: string[];
  deliveryInfo?: string;
  hasFreeDel: boolean;
  replacementDays?: number;
  warranty?: string;
  sellerName: string;
  sellerRating?: number;
  exchangeOffer?: { available: boolean; maxDiscount: number };
  bankOffers?: string[];
  emiOptions?: boolean;
  reviews: ProductReview[];
  relatedProducts?: string[];
  faq?: { question: string; answer: string }[];
  categories?: { id: string; name: string; slug: string }[];
  currency?: string;
};

/**
 * Parameters for filtering and paginating products
 */
export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  tags?: string[];
  inStock?: boolean;
}

/**
 * Parameters for getting products by category using the enhanced API
 */
export interface CategoryProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
}

/**
 * API response for paginated product listings
 */
export interface ProductListResponse {
  data: ProductDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Category hierarchy used in recursive products API
 */
export interface CategoryHierarchy {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  children: CategoryHierarchy[];
}

/**
 * Pagination information for recursive products API
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  sortBy: string;
  sortOrder: string;
}

/**
 * Filter information for recursive products API
 */
export interface FilterInfo {
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
}

/**
 * API response for recursive category products
 */
export interface RecursiveCategoryProductsData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  products: ProductDetail[];
  categories: CategoryHierarchy;
  pagination: PaginationInfo;
  filters: FilterInfo;
}

/**
 * Complete API response for recursive category products
 */
export interface RecursiveCategoryProductsResponse {
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    data: RecursiveCategoryProductsData;
  };
  timestamp: string;
  path: string;
}

// Type aliases for backward compatibility
export type Product = ApiProduct;
export type ProductImage = ApiProductImage;
export type ProductVariant = ApiProductVariant;
export type ProductSpecification = ApiProductSpecification;
export type Brand = ApiBrand;
export type Category = ApiCategory;
export type Tag = ApiTag; 