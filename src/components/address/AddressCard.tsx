'use client';

import { useState } from 'react';
import { Address } from '@/types/address';
import { deleteAddress, setDefaultAddress } from '@/services/addressService';
import { toast } from 'react-hot-toast';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => Promise<void>;
  onSelect?: (address: Address) => void;
  onAddressChange?: () => void; // Callback when address state changes
  isSelected?: boolean;
  isDefault?: boolean;
  showActions?: boolean;
  showSelectButton?: boolean;
}

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSelect,
  onAddressChange,
  isSelected = false,
  isDefault = false,
  showActions = true,
  showSelectButton = false,
}: AddressCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Handle edit
  const handleEdit = () => {
    if (onEdit) {
      onEdit(address);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (isDefault) {
      toast.error('Cannot delete default address. Please set another address as default first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsLoading(true);
      try {
        const success = await deleteAddress(address.id!);
        if (success) {
          toast.success('Address deleted successfully');
          if (onDelete) {
            await onDelete(address.id!);
          }
        } else {
          toast.error('Failed to delete address');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('An error occurred while deleting the address');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle select
  const handleSelect = () => {
    if (onSelect) {
      onSelect(address);
    }
  };

  // Handle set as default
  const handleSetDefault = async () => {
    if (isDefault) return;
    
    setIsLoading(true);
    try {
      const result = await setDefaultAddress(address.id!);
      if (result) {
        toast.success('Address set as default successfully');
        // Notify parent component to refresh the address list
        if (onAddressChange) {
          onAddressChange();
        }
      } else {
        toast.error('Failed to set address as default');
      }
    } catch (error) {
      console.error('Error setting address as default:', error);
      toast.error('An error occurred while setting the address as default');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`rounded-lg border ${isSelected 
        ? 'border-[#ed875a] dark:border-[#ed8c61] shadow-md' 
        : 'border-gray-200 dark:border-gray-700'} 
        bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300
        ${isLoading ? 'opacity-60' : ''}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700 mb-3">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-[#ed875a] mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {address.addressType === 'Home' ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              )}
            </svg>
            <h3 className="font-medium text-gray-900 dark:text-white">{address.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {isDefault && (
              <span className="px-2.5 py-1 bg-[#ed875a]/10 text-[#d44506] dark:text-[#ed8c61] text-xs font-medium rounded-full">
                Default
              </span>
            )}
            <span className="px-2.5 py-1 bg-[#ed875a]/10 text-[#d44506] dark:text-[#ed8c61] text-xs font-medium rounded-full">
              {address.addressType}
            </span>
          </div>
        </div>
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">{address.street}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{address.locality}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {address.city}, {address.state} - {address.zipCode}
          </p>
          {address.landmark && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Landmark: {address.landmark}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {address.mobileNumber}
            {address.alternatePhone && `, ${address.alternatePhone}`}
          </p>
        </div>
        
        {showActions && (
          <div className="flex space-x-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={handleEdit}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center text-[#ed875a] hover:text-[#d44506] dark:text-[#ed8c61] dark:hover:text-[#ed875a] py-1.5 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={isLoading || isDefault}
              className={`flex-1 flex items-center justify-center py-1.5 text-sm font-medium border-l border-gray-100 dark:border-gray-700 ${
                isDefault 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-[#d44506] hover:text-[#c13d05]'
              }`}
              title={isDefault ? 'Cannot delete default address' : 'Delete address'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
            {!isDefault && (
              <button 
                onClick={handleSetDefault}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center text-[#ed875a] hover:text-[#d44506] dark:text-[#ed8c61] dark:hover:text-[#ed875a] py-1.5 text-sm font-medium border-l border-gray-100 dark:border-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Set Default
              </button>
            )}
          </div>
        )}
        
        {showSelectButton && (
          <div className="mt-4">
            <button
              onClick={handleSelect}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                isSelected
                  ? 'bg-[#ed875a] text-white'
                  : 'bg-[#ed875a]/10 text-[#d44506] dark:text-[#ed8c61] hover:bg-[#ed875a]/20'
              }`}
            >
              {isSelected ? 'Deliver to this address' : 'Select'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressCard; 