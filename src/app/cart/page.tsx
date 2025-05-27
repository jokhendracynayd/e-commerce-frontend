'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  
  // Calculate shipping cost - free if total is above 500
  const shippingCost = totalPrice > 500 ? 0 : 40;
  const totalAmount = totalPrice + shippingCost;
  
  // Format price as Indian Rupees
  const formatPrice = (val: number) => {
    return val.toLocaleString('en-IN');
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      setApplyingCoupon(true);
      setShowCouponSuccess(true);
      
      setTimeout(() => {
        setShowCouponSuccess(false);
      }, 3000);
    }
  };
  
  // Calculate estimated delivery
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return deliveryDate.toLocaleDateString('en-IN', options);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Your Shopping Cart</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="w-32 h-32 mx-auto mb-8 text-gray-300 dark:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our products and find something you'll love.
          </p>
          <Link href="/" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Start Shopping
          </Link>
        </div>
        
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Shopping Cart</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3 space-y-5">
          {items.map((item, index) => (
            <motion.div 
              key={`${item.product.id}-${item.selectedColor?.id || 'default'}`} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product image */}
                <div className="sm:w-36 flex-shrink-0">
                  <div className="relative h-36 w-full mx-auto bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
                    <Image 
                      src={item.selectedColor?.image || item.product.images[0]} 
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                
                {/* Product details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {item.product.title}
                      </h3>
                      {item.selectedColor && (
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                            Color:
                          </span>
                          <span className="flex items-center">
                            <span 
                              className="w-4 h-4 rounded-full border border-gray-300 mr-1.5"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            ></span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {item.selectedColor.color}
                            </span>
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          In stock
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="h-9 w-12 flex items-center justify-center border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        className="w-9 h-9 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-r-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{formatPrice(item.product.price * item.quantity)}
                      </div>
                      {item.product.originalPrice && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₹{formatPrice(item.product.originalPrice * item.quantity)}
                        </div>
                      )}
                      {item.product.originalPrice && (
                        <div className="text-xs font-medium text-green-600 dark:text-green-400 mt-0.5">
                          {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% off
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 mt-8 border border-gray-100 dark:border-gray-700">
            <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
            
            <button 
              className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium flex items-center"
              onClick={() => items.forEach(item => removeFromCart(item.product.id))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            {/* Estimated delivery */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Estimated Delivery</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getEstimatedDelivery()}</p>
              </div>
            </div>
            
            {/* Coupon code */}
            <div className="mb-6">
              <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apply Coupon Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2.5 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                  className={`px-4 py-2.5 rounded-r-lg font-medium transition-all ${
                    applyingCoupon
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500'
                  }`}
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                >
                  {applyingCoupon ? 'Applied' : 'Apply'}
                </button>
              </div>
              
              {showCouponSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Coupon successfully applied!
                </motion.div>
              )}
            </div>
            
            {/* Price breakdown */}
            <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">₹{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  ) : (
                    `₹${formatPrice(shippingCost)}`
                  )}
                </span>
              </div>
              {applyingCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Discount (WELCOME10)
                  </span>
                  <span>-₹{formatPrice(Math.round(totalPrice * 0.1))}</span>
                </div>
              )}
              
              {/* Tax info */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Taxes</span>
                <span className="text-gray-500 dark:text-gray-400">Included</span>
              </div>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Total</span>
              <motion.span 
                key={applyingCoupon ? 'discounted' : 'regular'}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                ₹{formatPrice(applyingCoupon ? totalAmount - Math.round(totalPrice * 0.1) : totalAmount)}
              </motion.span>
            </div>
            
            {/* Checkout button */}
            <Link href="/checkout" className="block w-full">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceed to Checkout
              </button>
            </Link>
            
            {/* Payment methods */}
            <div className="mt-6 flex items-center justify-center space-x-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">We accept:</span>
              <div className="flex space-x-2 ml-2">
                <div className="bg-white dark:bg-gray-700 p-1.5 rounded shadow-sm">
                  <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="24" rx="4" fill="#F3F4F6"/>
                    <path d="M14.5 17.5H21L22.5 14.5H16L14.5 17.5Z" fill="#FF5F00"/>
                    <path d="M16 11.5H22.5L24 8.5H17.5L16 11.5Z" fill="#FF5F00"/>
                    <path d="M14 6.5H17.5L19 3.5H15.5L14 6.5Z" fill="#FF5F00"/>
                  </svg>
                </div>
                <div className="bg-white dark:bg-gray-700 p-1.5 rounded shadow-sm">
                  <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="24" rx="4" fill="#F3F4F6"/>
                    <path d="M15.5 15.5H19.5V9.5H15.5V15.5Z" fill="#2FABF7"/>
                    <path d="M19.5 12.5C19.5 14.5 20.5 15.5 22.5 15.5C24.5 15.5 25.5 14.5 25.5 12.5C25.5 10.5 24.5 9.5 22.5 9.5C20.5 9.5 19.5 10.5 19.5 12.5Z" fill="#228FE0"/>
                  </svg>
                </div>
                <div className="bg-white dark:bg-gray-700 p-1.5 rounded shadow-sm">
                  <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="24" rx="4" fill="#F3F4F6"/>
                    <path d="M26.5 11.5C26.5 13.5 25 15.5 22.5 15.5H15.5V9.5H22.5C25 9.5 26.5 11.5 26.5 11.5V11.5Z" fill="#016FD0"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Safety message */}
            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 