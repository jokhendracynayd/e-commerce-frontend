// API base URL from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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
    DETAIL: (id: string) => `/users/${id}`,
    ADDRESSES: '/users/addresses',
    ADDRESS_DETAIL: (id: string) => `/users/addresses/${id}`,
    ADD_ADDRESS: '/users/addresses',
    UPDATE_ADDRESS: (id: string) => `/users/addresses/${id}`,
    DELETE_ADDRESS: (id: string) => `/users/addresses/${id}`,
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
  },
  
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    CREATE_USER_ORDER: '/orders/user-order',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    CANCEL_MY_ORDER: (id: string) => `/orders/my-orders/${id}/cancel`,
  },
  
  WISHLIST: {
    BASE: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
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
}; 