'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import { getOrderById, getOrderByNumber } from '@/services/orderService';
import { toast } from 'react-hot-toast';
import { OrderResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const hasCleared = useRef(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const searchParams = useSearchParams();
  
  // Get order IDs from query params
  const orderId = searchParams?.get('orderId');
  const orderNumber = searchParams?.get('orderNumber');
  const paymentId = searchParams?.get('paymentId');

  // Fetch order details if we have an order ID or number
  useEffect(() => {
    // Wait until authentication state is initialized
    if (authLoading) {
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        setIsLoadingOrder(true);
        let orderData: OrderResponse | null = null;
        
        // Try to fetch by ID first (more reliable)
        if (orderId) {
          console.log('Fetching order by ID:', orderId);
          orderData = await getOrderById(orderId);
          console.log('Order data received:', orderData);
        }
        // Fall back to order number if no ID or ID fetch fails
        else if (orderNumber) {
          console.log('Fetching order by number:', orderNumber);
          orderData = await getOrderByNumber(orderNumber);
          console.log('Order data received:', orderData);
        }
        
        if (orderData) {
          console.log('Setting order data to state');
          setOrder(orderData);
        } else {
          console.error('No order details found');
          toast.error('Could not find order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Could not load your order details');
      } finally {
        setIsLoadingOrder(false);
      }
    };

    if (orderId || orderNumber) {
      fetchOrderDetails();
    } else {
      setIsLoadingOrder(false);
    }
  }, [orderId, orderNumber, authLoading, isAuthenticated]);
  
  // Debug logging for render
  useEffect(() => {
    console.log('Current order state:', order);
    console.log('Loading state:', isLoadingOrder);
  }, [order, isLoadingOrder]);
  
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
  }, [clearCart]);
  
  // Format date in human readable format
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };
  
  // Calculate estimated delivery date (5 days from order date)
  const getEstimatedDelivery = (orderDate?: string): string => {
    try {
      const date = orderDate ? new Date(orderDate) : new Date();
      date.setDate(date.getDate() + 5);
      return formatDate(date.toISOString());
    } catch (e) {
      return '';
    }
  };
  
  // Loading state
  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-[#f5f1ed]/50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-[#ed875a] border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  // No order found state
  if (!order && !isLoadingOrder) {
    return (
      <div className="min-h-screen bg-[#f5f1ed]/50 dark:bg-gray-900 py-16 px-4">
        <div className="container mx-auto max-w-md text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 border border-gray-100 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We couldn't find any order details. The order ID might be invalid or your session may have expired.
            </p>
            <div className="flex flex-col gap-4">
              <Link 
                href="/orders"
                className="flex items-center justify-center bg-white dark:bg-gray-700 text-[#ed875a] dark:text-[#ed8c61] py-3 px-6 font-medium border-2 border-[#ed875a] dark:border-[#ed8c61] rounded-md transition-all hover:bg-[#ed875a]/5"
              >
                View My Orders
              </Link>
              <Link 
                href="/"
                className="flex items-center justify-center bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-3 px-6 font-medium rounded-md"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Make sure we have access to order before rendering the success view
  const orderData = order as OrderResponse;  // Type assertion since we've checked it exists
  
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
                Thank you for your purchase. Your order <span className="font-semibold text-[#ed875a]">{orderData.orderNumber}</span> has been confirmed.
              </p>
            </div>

            {/* Order details card */}
            <div className={`bg-[#f5f1ed]/70 dark:bg-[#d44506]/10 rounded-lg p-5 sm:p-6 mb-8 sm:mb-10 mx-auto border border-gray-200 dark:border-gray-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-500 delay-700`}>
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Order Summary</span>
                  <span className="text-[#ed875a] dark:text-[#ed8c61] text-sm px-2 py-1 bg-[#ed875a]/10 dark:bg-[#ed875a]/20 rounded-full">{orderData.orderNumber}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date Placed:</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatDate(orderData.placedAt)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                  <span className="text-gray-800 dark:text-gray-200">{getEstimatedDelivery(orderData.placedAt)}</span>
                </div>
                
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Order Status:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    <span className={`px-2 py-0.5 rounded-full text-xs inline-block
                      ${orderData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : 
                        orderData.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 
                        orderData.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'}`}>
                      {orderData.status}
                    </span>
                  </span>
                </div> */}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {orderData.paymentMethod?.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    <span className={`px-2 py-0.5 rounded-full text-xs inline-block
                      ${orderData.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : 
                        orderData.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 
                        orderData.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'}`}>
                      {orderData.paymentStatus}
                    </span>
                  </span>
                </div>
                
                {paymentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {paymentId.length > 12
                        ? `${paymentId.substring(0, 8)}...${paymentId.substring(paymentId.length - 4)}`
                        : paymentId}
                    </span>
                  </div>
                )}
                
                {/* Order items */}
                <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-600 mt-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {orderData.items && Array.isArray(orderData.items) ? orderData.items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-full sm:w-20 h-20 bg-white rounded-md overflow-hidden relative flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <Image 
                              src={item.product.imageUrl} 
                              alt={item.product.title || ''}
                              width={80}
                              height={80}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                              <span className="text-gray-400 dark:text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.product?.title || 'Product'}</h4>
                          {item.variant && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Variant: {item.variant.variantName}</p>
                          )}
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
                            <span className="text-sm font-medium text-[#d44506] dark:text-[#ed875a]">₹{formatCurrency(item.unitPrice)}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-2">No items in this order</div>
                    )}
                  </div>
                </div>
                
                {/* Price breakdown */}
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-800 dark:text-gray-200">₹{formatCurrency(orderData.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                    <span className="text-gray-800 dark:text-gray-200">₹{formatCurrency(orderData.tax)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {(orderData.shippingFee || 0) > 0 ? `₹${formatCurrency(orderData.shippingFee)}` : 'Free'}
                    </span>
                  </div>
                  
                  {(orderData.discount || 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                      <span className="text-green-600 dark:text-green-400">-₹{formatCurrency(orderData.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-800 dark:text-gray-200">Total Amount:</span>
                    <span className="font-bold text-[#d44506] dark:text-[#ed875a]">₹{formatCurrency(orderData.total)}</span>
                  </div>
                </div>
                
                {/* Shipping & Billing Address */}
                <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2">Shipping Address</h3>
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <p className="font-medium">{orderData.shippingAddress?.name}</p>
                      <p>{orderData.shippingAddress?.street}</p>
                      <p>{orderData.shippingAddress?.landmark && `${orderData.shippingAddress.landmark}, `}
                        {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.zipCode}</p>
                      <p>{orderData.shippingAddress?.country}</p>
                      <p>{orderData.shippingAddress?.mobileNumber}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                    <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2">Billing Address</h3>
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <p className="font-medium">{orderData.billingAddress?.name}</p>
                      <p>{orderData.billingAddress?.street}</p>
                      <p>{orderData.billingAddress?.landmark && `${orderData.billingAddress.landmark}, `}
                        {orderData.billingAddress?.city}, {orderData.billingAddress?.state} {orderData.billingAddress?.zipCode}</p>
                      <p>{orderData.billingAddress?.country}</p>
                      <p>{orderData.billingAddress?.mobileNumber}</p>
                    </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Return Policy</span>
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