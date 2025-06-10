'use client';

import { useState } from 'react';
import { PaymentFormField } from '@/types/payment';

interface UpiPaymentFormProps {
  onDataChange: (data: Record<string, string>) => void;
  fields?: PaymentFormField[];
}

const UpiPaymentForm = ({ onDataChange, fields = [] }: UpiPaymentFormProps) => {
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState('');
  const UPI_APPS = ['GooglePay', 'PhonePe', 'Paytm', 'Other'];

  // Handle UPI ID change
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUpiId(value);
    
    // Update parent component
    onDataChange({
      upiId: value,
      upiApp
    });
  };

  // Handle UPI app change
  const handleUpiAppChange = (app: string) => {
    setUpiApp(app);
    
    // Update parent component
    onDataChange({
      upiId,
      upiApp: app
    });
  };

  return (
    <div className="mt-0 space-y-4 p-4 sm:p-5 animate-slideDown">
      <div className="group">
        <label htmlFor="upiId" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          UPI ID*
        </label>
        <div className="relative">
          <input
            type="text"
            id="upiId"
            value={upiId}
            onChange={handleUpiIdChange}
            className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 pl-10 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
            placeholder="yourname@upi"
            required
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter your UPI ID (e.g., yourname@upi)</p>
      </div>
      
      <div className="group">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          UPI App
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {UPI_APPS.map((app) => (
            <div key={app}>
              <input 
                type="radio" 
                id={`upi-${app}`} 
                name="upiApp" 
                value={app} 
                checked={upiApp === app}
                onChange={() => handleUpiAppChange(app)}
                className="sr-only peer"
              />
              <label 
                htmlFor={`upi-${app}`}
                className="flex flex-col items-center justify-center p-2 sm:p-3 h-full text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer peer-checked:border-[#ed875a] peer-checked:text-[#ed875a] peer-checked:bg-[#ed875a]/10 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
              >
                {app}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center mt-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">How it works</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">After order confirmation, you'll receive a payment request on your selected UPI app</p>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentForm; 