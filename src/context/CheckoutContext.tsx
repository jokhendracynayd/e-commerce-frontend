'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Address } from '@/types/address';

interface CheckoutData {
  // Delivery Address
  deliveryAddress: string;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  selectedAddress: Address | null;
  selectedAddressId: string | undefined;
  showManualAddressForm: boolean;
  
  // Billing Address
  useSameAddressForBilling: boolean;
  selectedBillingAddressId: string | undefined;
  selectedBillingAddress: Address | null;
  showBillingManualForm: boolean;
  billingFullName: string;
  billingPhoneNumber: string;
  billingPincode: string;
  billingAddress: string;
  
  // Payment
  paymentMethod: string;
  paymentData: Record<string, string>;
  
  // Order
  orderId: string | null;
  paymentStarted: boolean;
  paymentError: string | null;
}

interface CheckoutContextType {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
  resetCheckoutData: () => void;
  isStep1Complete: boolean;
  isStep2Complete: boolean;
}

const initialCheckoutData: CheckoutData = {
  // Delivery Address
  deliveryAddress: '',
  fullName: '',
  phoneNumber: '',
  pincode: '',
  selectedAddress: null,
  selectedAddressId: undefined,
  showManualAddressForm: false,
  
  // Billing Address
  useSameAddressForBilling: true,
  selectedBillingAddressId: undefined,
  selectedBillingAddress: null,
  showBillingManualForm: false,
  billingFullName: '',
  billingPhoneNumber: '',
  billingPincode: '',
  billingAddress: '',
  
  // Payment
  paymentMethod: 'cod',
  paymentData: {
    deliveryInstructions: '',
    timeSlot: 'anytime'
  },
  
  // Order
  orderId: null,
  paymentStarted: false,
  paymentError: null,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData);

  const updateCheckoutData = (updates: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...updates }));
  };

  const resetCheckoutData = () => {
    setCheckoutData(initialCheckoutData);
  };

  // Validation functions
  const isStep1Complete = !!(
    // Either manual address form is filled OR a saved address is selected
    (checkoutData.showManualAddressForm && 
     checkoutData.fullName &&
     checkoutData.phoneNumber &&
     checkoutData.deliveryAddress &&
     checkoutData.pincode) ||
    (!checkoutData.showManualAddressForm && 
     checkoutData.selectedAddressId && 
     checkoutData.selectedAddress) &&
    // Billing address validation
    (checkoutData.useSameAddressForBilling || 
     (checkoutData.showBillingManualForm && 
      checkoutData.billingFullName && 
      checkoutData.billingPhoneNumber && 
      checkoutData.billingAddress && 
      checkoutData.billingPincode) ||
     (!checkoutData.showBillingManualForm && 
      checkoutData.selectedBillingAddressId && 
      checkoutData.selectedBillingAddress))
  );

  const isStep2Complete = !!(
    checkoutData.paymentMethod &&
    Object.keys(checkoutData.paymentData).length > 0
  );

  return (
    <CheckoutContext.Provider 
      value={{ 
        checkoutData, 
        updateCheckoutData, 
        resetCheckoutData,
        isStep1Complete,
        isStep2Complete
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
