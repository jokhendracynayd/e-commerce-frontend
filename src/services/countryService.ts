import {
  getCountryConfig,
  getCountryLabels,
  getFieldLabel,
  getFieldConfig,
  getFieldOrder,
  getRequiredFields,
  getValidationRules,
  getSupportedCountryCodes,
  DEFAULT_COUNTRY,
} from '../../config';
import type { CountryConfig, CountryLabels, FieldConfig, ValidationRules } from '../../config/types';

export class CountryService {
  private static instance: CountryService;
  private currentCountry: string = DEFAULT_COUNTRY;

  private constructor() {}

  static getInstance(): CountryService {
    if (!CountryService.instance) {
      CountryService.instance = new CountryService();
    }
    return CountryService.instance;
  }

  // Set current country
  setCurrentCountry(countryCode: string): void {
    this.currentCountry = countryCode;
  }

  // Get current country
  getCurrentCountry(): string {
    return this.currentCountry;
  }

  // Get country configuration
  getCountryConfig(countryCode: string = this.currentCountry): CountryConfig {
    return getCountryConfig(countryCode);
  }

  // Get country labels
  getCountryLabels(countryCode: string = this.currentCountry): CountryLabels {
    return getCountryLabels(countryCode);
  }

  // Get field label
  getFieldLabel(fieldName: string, countryCode: string = this.currentCountry): string {
    return getFieldLabel(countryCode, fieldName);
  }

  // Get field configuration
  getFieldConfig(fieldName: string, countryCode: string = this.currentCountry): FieldConfig | undefined {
    return getFieldConfig(countryCode, fieldName);
  }

  // Get field order for form rendering
  getFieldOrder(countryCode: string = this.currentCountry): string[] {
    return getFieldOrder(countryCode);
  }

  // Get required fields
  getRequiredFields(countryCode: string = this.currentCountry): string[] {
    return getRequiredFields(countryCode);
  }

  // Get validation rules
  getValidationRules(countryCode: string = this.currentCountry): ValidationRules {
    return getValidationRules(countryCode);
  }

  // Validate field value
  validateField(fieldName: string, value: string, countryCode: string = this.currentCountry): boolean {
    const rules = this.getValidationRules(countryCode);
    const pattern = rules[fieldName];
    
    if (!pattern) return true; // No validation rule means valid
    
    const regex = new RegExp(pattern);
    return regex.test(value);
  }

  // Get all supported countries
  getSupportedCountries(): string[] {
    return getSupportedCountryCodes();
  }

  // Check if country is supported
  isCountrySupported(countryCode: string): boolean {
    return this.getSupportedCountries().includes(countryCode);
  }

  // Get country-specific field mapping
  getFieldMapping(countryCode: string = this.currentCountry): Record<string, string> {
    const config = this.getCountryConfig(countryCode);
    const mapping: Record<string, string> = {};

    // Map common fields
    mapping.name = 'name';
    mapping.street = 'street';
    mapping.city = 'city';
    mapping.phone = 'phone';
    mapping.alternate_phone = 'alternate_phone';
    mapping.landmark = 'landmark';
    mapping.address_type = 'address_type';
    mapping.set_as_default = 'set_as_default';

    // Map country-specific fields
    switch (countryCode) {
      case 'US':
        mapping.state = 'state';
        mapping.zip = 'zip';
        break;
      case 'IN':
        mapping.area = 'area';
        mapping.state = 'state';
        mapping.pincode = 'pincode';
        break;
      case 'GB':
        mapping.county = 'county';
        mapping.postcode = 'postcode';
        break;
      case 'BD':
        mapping.area = 'area';
        mapping.district = 'district';
        mapping.postcode = 'postcode';
        break;
    }

    return mapping;
  }

  // Get states/provinces for country
  getStatesProvinces(countryCode: string = this.currentCountry): Array<{code: string, name: string}> {
    const config = this.getCountryConfig(countryCode);
    
    // Return states, counties, or districts based on country
    if (config.states) return config.states;
    if (config.counties) return config.counties;
    if (config.districts) return config.districts;
    
    return [];
  }

  // Get state/province name by code
  getStateProvinceName(code: string, countryCode: string = this.currentCountry): string {
    const statesProvinces = this.getStatesProvinces(countryCode);
    const found = statesProvinces.find(item => item.code === code);
    return found ? found.name : code;
  }

  // Get state/province code by name
  getStateProvinceCode(name: string, countryCode: string = this.currentCountry): string {
    const statesProvinces = this.getStatesProvinces(countryCode);
    const found = statesProvinces.find(item => item.name.toLowerCase() === name.toLowerCase());
    return found ? found.code : name;
  }

  // Check if state/province is valid for country
  isValidStateProvince(code: string, countryCode: string = this.currentCountry): boolean {
    const statesProvinces = this.getStatesProvinces(countryCode);
    return statesProvinces.some(item => item.code === code);
  }

  // Format address based on country
  formatAddress(addressData: Record<string, string>, countryCode: string = this.currentCountry): string {
    const config = this.getCountryConfig(countryCode);
    const { fields, separator } = config.addressFormat;
    
    const addressParts = fields
      .map((field: string) => addressData[field])
      .filter((part: string) => part && part.trim() !== '');
    
    return addressParts.join(separator);
  }
}

// Export singleton instance
export const countryService = CountryService.getInstance();
export default countryService;
