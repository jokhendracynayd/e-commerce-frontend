'use client';

import { useState } from 'react';
import { PaymentFormField } from '@/types/payment';

interface CardPaymentFormProps {
  onDataChange: (data: Record<string, string>) => void;
  fields?: PaymentFormField[];
}

const CardPaymentForm = ({ onDataChange, fields = [] }: CardPaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Handle card number formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value)) {
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      setCardNumber(formattedValue);
      
      // Update parent component
      onDataChange({
        cardNumber: value,
        cardExpiry,
        cardCvv,
        nameOnCard,
        saveCard: saveCard.toString()
      });
    }
  };

  // Handle expiry date formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.length <= 2) {
        // Just month
        if (value.length === 1 && parseInt(value) > 1) {
          value = '0' + value; // Add leading zero for months > 1
        }
        setCardExpiry(value);
      } else {
        // Month and year
        const month = value.substring(0, 2);
        const year = value.substring(2, 4);
        setCardExpiry(`${month}/${year}`);
      }

      // Update parent component
      onDataChange({
        cardNumber,
        cardExpiry: value,
        cardCvv,
        nameOnCard,
        saveCard: saveCard.toString()
      });
    } else {
      setCardExpiry('');
      
      // Update parent component
      onDataChange({
        cardNumber,
        cardExpiry: '',
        cardCvv,
        nameOnCard,
        saveCard: saveCard.toString()
      });
    }
  };

  // Handle CVV change
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '');
    setCardCvv(value);
    
    // Update parent component
    onDataChange({
      cardNumber,
      cardExpiry,
      cardCvv: value,
      nameOnCard,
      saveCard: saveCard.toString()
    });
  };

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameOnCard(e.target.value);
    
    // Update parent component
    onDataChange({
      cardNumber,
      cardExpiry,
      cardCvv,
      nameOnCard: e.target.value,
      saveCard: saveCard.toString()
    });
  };

  // Handle save card toggle
  const handleSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveCard(e.target.checked);
    
    // Update parent component
    onDataChange({
      cardNumber,
      cardExpiry,
      cardCvv,
      nameOnCard,
      saveCard: e.target.checked.toString()
    });
  };

  return (
    <div className="mt-0 space-y-4 p-4 sm:p-5 animate-slideDown">
      <div className="group">
        <label htmlFor="cardNumber" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Card Number*
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            className="w-full border border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 pr-14 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <div className="w-8 h-5 opacity-70">
              <img src="/visa.svg" alt="Visa" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Enter your 16-digit card number</p>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 group">
          <label htmlFor="expiry" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Expiry Date*
          </label>
          <input
            type="text"
            id="expiry"
            className="w-full border border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
            placeholder="MM/YY"
            maxLength={5}
            value={cardExpiry}
            onChange={handleExpiryChange}
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">MM/YY format</p>
        </div>
        
        <div className="flex-1 group">
          <label htmlFor="cvv" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <div className="flex items-center">
              <span>CVV/CVC*</span>
              <span className="ml-1 text-gray-400 cursor-help group relative" title="3 or 4 digit security code">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Security code on back of card
                </span>
              </span>
            </div>
          </label>
          <div className="relative">
            <input
              type="password"
              id="cvv"
              className="w-full border border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
              placeholder="•••"
              maxLength={4}
              value={cardCvv}
              onChange={handleCvvChange}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="group">
        <label htmlFor="nameOnCard" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Name on Card*
        </label>
        <input
          type="text"
          id="nameOnCard"
          className="w-full border border-gray-300 dark:border-gray-600 py-2.5 sm:py-3 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
          placeholder="Name as it appears on your card"
          value={nameOnCard}
          onChange={handleNameChange}
          required
        />
      </div>

      <div className="flex items-center mt-2">
        <input
          id="saveCard"
          type="checkbox"
          className="h-4 w-4 text-[#ed875a] focus:ring-[#ed875a] border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-[#ed8c61]"
          checked={saveCard}
          onChange={handleSaveCardChange}
        />
        <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Save card for future payments
        </label>
      </div>

      <div className="flex items-center mt-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Secure payment processing</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm; 