/**
 * Format a number as currency with commas and 2 decimal places
 */
export const formatCurrency = (amount?: number, currency: string = 'INR'): string => {
  if (amount === undefined || amount === null) return '0.00';
  
  try {
    // Map currency codes to their respective locales and symbols
    const currencyConfig: Record<string, { locale: string, symbol: string }> = {
      'INR': { locale: 'en-IN', symbol: '₹' },
      'BDT': { locale: 'bn-BD', symbol: '৳' },
      'USD': { locale: 'en-US', symbol: '$' },
      'EUR': { locale: 'de-DE', symbol: '€' },
      'GBP': { locale: 'en-GB', symbol: '£' },
      'JPY': { locale: 'ja-JP', symbol: '¥' },
      'CAD': { locale: 'en-CA', symbol: 'C$' },
      'AUD': { locale: 'en-AU', symbol: 'A$' },
      // Add more currencies as needed
    };
    
    // Get configuration for the provided currency, default to INR if not found
    const config = currencyConfig[currency] || currencyConfig['INR'];
    
    // Format the number with the appropriate locale
    const formattedNumber = amount.toLocaleString(config.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Return formatted number with currency symbol
    return formattedNumber;
  } catch (e) {
    return amount.toFixed(2);
  }
};

/**
 * Get currency symbol based on currency code
 */
export const getCurrencySymbol = (currency: string = 'INR'): string => {
  const symbols: Record<string, string> = {
    'INR': '₹',
    'BDT': '৳',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    // Add more currencies as needed
  };
  
  return symbols[currency] || symbols['INR'];
}; 