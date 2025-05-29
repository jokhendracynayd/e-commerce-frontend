'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type ProductCardProps = {
  id: string;
  title: string;
  image: string;
  price?: number;
  discount?: string;
  originalPrice?: number;
  link: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  isAssured?: boolean;
  deliveryInfo?: string;
  hasFreeDel: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onQuickView?: () => void;
};

export function ProductCard({ 
  title, 
  image, 
  price, 
  discount, 
  originalPrice, 
  link, 
  badge,
  rating,
  reviewCount,
  isAssured = false,
  deliveryInfo,
  hasFreeDel = false,
  isNew = false,
  isBestSeller = false,
  onAddToCart,
  onAddToWishlist,
  onQuickView
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discount percentage if both price and originalPrice are available
  const discountPercentage = price && originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : null;

  return (
    <div 
      className="group w-full min-w-[270px] md:min-w-[280px] max-w-[280px] bg-white dark:bg-gray-800 overflow-hidden shadow-none hover:-translate-y-1 transition-all duration-300 relative hover:z-10"
      style={{ 
        width: '100%', 
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.1)';
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        setIsHovered(false);
      }}
    >
      {/* Image Container */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden">
        <Link href={link} className="block h-full w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={image} 
              alt={title}
              width={250}
              height={250}
              className={`object-contain max-h-64 transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {/* Remove inner shadow effect */}
            <div className="absolute inset-0 transition-opacity duration-300" />
          </div>
        </Link>
        
        {/* Quick action buttons */}
        <div className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 transform ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onAddToWishlist) onAddToWishlist();
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:cursor-pointer"
            aria-label="Add to wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && (
            <span className="inline-block bg-accent text-white text-xs font-bold px-2.5 py-1.5 rounded-md">
              {badge}
            </span>
          )}
          
          {isNew && (
            <span className="inline-block bg-green-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-md">
              New
            </span>
          )}
          
          {isBestSeller && (
            <span className="inline-block bg-amber-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-md">
              Best Seller
            </span>
          )}
          
          {discountPercentage && discountPercentage >= 5 && (
            <span className="inline-block bg-[#d44506] text-white text-xs font-bold px-2.5 py-1.5 rounded-md">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        {/* Assured badge */}
        {isAssured && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-gradient-to-r from-[#ed8c61] to-[#ed875a] text-white text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Assured
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <Link href={link} className="block group-hover:text-primary transition-colors">
          <h3 className="font-heading font-medium text-gray-800 dark:text-gray-100 line-clamp-2 h-12 text-sm sm:text-base">
            {title}
          </h3>
        </Link>
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center mt-2">
            <div className="flex items-center bg-[#e7e1dc] text-gray-800 text-xs px-2 py-0.5 rounded-sm">
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className={`w-3.5 h-3.5 ml-0.5 ${
                  rating >= 4 ? 'text-[#0e6b65]' : 
                  rating >= 3 ? 'text-[#14958f]' : 
                  rating >= 2 ? 'text-[#45ada5]' : 
                  'text-[#f9d776]'
                }`}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            {reviewCount !== undefined && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
                {reviewCount > 1000 ? `${(reviewCount / 1000).toFixed(1)}k reviews` : `${reviewCount} reviews`}
              </span>
            )}
          </div>
        )}
        
        {/* Price Section */}
        <div className="mt-3 flex items-baseline flex-wrap gap-1.5">
          {price ? (
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              ₹{price.toLocaleString()}
            </span>
          ) : discount ? (
            <span className="font-bold text-green-600 dark:text-green-400 text-lg">
              {discount}
            </span>
          ) : null}
          
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          
          {discountPercentage && (
            <span className="text-xs font-semibold text-[#ed8c61] dark:text-green-400 ml-1">
              ({discountPercentage}% off)
            </span>
          )}
        </div>
        
        {/* Delivery Info */}
        {(deliveryInfo || hasFreeDel) && (
          <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-300">
            {hasFreeDel && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-green-500">
                  <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 006.5 3zM2 12v2.5A1.5 1.5 0 003.5 16h.041a3 3 0 015.918 0h.791a.75.75 0 00.75-.75V12H2z" />
                  <path d="M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.25 5a.75.75 0 00-.75.75v8.514a3.001 3.001 0 014.893 1.44c.37-.275.607-.714.607-1.201V6.75a.75.75 0 00-.75-.75h-4z" />
                  <path d="M14.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="font-medium text-green-600 dark:text-green-400">Free Delivery</span>
              </div>
            )}
            {deliveryInfo && !hasFreeDel && (
              <div>{deliveryInfo}</div>
            )}
          </div>
        )}
      </div>
      
      {/* Add to cart quick button - visible on hover */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-3 transform transition-transform duration-300 shadow-md ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
        <button 
          className="w-full bg-[#ed8c61] hover:bg-[#ed875a] text-white py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (onAddToCart) onAddToCart();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="whitespace-nowrap">Add to Cart</span>
        </button>
      </div>
    </div>
  );
} 