'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import PaymentSection from '@/components/checkout/payment/PaymentSection';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const { checkoutData, updateCheckoutData, isStep1Complete, isStep2Complete } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to information step if step 1 is not complete
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
      return;
    }
    
    if (!isStep1Complete) {
      router.push('/checkout/information');
      return;
    }
  }, [items, router, isStep1Complete]);

  // Handle payment method and data change
  const handlePaymentDataChange = (methodId: string, data: Record<string, string>) => {
    console.log(`Payment method changed to: ${methodId}`);
    updateCheckoutData({
      paymentMethod: methodId,
      paymentData: data,
    });
  };

  // Calculate shipping cost - free if total is above 500
  const shippingCost = totalPrice > 500 ? 0 : 40;
  const totalAmount = totalPrice + shippingCost;
  const currency = 'BDT';

  // Generate dynamic button text based on payment method
  const getButtonText = () => {
    const paymentMethod = checkoutData.paymentMethod;
    
    if (paymentMethod === 'upi' || paymentMethod === 'card') {
      return `Pay ${getCurrencySymbol(currency)}${formatCurrency(totalAmount, currency)}`;
    }
    
    return 'Place Order';
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    updateCheckoutData({ paymentError: null });
    
    try {
      // 1. Prepare order data from checkout context
      const orderItems = items.map(item => ({
        productId: item.product.id,
        variantId: item.selectedColor?.id,
        quantity: item.quantity
      }));
      
      // 2. Prepare shipping & billing addresses - Properly formatted for backend
      const parseAddress = (addressString: string) => {
        const lines = addressString.split('\n');
        const addressParts = {
          street: lines[0] || '',
          city: '',
          state: '',
          landmark: ''
        };
        
        // Try to extract city, state, and landmark from the address
        if (lines.length > 1) {
          const secondLine = lines[1] || '';
          
          // Extract landmark if present
          if (addressString.includes('Landmark:')) {
            const landmarkPart = addressString.split('Landmark:')[1]?.trim();
            if (landmarkPart) {
              addressParts.landmark = landmarkPart;
            }
          }
          
          // Look for city and state pattern (City, State)
          const cityStateMatch = secondLine.match(/([^,]+),\s*([^,]+)/);
          if (cityStateMatch) {
            addressParts.city = cityStateMatch[1]?.trim() || '';
            addressParts.state = cityStateMatch[2]?.trim() || '';
          } else {
            // Try to extract known city/state names
            ['Bhopal', 'Delhi', 'Mumbai', 'Kolkata', 'Chennai'].forEach(city => {
              if (addressString.includes(city)) {
                addressParts.city = city;
              }
            });
            
            ['Madhya Pradesh', 'Maharashtra', 'Delhi', 'West Bengal', 'Tamil Nadu'].forEach(state => {
              if (addressString.includes(state)) {
                addressParts.state = state;
              }
            });
          }
        }
        
        return addressParts;
      };
      
      const shippingAddressParts = parseAddress(checkoutData.deliveryAddress);
      const billingAddressParts = checkoutData.useSameAddressForBilling 
        ? shippingAddressParts
        : parseAddress(checkoutData.billingAddress);
      
      const shippingAddressData = {
        name: checkoutData.fullName,
        mobileNumber: checkoutData.phoneNumber,
        zipCode: checkoutData.pincode,
        street: shippingAddressParts.street,
        city: shippingAddressParts.city,
        state: shippingAddressParts.state,
        country: 'India',
        landmark: shippingAddressParts.landmark,
      };
      
      const billingAddressData = checkoutData.useSameAddressForBilling 
        ? shippingAddressData
        : {
            name: checkoutData.billingFullName,
            mobileNumber: checkoutData.billingPhoneNumber,
            zipCode: checkoutData.billingPincode,
            street: billingAddressParts.street,
            city: billingAddressParts.city,
            state: billingAddressParts.state,
            country: 'India',
            landmark: billingAddressParts.landmark,
          };
      
      // For proper validation, ensure required fields are not empty
      const ensureRequiredFields = (address: any) => {
        if (!address.city) {
          address.city = 'Unknown';
        }
        
        if (!address.state) {
          address.state = 'Unknown';
        }
        
        return address;
      };
      
      // Log the actual payment method value before submission
      console.log('Selected payment method:', checkoutData.paymentMethod);

      // 3. Create order request
      const orderData = {
        items: orderItems,
        shippingAddress: ensureRequiredFields(shippingAddressData),
        billingAddress: ensureRequiredFields(billingAddressData),
        paymentMethod: checkoutData.paymentMethod.toLowerCase(),
      };
      
      console.log('Submitting order data:', orderData);
      
      // 4. Import and call createOrder from orderService with the authenticated endpoint
      const { createUserOrder } = await import('@/services/orderService');
      const response = await createUserOrder(orderData);
      
      console.log('Order created successfully:', response);
      
      // Extract order information from the API response
      const orderInfo = ('data' in response) ? (response.data as any) : response;
      const orderId = orderInfo.id;
      const orderNumber = orderInfo.orderNumber;
      
      console.log(`Order created with ID: ${orderId}, Number: ${orderNumber}`);
      
      // 5. Store order ID for payment processing
      updateCheckoutData({ orderId });
      
      // 6. Handle different payment methods correctly
      if (checkoutData.paymentMethod.toLowerCase() === 'cod') {
        console.log('COD payment selected, redirecting to success page');
        
        if (!orderId) {
          console.error("No order ID found in response:", response);
          throw new Error("Order created but ID not found in response");
        }

        // Force a small timeout to ensure state updates complete
        setTimeout(() => {
          try {
            const successUrl = `/order-success?orderId=${orderId}&orderNumber=${orderNumber}`;
            console.log('Redirecting to:', successUrl);
            window.location.href = successUrl;
          } catch (error) {
            console.error('Navigation error:', error);
            router.push(`/order-success?orderId=${orderId}`);
          }
        }, 300);
      } else {
        // For other payment methods, show payment UI
        console.log('Showing payment UI for online payment');
        updateCheckoutData({ paymentStarted: true });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      updateCheckoutData({ 
        paymentError: error instanceof Error ? error.message : 'An error occurred during checkout.' 
      });
      setIsProcessing(false);
    }
  };
  
  // Handle payment completion
  const handlePaymentComplete = (success: boolean, data: any) => {
    setIsProcessing(false);
    
    if (success) {
      // Redirect to success page with order info
      router.push(`/order-success?orderId=${data.orderId}&paymentId=${data.paymentId}`);
    } else {
      updateCheckoutData({ paymentError: 'Payment failed. Please try again.' });
    }
  };
  
  // Handle payment error
  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    updateCheckoutData({ 
      paymentStarted: false,
      paymentError: error.message || 'Payment processing failed.' 
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
        {/* Header with premium styling */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-orange-600 dark:from-white dark:via-gray-100 dark:to-orange-400 bg-clip-text text-transparent mb-2">
            Secure Payment
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Complete your secure payment</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <CheckoutProgress currentStep={2} />
        </div>
      
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Payment Section */}
        <div className="lg:w-2/3 space-y-4">
          {/* Order Summary */}
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
            
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Items:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{items.length} items ({items.reduce((total, item) => total + item.quantity, 0)} units)</span>
            </div>
          </div>

          {/* Delivery Information Review */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Information</h2>
              </div>
              <Link 
                href="/checkout/information"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{checkoutData.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{checkoutData.phoneNumber}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Address:</span>
                <div className="text-sm font-semibold text-gray-900 dark:text-white text-right max-w-xs">
                  {checkoutData.deliveryAddress}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pincode:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{checkoutData.pincode}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <PaymentSection 
            onPaymentDataChange={handlePaymentDataChange}
            initialMethod={checkoutData.paymentMethod}
          />
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
                Payment Summary
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
            
            {/* Error Display */}
            {checkoutData.paymentError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{checkoutData.paymentError}</p>
              </div>
            )}
            
            {/* Place order button using CheckoutForm component */}
            {!checkoutData.paymentStarted ? (
              <CheckoutForm 
                onSubmitOrder={handleSubmit}
                isFormValid={isStep2Complete}
                isProcessing={isProcessing}
                buttonText={getButtonText()}
              />
            ) : (
              /* Show payment processor once order is created and payment is started */
              checkoutData.orderId && (
                <div className="py-4">
                  {/* Dynamic import of PaymentProcessor to avoid server-side import errors */}
                  {(() => {
                    const PaymentProcessor = dynamic(() => 
                      import('@/components/checkout/payment/PaymentProcessor'), 
                      { ssr: false }
                    );
                    
                    return (
                      <PaymentProcessor
                        orderId={checkoutData.orderId}
                        amount={totalAmount}
                        paymentMethod={checkoutData.paymentMethod}
                        paymentData={checkoutData.paymentData}
                        onPaymentComplete={handlePaymentComplete}
                        onPaymentError={handlePaymentError}
                        customerEmail={undefined} // Replace with user's email when authentication is enabled
                      />
                    );
                  })()}
                </div>
              )
            )}
            
            {/* Back to Information Link */}
            <div className="mt-4 text-center">
              <Link 
                href="/checkout/information" 
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#ed875a] dark:hover:text-[#ed8c61] transition-colors"
              >
                ← Back to Information
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
                By placing your order, you agree to our <a href="#" className="underline hover:text-orange-500 dark:hover:text-orange-400">Terms of Service</a> and <a href="#" className="underline hover:text-orange-500 dark:hover:text-orange-400">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
