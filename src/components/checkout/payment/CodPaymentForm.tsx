'use client';

import { useState } from 'react';
import { PaymentFormField } from '@/types/payment';

interface CodPaymentFormProps {
  onDataChange: (data: Record<string, string>) => void;
  fields?: PaymentFormField[];
}

const CodPaymentForm = ({ onDataChange, fields = [] }: CodPaymentFormProps) => {
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [timeSlot, setTimeSlot] = useState('anytime');
  const TIME_SLOTS = ['anytime', 'morning', 'afternoon', 'evening'];

  // Handle delivery instructions change
  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDeliveryInstructions(value);
    
    // Update parent component
    onDataChange({
      deliveryInstructions: value,
      timeSlot
    });
  };

  // Handle time slot change
  const handleTimeSlotChange = (slot: string) => {
    setTimeSlot(slot);
    
    // Update parent component
    onDataChange({
      deliveryInstructions,
      timeSlot: slot
    });
  };

  return (
    <div className="mt-0 space-y-4 p-4 sm:p-5 animate-slideDown">
      <div className="group">
        <label htmlFor="deliveryInstructions" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Delivery Instructions (Optional)
        </label>
        <textarea
          id="deliveryInstructions"
          value={deliveryInstructions}
          onChange={handleInstructionsChange}
          rows={2}
          className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
          placeholder="Any special instructions for delivery"
        />
      </div>
      
      <div className="group">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Delivery Time
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_SLOTS.map((time) => (
            <div key={time}>
              <input 
                type="radio" 
                id={`time-${time}`} 
                name="deliveryTime" 
                value={time} 
                checked={timeSlot === time}
                onChange={() => handleTimeSlotChange(time)}
                className="sr-only peer"
              />
              <label 
                htmlFor={`time-${time}`}
                className="flex flex-col items-center justify-center p-2 sm:p-3 h-full text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer peer-checked:border-[#ed875a] peer-checked:text-[#ed875a] peer-checked:bg-[#ed875a]/10 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-900/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Note</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Please have the exact amount ready for a smooth delivery experience</p>
        </div>
      </div>
    </div>
  );
};

export default CodPaymentForm; 