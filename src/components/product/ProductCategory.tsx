'use client';

import { useState, useRef, useEffect } from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';

export type ProductType = ProductCardProps;

export type ProductCategoryProps = {
  title: string;
  products: ProductType[];
  viewAllLink?: string;
};

export function ProductCategory({ title, products, viewAllLink }: ProductCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Show left arrow if scrolled to the right
      setShowLeftArrow(container.scrollLeft > 20);
      
      // Show right arrow if athere's more content to scroll
      // We use a small buffer (20px) to handle precision issues
      setShowRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth - 20);
    }
  };
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Initial check
      checkScrollPosition();
      
      // Add scroll event listener
      container.addEventListener('scroll', checkScrollPosition);
      
      // Add resize listener
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      // Calculate the scroll amount based on container width
      const scrollAmount = Math.max(300, scrollContainerRef.current.clientWidth / 2);
      
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      // Calculate the scroll amount based on container width
      const scrollAmount = Math.max(300, scrollContainerRef.current.clientWidth / 2);
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="py-3 sm:py-4 md:py-6 px-2 sm:px-3 md:px-4 bg-white dark:bg-dark-background rounded-lg my-2 sm:my-3">
      <div className="w-full">
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-foreground">
            {title}
          </h2>
          {viewAllLink && (
            <a href={viewAllLink} className="text-primary hover:text-primary-dark text-sm sm:text-base transition-colors">
              View All
            </a>
          )}
        </div>
        
        <div className="relative">
          {/* Left scroll button */}
          {showLeftArrow && (
            <button 
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 border border-gray-100 dark:border-gray-700"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Products container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-2 xs:gap-3 sm:gap-4 py-4 sm:py-5 md:py-6 px-2 sm:px-3 md:px-4 scrollbar-hide scroll-smooth snap-x"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none snap-start">
                <ProductCard
                  id={product.id}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  discount={product.discount}
                  originalPrice={product.originalPrice}
                  link={product.link}
                  badge={product.badge}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  isAssured={product.isAssured}
                  deliveryInfo={product.deliveryInfo}
                  hasFreeDel={product.hasFreeDel || false}
                  currency={product.currency}
                />
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          {showRightArrow && (
            <button 
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 border border-gray-100 dark:border-gray-700"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Mobile scroll indicator dots */}
          <div className="flex justify-center mt-2 md:hidden">
            <div className="flex space-x-1.5">
              {[...Array(Math.min(5, Math.ceil(products.length / 2)))].map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 