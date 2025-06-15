/**
 * Authentication related types for the e-commerce application
 */

/**
 * Request payload for user registration
 */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

/**
 * Request payload for user login
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Request payload for refreshing authentication tokens
 * The refresh token is now sent via HTTP-only cookie
 */
export interface RefreshTokenRequest {
  userId: string;
}

/**
 * Request payload for changing user password
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Generic API response wrapper for consistent response structure
 */
export interface ApiResponseWrapper<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Response containing authentication data after successful login
 * refreshToken is now sent via HTTP-only cookie
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // Optional as it's now primarily sent via cookie
  user: UserDetails;
}

/**
 * Response containing just the tokens after refresh
 * refreshToken is now sent via HTTP-only cookie
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken?: string; // Optional as it's now primarily sent via cookie
}

/**
 * Detailed user information returned by the API
 */
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