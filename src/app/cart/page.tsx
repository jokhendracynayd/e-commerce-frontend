'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useProductAvailability } from '@/hooks/useProductAvailability';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const [unavailableItems, setUnavailableItems] = useState<Set<string>>(new Set());
  
  // Extract product and variant IDs from cart items
  const productIds = useMemo(() => items.map(item => item.product.id), [items]);
  const variantIds = useMemo(() => 
    items
      .filter(item => item.selectedColor?.id)
      .map(item => item.selectedColor!.id), 
    [items]
  );
  
  // Use the batch availability hook to check all items at once
  const { 
    productAvailability, 
    variantAvailability,
    loading: checkingAvailability
  } = useProductAvailability({
    productIds,
    variantIds,
    refreshInterval: 30000 // 30 seconds
  });
  
  // Update unavailable items whenever availability data changes
  useEffect(() => {
    if (checkingAvailability) return;
    
    const newUnavailableItems = new Set<string>();
    
    // Check each cart item against availability data
    items.forEach(item => {
      if (!productIds.includes(item.product.id)) return;
      
      const isAvailable = item.selectedColor?.id 
        ? variantAvailability[item.selectedColor.id]?.availableQuantity >= item.quantity
        : productAvailability[item.product.id]?.availableQuantity >= item.quantity;
      
      if (!isAvailable) {
        newUnavailableItems.add(item.product.id);
      }
    });
    
    setUnavailableItems(newUnavailableItems);
  }, [items, productAvailability, variantAvailability, checkingAvailability, productIds]);
  
  // Calculate order summary values directly from cart items
  const orderSummary = useMemo(() => {
    // Calculate subtotal from items
    const calculatedSubtotal = items.reduce((total, item) => {
      // Use discountPrice if available, otherwise use regular price
      const itemPrice = item.product.discountPrice || item.product.price;
      return total + (itemPrice * item.quantity);
    }, 0);
    
    // Calculate shipping - free if subtotal is above 500
    const calculatedShipping = calculatedSubtotal > 500 ? 0 : 40;
    
    // Calculate tax (5% of subtotal)
    const calculatedTax = Math.round(calculatedSubtotal * 0.05);
    
    // Calculate discount if coupon is applied
    const calculatedDiscount = applyingCoupon ? Math.round(calculatedSubtotal * 0.1) : 0;
    
    // Calculate total
    const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax - calculatedDiscount;
    
    // Calculate item count
    const calculatedItemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    // Get default currency from the first item, or use INR as fallback
    const defaultCurrency = items.length > 0 ? (items[0].product.currency || 'INR') : 'INR';
    
    return {
      subtotal: calculatedSubtotal,
      shippingCost: calculatedShipping,
      tax: calculatedTax,
      discount: calculatedDiscount,
      total: calculatedTotal,
      itemCount: calculatedItemCount,
      defaultCurrency
    };
  }, [items, applyingCoupon]);
  
  // Format price as Indian Rupees
  const formatPrice = (val: number, currency = 'INR') => {
    return formatCurrency(val, currency);
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

  // Replace the individual CartItemAvailability components with a simpler version
  // that uses the already fetched availability data
  const renderItemAvailability = (productId: string, quantity: number, variantId?: string) => {
    if (checkingAvailability) {
      return <span className="text-xs text-gray-500 dark:text-gray-400">Checking...</span>;
    }
    
    const availability = variantId 
      ? variantAvailability[variantId]
      : productAvailability[productId];
    
    if (!availability) return null;
    
    const isAvailable = availability.stockStatus !== 'OUT_OF_STOCK' && 
                        availability.availableQuantity >= quantity;
    
    if (!isAvailable) {
      return (
        <div className="text-red-600 dark:text-red-400 text-xs flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {availability.stockStatus === 'OUT_OF_STOCK' 
            ? 'Out of stock' 
            : `Only ${availability.availableQuantity} available`}
        </div>
      );
    }
    
    return (
      <div className="text-green-600 dark:text-green-400 text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        In stock
      </div>
    );
  };

  // Check if checkout should be disabled
  const isCheckoutDisabled = unavailableItems.size > 0;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-5xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 tracking-tight text-center sm:text-left">Your Shopping Cart</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-6 sm:p-8 md:p-12 text-center border border-gray-100 dark:border-gray-700 rounded-lg">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 text-gray-300 dark:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </motion.div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Explore our products and find something you&apos;ll love.
          </p>
          <Link href="/" className="inline-flex items-center bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-2.5 sm:py-3 px-6 sm:px-8 font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Start Shopping
          </Link>
        </div>
        
        <div className="mt-10 sm:mt-12 md:mt-16">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Recommended Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-[0_5px_20px_-10px_rgba(237,135,90,0.15)] border border-gray-100 dark:border-gray-700 rounded-md hover:shadow-[0_8px_25px_-5px_rgba(237,135,90,0.25)] transition-all duration-300">
                <div className="aspect-square bg-[#f5f1ed] dark:bg-gray-700 mb-3 rounded"></div>
                <div className="h-4 bg-[#f5f1ed] dark:bg-gray-600 w-3/4 mb-2 rounded-sm"></div>
                <div className="h-4 bg-[#f5f1ed] dark:bg-gray-600 w-1/2 rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-7xl">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight text-center sm:text-left">Shopping Cart</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">
          You have {orderSummary.itemCount} {orderSummary.itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3 space-y-4 sm:space-y-5">
          {items.map((item, index) => (
            <motion.div 
              key={`${item.product.id}-${item.selectedColor?.id || 'default'}`} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 shadow-[0_5px_20px_-10px_rgba(237,135,90,0.15)] p-4 sm:p-5 border border-gray-100 dark:border-gray-700 hover:shadow-[0_8px_30px_-10px_rgba(237,135,90,0.25)] transition-all duration-300 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Product image */}
                <div className="w-full sm:w-36 flex-shrink-0">
                  <div className="relative h-32 sm:h-36 w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
                    <Image 
                      src={item.selectedColor?.image || item.product.images[0]} 
                      alt={item.product.title}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, 144px"
                    />
                  </div>
                </div>
                
                {/* Product details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {item.product.title}
                      </h3>
                      {item.selectedColor && (
                        <div className="flex items-center mt-1.5 sm:mt-2">
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mr-2">
                            Color:
                          </span>
                          <span className="flex items-center">
                            <span 
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300 mr-1.5"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            ></span>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              {item.selectedColor.color}
                            </span>
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-1.5 sm:mt-2">
                        {renderItemAvailability(
                          item.product.id,
                          item.quantity,
                          item.selectedColor?.id
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-[#d44506] dark:text-gray-500 dark:hover:text-[#ed875a] transition-colors p-1 sm:p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-auto pt-4 sm:pt-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="h-8 sm:h-9 w-10 sm:w-12 flex items-center justify-center border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-r-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      {item.selectedColor ? (
                        // Show variant pricing
                                                  <div>
                            <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                             {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.price * item.quantity, item.product.currency)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                             {item.quantity} × {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.price, item.product.currency)}
                            </div>
                          </div>
                      ) : (
                        // Show product pricing with potential discount
                        <div>
                          {item.product.discountPrice ? (
                                                          <>
                                <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                 {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.discountPrice * item.quantity, item.product.currency)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                                 {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.price * item.quantity, item.product.currency)}
                                </div>
                                <div className="text-xs font-medium text-[#d44506] dark:text-[#ed875a] mt-0.5">
                                 {Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)}% off • {item.quantity} × {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.discountPrice, item.product.currency)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                 {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.price * item.quantity, item.product.currency)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                 {item.quantity} × {getCurrencySymbol(item.product.currency)}{formatPrice(item.product.price, item.product.currency)}
                                </div>
                              </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-5 mt-6 sm:mt-8 border border-gray-100 dark:border-gray-700 rounded-lg gap-3 sm:gap-0">
            <Link href="/" className="text-[#ed875a] dark:text-[#ed8c61] font-medium flex items-center hover:underline transition-all w-full sm:w-auto justify-center sm:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
            
            <button 
              className="text-gray-700 dark:text-gray-300 hover:text-[#d44506] dark:hover:text-[#ed875a] font-medium flex items-center w-full sm:w-auto justify-center sm:justify-start"
              onClick={() => clearCart()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 sticky top-20 border border-gray-100 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-6">Order Summary</h2>
            
            {/* Estimated delivery */}
            <div className="bg-[#f5f1ed] dark:bg-[#d44506]/10 p-3 sm:p-4 mb-5 sm:mb-6 flex items-start rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#ed875a] mr-2 sm:mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">Estimated Delivery</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{getEstimatedDelivery()}</p>
              </div>
            </div>
            
            {/* Coupon code */}
            <div className="mb-5 sm:mb-6">
              <label htmlFor="coupon" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apply Coupon Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all rounded-l-md"
                />
                <button 
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 font-medium text-xs sm:text-sm transition-all rounded-r-md ${
                    applyingCoupon
                      ? 'bg-[#f5f1ed] dark:bg-[#d44506]/20 text-[#d44506] dark:text-[#ed875a]'
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
                  className="mt-2 text-xs sm:text-sm text-[#d44506] dark:text-[#ed875a] flex items-center"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Coupon successfully applied!
                </motion.div>
              )}
            </div>
            
            {/* Price breakdown */}
            <div className="space-y-3 sm:space-y-4 border-b border-gray-200 dark:border-gray-700 pb-5 sm:pb-6 mb-5 sm:mb-6">
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Subtotal ({orderSummary.itemCount} items)</span>
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                  {getCurrencySymbol(orderSummary.defaultCurrency)}{formatPrice(orderSummary.subtotal, orderSummary.defaultCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                  {orderSummary.shippingCost === 0 ? (
                    <span className="text-[#d44506] dark:text-[#ed875a]">Free</span>
                  ) : (
                    `${getCurrencySymbol(orderSummary.defaultCurrency)}${formatPrice(orderSummary.shippingCost, orderSummary.defaultCurrency)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Tax (5%)</span>
                <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                  {getCurrencySymbol(orderSummary.defaultCurrency)}{formatPrice(orderSummary.tax, orderSummary.defaultCurrency)}
                </span>
              </div>
              {applyingCoupon && (
                <div className="flex justify-between text-[#d44506] dark:text-[#ed875a]">
                  <span className="text-sm sm:text-base">
                    Discount (WELCOME10)
                  </span>
                  <span className="text-sm sm:text-base">-{getCurrencySymbol(orderSummary.defaultCurrency)}{formatPrice(orderSummary.discount, orderSummary.defaultCurrency)}</span>
                </div>
              )}
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">Total</span>
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white"
              >
                {getCurrencySymbol(orderSummary.defaultCurrency)}{formatPrice(orderSummary.total, orderSummary.defaultCurrency)}
              </motion.span>
            </div>
            
            {/* Checkout button */}
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  router.push('/checkout');
                } else {
                  router.push('/login?returnUrl=/checkout');
                }
              }}
              disabled={isCheckoutDisabled}
              className={`w-full py-3 sm:py-4 px-6 sm:px-8 rounded-md ${
                isCheckoutDisabled
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white hover:shadow-lg'
              } font-medium text-sm sm:text-base transition-all`}
            >
              {isCheckoutDisabled ? 'Some items are unavailable' : 'Proceed to Checkout'}
            </button>
            
            {/* Payment methods */}
            <div className="mt-5 sm:mt-6 flex items-center justify-center space-x-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">We accept:</span>
              <div className="flex space-x-2 ml-2">
                <div className="bg-white dark:bg-gray-700 p-1 sm:p-1.5 rounded shadow-sm">
                  <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="24" rx="4" fill="#F3F4F6"/>
                    <path d="M14.5 17.5H21L22.5 14.5H16L14.5 17.5Z" fill="#FF5F00"/>
                    <path d="M16 11.5H22.5L24 8.5H17.5L16 11.5Z" fill="#FF5F00"/>
                    <path d="M14 6.5H17.5L19 3.5H15.5L14 6.5Z" fill="#FF5F00"/>
                  </svg>
                </div>
                <div className="bg-white dark:bg-gray-700 p-1 sm:p-1.5 rounded shadow-sm">
                  <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="24" rx="4" fill="#F3F4F6"/>
                    <path d="M15.5 15.5H19.5V9.5H15.5V15.5Z" fill="#2FABF7"/>
                    <path d="M19.5 12.5C19.5 14.5 20.5 15.5 22.5 15.5C24.5 15.5 25.5 14.5 25.5 12.5C25.5 10.5 24.5 9.5 22.5 9.5C20.5 9.5 19.5 10.5 19.5 12.5Z" fill="#228FE0"/>
                  </svg>
                </div>
                <div className="bg-white dark:bg-gray-700 p-1 sm:p-1.5 rounded shadow-sm">
                  <svg className="h-5 sm:h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="24" rx="4" fill="#F3F4F6"/>
                    <path d="M26.5 11.5C26.5 13.5 25 15.5 22.5 15.5H15.5V9.5H22.5C25 9.5 26.5 11.5 26.5 11.5V11.5Z" fill="#016FD0"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Safety message */}
            <div className="mt-3 sm:mt-4 text-center text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout with 256-bit SSL encryption
            </div>

            {/* Warning message */}
            {isCheckoutDisabled && (
              <div className="mt-3 text-xs sm:text-sm text-red-600 dark:text-red-400 text-center">
                Some items in your cart are unavailable or out of stock.
                Please remove them to continue with checkout.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 