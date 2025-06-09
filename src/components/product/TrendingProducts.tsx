'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Product } from '@/types/product';
import TrendingCard from './TrendingCard';

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
          {products.map((product, index) => (
            <TrendingCard 
              key={product.id}
              product={{
                ...product,
                badge: index === 0 ? 'Hot' : (index === 1 ? 'Sale' : undefined)
              }} 
              priority={index < 4}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingProducts; 