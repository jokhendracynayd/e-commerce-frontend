import { AxiosResponse } from 'axios';
import axiosClient, { 
  setAuthToken, 
  setRefreshToken, 
  setUserId, 
  clearAllTokens, 
  AUTH_EVENTS,
  getAuthState
} from './axios-client';
import { ENDPOINTS, API_BASE_URL } from './endpoints';
import { ApiError, handleApiError } from './error-handler';
import axios from 'axios';

// Types for auth requests and responses
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  userId: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponseWrapper<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDetails;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserDetails {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN' | 'SELLER';
  is_email_verified?: boolean;  // Using snake_case to match backend
  is_phone_verified?: boolean;  // Using snake_case to match backend
  isEmailVerified?: boolean;    // camelCase alternate for frontend
  isPhoneVerified?: boolean;    // camelCase alternate for frontend
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  profileImage?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  preferences?: any | null;
  lastLoginAt?: string;
  loginIp?: string;
  signupIp?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  failedLoginAttempts?: number;
  lastPasswordChange?: string | null;
  password_change_required?: boolean;
}

// Authentication API functions
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<UserDetails> => {
    try {
      const response: AxiosResponse<ApiResponseWrapper<UserDetails>> = await axiosClient.post(
        ENDPOINTS.AUTH.REGISTER, 
        data
      );
      
      // Extract user data from response - registration no longer returns tokens
      const responseData: UserDetails = response.data.data;
      
      // Registration doesn't automatically log in the user
      // No need to save tokens or dispatch login event
      
      return responseData;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<ApiResponseWrapper<AuthResponse>> = await axiosClient.post(
        ENDPOINTS.AUTH.LOGIN, 
        data
      );
      
      // Extract response data from the wrapper
      const responseData: AuthResponse = response.data.data;
      
      // Save auth tokens and user ID
      setAuthToken(responseData.accessToken);
      setRefreshToken(responseData.refreshToken);
      setUserId(responseData.user.id);
      
      // Dispatch login event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN, { 
          detail: { user: responseData.user } 
        }));
      }
      
      return responseData;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<UserDetails> => {
    try {
      // Get current auth state to ensure we're authenticated
      const authState = getAuthState();
      
      // Make a direct request to the /auth/me endpoint
      const response: AxiosResponse<ApiResponseWrapper<UserDetails>> = await axiosClient.get(
        ENDPOINTS.AUTH.PROFILE,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(authState.accessToken ? { 'Authorization': `Bearer ${authState.accessToken}` } : {})
          }
        }
      );
      
      // Extract the user data from the response
      const userData = response.data.data;
      
      // Log for development purposes
      if (process.env.NODE_ENV !== 'production') {
        console.log('Current user data:', userData);
      }
      
      // Normalize the response data to work with both snake_case and camelCase fields
      // The backend might return both is_email_verified (snake_case) and isEmailVerified (camelCase)
      const normalizedData: UserDetails = {
        ...userData,
        // Ensure we have consistent properties regardless of backend format
        isEmailVerified: userData.isEmailVerified ?? userData.is_email_verified,
        isPhoneVerified: userData.isPhoneVerified ?? userData.is_phone_verified
      };
      
      return normalizedData;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Refresh the authentication token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<TokenResponse> => {
    try {
      // Create a direct axios call to avoid interceptors that might cause recursion
      const response: AxiosResponse<ApiResponseWrapper<TokenResponse>> = await axiosClient.post(
        ENDPOINTS.AUTH.REFRESH, 
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const responseData = response.data.data;
      
      // Update the auth token
      setAuthToken(responseData.accessToken);
      
      // Update refresh token if provided
      if (responseData.refreshToken) {
        setRefreshToken(responseData.refreshToken);
      }
      
      // Dispatch token refresh event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.TOKEN_REFRESH, {
          detail: { accessToken: responseData.accessToken }
        }));
      }
      
      return responseData;
    } catch (error) {
      // Clear tokens on refresh failure
      clearAllTokens();
      
      // Dispatch logout and error events
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.AUTH_ERROR, {
          detail: { message: 'Session expired. Please log in again.' }
        }));
      }
      
      throw handleApiError(error);
    }
  },
  
  /**
   * Change the user's password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean }> => {
    try {
      const response: AxiosResponse<ApiResponseWrapper<{ success: boolean }>> = await axiosClient.post(
        ENDPOINTS.AUTH.CHANGE_PASSWORD, 
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<{ success: boolean }> => {
    try {
      // Get auth state which includes the current token
      const authState = getAuthState();
      
      // Call the backend to invalidate the session server-side
      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.AUTH.LOGOUT}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(authState.accessToken ? { 'Authorization': `Bearer ${authState.accessToken}` } : {})
          }
        }
      );
      
      // Extract the success response
      const result = response.data.data as { success: boolean };
      
      // Log success for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.log('Logout successful:', result);
      }
      
      // Clean up client-side state regardless of response
      // This ensures the user is always logged out client-side even if the server request fails
      clearAllTokens();
      
      // Dispatch logout event to notify the app about the change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
      }
      
      return result;
    } catch (error) {
      console.error('Logout API call failed:', error);
      
      // Even if the API call fails, ensure client-side logout happens
      clearAllTokens();
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
      }
      
      // We don't throw here - just return a default success response
      // This ensures the user experience isn't broken by API failures
      return { success: true };
    }
  },
};

export default authApi; 