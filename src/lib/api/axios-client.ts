import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, ENDPOINTS } from './endpoints';
import { handleApiError, logApiError } from './error-handler';

// Token storage - using memory only for security
let accessToken: string | null = null;
let userId: string | null = null;
let tokenExpiry: number | null = null;

// Create custom event for authentication state changes
export const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  TOKEN_REFRESH: 'auth:token_refresh',
  AUTH_ERROR: 'auth:error'
};

// Get CSRF token from cookies
function getCsrfToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Parse cookies to find the CSRF token
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Create the axios instance
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Important: Allow cookies to be sent with requests
  withCredentials: true,
});

// Refresh token promise to prevent multiple refreshes
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper function to decode JWT token and extract payload
function decodeJwtToken(token: string): { exp?: number } {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return {};
  }
}

// Check if token is about to expire (increase buffer time to 5 minutes)
function isTokenExpiringSoon(): boolean {
  if (!accessToken || !tokenExpiry) return true;
  
  const now = Date.now();
  const expiryBufferMs = 300000; // 5 minutes buffer (changed from 60 seconds)
  
  return now + expiryBufferMs >= tokenExpiry;
}

// Subscribe to token refresh
function subscribeToTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Notify subscribers with new token
function notifyRefreshSubscribers(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Function to refresh token with reuse of in-flight request
async function refreshAuthToken(): Promise<string> {
  // If we're already refreshing, return the existing promise
  if (refreshPromise) return refreshPromise;
  
  // Create a new refresh promise
  refreshPromise = new Promise<string>(async (resolve, reject) => {
    try {
      if (!userId) {
        throw new Error('Missing userId for token refresh');
      }
      
      // Make the request with withCredentials to send the HTTP-only refresh cookie
      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true, // Important: Send cookies with the request
        }
      );
      
      // Extract new token and update storage
      const data = response.data.data;
      const newAccessToken = data.accessToken;
      
      // Update the access token
      setAuthToken(newAccessToken);
      
      // Extract token expiry time
      const decodedToken = decodeJwtToken(newAccessToken);
      if (decodedToken.exp) {
        setTokenExpiry(decodedToken.exp * 1000); // Convert seconds to milliseconds
      }
      
      // Dispatch token refresh event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.TOKEN_REFRESH, {
          detail: { accessToken: newAccessToken }
        }));
      }
      
      resolve(newAccessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear tokens on refresh failure with skipEvent=true to prevent loops
      clearAllTokens(true);
      
      // Dispatch logout event
      if (typeof window !== 'undefined') {
        // Use setTimeout to break the synchronous call chain
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
          
          // Also dispatch auth error event with details
          window.dispatchEvent(new CustomEvent(AUTH_EVENTS.AUTH_ERROR, {
            detail: { message: 'Session expired. Please log in again.' }
          }));
        }, 0);
      }
      
      reject(error);
    } finally {
      // Clear the refresh promise
      refreshPromise = null;
    }
  });

  return refreshPromise;
}

// Request interceptor - adds auth token to requests and performs preemptive token refresh
axiosClient.interceptors.request.use(
  async (config) => {
    // Skip token check for auth-related endpoints
    const isAuthEndpoint = config.url && [
      ENDPOINTS.AUTH.LOGIN,
      ENDPOINTS.AUTH.REGISTER,
    ].includes(config.url);
    
    // If we have a token and it's not an auth endpoint, check if token needs refresh
    if (accessToken && !isAuthEndpoint && isTokenExpiringSoon()) {
      try {
        // Attempt to refresh the token
        const newToken = await refreshAuthToken();
        // Update the request with the new token
        if (config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } catch (refreshError) {
        // If refresh fails, continue with current token or without a token
        // The response interceptor will handle 401 errors
      }
    } else if (accessToken && config.headers) {
      // Add current token to request
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Add CSRF token for non-GET requests except for auth endpoints
    if (config.method !== 'get' && config.headers) {
      // These endpoints are exempt from CSRF protection on the server
      const csrfExemptEndpoints = [
        ENDPOINTS.AUTH.LOGIN,
        ENDPOINTS.AUTH.REGISTER,
        ENDPOINTS.AUTH.REFRESH,
        ENDPOINTS.AUTH.LOGOUT,
        ENDPOINTS.CART.MERGE // Make sure merge endpoint is in the exempt list
      ];
      
      // Check if the current URL is exempt
      const isExemptFromCsrf = csrfExemptEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      );
      
      // Only add CSRF token for non-exempt endpoints
      if (!isExemptFromCsrf) {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken;
          if (process.env.NODE_ENV !== 'production') {
            console.log('Added CSRF token to request:', config.url);
          }
        } else {
          console.warn('No CSRF token available for protected request:', config.url);
        }
      } else {
        console.log('Skipping CSRF token for exempt endpoint:', config.url);
      }
    }
    
    // Log request for debugging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!accessToken,
        hasCsrfToken: config.method !== 'get' ? !!config.headers['X-CSRF-TOKEN'] : 'not required'
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh and errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 errors (token expired) with automatic refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== ENDPOINTS.AUTH.REFRESH &&
      userId
    ) {
      originalRequest._retry = true;
      
      try {
        // If we're already refreshing, wait for that to complete
        const newToken = isRefreshing
          ? await new Promise<string>((resolve) => {
              subscribeToTokenRefresh(resolve);
            })
          : await refreshAuthToken();
        
        // Update header and retry
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject with the original error
        return Promise.reject(error);
      }
    }
    
    // For other errors, apply our error handling
    logApiError(error);
    return Promise.reject(handleApiError(error));
  }
);

// Auth token management functions
export const setAuthToken = (token: string) => {
  accessToken = token;
  
  // Extract and save expiry time from token
  const decodedToken = decodeJwtToken(token);
  if (decodedToken.exp) {
    setTokenExpiry(decodedToken.exp * 1000); // Convert seconds to milliseconds
  }
};

export const setUserId = (id: string) => {
  userId = id;
};

export const setTokenExpiry = (expiryTimestamp: number) => {
  tokenExpiry = expiryTimestamp;
};

export const clearAuthToken = () => {
  accessToken = null;
  tokenExpiry = null;
};

export const clearAllTokens = (skipEvent: boolean = false) => {
  // Clear all variables in memory
  accessToken = null;
  userId = null;
  tokenExpiry = null;
  isRefreshing = false;
  refreshPromise = null;
  refreshSubscribers = [];
  
  // Log that tokens were cleared (in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('All auth tokens cleared');
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!accessToken && (!tokenExpiry || Date.now() < tokenExpiry);
};

// Get remaining time in seconds for token
export const getTokenRemainingTime = (): number | null => {
  if (!tokenExpiry) return null;
  const remaining = Math.max(0, tokenExpiry - Date.now());
  return Math.floor(remaining / 1000); // Convert to seconds
};

// Set initial auth state based on stored tokens
export const getAuthState = (): {
  isAuthenticated: boolean;
  accessToken: string | null;
  userId: string | null;
  tokenExpiresIn: number | null;
} => {
  return {
    isAuthenticated: isAuthenticated(),
    accessToken,
    userId,
    tokenExpiresIn: getTokenRemainingTime()
  };
};

// Export default client
export default axiosClient; 