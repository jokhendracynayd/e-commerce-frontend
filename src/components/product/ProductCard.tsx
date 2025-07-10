'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from './WishlistButton';
import ProductAvailabilityBadge from './ProductAvailabilityBadge';
import ProductAvailabilityIndicator from './ProductAvailabilityIndicator';
import { useAnalyticsContext } from '@/context/AnalyticsContext';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

export type ColorVariant = {
  id: string;
  color: string;
  hex: string;
  image: string;
};

export type ExchangeOffer = {
  available: boolean;
  maxDiscount: number;
};

export type BankOffer = {
  available: boolean;
  discount: number;
  bankName?: string;
};

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
  currency?: string;
  subtitle?: string;
  colorVariants?: ColorVariant[];
  exchangeOffer?: ExchangeOffer;
  bankOffer?: BankOffer;
  sponsoredTag?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onQuickView?: () => void;
};

export function ProductCard({ 
  id,
  title, 
  image, 
  price, 
  discount, 
  originalPrice, 
  link, 
  badge,
  isAssured = false,
  deliveryInfo,
  hasFreeDel = false,
  isNew = false,
  isBestSeller = false,
  currency = 'INR',
  subtitle,
  colorVariants = [],
  exchangeOffer,
  bankOffer,
  sponsoredTag = false,
  rating,
  reviewCount,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(image);
  const analytics = useAnalyticsContext();
  
  // Auto-cycle through color variant images when hovered
  useEffect(() => {
    if (colorVariants && colorVariants.length > 1 && isHovered) {
      const interval = setInterval(() => {
        setCurrentVariantIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % colorVariants.length;
          setCurrentImage(colorVariants[nextIndex].image);
          return nextIndex;
        });
      }, 2000); // Change image every 2 seconds when hovered
      
      return () => clearInterval(interval);
    }
  }, [colorVariants, isHovered]);
  
  // Use the first color variant image if available, otherwise use the default image
  useEffect(() => {
    if (colorVariants && colorVariants.length > 0) {
      setCurrentImage(colorVariants[0].image);
    } else {
      setCurrentImage(image);
    }
  }, [colorVariants, image]);

  // Handle color variant selection
  const selectColorVariant = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentVariantIndex(index);
    setCurrentImage(colorVariants[index].image);
  };
  
  // Calculate discount percentage if both price and originalPrice are available
  let discountPercentage: number | null = null;
  if (price && originalPrice && originalPrice > price) {
    // Calculate discount percentage (avoid division by zero)
    const calculatedDiscount = ((originalPrice - price) / originalPrice) * 100;
    
    // Handle extreme discount cases - ensure it's at least 1% if there's any discount
    if (calculatedDiscount > 0) {
      // For very high discounts (like 90%+), ensure we don't exaggerate
      discountPercentage = Math.min(Math.max(1, Math.round(calculatedDiscount)), 90);
    }
  }

  // Handle product click tracking
  const handleProductClick = () => {
    analytics.trackProductClick(
      id,
      'product_grid', // source
      undefined, // position - could be passed as prop
      {
        productTitle: title,
        productPrice: price,
        originalPrice,
        discount: discountPercentage,
        rating,
        reviewCount,
        badge,
        isNew,
        isBestSeller,
        sponsoredTag,
      }
    );
  };

  return (
    <div
      className="group w-[120px] xs:w-[150px] sm:w-[210px] md:w-[240px] lg:w-[280px] bg-white dark:bg-gray-800 overflow-hidden hover:-translate-y-1 transition-all duration-300 relative hover:z-10 rounded-lg"
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
      <div className="relative h-28 xs:h-36 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden">
        <Link href={link} onClick={handleProductClick} className="block h-full w-full">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/30 dark:bg-gray-700/20">
            <Image 
              src={currentImage} 
              alt={title}
              width={200}
              height={200}
              sizes="(max-width: 480px) 120px, (max-width: 640px) 150px, (max-width: 768px) 190px, 250px"
              className={`object-contain max-h-full w-auto transition-transform duration-500 p-1 xs:p-2 ${isHovered ? 'scale-110' : ''}`}
            />
          </div>
        </Link>
        
        {/* Use the reusable ProductAvailabilityIndicator component */}
        <ProductAvailabilityIndicator 
          productId={id}
          viewMode="grid"
          showCentered={true}
        />
        
        {/* Quick action buttons */}
        <div className={`absolute right-1 top-1 sm:right-2 sm:top-2 flex flex-col gap-1 sm:gap-1.5 transition-all duration-300 transform ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          {/* WishlistButton integration */}
          <WishlistButton 
            productId={id}
            size="sm"
            variant="icon"
            className="shadow-sm"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1 sm:gap-1.5">
          {sponsoredTag && (
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[8px] xs:text-[10px] sm:text-xs font-medium px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm">
              Sponsored
            </span>
          )}
          
          {badge && (
            <span className={`inline-block ${
              badge === 'Featured' ? 'bg-gradient-to-r from-[#8e54e9] to-[#7048e8]' : 
              badge === 'Sale' ? 'bg-gradient-to-r from-[#f43f5e] to-[#e11d48]' : 
              'bg-gradient-to-r from-[#ed8c61] to-[#ed875a]'
            } text-white text-[10px] xs:text-[11px] sm:text-xs font-semibold sm:font-bold px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md shadow-sm border border-white/10`}>
              {badge}
            </span>
          )}
          
          {isNew && (
            <span className="inline-block bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[8px] xs:text-[10px] sm:text-xs font-medium sm:font-bold px-1 xs:px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-sm border border-white/10">
              New
            </span>
          )}
          
          {isBestSeller && (
            <span className="inline-block bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-[8px] xs:text-[10px] sm:text-xs font-medium sm:font-bold px-1 xs:px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-sm border border-white/10">
              Best Seller
            </span>
          )}
          
          {discountPercentage && discountPercentage >= 5 && (
            <span className="inline-block bg-gradient-to-r from-[#ed8c61] to-[#ed6261] text-white text-[10px] xs:text-[11px] sm:text-xs font-semibold sm:font-bold px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md shadow-sm border border-white/10">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        {/* Assured badge */}
        {isAssured && (
          <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
            <div className="bg-gradient-to-r from-[#ed8c61] to-[#ed875a] text-white text-[8px] xs:text-[10px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 rounded font-medium flex items-center gap-0.5 sm:gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="tracking-tight">Assured</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-1.5 xs:p-2 sm:p-3 md:p-4">
        <Link href={link} onClick={handleProductClick} className="block group-hover:text-primary transition-colors">
          <h3 className="font-heading font-medium text-gray-800 dark:text-gray-100 line-clamp-2 h-8 xs:h-9 sm:h-12 text-[11px] xs:text-xs sm:text-sm md:text-base">
            {title}
          </h3>
        </Link>

        {/* Subtitle (color/size info) */}
        {subtitle && (
          <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium truncate mt-0.5 xs:mt-1">
            {subtitle}
          </p>
        )}
        
        {/* Real-time inventory status */}
        <ProductAvailabilityBadge productId={id} />
        
        {/* Rating - Enhanced display */}
        {rating && rating > 0 && (
          <div className="flex flex-wrap items-center mt-0.5 xs:mt-1 sm:mt-2 gap-1">
            <div className="flex items-center bg-[#e7e1dc] text-gray-800 text-[8px] xs:text-[10px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-sm">
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ml-0.5 ${
                  rating >= 4 ? 'text-[#0e6b65]' : 
                  rating >= 3 ? 'text-[#14958f]' : 
                  rating >= 2 ? 'text-[#45ada5]' : 
                  'text-[#f9d776]'
                }`}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                {reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : `${reviewCount}`}
              </span>
            )}
          </div>
        )}
        
        {/* Price Section */}
        <div className="mt-1 xs:mt-1.5 sm:mt-2 flex items-baseline flex-wrap gap-0.5 xs:gap-1 sm:gap-1.5">
          {price ? (
            <span className="font-bold text-gray-900 dark:text-white text-xs xs:text-sm sm:text-base md:text-lg">
              {getCurrencySymbol(currency)}{formatCurrency(price, currency)}
            </span>
          ) : discount ? (
            <span className="font-bold text-green-600 dark:text-green-400 text-xs xs:text-sm sm:text-base md:text-lg">
              {discount}
            </span>
          ) : (
            <span className="font-bold text-gray-900 dark:text-white text-xs xs:text-sm sm:text-base md:text-lg">
              Call for price
            </span>
          )}
          
          {originalPrice && (
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-500 line-through">
              {getCurrencySymbol(currency)}{formatCurrency(originalPrice, currency)}
            </span>
          )}
          
          {discountPercentage && discountPercentage >= 1 && (
            <span className="text-[8px] xs:text-[10px] sm:text-xs font-semibold text-[#ed8c61] dark:text-green-400 ml-0.5">
              ({discountPercentage}% off)
            </span>
          )}
        </div>

        {/* Bank Offer */}
        {bankOffer?.available && (
          <div className="mt-1 xs:mt-1.5">
            <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 rounded-sm">
              <span className="bg-blue-700 text-white text-[8px] xs:text-[9px] sm:text-[10px] px-1 py-0.5 font-bold">WOW!</span>
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] px-1 py-0.5 text-gray-700 dark:text-gray-300 font-medium">
                {getCurrencySymbol(currency)}{bankOffer.discount} with Bank offer
              </span>
            </div>
          </div>
        )}

        {/* Exchange Offer */}
        {exchangeOffer?.available && (
          <div className="mt-0.5 xs:mt-1 flex items-center text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
            <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 mr-0.5 text-[#ed875a]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-4.9 0H6.05a2.5 2.5 0 01-4.9 0H1a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1v2z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Upto {getCurrencySymbol(currency)}{exchangeOffer.maxDiscount} Off on Exchange</span>
          </div>
        )}

        {/* Color variant selection */}
        {colorVariants && colorVariants.length > 0 && (
          <div className="mt-1 xs:mt-1.5">
            <div className="flex items-center space-x-1">
              {colorVariants.slice(0, 4).map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={(e) => selectColorVariant(index, e)}
                  className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-all duration-200 rounded-full ${
                    currentVariantIndex === index 
                      ? 'ring-1 ring-[#ed875a] scale-110' 
                      : 'ring-1 ring-gray-300 dark:ring-gray-600'
                  }`}
                  aria-label={`Select ${variant.color} color`}
                >
                  <span 
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 rounded-full" 
                    style={{ backgroundColor: variant.hex }}
                  />
                </button>
              ))}
              {colorVariants.length > 4 && (
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 ml-1">
                  +{colorVariants.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Delivery Info */}
        {(deliveryInfo || hasFreeDel) && (
          <div className="mt-0.5 xs:mt-1 sm:mt-1.5 flex items-center text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
            {hasFreeDel && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 mr-0.5 text-green-500">
                  <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 006.5 3zM2 12v2.5A1.5 1.5 0 003.5 16h.041a3 3 0 015.918 0h.791a.75.75 0 00.75-.75V12H2z" />
                  <path d="M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.25 5a.75.75 0 00-.75.75v8.514a3.001 3.001 0 014.893 1.44c.37-.275.607-.714.607-1.201V6.75a.75.75 0 00-.75-.75h-4z" />
                  <path d="M14.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="font-medium text-green-600 dark:text-green-400">Free</span>
              </div>
            )}
            {deliveryInfo && !hasFreeDel && (
              <div>{deliveryInfo}</div>
            )}
          </div>
        )}
      </div>
      
      {/* Add to cart quick button - visible on hover */}
      {/*
      <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-1.5 xs:p-2 sm:p-2.5 transform transition-transform duration-300 shadow-md ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
        <button 
          className="w-full bg-[#ed8c61] hover:bg-[#ed875a] text-white py-1 xs:py-1.5 sm:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 shadow-sm hover:cursor-pointer rounded-sm"
          onClick={(e) => {
            e.preventDefault();
            if (onAddToCart) onAddToCart();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="whitespace-nowrap">Add to Cart</span>
        </button>
      </div>
      */}
    </div>
  );
} 