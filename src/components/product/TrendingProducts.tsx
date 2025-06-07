'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Define types for product data structure
export type Product = {
  id: string | number;
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  imageSrc: string;
  badge?: string;
  slug?: string;
};

type TrendingProductsProps = {
  products: Product[];
  title?: string;
  viewAllLink?: string;
  className?: string;
};

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  products,
  title = "Trending Products",
  viewAllLink = "/products",
  className = ""
}) => {
  if (!products || products.length === 0) {
    return null;
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    }
  };

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className={`py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 ${className}`}>
      <div className="container mx-auto">
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-10"
        >
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-0">
            <span className="relative">
              {title}
              <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-[#ed875a] to-[#ed8c61]"></span>
            </span>
          </h2>
          <Link 
            href={viewAllLink} 
            className="group text-[#ed8c61] hover:text-[#d44506] flex items-center text-sm font-medium transition-all duration-300"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px 0px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {products.map((product, index) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });
            
            return (
              <motion.div 
                key={product.id} 
                ref={ref}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 overflow-hidden group transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] rounded-lg"
              >
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden">
                    <Image 
                      src={product.imageSrc} 
                      alt={product.name}
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index < 4}
                      quality={90}
                    />
                  </div>
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-[#d44506] to-[#ed875a] text-white text-xs font-semibold px-3 py-1.5 z-10 rounded-sm shadow-md">
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      className="bg-white text-gray-900 py-3 px-6 m-4 font-medium text-sm tracking-wide transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl rounded-sm hover:bg-[#ed8c61] hover:text-white"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <Link href={product.slug ? `/product/${product.slug}` : '#'}>
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 group-hover:text-[#ed875a] transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none opacity-40'}`} 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({product.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        ${product.discountPrice || product.price}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-[#ed875a] transition-colors duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingProducts; 