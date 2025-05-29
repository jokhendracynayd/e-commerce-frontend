'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [pincode, setPincode] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Redirect to home if no items in cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }

    // NOTE: Login requirement is disabled for testing purposes
    // When you're ready to implement authentication, uncomment this block:
    // 
    // if (!isAuthenticated) {
    //   router.push('/login?returnUrl=/checkout');
    // }
    
  }, [items, router]);
  
  // Calculate shipping cost - free if total is above 500
  const shippingCost = totalPrice > 500 ? 0 : 40;
  const totalAmount = totalPrice + shippingCost;
  
  // Format price as Indian Rupees
  const formatPrice = (val: number) => {
    return val.toLocaleString('en-IN');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to a thank you page or show success message
      router.push('/order-success');
    }, 2000);
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-8 text-center border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 mx-auto mb-6 text-[#ed875a] dark:text-[#ed8c61]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/" className="inline-block bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium transition-all hover:shadow-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  // NOTE: Login prompt is disabled for testing purposes
  // When you're ready to implement authentication, uncomment this block:
  // 
  // const isAuthenticated = false;
  // if (!isAuthenticated) {
  //   return (
  //     <div className="container mx-auto px-4 py-12 max-w-5xl">
  //       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
  //       
  //       <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-8 text-center">
  //         <div className="w-24 h-24 mx-auto mb-6 text-[#ed875a] dark:text-[#ed8c61]">
  //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  //           </svg>
  //         </div>
  //         <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Please log in to continue</h2>
  //         <p className="text-gray-600 dark:text-gray-300 mb-8">You need to be logged in to complete your purchase.</p>
  //         <div className="flex flex-col sm:flex-row gap-4 justify-center">
  //           <Link 
  //             href="/login?returnUrl=/checkout" 
  //             className="inline-block bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium transition-all hover:shadow-lg"
  //           >
  //             Login
  //           </Link>
  //           <Link 
  //             href="/signup" 
  //             className="inline-block bg-[#f5f1ed] hover:bg-gray-200 text-gray-800 py-3 px-6 font-medium transition-all"
  //           >
  //             Sign Up
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout form */}
        <div className="lg:w-2/3 space-y-6">
          {/* Product summary */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-4 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor?.id || 'default'}`} className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  {/* Product image */}
                  <div className="sm:w-24 flex-shrink-0">
                    <div className="relative h-24 w-24 mx-auto">
                      <Image 
                        src={item.selectedColor?.image || item.product.images[0]} 
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-1">
                      {item.product.title}
                    </h3>
                    {item.selectedColor && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Color: {item.selectedColor.color}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <div className="text-right sm:text-left mt-2 sm:mt-0">
                      <span className="text-md font-bold text-gray-900 dark:text-white">
                        ₹{formatPrice(item.product.price * item.quantity)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                          ₹{formatPrice(item.product.originalPrice * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Delivery Address</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name*</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number*</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode*</label>
                <input
                  type="text"
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                  placeholder="Enter pincode"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address*</label>
                <textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="h-4 w-4 text-[#ed875a] focus:ring-[#ed8c61]"
                />
                <label htmlFor="card" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Credit/Debit Card
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="h-4 w-4 text-[#ed875a] focus:ring-[#ed8c61]"
                />
                <label htmlFor="upi" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  UPI
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="h-4 w-4 text-[#ed875a] focus:ring-[#ed8c61]"
                />
                <label htmlFor="cod" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Cash on Delivery
                </label>
              </div>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number*
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength={19}
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date*
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CVV*
                    </label>
                    <input
                      type="password"
                      id="cvv"
                      className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                      placeholder="XXX"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'upi' && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    UPI ID*
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    className="w-full border border-gray-300 dark:border-gray-600 py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent"
                    placeholder="yourname@upi"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-6 sticky top-20 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Summary</h2>
            
            {/* Price breakdown */}
            <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  ₹{formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-[#d44506] dark:text-[#ed875a]">Free</span>
                  ) : (
                    `₹${formatPrice(shippingCost)}`
                  )}
                </span>
              </div>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Total</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ₹{formatPrice(totalAmount)}
              </span>
            </div>
            
            {/* Place order button */}
            <button 
              className="w-full bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSubmit}
              disabled={isProcessing || !fullName || !phoneNumber || !deliveryAddress || !pincode}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
            
            {/* Terms and conditions */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 