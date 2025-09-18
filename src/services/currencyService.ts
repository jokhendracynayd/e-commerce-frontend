import {
  getCurrencySymbol,
  getExchangeRate,
  convertCurrency,
  formatCurrency,
  getSupportedCurrencies,
  DEFAULT_CURRENCY,
} from '../../config';
import type { CurrencySymbol } from '../../config/types';

export class CurrencyService {
  private static instance: CurrencyService;
  private currentCurrency: string = DEFAULT_CURRENCY;

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  // Set current currency
  setCurrentCurrency(currencyCode: string): void {
    this.currentCurrency = currencyCode;
  }

  // Get current currency
  getCurrentCurrency(): string {
    return this.currentCurrency;
  }

  // Get currency symbol configuration
  getCurrencySymbol(currencyCode: string = this.currentCurrency): CurrencySymbol {
    return getCurrencySymbol(currencyCode);
  }

  // Get exchange rate between two currencies
  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    return getExchangeRate(fromCurrency, toCurrency);
  }

  // Convert amount from one currency to another
  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    return convertCurrency(amount, fromCurrency, toCurrency);
  }

  // Format currency amount
  formatAmount(amount: number, currencyCode: string = this.currentCurrency): string {
    return formatCurrency(amount, currencyCode);
  }

  // Format currency amount with symbol
  formatCurrencyWithSymbol(amount: number, currencyCode: string = this.currentCurrency): string {
    const symbolConfig = this.getCurrencySymbol(currencyCode);
    const formattedAmount = amount.toFixed(symbolConfig.decimalPlaces);
    
    if (symbolConfig.position === 'before') {
      return `${symbolConfig.symbol}${formattedAmount}`;
    } else {
      return `${formattedAmount} ${symbolConfig.symbol}`;
    }
  }

  // Get all supported currencies
  getSupportedCurrencies(): string[] {
    return getSupportedCurrencies();
  }

  // Check if currency is supported
  isCurrencySupported(currencyCode: string): boolean {
    return this.getSupportedCurrencies().includes(currencyCode);
  }

  // Get currency for country
  getCurrencyForCountry(countryCode: string): string {
    const countryCurrencyMap: Record<string, string> = {
      'US': 'USD',
      'IN': 'INR',
      'GB': 'GBP',
      'CA': 'CAD',
      'AU': 'AUD',
      'DE': 'EUR',
      'FR': 'EUR',
      'JP': 'JPY',
      'CN': 'CNY',
      'BR': 'BRL',
      'BD': 'BDT',
    };

    return countryCurrencyMap[countryCode] || DEFAULT_CURRENCY;
  }

  // Parse currency string to number
  parseCurrencyString(currencyString: string): number {
    // Remove currency symbols and spaces
    const cleaned = currencyString.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
  }

  // Get currency display info
  getCurrencyDisplayInfo(currencyCode: string = this.currentCurrency) {
    const symbolConfig = this.getCurrencySymbol(currencyCode);
    
    return {
      code: currencyCode,
      symbol: symbolConfig.symbol,
      position: symbolConfig.position,
      decimalPlaces: symbolConfig.decimalPlaces,
      thousandSeparator: symbolConfig.thousandSeparator,
      decimalSeparator: symbolConfig.decimalSeparator,
    };
  }

  // Calculate price with tax
  calculatePriceWithTax(basePrice: number, taxRate: number, currencyCode: string = this.currentCurrency): {
    basePrice: number;
    taxAmount: number;
    totalPrice: number;
    formattedBasePrice: string;
    formattedTaxAmount: string;
    formattedTotalPrice: string;
  } {
    const taxAmount = basePrice * (taxRate / 100);
    const totalPrice = basePrice + taxAmount;

    return {
      basePrice,
      taxAmount,
      totalPrice,
      formattedBasePrice: this.formatAmount(basePrice, currencyCode),
      formattedTaxAmount: this.formatAmount(taxAmount, currencyCode),
      formattedTotalPrice: this.formatAmount(totalPrice, currencyCode),
    };
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance();
export default currencyService;
