'use client';

import { useState, useRef, useEffect } from 'react';
import { ProductDetail } from '@/types/product';
import { ProductListingCard } from '@/components/product/ProductListingCard';
import { CSSProperties } from 'react';

// Custom wrapper to override ProductListingCard styles for Similar Products
function RelatedProductCard(props: React.ComponentProps<typeof ProductListingCard>) {
  return (
    <div className="related-product-wrapper">
      <ProductListingCard {...props} />
      
      {/* Add styles to hide the Add to Cart button */}
      <style jsx global>{`
        .related-product-wrapper .absolute.bottom-0.right-0 {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

interface RelatedProductsProps {
  products: ProductDetail[];
  title?: string;
}

export function RelatedProducts({ products, title = 'Similar Products' }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };
  
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
      container.scrollBy({ left: -300, behavior: 'smooth' });
      
      // We need a slight delay to check scrollability after the animation
      setTimeout(checkScrollability, 300);
    }
  };
  
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
      
      // We need a slight delay to check scrollability after the animation
      setTimeout(checkScrollability, 300);
    }
  };
  
  if (products.length === 0) return null;
  
  return (
    <div className="relative">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 shadow-[0_4px_10px_-2px_rgba(237,135,90,0.2)] flex items-center justify-center text-[#ed875a] dark:text-[#ed8c61] hover:shadow-lg"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 shadow-[0_4px_10px_-2px_rgba(237,135,90,0.2)] flex items-center justify-center text-[#ed875a] dark:text-[#ed8c61] hover:shadow-lg"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto hide-scrollbar pb-4 pt-2 -mx-2 px-2"
        onScroll={checkScrollability}
      >
        <div className="flex gap-4">
          {products.map(product => (
            <div key={product.id} className="w-[250px] flex-shrink-0">
              <RelatedProductCard
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
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 