'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/types/payment';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardPaymentForm from './CardPaymentForm';
import UpiPaymentForm from './UpiPaymentForm';
import CodPaymentForm from './CodPaymentForm';

// Define default payment methods (can be replaced with API data)
const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely using your credit or debit card',
    isActive: true,
    requiresAdditionalInfo: true,
    displayOrder: 1,
    badges: [
      { text: 'Secure', type: 'success' }
    ]
  },
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay using your preferred UPI app',
    isActive: true,
    requiresAdditionalInfo: true,
    displayOrder: 2,
    badges: [
      { text: 'Instant', type: 'info' }
    ]
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives at your doorstep',
    isActive: true,
    requiresAdditionalInfo: true,
    displayOrder: 3,
    badges: [
      { text: 'Available', type: 'success' }
    ]
  }
];

interface PaymentSectionProps {
  onPaymentDataChange: (methodId: string, data: Record<string, string>) => void;
  initialMethod?: string;
  paymentMethods?: PaymentMethod[];
}

const PaymentSection = ({ 
  onPaymentDataChange, 
  initialMethod = 'cod',
  paymentMethods = DEFAULT_PAYMENT_METHODS
}: PaymentSectionProps) => {
  const [selectedMethodId, setSelectedMethodId] = useState(initialMethod);
  const [paymentData, setPaymentData] = useState<Record<string, string>>({});

  // Handle payment method change
  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedMethodId(methodId);
    
    // Immediately trigger the parent with the current payment data and new method
    // This ensures the payment method is updated in the parent component
    console.log(`Payment method selected in PaymentSection: ${methodId}`);
    onPaymentDataChange(methodId, paymentData);
    
    // For COD, send default data immediately to ensure it's properly set
    if (methodId === 'cod') {
      const codDefaultData = {
        deliveryInstructions: '',
        timeSlot: 'anytime'
      };
      handleFormDataChange(codDefaultData);
    }
  };

  // Handle form data change
  const handleFormDataChange = (data: Record<string, string>) => {
    const newData = { ...paymentData, ...data };
    setPaymentData(newData);
    onPaymentDataChange(selectedMethodId, newData);
  };

  // Render the appropriate payment form based on selected method
  const renderPaymentForm = () => {
    switch (selectedMethodId) {
      case 'card':
        return <CardPaymentForm onDataChange={handleFormDataChange} />;
      case 'upi':
        return <UpiPaymentForm onDataChange={handleFormDataChange} />;
      case 'cod':
        return <CodPaymentForm onDataChange={handleFormDataChange} />;
      default:
        return null;
    }
  };

  // Ensure the parent is updated with the initial method on component mount
  useEffect(() => {
    onPaymentDataChange(selectedMethodId, paymentData);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 border border-gray-100 dark:border-gray-700 rounded-lg">
      <div className="flex items-center mb-4 sm:mb-5">
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 text-[#ed875a] mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Payment Method</h2>
      </div>
      
      {/* Payment Method Selector */}
      <PaymentMethodSelector 
        paymentMethods={paymentMethods} 
        selectedMethodId={selectedMethodId}
        onSelect={handlePaymentMethodChange}
      />
      
      {/* Dynamic Payment Form */}
      {renderPaymentForm()}
    </div>
  );
};

export default PaymentSection; 