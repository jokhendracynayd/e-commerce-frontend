'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { Address, AddressFormData } from '@/types/address';
import { createAddress, updateAddress } from '@/services/addressService';

interface AddressFormProps {
  onSave?: (address: Address) => void;
  onCancel?: () => void;
  initialAddress?: Partial<Address>;
  buttonText?: string;
  showCancelButton?: boolean;
}

const AddressForm = ({ 
  onSave, 
  onCancel, 
  initialAddress, 
  buttonText = 'SAVE',
  showCancelButton = true 
}: AddressFormProps) => {
  // Form state
  const [name, setName] = useState(initialAddress?.name || '');
  const [mobileNumber, setMobileNumber] = useState(initialAddress?.mobileNumber || '');
  const [pincode, setPincode] = useState(initialAddress?.zipCode || '');
  const [locality, setLocality] = useState(initialAddress?.locality || '');
  const [address, setAddress] = useState(initialAddress?.street || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [alternatePhone, setAlternatePhone] = useState(initialAddress?.alternatePhone || '');
  const [addressType, setAddressType] = useState<'Home' | 'Work'>(
    initialAddress?.addressType as ('Home' | 'Work') || 'Home'
  );
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault || false);
  
  // Loading state for geolocation and form submission
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth context to check if user is logged in
  const { isAuthenticated } = useAuth();

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    if (!locality.trim()) newErrors.locality = 'Locality is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state || state === '--Select State--') newErrors.state = 'State is required';
    
    if (alternatePhone && !/^\d{10}$/.test(alternatePhone)) {
      newErrors.alternatePhone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle current location
  const handleUseCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Here you would normally make an API call to a geocoding service
            // For now we'll just simulate finding the location details
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Fake data for demonstration
            setPincode('400001');
            setLocality('Marine Lines');
            setCity('Mumbai');
            setState('Maharashtra');
            
            toast.success('Location detected successfully');
          } catch (error) {
            console.error('Error getting location details:', error);
            toast.error('Could not retrieve location details');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Could not access your location. Please check your browser settings.');
          setIsLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create address object
      const addressData: AddressFormData = {
        name,
        mobileNumber,
        street: address,
        city,
        state,
        zipCode: pincode,
        locality,
        landmark: landmark || undefined,
        alternatePhone: alternatePhone || undefined,
        addressType,
        country: 'India', // Default for now
        isDefault
      };
      
      let result: Address | null = null;
      
      // Check if it's an update or create
      if (initialAddress?.id) {
        // Update existing address
        result = await updateAddress(initialAddress.id, addressData);
        if (result) {
          toast.success('Address updated successfully');
        }
      } else {
        // Create new address
        result = await createAddress(addressData);
        if (result) {
          toast.success('Address saved successfully');
        }
      }
      
      // If we have a callback and result, call it
      if (onSave && result) {
        onSave(result);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // List of Indian states
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const bangladeshStates = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Rangpur', 'Barisal','Comilla','Sylhet','khulna','Mymensingh'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        {/* Location Button */}
        <button 
          type="button" 
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="mb-6 flex items-center text-sm sm:text-base text-[#ed875a] dark:text-[#ed8c61] font-medium hover:text-[#d44506] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          {isLoading ? 'Detecting location...' : 'Use my current location'}
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Name */}
          <div className="sm:col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="Full Name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div className="sm:col-span-1">
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              10-digit mobile number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`w-full px-4 py-2 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="Mobile Number"
              maxLength={10}
            />
            {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>}
          </div>

          {/* Pincode */}
          <div className="sm:col-span-1">
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`w-full px-4 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="6-digit pincode"
              maxLength={6}
            />
            {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
          </div>

          {/* Locality */}
          <div className="sm:col-span-1">
            <label htmlFor="locality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Locality
            </label>
            <input
              type="text"
              id="locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className={`w-full px-4 py-2 border ${errors.locality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="Locality"
            />
            {errors.locality && <p className="mt-1 text-sm text-red-500">{errors.locality}</p>}
          </div>

          {/* Address (Area and Street) */}
          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address (Area and Street)
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="Address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          {/* City/District/Town */}
          <div className="sm:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City/District/Town
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="City"
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
          </div>

          {/* State */}
          <div className="sm:col-span-1">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
            >
              <option value="">--Select State--</option>
              {bangladeshStates.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
          </div>

          {/* Landmark (Optional) */}
          <div className="sm:col-span-1">
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white"
              placeholder="Landmark"
            />
          </div>

          {/* Alternate Phone (Optional) */}
          <div className="sm:col-span-1">
            <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alternate Phone (Optional)
            </label>
            <input
              type="tel"
              id="alternatePhone"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`w-full px-4 py-2 border ${errors.alternatePhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-[#ed875a] focus:border-[#ed875a] dark:bg-gray-700 dark:text-white`}
              placeholder="Alternate Phone"
              maxLength={10}
            />
            {errors.alternatePhone && <p className="mt-1 text-sm text-red-500">{errors.alternatePhone}</p>}
          </div>
        </div>

        {/* Address Type */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Address Type
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-[#ed875a] focus:ring-[#ed875a]"
                name="addressType"
                value="Home"
                checked={addressType === 'Home'}
                onChange={() => setAddressType('Home')}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Home</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-[#ed875a] focus:ring-[#ed875a]"
                name="addressType"
                value="Work"
                checked={addressType === 'Work'}
                onChange={() => setAddressType('Work')}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Work</span>
            </label>
          </div>
        </div>

        {/* Default Address Checkbox */}
        <div className="mt-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-[#ed875a] focus:ring-[#ed875a]"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Make this my default address
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-2 px-6 rounded-md font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none mb-4 sm:mb-0"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              buttonText
            )}
          </button>
          
          {showCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-6 rounded-md font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              CANCEL
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressForm; 