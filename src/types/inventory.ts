// Types for inventory responses
export interface ProductAvailability {
  productId: string;
  availableQuantity: number;
  stockStatus: string; // "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"
  updatedAt: Date;
}

export interface VariantAvailability {
  productId: string;
  variantId: string;
  availableQuantity: number;
  stockStatus: string; // "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"
  updatedAt: Date;
}

export interface BatchAvailabilityRequest {
  productIds?: string[];
  variantIds?: string[];
}

export interface BatchAvailabilityResponse {
  products: ProductAvailability[];
  variants: VariantAvailability[];
} 