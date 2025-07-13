// Export API endpoints
export * from './endpoints';

// Export error handling utilities
export * from './error-handler';

// Export auth-related functions and types
export * from './auth-api';

// Export product-related functions and types
export * from './products-api';

// Export cart-related functions and types
export * from './cart-api';

// Export order-related functions and types
export * from './orders-api';

// Export core Axios client and authentication utilities
export {
  axiosClient,
  setAuthToken,
  setUserId,
  clearAuthToken,
  clearAllTokens,
  isAuthenticated,
  getAuthState,
  AUTH_EVENTS
} from './axios-client';

// Export user-related functions and types
export * from './user-api';

// Export category-related functions and types
export * from './categories-api';

// Export wishlist-related functions and types
export * from './wishlist-api';

// Export recommendations-related functions and types
export * from './recommendations-api';

// Default export of all API services
import authApi from './auth-api';
import productsApi from './products-api';
import cartApi from './cart-api';
import ordersApi from './orders-api';
import userApi from './user-api';
import categoriesApi from './categories-api';
import wishlistApi from './wishlist-api';

const api = {
  auth: authApi,
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  user: userApi,
  categories: categoriesApi,
  wishlist: wishlistApi,
};

export default api; 