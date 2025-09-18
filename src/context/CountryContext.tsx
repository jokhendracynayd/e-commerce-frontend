'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCountry, type UseCountryReturn } from '@/hooks/useCountry';
import { DEFAULT_COUNTRY } from '../../config';

interface CountryContextType extends UseCountryReturn {
  // Additional context-specific methods can be added here
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: React.ReactNode;
  initialCountry?: string;
}

export const CountryProvider: React.FC<CountryProviderProps> = ({
  children,
  initialCountry = DEFAULT_COUNTRY,
}) => {
  const countryHook = useCountry(initialCountry);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize country on mount
  useEffect(() => {
    if (!isInitialized) {
      countryHook.setCountry(initialCountry);
      setIsInitialized(true);
    }
  }, [initialCountry, isInitialized, countryHook]);

  const contextValue: CountryContextType = {
    ...countryHook,
  };

  return (
    <CountryContext.Provider value={contextValue}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountryContext = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountryContext must be used within a CountryProvider');
  }
  return context;
};

// Higher-order component for country-aware components
export const withCountry = <P extends object>(
  Component: React.ComponentType<P & { country: UseCountryReturn }>
) => {
  const WrappedComponent = (props: P) => {
    const country = useCountryContext();
    return <Component {...props} country={country} />;
  };
  
  WrappedComponent.displayName = `withCountry(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default CountryContext;
