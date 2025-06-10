'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/types/payment';
import { getAvailablePaymentMethods, getPaymentMethodConfig } from '@/services/paymentService';

/**
 * Custom hook for fetching and managing payment methods
 */
export const usePaymentMethods = (initialMethodId: string = 'card') => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(initialMethodId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get available payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const methods = await getAvailablePaymentMethods();
        setPaymentMethods(methods);

        // If the initial method isn't available, select the first available one
        if (methods.length > 0 && !methods.some(m => m.id === initialMethodId)) {
          setSelectedMethodId(methods[0].id);
        }
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Failed to load payment methods. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [initialMethodId]);

  // Select a payment method
  const selectPaymentMethod = (methodId: string) => {
    // Verify the method exists and is active
    const method = paymentMethods.find(m => m.id === methodId);
    if (method && method.isActive) {
      setSelectedMethodId(methodId);
      return true;
    }
    return false;
  };

  // Check if a method is active
  const isMethodAvailable = (methodId: string) => {
    return paymentMethods.some(m => m.id === methodId && m.isActive);
  };

  // Get the currently selected method
  const getSelectedMethod = () => {
    return paymentMethods.find(m => m.id === selectedMethodId);
  };

  // Sort methods by display order
  const getSortedMethods = () => {
    return [...paymentMethods].sort((a, b) => a.displayOrder - b.displayOrder);
  };

  return {
    paymentMethods,
    sortedPaymentMethods: getSortedMethods(),
    selectedMethodId,
    selectedMethod: getSelectedMethod(),
    isLoading,
    error,
    selectPaymentMethod,
    isMethodAvailable
  };
}; 