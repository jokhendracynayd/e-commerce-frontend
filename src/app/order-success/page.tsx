'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Generate mock order details
  const orderNumber = useRef(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const estimatedDelivery = useRef(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString());
  const orderAmount = useRef((2499 + Math.floor(Math.random() * 5000)).toFixed(2));
  
  // Simulate loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Clear the cart when the success page loads, but only once
  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]); // Added clearCart as dependency
  
  return (
    <div className="min-h-screen bg-[#f5f1ed]/50 dark:bg-gray-900 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_8px_30px_-4px_rgba(237,135,90,0.15)] p-6 sm:p-8 md:p-12 border border-gray-100 dark:border-gray-700 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ed875a] to-[#ed8c61]"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#ed875a]/10 to-[#ed8c61]/5 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/10"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-[#ed875a]/10 to-[#ed8c61]/5 dark:from-[#ed875a]/20 dark:to-[#ed8c61]/10"></div>
          
          <div className="relative">
            {/* Success Icon with animation */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 relative">
              <div className={`absolute inset-0 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 scale-0 ${animationComplete ? 'scale-100 animate-pulse-gentle' : ''} transition-transform duration-700`}></div>
              <div className={`absolute inset-0 flex items-center justify-center transform ${animationComplete ? 'scale-100' : 'scale-0'} transition-transform duration-500 delay-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-14 sm:h-14 text-[#ed875a] dark:text-[#ed8c61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className={`transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-500 delay-500 text-center`}>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                Order Placed Successfully!
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Thank you for your purchase. We&apos;ve received your order and will begin processing it right away.
              </p>
            </div>

            {/* Order details card */}
            <div className={`bg-[#f5f1ed]/70 dark:bg-[#d44506]/10 rounded-lg p-5 sm:p-6 mb-8 sm:mb-10 max-w-md mx-auto border border-gray-200 dark:border-gray-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-500 delay-700`}>
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Order Summary</span>
                  <span className="text-[#ed875a] dark:text-[#ed8c61] text-sm px-2 py-1 bg-[#ed875a]/10 dark:bg-[#ed875a]/20 rounded-full">{orderNumber.current}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date Placed:</span>
                  <span className="text-gray-800 dark:text-gray-200">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                  <span className="text-gray-800 dark:text-gray-200">{estimatedDelivery.current}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="text-gray-800 dark:text-gray-200">Credit Card (•••• 4242)</span>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Total Amount:</span>
                  <span className="font-bold text-[#d44506] dark:text-[#ed875a]">₹{orderAmount.current}</span>
                </div>
              </div>
              
              {/* Order confirmation sent indicator */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Order confirmation sent to your email
              </div>
            </div>
            
            {/* Action buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-500 delay-900`}>
              <Link 
                href="/orders"
                className="flex items-center justify-center bg-white dark:bg-gray-700 text-[#ed875a] dark:text-[#ed8c61] py-3 px-6 font-medium border-2 border-[#ed875a] dark:border-[#ed8c61] rounded-md transition-all hover:bg-[#ed875a]/5 dark:hover:bg-[#ed8c61]/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View My Orders
              </Link>
              <Link 
                href="/"
                className="flex items-center justify-center bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium rounded-md transition-all hover:shadow-lg hover:shadow-[#ed875a]/30 dark:hover:shadow-[#ed875a]/20 transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continue Shopping
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className={`mt-10 md:mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-6 sm:gap-10 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-500 delay-1000`}>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ed875a] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ed875a] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ed875a] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

// Add pulsing animation to global CSS (assuming we have access to globals.css)
// If not, this would need to be added via an appropriate method for adding global styles
// @keyframes pulse-gentle {
//   0% { opacity: 0.6; }
//   50% { opacity: 1; }
//   100% { opacity: 0.6; }
// }
// .animate-pulse-gentle {
//   animation: pulse-gentle 2s infinite;
// } 