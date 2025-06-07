import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { UserDetails } from './auth-api';

// Types for user requests and responses
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
}

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

export interface AddressUpdateRequest extends AddressCreateRequest {
  id: string;
}

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

// User API functions
export const userApi = {
  /**
   * Get user profile
   */
  getUserProfile: async (): Promise<UserDetails> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.AUTH.PROFILE);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (data: UserUpdateRequest): Promise<UserDetails> => {
    try {
      const response = await axiosClient.patch(ENDPOINTS.USERS.BASE, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user addresses
   */
  getUserAddresses: async (): Promise<UserAddress[]> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.USERS.ADDRESSES);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Add a new address
   */
  addAddress: async (data: AddressCreateRequest): Promise<UserAddress> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.USERS.ADD_ADDRESS, data);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (data: AddressUpdateRequest): Promise<UserAddress> => {
    try {
      const response = await axiosClient.patch(
        ENDPOINTS.USERS.UPDATE_ADDRESS(data.id), 
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (addressId: string): Promise<{ success: boolean }> => {
    try {
      const response = await axiosClient.delete(ENDPOINTS.USERS.DELETE_ADDRESS(addressId));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default userApi; 