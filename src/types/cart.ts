import { ProductDetail, ColorVariant } from './product';
import { Product, ProductVariant } from '@/lib/api/products-api';

/**
 * Cart item used in the CartContext - this is the internal representation for UI
 */
export interface ContextCartItem {
  product: ProductDetail;
  quantity: number;
  selectedColor?: ColorVariant;
}

/**
 * Cart item from the API response
 */
export interface ApiCartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    imageUrl: string | null;
  };
  variant?: {
    id: string;
    variantName: string;
    price: number;
    sku: string;
  } | null;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  productId?: string;
  variantId?: string | null;
  additionalInfo?: any;
}

/**
 * Cart item with rich product details for UI rendering
 */
export interface CartItemWithProduct {
  id: string;
  productId: string;
  product: ProductDetail;
  quantity: number;
  productVariantId?: string;
  selectedColor?: ColorVariant;
  additionalInfo?: any;
}

/**
 * Applied coupon information
 */
export interface AppliedCoupon {
  id: string;
  code: string;
  discountAmount: number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  message?: string;
}

/**
 * Cart object from the API response
 */
export interface ApiCart {
  id: string;
  userId: string;
  items: ApiCartItem[];
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  appliedCoupon?: AppliedCoupon;
}

/**
 * Cart summary for order calculation
 */
export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

/**
 * Request to add an item to the cart
 */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variantId?: string;
  additionalInfo?: any;
}

/**
 * Request to update a cart item's quantity
 */
export interface UpdateCartItemRequest {
  quantity: number;
}

/**
 * Request to merge anonymous cart with user cart
 */
export interface MergeCartRequest {
  items: {
    productId: string;
    quantity: number;
    variantId?: string;
    additionalInfo?: any;
  }[];
}
