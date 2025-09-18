import { useState, useEffect, useCallback } from 'react';
import { countryService } from '@/services/countryService';
import { currencyService } from '@/services/currencyService';
import type { CountryConfig, FieldConfig } from '../../config/types';

export interface UseCountryReturn {
  // Current country state
  currentCountry: string;
  countryConfig: CountryConfig;
  
  // Country management
  setCountry: (countryCode: string) => void;
  getSupportedCountries: () => string[];
  isCountrySupported: (countryCode: string) => boolean;
  
  // Label and field management
  getFieldLabel: (fieldName: string) => string;
  getFieldConfig: (fieldName: string) => FieldConfig | undefined;
  getFieldOrder: () => string[];
  getRequiredFields: () => string[];
  
  // State/Province management
  getStatesProvinces: () => Array<{code: string, name: string}>;
  getStateProvinceName: (code: string) => string;
  getStateProvinceCode: (name: string) => string;
  isValidStateProvince: (code: string) => boolean;
  
  // Validation
  validateField: (fieldName: string, value: string) => boolean;
  getValidationRules: () => Record<string, string>;
  
  // Address formatting
  formatAddress: (addressData: Record<string, string>) => string;
  
  // Currency management
  currentCurrency: string;
  setCurrency: (currencyCode: string) => void;
  formatPrice: (amount: number) => string;
  
  // Loading state
  isLoading: boolean;
}

export const useCountry = (initialCountry?: string): UseCountryReturn => {
  const [currentCountry, setCurrentCountry] = useState<string>(
    initialCountry || countryService.getCurrentCountry()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update country service when current country changes
  useEffect(() => {
    countryService.setCurrentCountry(currentCountry);
    
    // Set currency based on country
    const currency = currencyService.getCurrencyForCountry(currentCountry);
    currencyService.setCurrentCurrency(currency);
  }, [currentCountry]);

  // Set country
  const setCountry = useCallback((countryCode: string) => {
    if (countryService.isCountrySupported(countryCode)) {
      setCurrentCountry(countryCode);
    } else {
      console.warn(`Country ${countryCode} is not supported`);
    }
  }, []);

  // Set currency
  const setCurrency = useCallback((currencyCode: string) => {
    if (currencyService.isCurrencySupported(currencyCode)) {
      currencyService.setCurrentCurrency(currencyCode);
    } else {
      console.warn(`Currency ${currencyCode} is not supported`);
    }
  }, []);

  // Get country configuration
  const countryConfig = countryService.getCountryConfig(currentCountry);

  // Get field label
  const getFieldLabel = useCallback((fieldName: string): string => {
    return countryService.getFieldLabel(fieldName, currentCountry);
  }, [currentCountry]);

  // Get field configuration
  const getFieldConfig = useCallback((fieldName: string): FieldConfig | undefined => {
    return countryService.getFieldConfig(fieldName, currentCountry);
  }, [currentCountry]);

  // Get field order
  const getFieldOrder = useCallback((): string[] => {
    return countryService.getFieldOrder(currentCountry);
  }, [currentCountry]);

  // Get required fields
  const getRequiredFields = useCallback((): string[] => {
    return countryService.getRequiredFields(currentCountry);
  }, [currentCountry]);

  // Get states/provinces
  const getStatesProvinces = useCallback((): Array<{code: string, name: string}> => {
    return countryService.getStatesProvinces(currentCountry);
  }, [currentCountry]);

  // Get state/province name by code
  const getStateProvinceName = useCallback((code: string): string => {
    return countryService.getStateProvinceName(code, currentCountry);
  }, [currentCountry]);

  // Get state/province code by name
  const getStateProvinceCode = useCallback((name: string): string => {
    return countryService.getStateProvinceCode(name, currentCountry);
  }, [currentCountry]);

  // Check if state/province is valid
  const isValidStateProvince = useCallback((code: string): boolean => {
    return countryService.isValidStateProvince(code, currentCountry);
  }, [currentCountry]);

  // Validate field
  const validateField = useCallback((fieldName: string, value: string): boolean => {
    return countryService.validateField(fieldName, value, currentCountry);
  }, [currentCountry]);

  // Get validation rules
  const getValidationRules = useCallback((): Record<string, string> => {
    return countryService.getValidationRules(currentCountry);
  }, [currentCountry]);

  // Format address
  const formatAddress = useCallback((addressData: Record<string, string>): string => {
    return countryService.formatAddress(addressData, currentCountry);
  }, [currentCountry]);

  // Format price
  const formatPrice = useCallback((amount: number): string => {
    return currencyService.formatAmount(amount);
  }, []);

  // Get supported countries
  const getSupportedCountries = useCallback((): string[] => {
    return countryService.getSupportedCountries();
  }, []);

  // Check if country is supported
  const isCountrySupported = useCallback((countryCode: string): boolean => {
    return countryService.isCountrySupported(countryCode);
  }, []);

  return {
    currentCountry,
    countryConfig,
    setCountry,
    getSupportedCountries,
    isCountrySupported,
    getFieldLabel,
    getFieldConfig,
    getFieldOrder,
    getRequiredFields,
    getStatesProvinces,
    getStateProvinceName,
    getStateProvinceCode,
    isValidStateProvince,
    validateField,
    getValidationRules,
    formatAddress,
    currentCurrency: currencyService.getCurrentCurrency(),
    setCurrency,
    formatPrice,
    isLoading,
  };
};

export default useCountry;
