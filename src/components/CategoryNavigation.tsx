'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export type CategoryType = {
  name: string;
  href: string;
  icon: string;
  id: string;
  featured?: boolean;
  description?: string;
};

export const categories: CategoryType[] = [
  { 
    id: 'kilos',
    name: 'Kilos', 
    href: '/products/kilos', 
    icon: 'https://i.pinimg.com/736x/c8/78/f3/c878f3cbb4a6cc56199b594f0e0d1871.jpg',
    featured: true,
    description: 'Premium groceries at wholesale prices'
  },
  { 
    id: 'mobiles',
    name: 'Mobiles', 
    href: '/products/mobiles', 
    icon: 'https://i.pinimg.com/736x/1c/ce/99/1cce99de15bfea9028d23b1965a04f0f.jpg',
    featured: true,
    description: 'Latest smartphones and accessories'
  },
  { 
    id: 'fashion',
    name: 'Fashion', 
    href: '/products/fashion', 
    icon: 'https://i.pinimg.com/736x/5c/6c/e6/5c6ce698df5d40ab8aa4f523da92cc38.jpg',
    description: 'Trendy clothing and apparel'
  },
  { 
    id: 'electronics',
    name: 'Electronics', 
    href: '/products/electronics', 
    icon: 'https://i.pinimg.com/736x/2b/18/d3/2b18d396018870983758de8d3f0db926.jpg',
    featured: true,
    description: 'Gadgets and tech essentials'
  },
  { 
    id: 'home-furniture',
    name: 'Home & Furniture', 
    href: '/products/home-furniture', 
    icon: 'https://i.pinimg.com/736x/6b/81/3f/6b813ff256e49639e8e85f254d296807.jpg',
    description: 'Stylish decor for your space'
  },
  { 
    id: 'appliances',
    name: 'Appliances', 
    href: '/products/appliances', 
    icon: 'https://i.pinimg.com/736x/61/26/e8/6126e833678890f28cfc282e3f4e879e.jpg',
    description: 'Premium home appliances'
  },
  { 
    id: 'beauty-toys',
    name: 'Beauty & Toys', 
    href: '/products/beauty-toys', 
    icon: 'https://i.pinimg.com/736x/bd/7e/a4/bd7ea444641930cbd78765067d3e0cf5.jpg',
    description: 'Self-care products and toys'
  },
  { 
    id: 'two-wheelers',
    name: 'Two Wheelers', 
    href: '/products/two-wheelers', 
    icon: 'https://i.pinimg.com/736x/fd/81/49/fd8149d6f5bee7d221bf25892d732e00.jpg',
    description: 'Bikes and two-wheeler accessories'
  },
];

export function CategoryNavigation() {
  // Wrap the usePathname hook in a try-catch to prevent server rendering errors
  let pathname = '/';
  try {
    pathname = usePathname() || '/';
  } catch (error) {
    console.error('Error using pathname:', error);
    // Use default pathname if there's an error
  }
  
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if scrolling is needed
  const checkForScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // Initial check
    checkForScrollButtons();
    
    // Add scroll event listener
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkForScrollButtons);
      
      // Add resize listener to adjust buttons on window resize
      window.addEventListener('resize', checkForScrollButtons);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkForScrollButtons);
      }
      window.removeEventListener('resize', checkForScrollButtons);
    };
  }, []);

  // Handle scroll buttons
  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="bg-white dark:bg-gray-900 shadow-sm relative overflow-hidden">
      <div className="container mx-auto px-4 py-6 relative">
        {/* Scroll Buttons - Only show on larger screens */}
        {showLeftScroll && (
          <button 
            onClick={() => scrollCategories('left')}
            className="hidden md:flex absolute left-4 top-1/2 z-10 items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {showRightScroll && (
          <button 
            onClick={() => scrollCategories('right')}
            className="hidden md:flex absolute right-4 top-1/2 z-10 items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* Categories Scrollable Container */}
        <div 
          ref={scrollContainerRef} 
          className="overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex justify-center space-x-4 md:space-x-6 min-w-max">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="relative"
                onMouseEnter={() => category.description ? setShowTooltip(category.id) : null}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Link 
                  href={category.href} 
                  className={`flex flex-col items-center justify-center group transition-all whitespace-nowrap ${
                    pathname === category.href 
                      ? 'scale-105' 
                      : 'hover:scale-105'
                  }`}
                >
                  <div className={`relative mb-3 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-lg
                    ${pathname === category.href 
                      ? 'text-primary' 
                      : 'text-gray-700 dark:text-gray-300'
                    } transition-colors duration-200`}
                  >
                    <Image 
                      src={category.icon} 
                      alt={category.name} 
                      width={48} 
                      height={48} 
                      className="object-contain group-hover:scale-110 transition-transform duration-200" 
                    />
                    
                    {category.featured && (
                      <span className="absolute top-0 right-0 bg-primary text-white text-xs px-1 rounded-bl-lg">
                        New
                      </span>
                    )}
                  </div>
                  
                  <span className={`text-center text-sm font-medium transition-colors
                    ${pathname === category.href 
                      ? 'text-primary dark:text-primary-light' 
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-light'
                    }`}
                  >
                    {category.name}
                  </span>
                </Link>
                
                {/* Tooltip */}
                {showTooltip === category.id && category.description && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs p-2 rounded shadow-lg z-10 pointer-events-none">
                    <div className="relative">
                      {category.description}
                      <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Scroll Indicator */}
        <div className="md:hidden flex justify-center mt-2">
          <div className="flex space-x-1">
            {categories.map((_, index) => (
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
      
      {/* Custom CSS to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
} 