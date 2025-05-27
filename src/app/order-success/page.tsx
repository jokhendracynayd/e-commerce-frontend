'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);
  
  // Clear the cart when the success page loads, but only once
  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, []); // Empty dependency array to run only once on mount
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 text-green-500 dark:text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-medium">Order Number:</span> #ORD-{Math.floor(100000 + Math.random() * 900000)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Estimated Delivery:</span> {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 