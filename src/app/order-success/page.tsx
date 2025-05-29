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
  }, [clearCart]); // Added clearCart as dependency
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-8 text-center border border-gray-100 dark:border-gray-700">
        <div className="w-24 h-24 mx-auto mb-6 text-[#ed875a] dark:text-[#ed8c61]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We&apos;ve received your order and will begin processing it right away.
        </p>
        
        <div className="bg-[#f5f1ed] dark:bg-[#d44506]/10 p-4 mb-8 max-w-md mx-auto border border-gray-100 dark:border-gray-700">
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
            className="inline-block bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium transition-all hover:shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 