// Main configuration exports
export * from './countries';
export {
  getCurrencySymbol,
  getExchangeRate,
  convertCurrency,
  formatCurrency,
  getSupportedCurrencies,
} from './currencies';

// Re-export commonly used functions
export {
  getCountryConfig,
  getCountryLabels,
  getFieldLabel,
  getFieldConfig,
  getFieldOrder,
  getRequiredFields,
  getValidationRules,
  getSupportedCountries as getSupportedCountryCodes,
} from './countries';

// Default country (can be changed based on user preference or geolocation)
export const DEFAULT_COUNTRY = 'BD';

// Default currency (can be changed based on country)
export const DEFAULT_CURRENCY = 'BDT';
