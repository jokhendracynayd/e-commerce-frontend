'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, OrderFilterParams } from '@/lib/api/orders-api';
import { OrderResponse, OrderStatus, PaymentStatus, PaginatedOrdersResponse } from '@/types/order';
import { toast } from 'react-hot-toast';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';
import WriteReviewModal from '@/components/review/WriteReviewModal';
import { reviewService } from '@/services/reviewService';
import { EligibleProductForReview } from '@/types/review';

// Type definitions for filtering
type StatusFilter = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
type TimeFilter = 'last30Days' | 'year2024' | 'year2023' | 'year2022' | 'year2021' | 'older';

type StatusFilters = {
  [key in StatusFilter]: boolean;
};

type TimeFilters = {
  [key in TimeFilter]: boolean;
};

// Mock order data based on the image with picsum.photos placeholder images
const mockOrders = [
  {
    id: 'ORD-123456',
    product: {
      name: 'ELV DIRECT Laptop Stand for Desk, Adjustable...',
      image: 'https://picsum.photos/id/20/200/200', // Tech/gadget looking image
      color: 'Black',
      size: '',
    },
    price: 305,
    status: 'Cancelled',
    statusDate: 'May 02',
    date: '2023-05-02',
    details: '',
    canReview: true,
  },
  {
    id: 'ORD-789012',
    product: {
      name: 'PHASHIONLINE Embroidered Kurta, Palazzo...',
      image: 'https://picsum.photos/id/56/200/200', // Fashion/clothing looking image
      color: 'Black',
      size: 'XL',
    },
    price: 728,
    status: 'Cancelled',
    statusDate: 'Jul 31, 2024',
    date: '2024-07-31',
    details: 'As per your request, your item has been cancelled',
    canReview: false,
  },
  {
    id: 'ORD-345678',
    product: {
      name: 'Dr. Morepen BP-15 Blood Pressure Monitor...',
      image: 'https://picsum.photos/id/250/200/200', // Medical-ish looking image
      color: 'White',
      size: '',
    },
    price: 1579,
    status: 'Delivered',
    statusDate: 'Apr 16, 2024',
    date: '2024-04-16',
    details: 'Your item has been delivered',
    canReview: true,
  },
  {
    id: 'ORD-901234',
    product: {
      name: 'Firstmed Digital Medical Thermometer Har...',
      image: 'https://picsum.photos/id/101/200/200', // Another medical-ish looking image
      color: 'White',
      size: '',
    },
    price: 213,
    status: 'Delivered',
    statusDate: 'Apr 16, 2024',
    date: '2024-04-16',
    details: 'Your item has been delivered',
    canReview: true,
  },
  {
    id: 'ORD-567890',
    product: {
      name: 'Dr. Morepen Health Care Appliance Combo',
      image: 'https://picsum.photos/id/96/200/200', // Health product looking image
      color: '',
      size: '',
    },
    price: 1684,
    status: 'Cancelled',
    statusDate: 'Apr 12, 2024',
    date: '2024-04-12',
    details: 'You requested a cancellation because you changed your mind about this product.',
    canReview: false,
  },
];

