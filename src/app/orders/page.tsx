'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// Type definitions
type StatusFilter = 'onTheWay' | 'delivered' | 'cancelled' | 'returned';
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
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [statusFilters, setStatusFilters] = useState<StatusFilters>({
    onTheWay: false,
    delivered: false,
    cancelled: false,
    returned: false,
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
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/orders');
    }
  }, [isAuthenticated, router]);

  // Filter orders based on selected filters
  useEffect(() => {
    let filtered = [...mockOrders];
    
    // Apply status filters
    if (statusFilters.onTheWay || statusFilters.delivered || statusFilters.cancelled || statusFilters.returned) {
      filtered = filtered.filter(order => {
        return (
          (statusFilters.onTheWay && order.status === 'On the way') ||
          (statusFilters.delivered && order.status === 'Delivered') ||
          (statusFilters.cancelled && order.status === 'Cancelled') ||
          (statusFilters.returned && order.status === 'Returned')
        );
      });
    }
    
    // Apply time filters
    if (timeFilters.last30Days || timeFilters.year2024 || timeFilters.year2023 || timeFilters.year2022 || timeFilters.year2021 || timeFilters.older) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
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
        order.product.name.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(filtered);
  }, [statusFilters, timeFilters, searchQuery]);

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
  
  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-dark-background p-8 rounded-xl shadow-md max-w-md w-full">
          <p className="text-center text-gray-500 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/profile" className="hover:text-primary">My Account</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800 dark:text-gray-200">My Orders</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 bg-white dark:bg-dark-background rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Filters</h2>
          
          {/* Order Status Filters */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase text-sm mb-4">ORDER STATUS</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={statusFilters.onTheWay}
                  onChange={() => handleStatusFilterChange('onTheWay')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">On the way</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={statusFilters.delivered}
                  onChange={() => handleStatusFilterChange('delivered')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Delivered</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={statusFilters.cancelled}
                  onChange={() => handleStatusFilterChange('cancelled')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Cancelled</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={statusFilters.returned}
                  onChange={() => handleStatusFilterChange('returned')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Returned</span>
              </label>
            </div>
          </div>
          
          {/* Order Time Filters */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase text-sm mb-4">ORDER TIME</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={timeFilters.last30Days}
                  onChange={() => handleTimeFilterChange('last30Days')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Last 30 days</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={timeFilters.year2024}
                  onChange={() => handleTimeFilterChange('year2024')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">2024</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={timeFilters.year2023}
                  onChange={() => handleTimeFilterChange('year2023')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">2023</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={timeFilters.year2022}
                  onChange={() => handleTimeFilterChange('year2022')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">2022</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={timeFilters.year2021}
                  onChange={() => handleTimeFilterChange('year2021')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">2021</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                  checked={timeFilters.older}
                  onChange={() => handleTimeFilterChange('older')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Older</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Orders content */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="flex mb-6">
            <input
              type="text"
              placeholder="Search your orders here"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Orders
            </button>
          </div>
          
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-dark-background rounded-md shadow p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Product image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <div className="relative w-20 h-20">
                      <Image 
                        src={order.product.image} 
                        alt={order.product.name}
                        width={80}
                        height={80}
                        className="object-contain rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/200";
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-800 dark:text-gray-200 font-medium">{order.product.name}</h3>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {order.product.color && <span>Color: {order.product.color}</span>}
                      {order.product.color && order.product.size && <span> </span>}
                      {order.product.size && <span>Size: {order.product.size}</span>}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right whitespace-nowrap text-gray-900 dark:text-white font-medium">
                    ₹{order.price}
                  </div>
                  
                  {/* Status and actions */}
                  <div className="md:ml-4 flex flex-col items-end gap-2">
                    <div className={`flex items-center ${
                      order.status === 'Delivered' 
                        ? 'text-green-600' 
                        : order.status === 'Cancelled' 
                          ? 'text-red-600' 
                          : 'text-blue-600'
                    }`}>
                      <span className={`h-2.5 w-2.5 rounded-full mr-2 ${
                        order.status === 'Delivered' 
                          ? 'bg-green-600' 
                          : order.status === 'Cancelled' 
                            ? 'bg-red-600' 
                            : 'bg-blue-600'
                      }`}></span>
                      <span>{order.status} on {order.statusDate}</span>
                    </div>
                    
                    {order.details && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{order.details}</p>
                    )}
                    
                    {order.canReview && (
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Rate & Review Product
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-background rounded-lg shadow-sm p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m8-4l-8-4m-8 4l8-4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
              <div className="mt-6">
                <Link 
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 