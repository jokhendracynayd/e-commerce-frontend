'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/types/payment';

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId: string;
  onSelect: (methodId: string) => void;
}

const PaymentMethodSelector = ({ 
  paymentMethods, 
  selectedMethodId,
  onSelect 
}: PaymentMethodSelectorProps) => {
  // Sort payment methods by display order
  const sortedMethods = [...paymentMethods].sort((a, b) => a.displayOrder - b.displayOrder);

  // Handle payment method selection
  const handleMethodSelect = (methodId: string) => {
    onSelect(methodId);
  };

  return (
    <div className="space-y-3">
      {/* Payment method options */}
      {sortedMethods.map(method => (
        <div key={method.id} className="relative">
          <input
            type="radio"
            id={`payment-${method.id}`}
            name="paymentMethod"
            value={method.id}
            checked={selectedMethodId === method.id}
            onChange={() => handleMethodSelect(method.id)}
            className="peer absolute opacity-0 h-0 w-0"
            disabled={!method.isActive}
          />
          <label 
            htmlFor={`payment-${method.id}`} 
            className={`flex items-center p-3 sm:p-4 border ${
              selectedMethodId === method.id 
                ? 'border-[#ed875a] dark:border-[#ed8c61] bg-[#ed875a]/5 dark:bg-[#ed8c61]/5' 
                : 'border-gray-200 dark:border-gray-700'
            } rounded-md cursor-pointer transition-all duration-300 hover:border-[#ed875a]/50 dark:hover:border-[#ed8c61]/50 hover:shadow-md ${!method.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${
              selectedMethodId === method.id 
                ? 'border-[#ed875a] bg-[#ed875a]/20' 
                : 'border-gray-300 dark:border-gray-600'
            } mr-3`}>
              <div className={`h-2.5 w-2.5 rounded-full bg-[#ed875a] ${
                selectedMethodId === method.id ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}></div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-800 dark:text-white">{method.name}</span>
              {method.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{method.description}</p>
              )}
              {method.badges && method.badges.length > 0 && (
                <div className="flex items-center mt-1.5">
                  <div className="flex space-x-2">
                    {method.badges.map((badge, index) => (
                      <span 
                        key={index}
                        className={`
                          inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${badge.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                          ${badge.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                          ${badge.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                          ${badge.type === 'neutral' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                        `}
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-[#ed875a] opacity-0 peer-checked:opacity-100 transition-opacity duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector; 