export default function OrdersPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    PENDING: false,
    PROCESSING: false,
    SHIPPED: false,
    DELIVERED: false,
    CANCELLED: false,
    RETURNED: false,
  });
  const [timeFilters, setTimeFilters] = useState<TimeFilters>({
    last30Days: false,
    year2024: false,
    year2023: false,
    year2022: false,
    year2021: false,
    older: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  
  // Review modal state
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<EligibleProductForReview | null>(null);
  const [eligibleProducts, setEligibleProducts] = useState<EligibleProductForReview[]>([]);
  
  // Fetch orders from API using useCallback to memoize the function
  const fetchOrders = useCallback(async (params: OrderFilterParams = {}) => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getMyOrders(params);
      setOrders(response.data);
      setFilteredOrders(response.data);
      setPaginationData({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load your orders. Please try again.');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch eligible products for review
  const fetchEligibleProducts = useCallback(async () => {
    try {
      const products = await reviewService.getEligibleProducts();
      setEligibleProducts(products);
    } catch (error) {
      console.error('Failed to fetch eligible products:', error);
    }
  }, []);

  // Handle review button click
  const handleReviewClick = (order: OrderResponse) => {
    // Find the product from eligible products that matches this order
    const eligibleProduct = eligibleProducts.find(p => 
      p.orderId === order.id && order.items && order.items.length > 0
    );
    
    if (eligibleProduct) {
      setSelectedProductForReview(eligibleProduct);
      setIsWriteReviewModalOpen(true);
    } else {
      // If not found in eligible products, create a temporary one from order data
      if (order.items && order.items.length > 0) {
        const firstItem = order.items[0];
        const tempProduct: EligibleProductForReview = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          orderDate: order.placedAt,
          product: {
            id: firstItem.product?.id || '',
            title: firstItem.product?.title || 'Unknown Product',
            slug: firstItem.product?.slug || '',
            imageUrl: firstItem.product?.imageUrl,
          },
          quantity: firstItem.quantity,
        };
        setSelectedProductForReview(tempProduct);
        setIsWriteReviewModalOpen(true);
      }
    }
  };

  // Handle review submission success
  const handleReviewSubmitted = () => {
    fetchEligibleProducts(); // Refresh eligible products
    fetchOrders(); // Refresh orders to update review status
    toast.success('Thank you for your review!');
  };
  
  // Redirect to login if not authenticated, but only after auth state has loaded
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/orders');
    } else if (!authLoading && isAuthenticated) {
      // Fetch orders and eligible products when component mounts, user is authenticated, and auth state has loaded
      fetchOrders();
      fetchEligibleProducts();
    }
  }, [isAuthenticated, authLoading, router, fetchOrders, fetchEligibleProducts]);

  // Count applied filters
  useEffect(() => {
    let count = 0;
    Object.values(statusFilters).forEach(val => { if(val) count++; });
    Object.values(timeFilters).forEach(val => { if(val) count++; });
    setAppliedFilterCount(count);
  }, [statusFilters, timeFilters]);

  // Filter orders based on selected filters
  useEffect(() => {
    if (orders.length === 0) return;
    
    let filtered = [...orders];
    
    // Apply status filters
    if (statusFilters.PENDING || statusFilters.PROCESSING || statusFilters.SHIPPED || statusFilters.DELIVERED || statusFilters.CANCELLED || statusFilters.RETURNED) {
      filtered = filtered.filter(order => {
        return (
          (statusFilters.PENDING && order.status === OrderStatus.PENDING) ||
          (statusFilters.PROCESSING && order.status === OrderStatus.PROCESSING) ||
          (statusFilters.SHIPPED && order.status === OrderStatus.SHIPPED) ||
          (statusFilters.DELIVERED && order.status === OrderStatus.DELIVERED) ||
          (statusFilters.CANCELLED && order.status === OrderStatus.CANCELLED) ||
          (statusFilters.RETURNED && order.status === OrderStatus.RETURNED)
        );
      });
    }
    
    // Apply time filters
    if (timeFilters.last30Days || timeFilters.year2024 || timeFilters.year2023 || timeFilters.year2022 || timeFilters.year2021 || timeFilters.older) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.placedAt);
        const year = orderDate.getFullYear();
        
        return (
          (timeFilters.last30Days && orderDate >= thirtyDaysAgo) ||
          (timeFilters.year2024 && year === 2024) ||
          (timeFilters.year2023 && year === 2023) ||
          (timeFilters.year2022 && year === 2022) ||
          (timeFilters.year2021 && year === 2021) ||
          (timeFilters.older && year < 2021)
        );
      });
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.items.some(item => item.product.title.toLowerCase().includes(query)) ||
        order.orderNumber.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilters, timeFilters, searchQuery]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side filtering already handled in useEffect
  };

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  const clearAllFilters = () => {
    setStatusFilters({
      PENDING: false,
      PROCESSING: false,
      SHIPPED: false,
      DELIVERED: false,
      CANCELLED: false,
      RETURNED: false,
    });
    setTimeFilters({
      last30Days: false,
      year2024: false,
      year2023: false,
      year2022: false,
      year2021: false,
      older: false,
    });
    setSearchQuery('');
  };
  
  // Show loading state while checking authentication or loading orders
  if (!isAuthenticated || !user || isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1ed]/50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 max-w-7xl">
          {/* Breadcrumbs skeleton */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-2 animate-pulse delay-75"></div>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse delay-100"></div>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-2 animate-pulse delay-75"></div>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse delay-150"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Toggle skeleton */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-28 animate-pulse"></div>
            </div>
            
            {/* Filters sidebar skeleton */}
            <div className="hidden lg:block w-full lg:w-72 lg:flex-shrink-0">
              <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-[0_8px_30px_-4px_rgba(237,135,90,0.15)] p-5 sm:p-6 border border-gray-100 dark:border-gray-700">
                {/* Filter header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-[#ed875a]/10 dark:bg-[#ed875a]/20 rounded w-16 animate-pulse delay-300"></div>
                </div>
                
                {/* Order Status Filters skeleton */}
                <div className="space-y-6">
                  <div className="filter-section">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse delay-200"></div>
                    </div>
                    
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={`status-${i}`} className="flex items-center">
                          <div className={`w-5 h-5 mr-3 border-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse delay-${i * 100}`}></div>
                          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-${16 + i * 2} animate-pulse delay-${i * 100}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
                  
                  {/* Time Filters skeleton */}
                  <div className="filter-section">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse delay-200"></div>
                    </div>
                    
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={`time-${i}`} className="flex items-center">
                          <div className={`w-5 h-5 mr-3 border-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse delay-${i * 75}`}></div>
                          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-${16 + i * 2} animate-pulse delay-${i * 75}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Orders content skeleton */}
            <div className="flex-1">
              {/* Title for desktop */}
              <div className="hidden lg:block mb-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
              </div>
              
              {/* Search bar skeleton */}
              <div className="flex mb-6 rounded-lg overflow-hidden shadow-sm">
                <div className="relative flex-1 h-12 bg-white dark:bg-gray-800 animate-pulse">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-24 bg-gradient-to-r from-[#ed875a]/40 to-[#ed8c61]/40 dark:from-[#ed875a]/30 dark:to-[#ed8c61]/30 animate-pulse"></div>
              </div>
              
              {/* Order count summary skeleton */}
              <div className="mb-4 flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse delay-150"></div>
              </div>
              
              {/* Order items skeleton */}
              <div className="space-y-4 sm:space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={`order-${i}`} 
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-[0_5px_20px_-4px_rgba(237,135,90,0.1)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-100 dark:border-gray-700 animate-pulse delay-${i * 150}`}
                  >
                    {/* Product image skeleton */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative">
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                      <div className="absolute top-0 right-0 p-1 m-1 w-14 h-5 bg-[#ed875a]/20 dark:bg-[#ed875a]/30 rounded"></div>
                    </div>
                    
                    {/* Order details skeleton */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        {/* Left side info skeleton */}
                        <div className="mb-2 sm:mb-0">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse delay-100"></div>
                          </div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-full max-w-md mb-1"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 max-w-sm animate-pulse delay-75"></div>
                          <div className="mt-1 flex space-x-2">
                            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 animate-pulse delay-150"></div>
                          </div>
                        </div>

                        {/* Right side info skeleton */}
                        <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28 mt-1 animate-pulse delay-200"></div>
                        </div>
                      </div>
                      
                      {/* Details and actions row skeleton */}
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2 sm:mb-0 animate-pulse"></div>
                        
                        {/* Action buttons skeleton */}
                        <div className="flex space-x-2">
                          <div className="h-7 bg-[#ed875a]/10 dark:bg-[#ed875a]/20 rounded-md w-16 animate-pulse delay-100"></div>
                          <div className="h-7 border border-gray-200 dark:border-gray-600 rounded-md w-16 animate-pulse delay-200"></div>
                          <div className="h-7 border border-gray-200 dark:border-gray-600 rounded-md w-20 animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Function to get status display text
  const getStatusDisplayText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING: return 'Pending';
      case OrderStatus.PROCESSING: return 'Processing';
      case OrderStatus.SHIPPED: return 'Shipped';
      case OrderStatus.DELIVERED: return 'Delivered';
      case OrderStatus.CANCELLED: return 'Cancelled';
      case OrderStatus.RETURNED: return 'Returned';
      case OrderStatus.REFUNDED: return 'Refunded';
      case OrderStatus.ON_HOLD: return 'On Hold';
      case OrderStatus.COMPLETED: return 'Completed';
      case OrderStatus.FAILED: return 'Failed';
      default: return status;
    }
  };

  // Function to get status color class
  const getStatusColorClass = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return 'bg-[#4caf50] text-white';
      case OrderStatus.CANCELLED:
      case OrderStatus.FAILED:
        return 'bg-[#d44506] text-white';
      case OrderStatus.RETURNED:
      case OrderStatus.REFUNDED:
        return 'bg-[#f44336] text-white';
      case OrderStatus.PENDING:
      case OrderStatus.PROCESSING:
      case OrderStatus.SHIPPED:
      case OrderStatus.ON_HOLD:
      default:
        return 'bg-[#ed875a] text-white';
    }
  };

  // Function to determine if order can be reviewed
  const canReviewOrder = (order: OrderResponse): boolean => {
    return order.status === OrderStatus.DELIVERED || order.status === OrderStatus.COMPLETED;
  };

  // Use our shared formatting utilities
  const formatOrderPrice = (price: number, currency: string = 'INR'): string => {
    return `${getCurrencySymbol(currency)}${formatCurrency(price, currency)}`;
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed]/50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#ed875a] transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/profile" className="hover:text-[#ed875a] transition-colors">My Account</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 dark:text-white">My Orders</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Orders</h2>
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 shadow-md rounded-lg text-[#ed875a] border border-gray-100 dark:border-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-medium">{appliedFilterCount ? `Filters (${appliedFilterCount})` : 'Filters'}</span>
            </button>
          </div>
          
          {/* Filters sidebar - desktop always visible, mobile conditionally */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 lg:flex-shrink-0`}>
            <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-[0_8px_30px_-4px_rgba(237,135,90,0.15)] p-5 sm:p-6 border border-gray-100 dark:border-gray-700">
              {/* Filter header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                {appliedFilterCount > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-[#ed875a] hover:text-[#d44506] transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Clear all
                  </button>
                )}
              </div>

              {/* Filter sections container */}
              <div className="space-y-6">
                {/* Order Status Filters */}
                <div className="filter-section">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 uppercase text-sm flex items-center">
                      <span className="w-5 h-5 mr-2 flex-shrink-0 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Order Status
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                      {Object.values(statusFilters).filter(Boolean).length} selected
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <CheckboxOption 
                      id="filter-pending"
                      label="Pending" 
                      checked={statusFilters.PENDING}
                      onChange={() => handleStatusFilterChange('PENDING')}
                    />
                    <CheckboxOption 
                      id="filter-processing"
                      label="Processing" 
                      checked={statusFilters.PROCESSING}
                      onChange={() => handleStatusFilterChange('PROCESSING')}
                    />
                    <CheckboxOption 
                      id="filter-shipped"
                      label="Shipped" 
                      checked={statusFilters.SHIPPED}
                      onChange={() => handleStatusFilterChange('SHIPPED')}
                    />
                    <CheckboxOption 
                      id="filter-delivered"
                      label="Delivered" 
                      checked={statusFilters.DELIVERED}
                      onChange={() => handleStatusFilterChange('DELIVERED')}
                    />
                    <CheckboxOption
                      id="filter-cancelled" 
                      label="Cancelled" 
                      checked={statusFilters.CANCELLED}
                      onChange={() => handleStatusFilterChange('CANCELLED')}
                    />
                    <CheckboxOption 
                      id="filter-returned"
                      label="Returned" 
                      checked={statusFilters.RETURNED}
                      onChange={() => handleStatusFilterChange('RETURNED')}
                    />
                  </div>
                </div>
                
                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
                
                {/* Order Time Filters */}
                <div className="filter-section">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 uppercase text-sm flex items-center">
                      <span className="w-5 h-5 mr-2 flex-shrink-0 rounded-full bg-[#ed875a]/10 dark:bg-[#ed875a]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#ed875a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Order Time
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                      {Object.values(timeFilters).filter(Boolean).length} selected
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <CheckboxOption 
                      id="filter-last-30-days"
                      label="Last 30 days" 
                      checked={timeFilters.last30Days}
                      onChange={() => handleTimeFilterChange('last30Days')}
                    />
                    <CheckboxOption 
                      id="filter-2024"
                      label="2024" 
                      checked={timeFilters.year2024}
                      onChange={() => handleTimeFilterChange('year2024')}
                    />
                    <CheckboxOption 
                      id="filter-2023"
                      label="2023" 
                      checked={timeFilters.year2023}
                      onChange={() => handleTimeFilterChange('year2023')}
                    />
                    <CheckboxOption 
                      id="filter-2022"
                      label="2022" 
                      checked={timeFilters.year2022}
                      onChange={() => handleTimeFilterChange('year2022')}
                    />
                    <CheckboxOption 
                      id="filter-2021"
                      label="2021" 
                      checked={timeFilters.year2021}
                      onChange={() => handleTimeFilterChange('year2021')}
                    />
                    <CheckboxOption 
                      id="filter-older"
                      label="Older" 
                      checked={timeFilters.older}
                      onChange={() => handleTimeFilterChange('older')}
                    />
                  </div>
                </div>
                
                {/* Apply filters button (only for mobile) */}
                <div className="lg:hidden mt-4">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white font-medium rounded-md flex items-center justify-center"
                  >
                    Apply Filters
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Orders content */}
          <div className="flex-1">
            {/* Title for desktop */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h2>
            </div>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex mb-6 rounded-lg overflow-hidden shadow-sm">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search your orders by product or order ID"
                  className="pl-10 block w-full px-4 py-3 sm:py-3.5 border border-r-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white px-5 sm:px-6 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#ed875a]/20"
              >
                Search
              </button>
            </form>
            
            {/* Order count summary */}
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                {appliedFilterCount > 0 && ` (filtered from ${orders.length})`}
              </div>
              <div className="flex space-x-2">
                {appliedFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
            
            {filteredOrders.length > 0 ? (
              <div className="space-y-4 sm:space-y-5">
                {filteredOrders.map((order) => (
                  console.log('😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊', order),
                  <div 
                    key={order.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_5px_20px_-4px_rgba(237,135,90,0.1)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-100 dark:border-gray-700 hover:shadow-[0_8px_25px_-5px_rgba(237,135,90,0.15)] transition-shadow duration-300"
                  >
                    {/* Take the first item as the main product to display */}
                    {order.items.length > 0 && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative">
                        <div className="relative w-full h-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                          <Image 
                            src={order.items[0].product.imageUrl || "https://picsum.photos/200"} 
                            alt={order.items[0].product.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://picsum.photos/200";
                            }}
                          />
                        </div>
                        <div className={`absolute top-0 right-0 p-1 m-1 text-xs font-medium rounded ${getStatusColorClass(order.status)}`}>
                          {getStatusDisplayText(order.status)}
                        </div>
                      </div>
                    )}
                    
                    {/* Order details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        {/* Left side info */}
                        <div className="mb-2 sm:mb-0">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            <span className="font-medium">{order.orderNumber}</span>
                            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            <span>Ordered on: {new Date(order.placedAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium line-clamp-2">
                            {order.items.length > 0 
                              ? order.items[0].product.title 
                              : 'Order ' + order.orderNumber}
                            {order.items.length > 1 && ` +${order.items.length - 1} more item${order.items.length - 1 > 1 ? 's' : ''}`}
                          </h3>
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-2">
                            {order.items.length > 0 && order.items[0].variant && (
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                {order.items[0].variant.variantName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right side info */}
                        <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                          <div className="text-right">
                                                         <span className="font-bold text-gray-900 dark:text-white">
                               {formatOrderPrice(order.total)}
                             </span>
                          </div>
                          <div className="sm:text-right text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {getStatusDisplayText(order.status)} on {new Date(order.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Details and actions row */}
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        {/* Status details */}
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
                          {order.paymentStatus === PaymentStatus.PAID 
                            ? 'Payment completed' 
                            : order.paymentStatus === PaymentStatus.PENDING 
                              ? 'Payment pending' 
                              : order.paymentStatus}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2">
                          {canReviewOrder(order) && (
                            <button 
                              onClick={() => handleReviewClick(order)}
                              className="text-xs font-medium flex items-center justify-center px-3 py-1.5 bg-[#ed875a]/10 dark:bg-[#ed875a]/20 text-[#d44506] dark:text-[#ed875a] rounded-md transition-colors hover:bg-[#ed875a]/20 dark:hover:bg-[#ed875a]/30"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              Write Review
                            </button>
                          )}
                          <Link 
                            href={`/orders/${order.id}`}
                            className="text-xs font-medium flex items-center justify-center px-3 py-1.5 border border-[#ed875a]/20 dark:border-[#ed875a]/30 text-gray-700 dark:text-gray-300 rounded-md transition-colors hover:bg-[#ed875a]/5 dark:hover:bg-[#ed875a]/10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Details
                          </Link>
                          <button className="text-xs font-medium flex items-center justify-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-[0_8px_30px_-4px_rgba(237,135,90,0.15)] p-8 sm:p-10 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#ed875a]/10 dark:bg-[#ed875a]/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#ed875a] dark:text-[#ed8c61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m8-4l-8-4m-8 4l8-4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any orders matching your criteria. Try adjusting your filters or explore our latest products.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button 
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium border-2 border-[#ed875a] text-[#ed875a] hover:bg-[#ed875a]/5 dark:hover:bg-[#ed875a]/10 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                  <Link 
                    href="/products"
                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-lg hover:shadow-[#ed875a]/20 rounded-md transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Browse Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {selectedProductForReview && (
        <WriteReviewModal
          isOpen={isWriteReviewModalOpen}
          onClose={() => {
            setIsWriteReviewModalOpen(false);
            setSelectedProductForReview(null);
          }}
          product={selectedProductForReview}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
} 
// Custom checkbox component for better styling
function CheckboxOption({ id, label, checked, onChange }: { 
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer group">
      <div className="relative mr-3">
        <input 
          id={id}
          type="checkbox" 
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
          checked 
            ? 'bg-[#ed875a] border-[#ed875a]' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 group-hover:border-[#ed875a]/50'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
      </div>
      <span className={`text-sm ${checked ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </span>
    </label>
  );
} 
