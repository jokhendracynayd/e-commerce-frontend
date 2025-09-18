// Country configurations
import usConfig from './us.json';
import inConfig from './in.json';
import gbConfig from './gb.json';
import bdConfig from './bd.json';

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  phoneCode: string;
  timezone: string;
  locale: string;
  labels: {
    [key: string]: {
      label: string;
      placeholder: string;
      required: boolean;
      helpText?: string;
    };
  };
  validation: {
    [key: string]: string;
  };
  fieldOrder: string[];
  requiredFields: string[];
  addressFormat: {
    fields: string[];
    required: string[];
    separator: string;
  };
}

export const countryConfigs: Record<string, CountryConfig> = {
  US: usConfig,
  IN: inConfig,
  GB: gbConfig,
  BD: bdConfig,
};

export const getCountryConfig = (countryCode: string): CountryConfig => {
  return countryConfigs[countryCode] || countryConfigs['IN'];
};

export const getSupportedCountries = (): string[] => {
  return Object.keys(countryConfigs);
};

export const getCountryLabels = (countryCode: string) => {
  const config = getCountryConfig(countryCode);
  return config.labels;
};

export const getFieldLabel = (countryCode: string, fieldName: string): string => {
  const labels = getCountryLabels(countryCode);
  return labels[fieldName]?.label || fieldName;
};

export const getFieldConfig = (countryCode: string, fieldName: string) => {
  const labels = getCountryLabels(countryCode);
  return labels[fieldName];
};

export const getFieldOrder = (countryCode: string): string[] => {
  const config = getCountryConfig(countryCode);
  return config.fieldOrder;
};

export const getRequiredFields = (countryCode: string): string[] => {
  const config = getCountryConfig(countryCode);
  return config.requiredFields;
};

export const getValidationRules = (countryCode: string) => {
  const config = getCountryConfig(countryCode);
  return config.validation;
};

export default countryConfigs;
