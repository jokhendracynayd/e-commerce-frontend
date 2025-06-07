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
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-5xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 tracking-tight text-center sm:text-left">Checkout</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-6 sm:p-8 md:p-10 text-center border border-gray-100 dark:border-gray-700 rounded-lg">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6 text-[#ed875a] dark:text-[#ed8c61] animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-2.5 sm:py-3 px-5 sm:px-6 font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-7xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 tracking-tight text-center sm:text-left">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">
        {/* Checkout form */}
        <div className="lg:w-2/3 space-y-5 sm:space-y-6">
          {/* Product summary */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-4 sm:p-5 border border-gray-100 dark:border-gray-700 rounded-lg">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedColor?.id || 'default'}`} 
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                >
                  {/* Product image */}
                  <div className="w-full sm:w-24 flex-shrink-0">
                    <div className="relative h-24 w-24 mx-auto sm:mx-0 bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden">
                      <Image 
                        src={item.selectedColor?.image || item.product.images[0]} 
                        alt={item.product.title}
                        fill
                        sizes="96px"
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {item.selectedColor && (
                          <span className="flex items-center">
                            <span 
                              className="w-3 h-3 rounded-full mr-1.5 border border-gray-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            ></span>
                            {item.selectedColor.color}
                          </span>
                        )}
                        <span>
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        ₹{formatPrice(item.product.price * item.quantity)}
                      </span>
                      {item.product.originalPrice && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                          ₹{formatPrice(item.product.originalPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Items:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{items.length} items ({items.reduce((total, item) => total + item.quantity, 0)} units)</span>
            </div>
          </div>
          
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 text-[#ed875a] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Delivery Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="group">
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name*</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number*</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="pincode" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pincode*</label>
                <input
                  type="text"
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                  placeholder="Enter pincode"
                  required
                />
              </div>
              <div className="md:col-span-2 group">
                <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address*</label>
                <textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 text-[#ed875a] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="peer absolute opacity-0 h-0 w-0"
                />
                <label htmlFor="card" className={`flex items-center p-3 sm:p-4 border ${paymentMethod === 'card' ? 'border-[#ed875a] dark:border-[#ed8c61] bg-[#ed875a]/5 dark:bg-[#ed8c61]/5' : 'border-gray-200 dark:border-gray-700'} rounded-md cursor-pointer transition-all duration-200 hover:border-[#ed875a]/50 dark:hover:border-[#ed8c61]/50`}>
                  <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${paymentMethod === 'card' ? 'border-[#ed875a] bg-[#ed875a]/20' : 'border-gray-300 dark:border-gray-600'} mr-3`}>
                    <div className={`h-2.5 w-2.5 rounded-full bg-[#ed875a] ${paymentMethod === 'card' ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">Credit/Debit Card</span>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1.5">
                        <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="w-8 h-5 bg-gray-100 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="relative">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="peer absolute opacity-0 h-0 w-0"
                />
                <label htmlFor="upi" className={`flex items-center p-3 sm:p-4 border ${paymentMethod === 'upi' ? 'border-[#ed875a] dark:border-[#ed8c61] bg-[#ed875a]/5 dark:bg-[#ed8c61]/5' : 'border-gray-200 dark:border-gray-700'} rounded-md cursor-pointer transition-all duration-200 hover:border-[#ed875a]/50 dark:hover:border-[#ed8c61]/50`}>
                  <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${paymentMethod === 'upi' ? 'border-[#ed875a] bg-[#ed875a]/20' : 'border-gray-300 dark:border-gray-600'} mr-3`}>
                    <div className={`h-2.5 w-2.5 rounded-full bg-[#ed875a] ${paymentMethod === 'upi' ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">UPI</span>
                </label>
              </div>
              
              <div className="relative">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="peer absolute opacity-0 h-0 w-0"
                />
                <label htmlFor="cod" className={`flex items-center p-3 sm:p-4 border ${paymentMethod === 'cod' ? 'border-[#ed875a] dark:border-[#ed8c61] bg-[#ed875a]/5 dark:bg-[#ed8c61]/5' : 'border-gray-200 dark:border-gray-700'} rounded-md cursor-pointer transition-all duration-200 hover:border-[#ed875a]/50 dark:hover:border-[#ed8c61]/50`}>
                  <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${paymentMethod === 'cod' ? 'border-[#ed875a] bg-[#ed875a]/20' : 'border-gray-300 dark:border-gray-600'} mr-3`}>
                    <div className={`h-2.5 w-2.5 rounded-full bg-[#ed875a] ${paymentMethod === 'cod' ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">Cash on Delivery</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pay when your order arrives</span>
                  </div>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="mt-5 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-5 animate-fadeIn">
                <div className="group">
                  <label htmlFor="cardNumber" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Card Number*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardNumber"
                      className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 pr-10 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 group">
                    <label htmlFor="expiry" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Expiry Date*
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="flex-1 group">
                    <label htmlFor="cvv" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <div className="flex items-center">
                        <span>CVV*</span>
                        <span className="ml-1 text-gray-400 cursor-help" title="3-digit security code on the back of your card">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                    </label>
                    <input
                      type="password"
                      id="cvv"
                      className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                      placeholder="XXX"
                      maxLength={3}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your card details are encrypted and secure. We don't store your full card information.</p>
              </div>
            )}
            
            {paymentMethod === 'upi' && (
              <div className="mt-5 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-5 animate-fadeIn">
                <div className="group">
                  <label htmlFor="upiId" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    UPI ID*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="upiId"
                      className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 pl-10 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                      placeholder="yourname@upi"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">GooglePay</span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">PhonePe</span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">Paytm</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 sticky top-20 border border-gray-100 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-6">Payment Summary</h2>
            
            {/* Price breakdown */}
            <div className="space-y-3 sm:space-y-4 border-b border-gray-200 dark:border-gray-700 pb-5 sm:pb-6 mb-5 sm:mb-6">
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                  ₹{formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-[#d44506] dark:text-[#ed875a]">Free</span>
                  ) : (
                    `₹${formatPrice(shippingCost)}`
                  )}
                </span>
              </div>
              {shippingCost === 0 && (
                <div className="text-xs text-[#d44506] dark:text-[#ed875a] bg-[#d44506]/5 dark:bg-[#ed875a]/5 p-2 rounded flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free shipping applied on orders above ₹500</span>
                </div>
              )}
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-6 border-b border-dashed border-gray-200 dark:border-gray-700 pb-4">
              <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">Total</span>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  ₹{formatPrice(totalAmount)}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Inclusive of all taxes
                </div>
              </div>
            </div>
            
            {/* Delivery estimate */}
            <div className="flex items-center mb-6 text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Estimated Delivery:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })} - {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
            
            {/* Place order button */}
            <button 
              className="w-full bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center rounded-md transform hover:-translate-y-0.5 active:translate-y-0"
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
                <>
                  Place Order
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            
            {/* Security and terms */}
            <div className="mt-5">
              <div className="flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Secure Checkout</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By placing your order, you agree to our <a href="#" className="underline hover:text-[#ed875a]">Terms of Service</a> and <a href="#" className="underline hover:text-[#ed875a]">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 