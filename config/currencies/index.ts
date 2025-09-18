// Currency configurations
import symbolsConfig from './symbols.json';
import exchangeRatesConfig from './exchange-rates.json';

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

export const currencySymbols: Record<string, CurrencySymbol> = symbolsConfig as Record<string, CurrencySymbol>;
export const exchangeRates: ExchangeRates = exchangeRatesConfig;

export const getCurrencySymbol = (currencyCode: string): CurrencySymbol => {
  return currencySymbols[currencyCode] || currencySymbols['USD'];
};

export const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return 1;
  
  const fromRate = exchangeRates.rates[fromCurrency] || 1;
  const toRate = exchangeRates.rates[toCurrency] || 1;
  
  return toRate / fromRate;
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const rate = getExchangeRate(fromCurrency, toCurrency);
  return amount * rate;
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const symbolConfig = getCurrencySymbol(currencyCode);
  const formattedAmount = amount.toFixed(symbolConfig.decimalPlaces);
  
  if (symbolConfig.position === 'before') {
    return `${symbolConfig.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${symbolConfig.symbol}`;
  }
};

export const getSupportedCurrencies = (): string[] => {
  return exchangeRates.supportedCurrencies;
};

export const getSupportedCountries = (): string[] => {
  return ['US', 'IN', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'CN', 'BR'];
};

export default {
  currencySymbols,
  exchangeRates,
  getCurrencySymbol,
  getExchangeRate,
  convertCurrency,
  formatCurrency,
  getSupportedCurrencies,
  getSupportedCountries,
};
