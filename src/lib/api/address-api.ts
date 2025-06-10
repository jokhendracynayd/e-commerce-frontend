import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { Address } from '@/types/address';

// Address API functions
export const addressApi = {
  /**
   * Get all addresses for the current user
   */
  getUserAddresses: async (): Promise<Address[]> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.USERS.ADDRESSES);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a specific address by ID
   */
  getAddressById: async (addressId: string): Promise<Address> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.USERS.ADDRESS_DETAIL(addressId));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new address
   */
  createAddress: async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
    try {
      // Send all fields directly to the backend
      const response = await axiosClient.post(ENDPOINTS.USERS.ADD_ADDRESS, addressData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (addressId: string, addressData: Partial<Address>): Promise<Address> => {
    try {
      // Send all fields directly to the backend
      const response = await axiosClient.patch(
        ENDPOINTS.USERS.UPDATE_ADDRESS(addressId), 
        addressData
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (addressId: string): Promise<boolean> => {
    try {
      await axiosClient.delete(ENDPOINTS.USERS.DELETE_ADDRESS(addressId));
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Set an address as default
   */
  setDefaultAddress: async (addressId: string): Promise<Address> => {
    try {
      const response = await axiosClient.patch(
        ENDPOINTS.USERS.SET_DEFAULT_ADDRESS(addressId)
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default addressApi; 