/**
 * User related types for the e-commerce application
 */

import { UserDetails } from './auth';

/**
 * Frontend representation of a user with simplified structure
 */
export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  gender?: string;
  initials: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  profileImage?: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  phone?: string | null;
  passwordChangeRequired: boolean;
}

/**
 * Request payload for updating user profile
 */
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
}

/**
 * Request payload for creating a new address
 */
export interface AddressCreateRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  type?: 'HOME' | 'OFFICE' | 'OTHER';
  label?: string;
  phone?: string;
}

/**
 * Request payload for updating an existing address
 */
export interface AddressUpdateRequest extends AddressCreateRequest {
  id: string;
}

/**
 * User address details
 */
export interface UserAddress {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  label?: string;
  phone?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 