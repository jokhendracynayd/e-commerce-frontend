// API base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.allmart.fashion/api/v1';
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Centralized endpoint definitions for the e-commerce frontend API
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    DETAIL: (id: string) => `/users/${id}`,
    ADDRESSES: '/users/me/addresses',
    ADDRESS_DETAIL: (id: string) => `/users/me/addresses/${id}`,
    ADD_ADDRESS: '/users/me/addresses',
    UPDATE_ADDRESS: (id: string) => `/users/me/addresses/${id}`,
    DELETE_ADDRESS: (id: string) => `/users/me/addresses/${id}`,
    SET_DEFAULT_ADDRESS: (id: string) => `/users/me/addresses/${id}/default`,
  },
  
  PRODUCTS: {
    BASE: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    SEARCH: '/products/search',
    TRENDING: '/products/trending',
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
    RELATED: (id: string) => `/products/${id}/related`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    ADD_REVIEW: (id: string) => `/products/${id}/reviews`,
    SPECIFICATIONS: (id: string) => `/products/${id}/specifications`,
  },
  
  SPECIFICATIONS: {
    PRODUCT: {
      GET_BY_PRODUCT: (productId: string) => `/specifications/product/${productId}`,
      GET_GROUPED: (productId: string) => `/specifications/product/${productId}/grouped`,
    },
  },

  CATEGORIES: {
    BASE: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    TREE: '/categories/tree',
    PRODUCTS: (id: string) => `/categories/${id}/products`,
    RECURSIVE_PRODUCTS: (id: string) => `/categories/${id}/recursive-products`,
  },
  
  BRANDS: {
    BASE: '/brands',
    DETAIL: (id: string) => `/brands/${id}`,
    BY_SLUG: (slug: string) => `/brands/slug/${slug}`,
    PRODUCTS: (id: string) => `/brands/${id}/products`,
  },
  
  CART: {
    GET: '/carts/my-cart',
    ADD_ITEM: '/carts/add-item',
    UPDATE_ITEM: (itemId: string) => `/carts/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/carts/items/${itemId}`,
    CLEAR: '/carts/clear',
    MERGE: '/carts/merge-anonymous',
  },
  
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    DETAIL: (id: string) => `/orders/${id}`,
    BY_NUMBER: (orderNumber: string) => `/orders/by-number/${orderNumber}`,
    CREATE: '/orders',
    CREATE_USER_ORDER: '/orders/user-order',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    CANCEL_MY_ORDER: (id: string) => `/orders/my-orders/${id}/cancel`,
  },
  
  WISHLIST: {
    BASE: '/wishlist',
    COUNT: '/wishlist/count',
    ADD: '/wishlist/add',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
    CHECK: (productId: string) => `/wishlist/check/${productId}`,
  },
  
  COUPONS: {
    VALIDATE: '/coupons/validate',
    APPLY: '/coupons/apply',
  },
  
  DEALS: {
    FLASH: '/deals/flash',
    TRENDING: '/deals/trending',
    DEAL_OF_DAY: '/deals/of-the-day',
    BY_TYPE: {
      TRENDING: '/deals/types/TRENDING/products',
      FLASH: '/deals/types/FLASH/products',
      DEAL_OF_DAY: '/deals/types/DEAL_OF_DAY/products',
    }
  },
  
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    VERIFY: '/payments/verify',
    STATUS: (paymentId: string) => `/payments/${paymentId}/status`,
    REFUND: (paymentId: string) => `/payments/${paymentId}/refund`,
    UPI: {
      GENERATE: '/payments/upi/generate',
      STATUS: (transactionId: string) => `/payments/upi/status/${transactionId}`,
      VERIFY: '/payments/upi/verify',
      QR: '/payments/upi/qr-code',
    },
  },
  
  REVIEWS: {
    BASE: '/reviews',
    DETAIL: (id: string) => `/reviews/${id}`,
    MY_REVIEWS: '/reviews/my-reviews',
    ELIGIBLE_PRODUCTS: '/reviews/eligible-products',
    CAN_REVIEW: (orderId: string, productId: string) => `/reviews/can-review/${orderId}/${productId}`,
    PRODUCT_STATS: (productId: string) => `/reviews/products/${productId}/stats`,
    CREATE: '/reviews',
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },

  INVENTORY: {
    PRODUCT_AVAILABILITY: (productId: string) => `/inventory/availability/product/${productId}`,
    VARIANT_AVAILABILITY: (variantId: string) => `/inventory/availability/variant/${variantId}`,
    BATCH_AVAILABILITY: '/inventory/availability/batch',
  },

  ANALYTICS: {
    TRACK_ACTIVITY: '/analytics/activity',
    TRACK_BATCH: '/analytics/batch',
    BROWSING_HISTORY: '/analytics/history',
    USER_ACTIVITIES: '/analytics/activities',
    MARK_CONVERSION: '/analytics/conversion',
  },

  RECOMMENDATIONS: {
    RECENTLY_VIEWED: '/recommendations/recently-viewed',
    TRENDING: '/recommendations/trending',
  },
}; 