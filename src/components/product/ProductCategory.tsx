'use client';

import { useState, useRef } from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';

export type ProductType = ProductCardProps;

export type ProductCategoryProps = {
  title: string;
  products: ProductType[];
};

export function ProductCategory({ title, products }: ProductCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="py-6 px-4 bg-white dark:bg-dark-background">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-foreground mb-4">
          {title}
        </h2>
        
        <div className="relative">
          {/* Left scroll button */}
          <button 
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-dark-background rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Products container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-0 py-6 px-8 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
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
              />
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-dark-background rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
} 