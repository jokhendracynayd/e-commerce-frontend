'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface CheckoutFormProps {
  onSubmitOrder: () => void;
  isFormValid: boolean;
  isProcessing?: boolean;
}

/**
 * CheckoutForm component for handling cart checkout process
 * and authentication check before purchase
 */
const CheckoutForm = ({ onSubmitOrder, isFormValid, isProcessing = false }: CheckoutFormProps) => {
  const { isAuthenticated } = useAuth();
  const { syncWithBackend } = useCart();
  const [isCartSyncing, setIsCartSyncing] = useState(false);
  const router = useRouter();

  /**
   * Handle the checkout form submission
   * - If user is not authenticated, redirect to login page with returnUrl
   * - If authenticated, sync cart with backend before proceeding with order
   */
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page with return URL to checkout page
      router.push('/login?returnUrl=/checkout');
      return;
    }
    
    // If authenticated, sync cart before proceeding
    try {
      setIsCartSyncing(true);
      await syncWithBackend();
      
      // Now proceed with checkout order submission
      onSubmitOrder();
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to sync your cart. Please try again.');
    } finally {
      setIsCartSyncing(false);
    }
  };
  
  return (
    <button 
      className="w-full bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center rounded-md transform hover:-translate-y-0.5 active:translate-y-0"
      onClick={handleCheckoutSubmit}
      disabled={isCartSyncing || isProcessing || !isFormValid}
      type="button"
    >
      {isCartSyncing ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Syncing Cart...
        </>
      ) : isProcessing ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Order...
        </>
      ) : (
        <>
          Place Order
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  );
};

export default CheckoutForm; 