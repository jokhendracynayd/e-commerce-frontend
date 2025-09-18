// Type definitions for country and currency configurations

export interface FieldConfig {
  label: string;
  placeholder: string;
  required: boolean;
  helpText?: string;
}

export interface CountryLabels {
  [fieldName: string]: FieldConfig;
}

export interface ValidationRules {
  [fieldName: string]: string;
}

export interface AddressFormat {
  fields: string[];
  required: string[];
  separator: string;
}

export interface StateProvince {
  code: string;
  name: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  phoneCode: string;
  timezone: string;
  locale: string;
  labels: CountryLabels;
  validation: ValidationRules;
  states?: StateProvince[];
  counties?: StateProvince[];
  districts?: StateProvince[];
  fieldOrder: string[];
  requiredFields: string[];
  addressFormat: AddressFormat;
}

export interface CurrencySymbol {
  symbol: string;
  position: 'before' | 'after';
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
}

export interface ExchangeRates {
  base: string;
  lastUpdated: string;
  rates: Record<string, number>;
  supportedCurrencies: string[];
}

export interface CountryService {
  getCountryConfig: (countryCode: string) => CountryConfig;
  getCountryLabels: (countryCode: string) => CountryLabels;
  getFieldLabel: (countryCode: string, fieldName: string) => string;
  getFieldConfig: (countryCode: string, fieldName: string) => FieldConfig | undefined;
  getFieldOrder: (countryCode: string) => string[];
  getRequiredFields: (countryCode: string) => string[];
  getValidationRules: (countryCode: string) => ValidationRules;
}

export interface CurrencyService {
  getCurrencySymbol: (currencyCode: string) => CurrencySymbol;
  getExchangeRate: (fromCurrency: string, toCurrency: string) => number;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number;
  formatCurrency: (amount: number, currencyCode: string) => string;
  getSupportedCurrencies: () => string[];
}

// Common field names across countries
export type CommonFieldNames = 
  | 'name'
  | 'street'
  | 'city'
  | 'phone'
  | 'alternate_phone'
  | 'landmark'
  | 'address_type'
  | 'set_as_default';

// Country-specific field names
export type CountrySpecificFields = 
  | 'area'      // India, Bangladesh
  | 'state'     // US, India
  | 'county'    // UK
  | 'district'  // Bangladesh
  | 'zip'       // US
  | 'pincode'   // India
  | 'postcode'; // UK, Bangladesh

export type AllFieldNames = CommonFieldNames | CountrySpecificFields;

// Supported country codes
export type SupportedCountryCode = 'US' | 'IN' | 'GB' | 'CA' | 'AU' | 'DE' | 'FR' | 'JP' | 'CN' | 'BR' | 'BD';

// Supported currency codes
export type SupportedCurrencyCode = 'USD' | 'INR' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'BRL' | 'BDT';
