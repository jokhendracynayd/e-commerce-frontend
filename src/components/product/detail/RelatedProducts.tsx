'use client';

import { useState, useRef, useEffect } from 'react';
import { ProductDetail } from '@/types/product';
import { ProductListingCard } from '@/components/product/ProductListingCard';
import { CSSProperties } from 'react';

type ViewMode = 'grid' | 'list';

interface RelatedProductsProps {
  products: ProductDetail[];
  title?: string;
  initialViewMode?: ViewMode;
}

export function RelatedProducts({ products, title = 'Similar Products', initialViewMode }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode || 'grid');
  
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };
  
  // Set viewMode based on screen width - default to list for mobile
  useEffect(() => {
    // Handle initial viewMode setting based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      } else {
        setViewMode(initialViewMode || 'grid');
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [initialViewMode]);
  
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    
    return () => {
      window.removeEventListener('resize', checkScrollability);
    };
  }, []);
  
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -260, behavior: 'smooth' });
      
      // We need a slight delay to check scrollability after the animation
      setTimeout(checkScrollability, 300);
    }
  };
  
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 260, behavior: 'smooth' });
      
      // We need a slight delay to check scrollability after the animation
      setTimeout(checkScrollability, 300);
    }
  };
  
  if (products.length === 0) return null;
  
  // View mode toggle handler
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white flex items-center justify-center"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white flex items-center justify-center"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto hide-scrollbar pb-3 pt-1 -mx-2 px-2 snap-x snap-mandatory"
            onScroll={checkScrollability}
          >
            <div className="flex gap-3 md:gap-4">
              {products.map(product => (
                <div key={product.id} className="w-[160px] xs:w-[180px] sm:w-[220px] md:w-[240px] lg:w-[260px] flex-shrink-0 snap-start">
                  <ProductListingCard
                    id={product.id}
                    title={product.title}
                    image={product.images[0]}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    link={`/product/${product.slug}`}
                    badge={product.badges?.[0]}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    isAssured={product.isAssured}
                    hasFreeDel={product.hasFreeDel}
                    deliveryInfo={product.deliveryInfo}
                    subtitle={product.subtitle}
                    colorVariants={product.colorVariants}
                    exchangeOffer={product.exchangeOffer}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2 sm:space-y-4">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700"
            >
              <ProductListingCard
                id={product.id}
                title={product.title}
                image={product.images[0]}
                price={product.price}
                originalPrice={product.originalPrice}
                link={`/product/${product.slug}`}
                badge={product.badges?.[0]}
                rating={product.rating}
                reviewCount={product.reviewCount}
                isAssured={product.isAssured}
                hasFreeDel={product.hasFreeDel}
                deliveryInfo={product.deliveryInfo}
                subtitle={product.subtitle}
                colorVariants={product.colorVariants}
                exchangeOffer={product.exchangeOffer}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Custom breakpoint for extra small devices */
        @media (min-width: 400px) {
          .xs\\:w-\\[180px\\] {
            width: 180px;
          }
        }
        
        /* Remove shadows from product cards */
        .flex div[class*="snap-start"] > div {
        }
        
        /* Make titles display fully - prevent truncation for all views */
        .flex div[class*="snap-start"] h3,
        .space-y-2 h3,
        .space-y-4 h3 {
          height: auto !important;
          max-height: none !important;
          white-space: normal !important;
          overflow: visible !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
} 