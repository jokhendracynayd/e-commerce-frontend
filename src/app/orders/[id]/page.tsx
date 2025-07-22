'use client';

/**
 * Order Details Page - /orders/[id]
 * 
 * This page displays detailed information about a specific order including:
 * - Order items with product images and details
 * - Order timeline and status tracking
 * - Shipping and billing information
 * - Payment details and actions
 * - Invoice download functionality
 * 
 * Note: This route is protected by middleware and requires authentication.
 * The green diagnostic message (in development) confirms correct routing.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getOrderById } from '@/services/orderService';
import { OrderResponse, OrderStatus, PaymentStatus } from '@/types/order';
import { toast } from 'react-hot-toast';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

// Order timeline status configurations
const getOrderTimeline = (status: OrderStatus, placedAt: string, updatedAt: string) => {
  const timeline = [
    {
      step: 'Order Confirmed',
      status: 'completed',
      icon: '✓',
      date: placedAt,
      description: 'Your order has been placed successfully'
    },
    {
      step: 'Processing',
      status: status === OrderStatus.PENDING ? 'pending' : 'completed',
      icon: status === OrderStatus.PENDING ? '○' : '✓',
      date: status !== OrderStatus.PENDING ? updatedAt : null,
      description: 'Your order is being prepared for shipment'
    },
    {
      step: 'Shipped',
      status: ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status) ? 'completed' : 'pending',
      icon: ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status) ? '✓' : '○',
      date: ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status) ? updatedAt : null,
      description: 'Your order has been shipped and is on the way'
    },
    {
      step: 'Out For Delivery',
      status: ['DELIVERED', 'COMPLETED'].includes(status) ? 'completed' : 'pending',
      icon: ['DELIVERED', 'COMPLETED'].includes(status) ? '✓' : '○',
      date: ['DELIVERED', 'COMPLETED'].includes(status) ? updatedAt : null,
      description: 'Your order is out for delivery'
    },
    {
      step: 'Delivered',
      status: ['DELIVERED', 'COMPLETED'].includes(status) ? 'completed' : 'pending',
      icon: ['DELIVERED', 'COMPLETED'].includes(status) ? '✓' : '○',
      date: ['DELIVERED', 'COMPLETED'].includes(status) ? updatedAt : null,
      description: 'Your order has been delivered successfully'
    }
  ];

  // Handle special statuses
  if (status === OrderStatus.CANCELLED) {
    return timeline.map((item, index) => ({
      ...item,
      status: index === 0 ? 'completed' : 'cancelled'
    }));
  }

  if (status === OrderStatus.RETURNED || status === OrderStatus.REFUNDED) {
    return [
      ...timeline.map(item => ({ ...item, status: 'completed' })),
      {
        step: 'Returned',
        status: 'completed',
        icon: '↩',
        date: updatedAt,
        description: 'Your order has been returned'
      }
    ];
  }

  return timeline;
};

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.DELIVERED:
    case OrderStatus.COMPLETED:
      return 'text-green-600 bg-green-50 border-green-200';
    case OrderStatus.SHIPPED:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case OrderStatus.PROCESSING:
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case OrderStatus.CANCELLED:
      return 'text-red-600 bg-red-50 border-red-200';
    case OrderStatus.RETURNED:
    case OrderStatus.REFUNDED:
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'text-green-600 bg-green-50';
    case PaymentStatus.PENDING:
      return 'text-yellow-600 bg-yellow-50';
    case PaymentStatus.FAILED:
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

// Enhanced image component with better error handling
const OrderItemImage = ({ src, alt, width = 80, height = 80 }: { 
  src?: string | null; 
  alt: string; 
  width?: number; 
  height?: number; 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const imageSrc = src && !imageError ? src : "https://picsum.photos/200";

  return (
    <div className="w-20 h-20 flex-shrink-0 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover rounded-md border border-gray-200 dark:border-gray-600"
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
      />
    </div>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized values to prevent unnecessary recalculations
  const currencySymbol = useMemo(() => 
    order?.currency ? getCurrencySymbol(order.currency) : '$', 
    [order?.currency]
  );

  const timeline = useMemo(() => 
    order ? getOrderTimeline(order.status, order.placedAt, order.updatedAt) : [], 
    [order?.status, order?.placedAt, order?.updatedAt]
  );

  // Fetch order details
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnUrl=' + encodeURIComponent(`/orders/${id}`));
      return;
    }

    if (!authLoading && isAuthenticated && id) {
      fetchOrderDetails();
    }
  }, [id, isAuthenticated, authLoading, router]);

  const fetchOrderDetails = useCallback(async () => {
    if (!id || typeof id !== 'string') {
      setError('Invalid order ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const orderData = await getOrderById(id);
      
      // Validate order data structure
      if (!orderData || !orderData.id) {
        throw new Error('Invalid order data received');
      }
      
      setOrder(orderData);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      const errorMessage = error.message || 'Failed to load order details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handlePayNow = useCallback(() => {
    if (!order) return;
    
    // For now, redirect to checkout page with order details
    // In a real implementation, this would integrate with your payment gateway
    router.push(`/checkout?orderId=${order.id}&amount=${order.total}&currency=${order.currency}`);
    
    // Alternative: Show payment modal or integrate with payment gateway
    // Example: window.open('payment-gateway-url', '_blank');
    
    toast.success('Redirecting to payment...');
  }, [order, router]);

  const handleDownloadInvoice = useCallback(() => {
    if (!order) return;
    
    try {
      // Enhanced invoice content with better formatting
      const invoiceContent = `
INVOICE - Order #${order.orderNumber}
=====================================

Customer Information:
${order.user?.firstName || ''} ${order.user?.lastName || ''}
Email: ${order.user?.email || 'N/A'}
Order Date: ${new Date(order.placedAt).toLocaleDateString()}
Order ID: ${order.id}

ITEMS:
------
${order.items?.map(item => {
  const productTitle = item.product?.title || 'Unknown Product';
  const variantInfo = item.variant?.variantName ? ` (${item.variant.variantName})` : '';
  return `${productTitle}${variantInfo}
  Qty: ${item.quantity} x ${currencySymbol}${formatCurrency(item.unitPrice)} = ${currencySymbol}${formatCurrency(item.totalPrice)}`;
}).join('\n') || 'No items'}

SUMMARY:
--------
Subtotal: ${currencySymbol}${formatCurrency(order.subtotal)}
${order.discount > 0 ? `Discount: -${currencySymbol}${formatCurrency(order.discount)}\n` : ''}Tax/Fees: ${currencySymbol}${formatCurrency(order.tax + order.shippingFee)}
Total: ${currencySymbol}${formatCurrency(order.total)}

Payment Information:
Payment Method: ${order.paymentMethod || 'N/A'}
Payment Status: ${order.paymentStatus}

Shipping Address:
${order.shippingAddress?.name || ''}
${order.shippingAddress?.street || ''}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}
${order.shippingAddress?.country || ''}

Generated on: ${new Date().toLocaleString()}
`;

      // Create and download the file
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to download invoice');
    }
  }, [order, currencySymbol]);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed875a] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The order you are looking for could not be found.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="inline-flex items-center px-6 py-3 bg-[#ed875a] text-white font-medium rounded-lg hover:bg-[#d44506] transition-colors"
              >
                ← Back to Orders
              </Link>
              <button
                onClick={fetchOrderDetails}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-[#ed875a] hover:text-[#d44506] font-medium mb-4"
            aria-label="Back to orders list"
          >
            ← Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Actions (if needed) */}
            {order.paymentStatus === PaymentStatus.PENDING && (
              <div className="bg-gradient-to-r from-[#ed875a] to-[#d44506] rounded-lg p-6 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Pay now and ask the delivery agent to drop the item at doorstep
                    </h3>
                    <p className="text-white/90 text-sm">
                      Complete your payment to confirm the order
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-2xl font-bold">
                        {currencySymbol}{formatCurrency(order.total)}
                      </span>
                    </div>
                    <div className="w-16 h-16 hidden sm:block">
                      <Image
                        src="/images/payment-icon.svg"
                        alt="Payment"
                        width={64}
                        height={64}
                        className="w-full h-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handlePayNow}
                  className="bg-white text-[#d44506] font-bold py-3 px-8 rounded-lg mt-4 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  aria-label={`Pay ${currencySymbol}${formatCurrency(order.total)} for order ${order.orderNumber}`}
                >
                  PAY {currencySymbol}{formatCurrency(order.total)}
                </button>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.items?.length > 0 ? order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <OrderItemImage
                      src={item.product?.imageUrl}
                      alt={item.product?.title || 'Product image'}
                      width={80}
                      height={80}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.product?.title || 'Unknown Product'}
                      </h4>
                      {item.variant && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Variant: {item.variant.variantName}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold text-[#d44506] dark:text-[#ed875a]">
                          {currencySymbol}{formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No items found in this order
                  </div>
                )}
              </div>

              {/* Order Progress Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Open Box Delivery will be done
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      📦
                    </div>
                    <span>Sealed package will be opened</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      🔍
                    </div>
                    <span>Checks will be performed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      📱
                    </div>
                    <span>Share OTP to confirm delivery</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Order Timeline</h4>
                <div className="space-y-4" role="list" aria-label="Order timeline">
                  {timeline.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 relative" role="listitem">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600 border-2 border-green-500' 
                          : step.status === 'cancelled'
                          ? 'bg-red-100 text-red-600 border-2 border-red-500'
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            step.status === 'completed' ? 'text-green-600' : 
                            step.status === 'cancelled' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {step.step}
                          </p>
                          {step.date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(step.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {step.description}
                        </p>
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200 dark:bg-gray-600 z-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delivery Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    🏠 Home
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {order.shippingAddress?.name && (
                      <p className="font-medium">{order.shippingAddress.name}</p>
                    )}
                    {order.shippingAddress?.street && (
                      <p>{order.shippingAddress.street}</p>
                    )}
                    {order.shippingAddress?.landmark && (
                      <p>{order.shippingAddress.landmark}</p>
                    )}
                    <p>
                      {[
                        order.shippingAddress?.city,
                        order.shippingAddress?.state,
                        order.shippingAddress?.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                    {order.shippingAddress?.country && (
                      <p>{order.shippingAddress.country}</p>
                    )}
                    {order.shippingAddress?.mobileNumber && (
                      <p className="font-medium">{order.shippingAddress.mobileNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    👤 <span className="ml-2 font-medium">
                      {[order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || 'Guest Customer'}
                    </span>
                  </p>
                  {order.shippingAddress?.mobileNumber && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {order.shippingAddress.mobileNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Price Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">List price</span>
                  <span className="text-gray-600 dark:text-gray-400 line-through">
                    {currencySymbol}{formatCurrency(order.subtotal + (order.discount || 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Selling price</span>
                  <span className="text-gray-900 dark:text-white">
                    {currencySymbol}{formatCurrency(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Extra Discount</span>
                    <span className="text-green-600">
                      - {currencySymbol}{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Special Price</span>
                  <span className="text-gray-900 dark:text-white">
                    {currencySymbol}{formatCurrency(order.subtotal - (order.discount || 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Handling Fee</span>
                  <span className="text-gray-900 dark:text-white">
                    {currencySymbol}{formatCurrency(order.tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Platform fee</span>
                  <span className="text-gray-900 dark:text-white">
                    {currencySymbol}{formatCurrency(order.shippingFee)}
                  </span>
                </div>
                <hr className="border-gray-200 dark:border-gray-600" />
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-gray-900 dark:text-white">
                    {currencySymbol}{formatCurrency(order.total)}
                  </span>
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center text-sm">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {order.paymentMethod || 'Payment method not specified'}: {currencySymbol}{formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {order.paymentMethod || 'Not specified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Total</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {currencySymbol}{formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Download invoice for this order"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Download Invoice
                </button>
                <Link
                  href="/orders"
                  className="w-full flex items-center justify-center px-4 py-2 bg-[#ed875a] text-white rounded-md hover:bg-[#d44506] transition-colors"
                  aria-label="Go back to orders list"
                >
                  ← Back to All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 