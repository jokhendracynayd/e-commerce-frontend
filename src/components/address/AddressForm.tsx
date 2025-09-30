'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCountry } from '@/hooks/useCountry';
import { toast } from 'react-hot-toast';
import { Address, AddressFormData } from '@/types/address';
import { createAddress, updateAddress } from '@/services/addressService';

interface AddressFormProps {
  onSave?: (address: Address) => void;
  onCancel?: () => void;
  initialAddress?: Partial<Address>;
  buttonText?: string;
  showCancelButton?: boolean;
  countryCode?: string; // Allow country to be passed in
}

const AddressForm = ({ 
  onSave, 
  onCancel, 
  initialAddress, 
  buttonText = 'SAVE',
  showCancelButton = true,
  countryCode
}: AddressFormProps) => {
  // Country configuration
  const {
    currentCountry,
    countryConfig,
    getFieldLabel,
    getFieldConfig,
    getFieldOrder,
    getRequiredFields,
    getStatesProvinces,
    validateField,
    setCountry,
    formatAddress
  } = useCountry(countryCode);

  // Form state - dynamic based on country
  const [formData, setFormData] = useState<Record<string, string>>({
    name: initialAddress?.name || '',
    phone: initialAddress?.mobileNumber || '',
    alternate_phone: initialAddress?.alternatePhone || '',
    street: initialAddress?.street || '',
    city: initialAddress?.city || '',
    landmark: initialAddress?.landmark || '',
    address_type: initialAddress?.addressType as string || 'Home',
    set_as_default: initialAddress?.isDefault ? 'true' : 'false'
  });

  // Country-specific fields
  const [area, setArea] = useState(initialAddress?.locality || '');
  const [stateProvince, setStateProvince] = useState(initialAddress?.state || '');
  const [postalCode, setPostalCode] = useState(initialAddress?.zipCode || '');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth context
  const { isAuthenticated } = useAuth();

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-focus ref for the name input field
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on the name input when component mounts
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Update form data when country changes
  useEffect(() => {
    if (countryCode && countryCode !== currentCountry) {
      setCountry(countryCode);
    }
  }, [countryCode, currentCountry, setCountry]);

  // Update form data
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form fields using country configuration
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = getRequiredFields();
    
    // Validate required fields
    requiredFields.forEach(field => {
      let value = '';
      
      switch (field) {
        case 'name':
          value = formData.name;
          break;
        case 'street':
          value = formData.street;
          break;
        case 'city':
          value = formData.city;
          break;
        case 'phone':
          value = formData.phone;
          break;
        case 'state':
          value = stateProvince;
          break;
        case 'zip':
        case 'pincode':
        case 'postcode':
          value = postalCode;
          break;
        case 'area':
          value = area;
          break;
        case 'district':
          value = stateProvince;
          break;
        case 'county':
          value = stateProvince;
          break;
      }
      
      if (!value || value.trim() === '') {
        newErrors[field] = `${getFieldLabel(field)} is required`;
      }
    });
    
    // Validate field formats using country validation rules
    Object.keys(formData).forEach(field => {
      if (formData[field]) {
        let valueToValidate = formData[field];
        
        // For phone numbers, add country code for validation
        if (field.includes('phone') && !valueToValidate.startsWith('+')) {
          const countryCode = countryConfig.phoneCode || '+91';
          valueToValidate = `${countryCode}${valueToValidate}`;
        }
        
        if (!validateField(field, valueToValidate)) {
          newErrors[field] = `Invalid ${getFieldLabel(field)} format`;
        }
      }
    });
    
    // Validate country-specific fields
    if (stateProvince && !validateField('state', stateProvince)) {
      newErrors.state = `Invalid ${getFieldLabel('state')} format`;
    }
    
    if (postalCode && !validateField(getPostalCodeFieldName(), postalCode)) {
      newErrors[getPostalCodeFieldName()] = `Invalid ${getFieldLabel(getPostalCodeFieldName())} format`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get postal code field name based on country
  const getPostalCodeFieldName = () => {
    switch (currentCountry) {
      case 'US': return 'zip';
      case 'IN': return 'pincode';
      case 'GB':
      case 'BD': return 'postcode';
      default: return 'pincode';
    }
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
            
            // Fake data for demonstration - set based on current country
            switch (currentCountry) {
              case 'US':
                updateFormData('street', '123 Main St');
                updateFormData('city', 'New York');
                setStateProvince('NY');
                setPostalCode('10001');
                break;
              case 'IN':
                updateFormData('street', '123 MG Road');
                setArea('Marine Lines');
                updateFormData('city', 'Mumbai');
                setStateProvince('MH');
                setPostalCode('400001');
                break;
              case 'GB':
                updateFormData('street', '123 Baker Street');
                updateFormData('city', 'London');
                setStateProvince('ENG');
                setPostalCode('NW1 6XE');
                break;
              case 'BD':
                updateFormData('street', '123 Dhanmondi Road');
                setArea('Dhanmondi');
                updateFormData('city', 'Dhaka');
                setStateProvince('DHA');
                setPostalCode('1205');
                break;
            }
            
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
      // Create address object using country-specific field mapping
      const addressData: AddressFormData = {
        name: formData.name,
        mobileNumber: formData.phone.startsWith('+') ? formData.phone : `${countryConfig.phoneCode}${formData.phone}`,
        street: formData.street,
        city: formData.city,
        state: stateProvince,
        zipCode: postalCode,
        locality: area,
        landmark: formData.landmark || undefined,
        alternatePhone: formData.alternate_phone ? 
          (formData.alternate_phone.startsWith('+') ? formData.alternate_phone : `${countryConfig.phoneCode}${formData.alternate_phone}`) 
          : undefined,
        addressType: formData.address_type as 'Home' | 'Work',
        country: countryConfig.name,
        isDefault: formData.set_as_default === 'true'
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

  // Render dynamic field based on country configuration
  const renderField = (fieldName: string) => {
    const config = getFieldConfig(fieldName);
    if (!config) return null;

    const fieldId = fieldName.toLowerCase().replace('_', '');
    const hasError = errors[fieldName];
    
    // Get field value
    let value = '';
    let setValue = (val: string) => updateFormData(fieldName, val);
    
    switch (fieldName) {
      case 'name':
        value = formData.name;
        break;
      case 'phone':
        value = formData.phone;
        break;
      case 'alternate_phone':
        value = formData.alternate_phone;
        break;
      case 'street':
        value = formData.street;
        break;
      case 'city':
        value = formData.city;
        break;
      case 'landmark':
        value = formData.landmark;
        break;
      default:
        return null;
    }

    return (
      <div key={fieldName} className="sm:col-span-1">
        <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={fieldName === 'name' ? nameInputRef : undefined}
          type={fieldName.includes('phone') ? 'tel' : 'text'}
          id={fieldId}
          value={value}
          onChange={(e) => {
            if (fieldName.includes('phone')) {
              let phoneValue = e.target.value.replace(/\D/g, '');
              
              // Remove country code digits if they exist
              const countryCode = countryConfig.phoneCode || '+91';
              const countryCodeDigits = countryCode.replace('+', '');
              
              // If the input starts with country code digits, remove them
              if (phoneValue.startsWith(countryCodeDigits)) {
                phoneValue = phoneValue.substring(countryCodeDigits.length);
              }
              
              // Special handling for Bangladesh: remove leading 0 if present
              if (currentCountry === 'BD' && phoneValue.startsWith('0')) {
                phoneValue = phoneValue.substring(1);
              }
              
              // Limit to appropriate length based on country
              let maxLength = 10; // Default
              if (currentCountry === 'BD') maxLength = 8; // Bangladesh: 8 digits after removing 0
              else if (currentCountry === 'GB') maxLength = 11;
              
              setValue(phoneValue.slice(0, maxLength));
            } else {
              setValue(e.target.value);
            }
          }}
          placeholder={config.placeholder}
          required={config.required}
          className={`w-full px-3 py-2 text-sm border ${hasError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a]'} rounded-md dark:bg-gray-700 dark:text-white transition-all duration-200`}
          maxLength={fieldName.includes('phone') ? 
            (currentCountry === 'BD' ? 8 : currentCountry === 'GB' ? 11 : 10) 
            : undefined}
        />
        {/* {config.helpText && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {config.helpText}
          </div>
        )} */}
        {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
      </div>
    );
  };

  // Render country-specific fields
  const renderCountrySpecificFields = () => {
    const fieldOrder = getFieldOrder();
    const statesProvinces = getStatesProvinces();
    
    return fieldOrder.map(fieldName => {
      const config = getFieldConfig(fieldName);
      if (!config) return null;

      const fieldId = fieldName.toLowerCase();
      const hasError = errors[fieldName];
      
      switch (fieldName) {
        case 'street':
          return (
            <div key={fieldName} className="sm:col-span-2">
              <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {config.label}
                {config.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                id={fieldId}
                value={formData.street}
                onChange={(e) => updateFormData('street', e.target.value)}
                rows={2}
                placeholder={config.placeholder}
                required={config.required}
                className={`w-full px-3 py-2 text-sm border ${hasError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a]'} rounded-md dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none`}
              />
              {/* {config.helpText && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {config.helpText}
                </div>
              )} */}
              {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
            </div>
          );
          
        case 'area':
          return (
            <div key={fieldName} className="sm:col-span-1">
              <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {config.label}
                {config.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                id={fieldId}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={config.placeholder}
                required={config.required}
                className={`w-full px-3 py-2 text-sm border ${hasError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a]'} rounded-md dark:bg-gray-700 dark:text-white transition-all duration-200`}
              />
              {/* {config.helpText && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {config.helpText}
                </div>
              )} */}
              {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
            </div>
          );
          
        case 'city':
          return (
            <div key={fieldName} className="sm:col-span-1">
              <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {config.label}
                {config.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                id={fieldId}
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder={config.placeholder}
                required={config.required}
                className={`w-full px-3 py-2 text-sm border ${hasError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a]'} rounded-md dark:bg-gray-700 dark:text-white transition-all duration-200`}
              />
              {/* {config.helpText && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {config.helpText}
                </div>
              )} */}
              {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
            </div>
          );
          
        case 'state':
        case 'district':
        case 'county':
          return (
            <div key={fieldName} className="sm:col-span-1">
              <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {config.label}
                {config.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                id={fieldId}
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                required={config.required}
                className={`w-full px-3 py-2 text-sm border ${hasError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a]'} rounded-md dark:bg-gray-700 dark:text-white transition-all duration-200`}
              >
                <option value="">--Select {config.label}--</option>
                {statesProvinces.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {/* {config.helpText && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {config.helpText}
                </div>
              )} */}
              {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
            </div>
          );
          
        case 'zip':
        case 'pincode':
        case 'postcode':
          return (
            <div key={fieldName} className="sm:col-span-1">
              <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {config.label}
                {config.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                id={fieldId}
                value={postalCode}
                onChange={(e) => {
                  const maxLength = currentCountry === 'US' ? 10 : currentCountry === 'BD' ? 4 : 6;
                  setPostalCode(e.target.value.replace(/\D/g, '').slice(0, maxLength));
                }}
                placeholder={config.placeholder}
                required={config.required}
                className={`w-full px-3 py-2 text-sm border ${hasError ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a]'} rounded-md dark:bg-gray-700 dark:text-white transition-all duration-200`}
                maxLength={currentCountry === 'US' ? 10 : currentCountry === 'BD' ? 4 : 6}
              />
              {/* {config.helpText && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {config.helpText}
                </div>
              )} */}
              {hasError && <p className="mt-1 text-xs text-red-500">{hasError}</p>}
            </div>
          );
          
        default:
          return null;
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4 sm:p-5">
        {/* Location Button */}
        <button 
          type="button" 
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2" 
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
          {isLoading ? 'Detecting...' : 'Use my current location'}
        </button>

        {/* Country Selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Country
          </label>
          <select
            value={currentCountry}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-[#ed875a]/30 focus:border-[#ed875a] dark:bg-gray-700 dark:text-white transition-colors duration-200"
          >
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="GB">United Kingdom</option>
            <option value="BD">Bangladesh</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {/* Common Fields */}
          {renderField('name')}
          {renderField('phone')}
          
          {/* Country-specific fields */}
          {renderCountrySpecificFields()}
          
          {/* Optional Fields */}
          {renderField('alternate_phone')}
          {renderField('landmark')}
        </div>

        {/* Address Type and Default */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Address Type */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              {getFieldLabel('address_type')}
            </label>
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="h-3.5 w-3.5 text-[#ed875a] focus:ring-1 focus:ring-[#ed875a]/30 border-gray-300 dark:border-gray-600"
                  name="addressType"
                  value="Home"
                  checked={formData.address_type === 'Home'}
                  onChange={() => updateFormData('address_type', 'Home')}
                />
                <span className="ml-1.5 text-xs text-gray-700 dark:text-gray-300">Home</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="h-3.5 w-3.5 text-[#ed875a] focus:ring-1 focus:ring-[#ed875a]/30 border-gray-300 dark:border-gray-600"
                  name="addressType"
                  value="Work"
                  checked={formData.address_type === 'Work'}
                  onChange={() => updateFormData('address_type', 'Work')}
                />
                <span className="ml-1.5 text-xs text-gray-700 dark:text-gray-300">Work</span>
              </label>
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex-shrink-0">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 text-[#ed875a] focus:ring-1 focus:ring-[#ed875a]/30 border-gray-300 dark:border-gray-600 rounded"
                checked={formData.set_as_default === 'true'}
                onChange={(e) => updateFormData('set_as_default', e.target.checked ? 'true' : 'false')}
              />
              <span className="ml-1.5 text-xs text-gray-700 dark:text-gray-300">
                {getFieldLabel('set_as_default')}
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
          {showCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:from-[#d44506] hover:to-[#ed875a] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-3.5 w-3.5 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm; 