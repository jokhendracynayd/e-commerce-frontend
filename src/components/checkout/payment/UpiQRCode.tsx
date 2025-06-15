'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UpiApp } from '@/types';

interface UpiQRCodeProps {
  qrCode: string;
  transactionId: string;
  upiApp?: string;
  onExpired?: () => void;
  expiryMinutes?: number;
}

const UpiQRCode = ({
  qrCode,
  transactionId,
  upiApp,
  onExpired,
  expiryMinutes = 10
}: UpiQRCodeProps) => {
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60); // seconds
  const [isExpired, setIsExpired] = useState(false);
  
  // Calculate time remaining in minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Set up timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      if (onExpired) {
        onExpired();
      }
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onExpired]);
  
  // Get UPI app logo
  const getUpiAppLogo = () => {
    if (!upiApp) return null;
    
    switch (upiApp) {
      case UpiApp.GOOGLE_PAY:
        return '/images/payment/gpay-logo.png';
      case UpiApp.PHONE_PE:
        return '/images/payment/phonepe-logo.png';
      case UpiApp.PAYTM:
        return '/images/payment/paytm-logo.png';
      case UpiApp.BHARAT_PE:
        return '/images/payment/bharatpe-logo.png';
      default:
        return '/images/payment/upi-logo.png';
    }
  };
  
  const appLogo = getUpiAppLogo();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm mx-auto">
      <div className="flex flex-col items-center">
        {/* UPI App logo if available */}
        {appLogo && (
          <div className="mb-3">
            <div className="w-12 h-12 relative">
              <Image 
                src={appLogo} 
                alt={upiApp || 'UPI Payment'} 
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          Scan QR to Pay
        </h3>
        
        {!isExpired ? (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
              Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
            
            {/* QR Code */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
              <img src={qrCode} alt="UPI QR Code" className="w-56 h-56" />
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Transaction ID: {transactionId.substring(0, 8)}...
              </p>
              
              {upiApp && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Open {upiApp} app to complete payment
                </p>
              )}
            </div>
            
            {/* Payment instructions */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 w-full">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white">How to pay:</h4>
              <ol className="text-xs text-gray-500 dark:text-gray-400 list-decimal pl-4">
                <li>Open any UPI app on your phone</li>
                <li>Select "Scan & Pay" option</li>
                <li>Scan the QR code shown above</li>
                <li>Verify the amount and complete the payment</li>
              </ol>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              QR Code Expired
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              This payment request has expired.
            </p>
            <button 
              className="px-4 py-2 bg-[#ed875a] text-white rounded-md hover:bg-[#d44506] transition-colors"
              onClick={onExpired}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpiQRCode; 