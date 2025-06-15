'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductDetail } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface DealTimer {
  hours: string;
  minutes: string;
  seconds: string;
}

type DealOfTheDayProps = {
  dealProduct: Product | null;
  className?: string;
};

// Use React.memo to prevent unnecessary re-renders
const DealOfTheDay: React.FC<DealOfTheDayProps> = React.memo(({
  dealProduct,
  className = ""
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<DealTimer>({ hours: '10', minutes: '24', seconds: '36' });
  
  // Map dealProduct (type Product/ApiProduct) to ProductDetail format required by addToCart
  const mappedProductDetail = useMemo((): ProductDetail | null => {
    if (!dealProduct) return null;
    
    return {
      id: dealProduct.id,
      slug: dealProduct.slug,
      title: dealProduct.title || dealProduct.name || '',
      brand: dealProduct.brand?.name || '',
      description: dealProduct.description || '',
      price: dealProduct.discountPrice || dealProduct.price,
      originalPrice: dealProduct.originalPrice || dealProduct.price,
      discountPercentage: dealProduct.discount || 0,
      rating: dealProduct.averageRating || 0,
      reviewCount: dealProduct.reviewCount || 0,
      inStock: dealProduct.stockQuantity > 0,
      stockCount: dealProduct.stockQuantity,
      isAssured: false,
      images: dealProduct.images?.map(img => img.imageUrl) || 
              (dealProduct.imageSrc ? [dealProduct.imageSrc] : []),
      highlights: dealProduct.highlights || [],
      specificationGroups: [],
      hasFreeDel: false,
      sellerName: '',
      reviews: []
    };
  }, [dealProduct]);
  
  // Get product data with proper fallbacks to avoid rendering errors
  const productData = useMemo(() => {
    if (!dealProduct) return null;
    
    // Calculate discount percentage
    const originalPrice = dealProduct.originalPrice || dealProduct.price;
    const currentPrice = dealProduct.discountPrice || dealProduct.price;
    const discountPercentage = dealProduct.discount || 
      (originalPrice && currentPrice && originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0);
    
    // Calculate savings amount
    const savingsAmount = originalPrice && currentPrice && originalPrice > currentPrice
      ? (originalPrice - currentPrice).toFixed(2)
      : '0.00';
    
    // Get image URL from product
    const imageUrl = typeof dealProduct.imageSrc === 'string' 
      ? dealProduct.imageSrc
      : (dealProduct.images && dealProduct.images.length > 0 
          ? (typeof dealProduct.images[0] === 'string' 
            ? dealProduct.images[0] 
            : dealProduct.images[0].imageUrl) 
          : '/placeholder-product.jpg');
          
    // Extract features
    const features = dealProduct.features || [];
    
    return {
      id: dealProduct.id,
      title: dealProduct.title || dealProduct.name || 'Deal of the Day',
      originalPrice,
      currentPrice,
      discountPercentage,
      savingsAmount,
      imageUrl,
      features,
      slug: dealProduct.slug
    };
  }, [dealProduct]);
  
  // Memoize the end time to prevent unnecessary recreation of the timer
  const endTimeMs = useMemo(() => {
    if (!dealProduct) return new Date().getTime() + (24 * 60 * 60 * 1000);
    
    return dealProduct.endTime 
      ? new Date(dealProduct.endTime).getTime()
      : new Date().getTime() + (24 * 60 * 60 * 1000);
  }, [dealProduct?.endTime]);
  
  // Set up countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTimeMs - now;
      
      if (distance < 0) {
        // Timer expired
        clearInterval(timer);
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      
      // Calculate time units
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Format with leading zeros
      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTimeMs]); // Only recreate timer when endTimeMs changes
  
  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!dealProduct || !mappedProductDetail) return;
    setAddingToCart(true);
    
    // Add to cart with a slight delay to show animation
    setTimeout(() => {
      addToCart(mappedProductDetail, 1); // Add quantity of 1
      setAddingToCart(false);
      setCartSuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setCartSuccess(false);
      }, 2000);
    }, 500);
  };
  
  // Handle Buy Now
  const handleBuyNow = () => {
    if (!dealProduct || !mappedProductDetail) return;
    
    addToCart(mappedProductDetail, 1); // Add quantity of 1
    
    // Check if user is logged in
    if (user) {
      // If logged in, proceed directly to checkout
      router.push('/checkout');
    } else {
      // If not logged in, redirect to login page with return URL
      router.push(`/login?returnUrl=${encodeURIComponent('/checkout')}`);
    }
  };

  if (!dealProduct || !productData) {
    return null;
  }

  return (
    <section className={`py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-8">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center mb-4 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#d44506] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="relative">
              Deal of the Day
              <span className="absolute -bottom-1 left-0 w-2/3 h-1 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hidden sm:block"></span>
            </span>
          </h2>
          <div className="flex gap-2 sm:gap-3 text-sm sm:text-base">
            <div className="bg-gray-900 dark:bg-gray-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-sm flex flex-col items-center min-w-[38px] sm:min-w-[44px]">
              <span className="font-bold">{timeLeft.hours}</span>
              <span className="text-[10px] text-gray-300">HOURS</span>
            </div>
            <span className="text-gray-500 my-auto">:</span>
            <div className="bg-gray-900 dark:bg-gray-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-sm flex flex-col items-center min-w-[38px] sm:min-w-[44px]">
              <span className="font-bold">{timeLeft.minutes}</span>
              <span className="text-[10px] text-gray-300">MINS</span>
            </div>
            <span className="text-gray-500 my-auto">:</span>
            <div className="bg-gray-900 dark:bg-gray-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-sm flex flex-col items-center min-w-[38px] sm:min-w-[44px]">
              <span className="font-bold">{timeLeft.seconds}</span>
              <span className="text-[10px] text-gray-300">SECS</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg hover:shadow-md transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative overflow-hidden aspect-square sm:aspect-auto sm:h-[350px] md:h-full">
              <Image 
                src={productData.imageUrl}
                alt={productData.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                quality={90}
              />
              <div className="absolute top-4 left-4 bg-gradient-to-br from-[#d44506] to-[#ed875a] text-white text-base sm:text-lg font-bold w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-full shadow-lg transform -rotate-3">
                <span>{productData.discountPercentage}%</span>
                <span className="text-xs font-medium">OFF</span>
              </div>
            </div>
            <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {productData.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{productData.currentPrice.toLocaleString()}
                </span>
                {productData.originalPrice !== productData.currentPrice && (
                  <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 line-through">
                    ₹{productData.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-medium px-2 py-0.5 bg-[#ed875a]/10 text-[#ed875a] rounded-sm">
                  Save ₹{productData.savingsAmount}
                </span>
              </div>
              <div className="mb-4 sm:mb-6">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Key Features:</div>
                <ul className="space-y-1.5">
                  {productData.features.length > 0 ? productData.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#ed875a] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  )) : (
                    <li className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#ed875a] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Limited time special offer</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={handleBuyNow}
                  className="bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-md text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-sm transition-all duration-300 hover:translate-y-[1px]"
                >
                  Buy Now
                </button>
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-white dark:bg-gray-700 border border-[#ed875a] text-[#ed875a] dark:text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 hover:bg-[#ed875a]/5 transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-[#ed875a] border-t-transparent rounded-full animate-spin mr-1" />
                      Adding...
                    </div>
                  ) : cartSuccess ? (
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
              <div className="mt-4 sm:mt-5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Offer ends in limited time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

DealOfTheDay.displayName = 'DealOfTheDay';

export { DealOfTheDay };
export default DealOfTheDay; 