import { ProductDetail } from './product';

/**
 * Wishlist item from the API response
 */
export interface ApiWishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    imageUrl: string | null;
  };
}

/**
 * Wishlist item with rich product details for UI rendering
 */
export interface WishlistItemWithProduct {
  id: string;
  productId: string;
  product: ProductDetail;
  addedAt: string;
}

/**
 * Request to add an item to the wishlist
 */
export interface AddToWishlistRequest {
  productId: string;
}

/**
 * Response when adding to wishlist
 */
export interface WishlistAddResponse {
  success: boolean;
  message: string;
  item?: ApiWishlistItem;
}

/**
 * Response when removing from wishlist
 */
export interface WishlistRemoveResponse {
  success: boolean;
  message: string;
}

/**
 * Wishlist response from the API
 */
export interface ApiWishlistResponse {
  items: ApiWishlistItem[];
  total: number;
} 