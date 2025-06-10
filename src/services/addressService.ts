import { Address } from '@/types/address';
import { addressApi } from '@/lib/api/address-api';

/**
 * Get all addresses for the current user
 */
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    return await addressApi.getUserAddresses();
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

/**
 * Get a specific address by ID
 */
export const getAddressById = async (addressId: string): Promise<Address | null> => {
  try {
    return await addressApi.getAddressById(addressId);
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};

/**
 * Create a new address
 */
export const createAddress = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address | null> => {
  try {
    return await addressApi.createAddress(addressData);
  } catch (error) {
    console.error('Error creating address:', error);
    return null;
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (addressId: string, addressData: Partial<Address>): Promise<Address | null> => {
  try {
    return await addressApi.updateAddress(addressId, addressData);
  } catch (error) {
    console.error('Error updating address:', error);
    return null;
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (addressId: string): Promise<boolean> => {
  try {
    return await addressApi.deleteAddress(addressId);
  } catch (error) {
    console.error('Error deleting address:', error);
    return false;
  }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (addressId: string): Promise<Address | null> => {
  try {
    return await addressApi.setDefaultAddress(addressId);
  } catch (error) {
    console.error('Error setting default address:', error);
    return null;
  }
}; 