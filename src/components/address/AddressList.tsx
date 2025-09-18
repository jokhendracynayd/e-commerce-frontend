'use client';

import { useState, useEffect } from 'react';
import { Address } from '@/types/address';
import { getUserAddresses } from '@/services/addressService';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import { toast } from 'react-hot-toast';

interface AddressListProps {
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: string;
  showAddNewButton?: boolean;
  showSelectionMode?: boolean;
  header?: React.ReactNode;
  emptyStateMessage?: string;
  onAddressChange?: () => void; // Callback when addresses are added/edited/deleted
  autoSelectFirst?: boolean; // New prop to auto-select first/default address
  autoOpenAddFormWhenEmpty?: boolean; // Auto-open add form when no addresses exist
}

const AddressList = ({
  onSelectAddress,
  selectedAddressId,
  showAddNewButton = true,
  showSelectionMode = false,
  header,
  emptyStateMessage = 'You don\'t have any saved addresses yet.',
  onAddressChange,
  autoSelectFirst = false,
  autoOpenAddFormWhenEmpty = false,
}: AddressListProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Fetch addresses
  const fetchAddresses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUserAddresses();
      setAddresses(result);
      
      // Auto-select first/default address if enabled and no address is currently selected
      if (autoSelectFirst && result.length > 0 && !selectedAddressId && onSelectAddress) {
        // Find default address first, otherwise select the first one
        const defaultAddress = result.find(addr => addr.isDefault);
        const addressToSelect = defaultAddress || result[0];
        onSelectAddress(addressToSelect);
      }
      
      // Auto-open add form if no addresses exist and the prop is enabled
      if (autoOpenAddFormWhenEmpty && result.length === 0 && !showAddForm) {
        setShowAddForm(true);
        setEditingAddress(null);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again.');
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle address selection
  const handleSelectAddress = (address: Address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
  };

  // Handle edit
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (addressId: string) => {
    try {
      // Remove from local state immediately for better UX
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      
      // Notify parent component of the change
      if (onAddressChange) {
        onAddressChange();
      }
      
      // Refresh the addresses list to ensure consistency
      await fetchAddresses();
    } catch (error) {
      console.error('Error handling address deletion:', error);
      // Revert the local state change if there was an error
      await fetchAddresses();
    }
  };

  // Handle address change (for set default, etc.)
  const handleAddressChange = async () => {
    // Notify parent component of the change
    if (onAddressChange) {
      onAddressChange();
    }
    
    // Refresh the addresses list to ensure consistency
    await fetchAddresses();
  };

  // Handle save
  const handleSave = (address: Address) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === address.id ? address : addr
      ));
      setEditingAddress(null);
    } else {
      // Add new address
      setAddresses([...addresses, address]);
      
      // Auto-select the newly added address if in selection mode
      if (showSelectionMode && onSelectAddress) {
        onSelectAddress(address);
      }
    }
    setShowAddForm(false);
    // Notify parent component of the change
    if (onAddressChange) {
      onAddressChange();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingAddress(null);
    setShowAddForm(true);
  };

  // Check if address limit is reached
  const addressLimitReached = addresses.length >= 3;

  return (
    <div className="space-y-6">
      {/* Header section */}
      {header && <div>{header}</div>}

      {/* Address Limit Message */}
      {addressLimitReached && showAddNewButton && !showAddForm && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
              You've reached the maximum limit of 3 addresses. To add a new address, please delete an existing one first.
            </p>
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      {showAddNewButton && !showAddForm && (
        <div>
          <button 
            onClick={addressLimitReached ? undefined : handleAddNew}
            disabled={addressLimitReached}
            className={`flex items-center p-3 rounded-md border border-dashed w-full sm:w-auto justify-center transition-all duration-300 ${
              addressLimitReached 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60' 
                : 'bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 hover:from-[#ed875a]/20 hover:to-[#ed8c61]/20 text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] border-[#ed875a]/30'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">
              {addressLimitReached ? 'Address limit reached (3/3)' : 'Add a new address'}
            </span>
          </button>
        </div>
      )}

      {/* Address Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddressForm 
            initialAddress={editingAddress || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
            buttonText={editingAddress ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ed875a]"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={fetchAddresses}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && addresses.length === 0 && !showAddForm && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ed875a]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{emptyStateMessage}</p>
          {!showAddNewButton && (
            <button 
              onClick={addressLimitReached ? undefined : handleAddNew}
              disabled={addressLimitReached}
              className={`mt-4 flex items-center mx-auto p-2 rounded-md border border-dashed justify-center transition-all duration-300 ${
                addressLimitReached 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60' 
                  : 'bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 hover:from-[#ed875a]/20 hover:to-[#ed8c61]/20 text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] border-[#ed875a]/30'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">
                {addressLimitReached ? 'Address limit reached (3/3)' : 'Add Address'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Address List */}
      {!isLoading && !error && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={showSelectionMode ? handleSelectAddress : undefined}
              onAddressChange={handleAddressChange}
              isSelected={showSelectionMode && selectedAddressId === address.id}
              isDefault={address.isDefault}
              showActions={!showSelectionMode}
              showSelectButton={showSelectionMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList; 