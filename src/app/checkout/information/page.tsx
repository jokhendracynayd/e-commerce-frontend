'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import AddressList from '@/components/address/AddressList';
import { Address } from '@/types/address';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

export default function CheckoutInformationPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const { checkoutData, updateCheckoutData, isStep1Complete } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to home if no items in cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    updateCheckoutData({
      selectedAddress: address,
      selectedAddressId: address.id,
      fullName: address.name,
      phoneNumber: address.mobileNumber,
      pincode: address.zipCode,
      deliveryAddress: `${address.street}, ${address.locality}, ${address.city}, ${address.state}${address.landmark ? ', Landmark: ' + address.landmark : ''}`,
    });

    // If using same address for billing, update billing fields too
    if (checkoutData.useSameAddressForBilling) {
      handleBillingAddressSelect(address);
    }
  };

  // Handle billing address selection
  const handleBillingAddressSelect = (address: Address) => {
    updateCheckoutData({
      selectedBillingAddress: address,
      selectedBillingAddressId: address.id,
      billingFullName: address.name,
      billingPhoneNumber: address.mobileNumber,
      billingPincode: address.zipCode,
      billingAddress: `${address.street}, ${address.locality}, ${address.city}, ${address.state}${address.landmark ? ', Landmark: ' + address.landmark : ''}`,
    });
  };

  // Handle address added
  const handleAddressAdded = (address: Address) => {
    handleAddressSelect(address);
  };

  // Toggle manual address form
  const handleToggleManualForm = () => {
    updateCheckoutData({
      showManualAddressForm: !checkoutData.showManualAddressForm,
      selectedAddressId: checkoutData.showManualAddressForm ? checkoutData.selectedAddressId : undefined,
      selectedAddress: checkoutData.showManualAddressForm ? checkoutData.selectedAddress : null,
    });
  };

  // Toggle billing manual form
  const handleToggleBillingManualForm = () => {
    updateCheckoutData({
      showBillingManualForm: !checkoutData.showBillingManualForm,
      selectedBillingAddressId: checkoutData.showBillingManualForm ? checkoutData.selectedBillingAddressId : undefined,
      selectedBillingAddress: checkoutData.showBillingManualForm ? checkoutData.selectedBillingAddress : null,
    });
  };

  // Handle same address for billing toggle
  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const useShippingAsBilling = e.target.checked;
    updateCheckoutData({ useSameAddressForBilling: useShippingAsBilling });
    
    // If checked, copy shipping address to billing address
    if (useShippingAsBilling && checkoutData.selectedAddress) {
      handleBillingAddressSelect(checkoutData.selectedAddress);
    }
  };

  // Handle continue to payment
  const handleContinueToPayment = () => {
    if (isStep1Complete) {
      router.push('/checkout/payment');
    }
  };

  // Calculate shipping cost - free if total is above 500
  const shippingCost = totalPrice > 500 ? 0 : 40;
  const totalAmount = totalPrice + shippingCost;
  const currency = 'INR';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
        {/* Header with premium styling */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-orange-600 dark:from-white dark:via-gray-100 dark:to-orange-400 bg-clip-text text-transparent mb-2">
            Secure Checkout
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Complete your order in just a few steps</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <CheckoutProgress currentStep={1} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Information Collection Form */}
          <div className="lg:w-2/3 space-y-4">
            {/* Compact Product summary */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Order Summary
                </h2>
                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                  {items.length} items
                </span>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.selectedColor?.id || 'default'}`} 
                    className="flex gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-600/60 transition-all duration-200"
                  >
                    {/* Product image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden group">
                        <Image 
                          src={item.selectedColor?.image || item.product.images[0]} 
                          alt={item.product.title}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                        />
                      </div>
                    </div>
                    
                    {/* Product details */}
                    <div className="flex-1 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                          {item.product.title}
                        </h3>
                        <div className="flex items-center gap-4">
                          {item.selectedColor && (
                            <div className="flex items-center">
                              <span 
                                className="w-4 h-4 rounded-full mr-2 border-2 border-gray-300 dark:border-gray-500 shadow-sm"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              ></span>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {item.selectedColor.color}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {getCurrencySymbol(item.product.currency || currency)}
                            {formatCurrency(
                              (item.product.discountPrice !== undefined && item.product.discountPrice !== null) 
                                ? item.product.discountPrice * item.quantity 
                                : item.product.price * item.quantity, 
                              item.product.currency || currency
                            )}
                          </span>
                          {(item.product.originalPrice || (item.product.price && item.product.discountPrice !== undefined && item.product.discountPrice !== null)) && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-through mt-1">
                              {getCurrencySymbol(item.product.currency || currency)}
                              {formatCurrency(
                                item.product.originalPrice 
                                  ? item.product.originalPrice * item.quantity
                                  : item.product.price * item.quantity, 
                                item.product.currency || currency
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
            {/* Delivery Address */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Address</h2>
                </div>
                
                {/* Toggle between saved addresses and manual input */}
                <button 
                  onClick={handleToggleManualForm}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-all duration-200"
                >
                  {checkoutData.showManualAddressForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Use saved address
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Enter manually
                    </>
                  )}
                </button>
              </div>
            
              {/* Show either saved addresses or manual input form */}
              {checkoutData.showManualAddressForm ? (
                // Manual address input (premium form)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name*</label>
                    <input
                      type="text"
                      id="fullName"
                      value={checkoutData.fullName}
                      onChange={(e) => updateCheckoutData({ fullName: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number*</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={checkoutData.phoneNumber}
                      onChange={(e) => updateCheckoutData({ phoneNumber: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode*</label>
                    <input
                      type="text"
                      id="pincode"
                      value={checkoutData.pincode}
                      onChange={(e) => updateCheckoutData({ pincode: e.target.value })}
                      maxLength={6}
                      className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address*</label>
                    <textarea
                      id="address"
                      value={checkoutData.deliveryAddress}
                      onChange={(e) => updateCheckoutData({ deliveryAddress: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                </div>
            ) : (
              // Address list component
              <div className="address-list-checkout w-full">
                <style jsx global>{`
                  /* Make address cards take full width in checkout only */
                  .address-list-checkout .grid {
                    grid-template-columns: 1fr !important;
                  }
                  .address-list-checkout button {
                    width: 100%;
                  }
                `}</style>
                <AddressList
                  onSelectAddress={handleAddressSelect}
                  selectedAddressId={checkoutData.selectedAddressId}
                  showSelectionMode={true}
                  showAddNewButton={true}
                  autoSelectFirst={true}
                  emptyStateMessage="Please add a delivery address to continue"
                  header={
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Select a delivery address or add a new one.
                    </p>
                  }
                />
              </div>
            )}
          </div>
          
            {/* Billing Address */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Address</h2>
              </div>
              
              {/* Use same as delivery address option */}
              <div className="mb-4">
                <label className="flex items-center cursor-pointer p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={checkoutData.useSameAddressForBilling}
                    onChange={handleSameAddressToggle}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded dark:border-gray-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Use same address for billing
                  </span>
                </label>
              </div>
            
              {/* Show billing address options if not using same address */}
              {!checkoutData.useSameAddressForBilling && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <button 
                        onClick={handleToggleBillingManualForm}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-all duration-200"
                      >
                        {checkoutData.showBillingManualForm ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Use saved address
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Enter manually
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {checkoutData.showBillingManualForm ? (
                    // Manual billing address input form
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="billingFullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name*</label>
                        <input
                          type="text"
                          id="billingFullName"
                          value={checkoutData.billingFullName}
                          onChange={(e) => updateCheckoutData({ billingFullName: e.target.value })}
                          className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your full name"
                          required={!checkoutData.useSameAddressForBilling}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="billingPhoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number*</label>
                        <input
                          type="tel"
                          id="billingPhoneNumber"
                          value={checkoutData.billingPhoneNumber}
                          onChange={(e) => updateCheckoutData({ billingPhoneNumber: e.target.value })}
                          className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your phone number"
                          required={!checkoutData.useSameAddressForBilling}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="billingPincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode*</label>
                        <input
                          type="text"
                          id="billingPincode"
                          value={checkoutData.billingPincode}
                          onChange={(e) => updateCheckoutData({ billingPincode: e.target.value })}
                          maxLength={6}
                          className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter pincode"
                          required={!checkoutData.useSameAddressForBilling}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address*</label>
                        <textarea
                          id="billingAddress"
                          value={checkoutData.billingAddress}
                          onChange={(e) => updateCheckoutData({ billingAddress: e.target.value })}
                          rows={3}
                          className="w-full border border-gray-200 dark:border-gray-600 py-2.5 px-4 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                          placeholder="Enter your complete address"
                          required={!checkoutData.useSameAddressForBilling}
                        />
                      </div>
                    </div>
                ) : (
                  // Billing address list component
                  <div className="address-list-checkout w-full">
                    <style jsx global>{`
                      /* Make address cards take full width in checkout only */
                      .address-list-checkout .grid {
                        grid-template-columns: 1fr !important;
                      }
                      .address-list-checkout button {
                        width: 100%;
                      }
                    `}</style>
                    <AddressList
                      onSelectAddress={handleBillingAddressSelect}
                      selectedAddressId={checkoutData.selectedBillingAddressId}
                      showSelectionMode={true}
                      showAddNewButton={true}
                      autoSelectFirst={true}
                      emptyStateMessage="Please add a billing address"
                      header={
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Select a billing address or add a new one.
                        </p>
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Order Summary
                </h2>
              </div>
              
              {/* Price breakdown */}
              <div className="space-y-3 border-b border-gray-200/50 dark:border-gray-700/50 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {getCurrencySymbol(currency)}{formatCurrency(totalPrice, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                    ) : (
                      `${getCurrencySymbol(currency)}${formatCurrency(shippingCost, currency)}`
                    )}
                  </span>
                </div>
                {shippingCost === 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on orders above {getCurrencySymbol(currency)}500</span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center mb-4 border-b border-dashed border-gray-200 dark:border-gray-700 pb-4">
                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Total</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {getCurrencySymbol(currency)}{formatCurrency(totalAmount, currency)}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Inclusive of all taxes
                  </div>
                </div>
              </div>
              
              {/* Delivery estimate */}
              <div className="flex items-center mb-4 text-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">Estimated Delivery:</span>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })} - {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>
            
              {/* Continue to Payment Button */}
              <button 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center rounded-xl transform hover:-translate-y-0.5 active:translate-y-0 mb-4"
                onClick={handleContinueToPayment}
                disabled={!isStep1Complete || isProcessing}
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
                    Continue to Payment
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
              
              {/* Back to Cart Link */}
              <div className="text-center mb-4">
                <Link 
                  href="/cart" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Cart
                </Link>
              </div>
              
              {/* Security and terms */}
              <div className="bg-gray-50/50 dark:bg-gray-700/30 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Your information is secure and encrypted with SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
