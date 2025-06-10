'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export function CartIcon() {
  const { items } = useCart();
  const [displayCount, setDisplayCount] = useState(0);
  
  // Calculate total directly from items to ensure it's always in sync
  useEffect(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    console.log('CartIcon: Items length:', items.length, 'Calculated count:', itemCount);
    setDisplayCount(itemCount);
  }, [items]);
  
  return (
    <div className="relative">
      <Link 
        href="/cart" 
        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Shopping cart"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 text-gray-700 dark:text-gray-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        
        {displayCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs font-bold text-white bg-red-500 rounded-full">
            {displayCount > 99 ? '99+' : displayCount}
          </span>
        )}
      </Link>
    </div>
  );
} 