'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export type ColorVariant = {
  id: string;
  color: string;
  hex: string;
  image: string;
};

export type ProductListingCardProps = {
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
  subtitle?: string;
  colorVariants?: ColorVariant[];
  exchangeOffer?: { available: boolean; maxDiscount: number };
  sponsoredTag?: boolean;
};

export function ProductListingCard({ 
  id,
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
  subtitle,
  colorVariants = [],
  exchangeOffer,
  sponsoredTag
}: ProductListingCardProps) {
  // For tracking currently selected color variant
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(image);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-cycle through color variant images
  useEffect(() => {
    if (colorVariants && colorVariants.length > 1) {
      const interval = setInterval(() => {
        setCurrentVariantIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % colorVariants.length;
          setCurrentImage(colorVariants[nextIndex].image);
          return nextIndex;
        });
      }, 3000); // Change image every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [colorVariants]);
  
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
  
  // Calculate discount percentage if not provided
  const discountPercentage = price && originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : null;

  // Format price as Indian Rupees
  const formatPrice = (val: number) => {
    return val.toLocaleString('en-IN');
  };

  // Determine badge background color based on badge content
  const getBadgeClass = () => {
    if (!badge) return "";
    
    if (badge === "Trending") 
      return "bg-purple-600 text-white";
    else if (badge === "Only 3 left") 
      return "bg-orange-500 text-white";
    else if (badge === "Premium") 
      return "bg-yellow-600 text-white";
    else if (badge === "Early Bird Deal") 
      return "bg-blue-500 text-white";
    else 
      return "bg-accent text-white";
  };
    
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Wishlist button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm hover:shadow-md transition-all transform hover:scale-105"
          aria-label="Add to wishlist"
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth={isWishlisted ? "0" : "2"}
            className={isWishlisted ? "text-red-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        
        <Link href={link} className="block">
          <div className="relative h-60 md:h-64 w-full overflow-hidden bg-gray-50 dark:bg-gray-900/50">
            <div className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-500 ease-out">
              <Image 
                src={currentImage} 
                alt={title}
                width={320}
                height={320}
                className="object-contain w-[95%] h-[95%] transition-opacity duration-300"
                style={{ 
                  filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
                }}
                priority={true}
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-0 left-0 flex flex-col items-start">
              {badge && (
                <span className={`m-2 ${getBadgeClass()} text-xs font-bold px-2.5 py-1 rounded-sm z-10 shadow-sm`}>
                  {badge}
                </span>
              )}
              
              {sponsoredTag && (
                <span className="m-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-0.5 rounded-sm font-medium">
                  Sponsored
                </span>
              )}
            </div>
          </div>

          <div className="p-4 space-y-2.5">
            {/* Title */}
            <h3 className="text-sm font-semibold leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] tracking-tight">
              {title}
            </h3>
            
            {/* Subtitle (color/size) */}
            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {subtitle}
              </p>
            )}
            
            {/* Assured badge */}
            {isAssured && (
              <div className="flex items-center">
                <span className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                  <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  <span className="ml-1 text-xs font-semibold text-blue-600 dark:text-blue-400">Assured</span>
                </span>
              </div>
            )}
            
            {/* Price and discount */}
            <div className="flex items-center flex-wrap gap-2 mt-1">
              {price && (
                <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">
                  ₹{formatPrice(price)}
                </span>
              )}
              
              {originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{formatPrice(originalPrice)}
                </span>
              )}
              
              {(discount || discountPercentage) && (
                <span className="text-xs font-bold text-green-600 dark:text-green-400">
                  {discount || `${discountPercentage}% off`}
                </span>
              )}
            </div>
            
            {/* Exchange offer */}
            {exchangeOffer?.available && (
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Upto ₹{exchangeOffer.maxDiscount} Off on Exchange
              </div>
            )}
            
            {/* Delivery info */}
            {(deliveryInfo || hasFreeDel) && (
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center">
                {hasFreeDel && (
                  <svg className="w-3.5 h-3.5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.038A2.968 2.968 0 0115 12.506V16a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0013 7h-2v-1a1 1 0 00-1-1H3z" />
                    <path d="M12 7v1h2.007a1 1 0 01.707.293l2 2A1 1 0 0117 11v5a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-4.9 0H6.05a2.5 2.5 0 01-4.9 0H1a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1v2z" />
                  </svg>
                )}
                {deliveryInfo || (hasFreeDel ? 'Free delivery' : '')}
              </div>
            )}
            
            {/* Rating */}
            {rating && (
              <div className="flex items-center mt-1">
                <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center font-semibold">
                  {rating.toFixed(1)}
                  <svg className="w-3 h-3 ml-0.5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                {reviewCount !== undefined && (
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1.5">
                    ({reviewCount > 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
                  </span>
                )}
              </div>
            )}
            
            {/* Color variant selection */}
            {colorVariants && colorVariants.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center flex-wrap gap-1.5">
                  {colorVariants.slice(0, 5).map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={(e) => selectColorVariant(index, e)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                        currentVariantIndex === index 
                          ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-110' 
                          : 'ring-1 ring-gray-300 dark:ring-gray-600 hover:scale-105'
                      }`}
                      aria-label={`Select ${variant.color} color`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full" 
                        style={{ backgroundColor: variant.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
} 