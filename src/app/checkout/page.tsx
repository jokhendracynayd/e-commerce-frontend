'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    // Redirect to home if no items in cart
    if (items.length === 0) {
      router.push('/');
      return;
    }
    
    // Redirect to information step
    router.push('/checkout/information');
  }, [items, router]);

  // Show loading state while redirecting
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-5xl">
      <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-8 text-center border border-gray-100 dark:border-gray-700 rounded-lg">
        <div className="w-16 h-16 mx-auto mb-4 text-[#ed875a] dark:text-[#ed8c61] animate-spin">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Redirecting to Checkout</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Please wait while we redirect you to the checkout process...</p>
      </div>
    </div>
  );
}
