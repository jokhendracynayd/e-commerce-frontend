'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// Define types for category data structure
export type Category = {
  id?: string | number;
  name: string;
  image: string;
  slug?: string;
};

export type CategoryGroup = {
  id?: string | number;
  title: string;
  categories: Category[];
  ctaText: string;
  ctaLink?: string;
};

type CategoryGroupsProps = {
  groups: CategoryGroup[];
  className?: string;
};

export const CategoryGroups: React.FC<CategoryGroupsProps> = ({ 
  groups,
  className = ""
}) => {
  if (!groups || groups.length === 0) {
    return null;
  }

  // Animation variants for staggered children animations
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
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className={`px-2 ${className}`}>
      <div className="container mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px 0px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {groups.map((group, groupIndex) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });
            
            return (
              <motion.div 
                key={group.id || groupIndex}
                ref={ref}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg hover:shadow-md transition-all duration-300 dark:border-gray-700"
              >
                <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-gray-900 dark:text-white mb-4 md:mb-5 pb-2 border-b border-gray-100 dark:border-gray-700">
                  {group.title}
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {group.categories.map((category, catIndex) => (
                    <Link 
                      href={category.slug ? `/category/${category.slug}` : '#'}
                      key={category.id || catIndex} 
                      className="group transition-all duration-300"
                    >
                      <div className="bg-[#f5f2ef] dark:bg-gray-700 overflow-hidden rounded-md aspect-square relative mb-2 sm:mb-3">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 768px) 22vw, (max-width: 1024px) 18vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          priority={groupIndex === 0 && catIndex < 2}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#ed8c61] transition-colors duration-300 line-clamp-1">
                        {category.name}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href={group.ctaLink || `/category/${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-[#ed8c61] hover:text-[#d44506] dark:text-[#ed8c61] dark:hover:text-[#ff9d73] text-xs sm:text-sm font-medium mt-3 sm:mt-4 md:mt-5 pt-2 md:pt-3 border-t border-gray-100 dark:border-gray-700 transition-all duration-300 w-full justify-between group"
                >
                  <span>{group.ctaText}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGroups; 