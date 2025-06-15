'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import AddressList from '@/components/address/AddressList';
import { Address } from '@/types/address';
import PaymentSection from '@/components/checkout/payment/PaymentSection';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { CreateOrderRequest } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [pincode, setPincode] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [showManualAddressForm, setShowManualAddressForm] = useState(false);
  
  // Billing address state
  const [useSameAddressForBilling, setUseSameAddressForBilling] = useState(true);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | undefined>();
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null);
  const [showBillingManualForm, setShowBillingManualForm] = useState(false);
  const [billingFullName, setBillingFullName] = useState('');
  const [billingPhoneNumber, setBillingPhoneNumber] = useState('');
  const [billingPincode, setBillingPincode] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  
  // Payment details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [timeSlot, setTimeSlot] = useState('anytime');
  const [paymentData, setPaymentData] = useState<Record<string, string>>({});
  
  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setSelectedAddressId(address.id);
    
    // Update the form fields from the selected address
    setFullName(address.name);
    setPhoneNumber(address.mobileNumber);
    setPincode(address.zipCode);
    const formattedAddress = `${address.street}, ${address.locality}, ${address.city}, ${address.state}${address.landmark ? ', Landmark: ' + address.landmark : ''}`;
    setDeliveryAddress(formattedAddress);

    // If using same address for billing, update billing fields too
    if (useSameAddressForBilling) {
      handleBillingAddressSelect(address);
    }
  };

  // Handle billing address selection
  const handleBillingAddressSelect = (address: Address) => {
    setSelectedBillingAddress(address);
    setSelectedBillingAddressId(address.id);
    
    // Update billing form fields
    setBillingFullName(address.name);
    setBillingPhoneNumber(address.mobileNumber);
    setBillingPincode(address.zipCode);
    const formattedAddress = `${address.street}, ${address.locality}, ${address.city}, ${address.state}${address.landmark ? ', Landmark: ' + address.landmark : ''}`;
    setBillingAddress(formattedAddress);
  };
  
  // Handle address added
  const handleAddressAdded = (address: Address) => {
    // Select the newly added address
    handleAddressSelect(address);
  };

  // Toggle manual address form
  const handleToggleManualForm = () => {
    setShowManualAddressForm(!showManualAddressForm);
    if (selectedAddressId) {
      // Clear selected address if switching to manual form
      setSelectedAddressId(undefined);
      setSelectedAddress(null);
    }
  };

  // Toggle billing manual form
  const handleToggleBillingManualForm = () => {
    setShowBillingManualForm(!showBillingManualForm);
    if (selectedBillingAddressId) {
      setSelectedBillingAddressId(undefined);
      setSelectedBillingAddress(null);
    }
  };

  // Handle same address for billing toggle
  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const useShippingAsBilling = e.target.checked;
    setUseSameAddressForBilling(useShippingAsBilling);
    
    // If checked, copy shipping address to billing address
    if (useShippingAsBilling && selectedAddress) {
      handleBillingAddressSelect(selectedAddress);
    }
  };
  
  // Handle payment method and data change
  const handlePaymentDataChange = (methodId: string, data: Record<string, string>) => {
    console.log(`Payment method changed to: ${methodId}`);
    setPaymentMethod(methodId);
    setPaymentData(data);
    
    // Update the individual payment form states based on the method
    if (methodId === 'card' && data) {
      data.cardNumber && setCardNumber(data.cardNumber);
      data.cardExpiry && setCardExpiry(data.cardExpiry);
      data.cardCvv && setCardCvv(data.cardCvv);
      data.nameOnCard && setNameOnCard(data.nameOnCard);
      data.saveCard && setSaveCard(data.saveCard === 'true');
    } else if (methodId === 'upi' && data) {
      data.upiId && setUpiId(data.upiId);
      data.upiApp && setUpiApp(data.upiApp);
    } else if (methodId === 'cod' && data) {
      data.deliveryInstructions && setDeliveryInstructions(data.deliveryInstructions);
      data.timeSlot && setTimeSlot(data.timeSlot);
    }
  };
  
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
  
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // 1. Prepare order data from form state
      const orderItems = items.map(item => ({
        productId: item.product.id,
        variantId: item.selectedColor?.id,
        quantity: item.quantity
      }));
      
      // 2. Prepare shipping & billing addresses - Properly formatted for backend
      // Parse address and extract components properly
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
      
      const shippingAddressParts = parseAddress(deliveryAddress);
      const billingAddressParts = useSameAddressForBilling 
        ? shippingAddressParts
        : parseAddress(billingAddress);
      
      const shippingAddressData = {
        name: fullName,
        mobileNumber: phoneNumber,
        zipCode: pincode,
        street: shippingAddressParts.street,
        city: shippingAddressParts.city,
        state: shippingAddressParts.state,
        country: 'India', // Default country
        landmark: shippingAddressParts.landmark,
      };
      
      const billingAddressData = useSameAddressForBilling 
        ? shippingAddressData
        : {
            name: billingFullName,
            mobileNumber: billingPhoneNumber,
            zipCode: billingPincode,
            street: billingAddressParts.street,
            city: billingAddressParts.city,
            state: billingAddressParts.state,
            country: 'India', // Default country
            landmark: billingAddressParts.landmark,
          };
      
      // For proper validation, ensure required fields are not empty
      const ensureRequiredFields = (address: any) => {
        // If city is empty, use a fallback
        if (!address.city) {
          address.city = 'Unknown';
        }
        
        // If state is empty, use a fallback
        if (!address.state) {
          address.state = 'Unknown';
        }
        
        return address;
      };
      
      // Log the actual payment method value before submission
      console.log('Selected payment method:', paymentMethod);

      // 3. Create order request
      const orderData = {
        items: orderItems,
        shippingAddress: ensureRequiredFields(shippingAddressData),
        billingAddress: ensureRequiredFields(billingAddressData),
        paymentMethod: paymentMethod.toLowerCase(), // Ensure lowercase to match backend expectations
      };
      
      console.log('Submitting order data:', orderData);
      
      // 4. Import and call createOrder from orderService with the authenticated endpoint
      const { createUserOrder } = await import('@/services/orderService');
      const response = await createUserOrder(orderData);
      
      console.log('Order created successfully:', response);
      
      // Extract order information from the API response
      // The API response structure is { statusCode, message, data: { id, orderNumber, ... } }
      const orderInfo = response.data || response;
      const orderId = orderInfo.id;
      const orderNumber = orderInfo.orderNumber;
      
      console.log(`Order created with ID: ${orderId}, Number: ${orderNumber}`);
      
      // 5. Store order ID for payment processing
      setOrderId(orderId);
      
      // 6. Handle different payment methods correctly
      if (paymentMethod.toLowerCase() === 'cod') {
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
            window.location.href = successUrl; // Use direct navigation instead of router.push
          } catch (error) {
            console.error('Navigation error:', error);
            // Fallback if navigation fails
            router.push(`/order-success?orderId=${orderId}`);
          }
        }, 300);
      } else {
        // For other payment methods, show payment UI
        console.log('Showing payment UI for online payment');
        setPaymentStarted(true);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setPaymentError(error instanceof Error ? error.message : 'An error occurred during checkout.');
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
      setPaymentError('Payment failed. Please try again.');
    }
  };
  
  // Handle payment error
  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    setPaymentStarted(false);
    setPaymentError(error.message || 'Payment processing failed.');
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
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 text-[#ed875a] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Delivery Address</h2>
              </div>
              
              {/* Toggle between saved addresses and manual input */}
              <div>
                <button 
                  onClick={handleToggleManualForm}
                  className="text-sm text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] flex items-center"
                >
                  {showManualAddressForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Use saved address
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Enter manually
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Show either saved addresses or manual input form */}
            {showManualAddressForm ? (
              // Manual address input (original form)
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
                  selectedAddressId={selectedAddressId}
                  showSelectionMode={true}
                  showAddNewButton={true}
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
          <div className="bg-white dark:bg-gray-800 shadow-[0_5px_30px_-15px_rgba(237,135,90,0.15)] p-5 sm:p-6 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#ed875a]/10 to-[#ed8c61]/10 text-[#ed875a] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Billing Address</h2>
            </div>
            
            {/* Use same as delivery address option */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useSameAddressForBilling}
                  onChange={handleSameAddressToggle}
                  className="h-4 w-4 text-[#ed875a] focus:ring-[#ed875a] border-gray-300 rounded dark:border-gray-600"
                />
                <span className="ml-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Use same address for billing
                </span>
              </label>
            </div>
            
            {/* Show billing address options if not using same address */}
            {!useSameAddressForBilling && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <button 
                      onClick={handleToggleBillingManualForm}
                      className="text-sm text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] flex items-center"
                    >
                      {showBillingManualForm ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Use saved address
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Enter manually
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {showBillingManualForm ? (
                  // Manual billing address input form
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div className="group">
                      <label htmlFor="billingFullName" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name*</label>
                      <input
                        type="text"
                        id="billingFullName"
                        value={billingFullName}
                        onChange={(e) => setBillingFullName(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                        placeholder="Enter your full name"
                        required={!useSameAddressForBilling}
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="billingPhoneNumber" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number*</label>
                      <input
                        type="tel"
                        id="billingPhoneNumber"
                        value={billingPhoneNumber}
                        onChange={(e) => setBillingPhoneNumber(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                        placeholder="Enter your phone number"
                        required={!useSameAddressForBilling}
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="billingPincode" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pincode*</label>
                      <input
                        type="text"
                        id="billingPincode"
                        value={billingPincode}
                        onChange={(e) => setBillingPincode(e.target.value)}
                        maxLength={6}
                        className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                        placeholder="Enter pincode"
                        required={!useSameAddressForBilling}
                      />
                    </div>
                    <div className="md:col-span-2 group">
                      <label htmlFor="billingAddress" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address*</label>
                      <textarea
                        id="billingAddress"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 dark:border-gray-600 py-2 sm:py-2.5 px-3 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-all duration-200 group-hover:border-[#ed875a]/50"
                        placeholder="Enter your complete address"
                        required={!useSameAddressForBilling}
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
                      selectedAddressId={selectedBillingAddressId}
                      showSelectionMode={true}
                      showAddNewButton={true}
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
          
          {/* Payment Methods */}
          <PaymentSection 
            onPaymentDataChange={handlePaymentDataChange}
            initialMethod={paymentMethod}
          />
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
            
            {/* Place order button using CheckoutForm component */}
            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{paymentError}</p>
              </div>
            )}
            
            {/* Only show checkout form if payment hasn't started */}
            {!paymentStarted ? (
              <CheckoutForm 
                onSubmitOrder={handleSubmit}
                isFormValid={!!fullName && !!phoneNumber && !!deliveryAddress && !!pincode}
                isProcessing={isProcessing}
              />
            ) : (
              /* Show payment processor once order is created and payment is started */
              orderId && (
                <div className="py-4">
                  {/* Dynamic import of PaymentProcessor to avoid server-side import errors */}
                  {(() => {
                    const PaymentProcessor = dynamic(() => 
                      import('@/components/checkout/payment/PaymentProcessor'), 
                      { ssr: false }
                    );
                    
                    return (
                      <PaymentProcessor
                        orderId={orderId}
                        amount={totalAmount}
                        paymentMethod={paymentMethod}
                        paymentData={paymentData}
                        onPaymentComplete={handlePaymentComplete}
                        onPaymentError={handlePaymentError}
                        customerEmail={undefined} // Replace with user's email when authentication is enabled
                      />
                    );
                  })()}
                </div>
              )
            )}
            
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