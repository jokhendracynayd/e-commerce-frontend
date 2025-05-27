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
    icon: 'https://cdn-icons-png.flaticon.com/128/3082/3082011.png',
    featured: true,
    description: 'Premium groceries at wholesale prices'
  },
  { 
    id: 'mobiles',
    name: 'Mobiles', 
    href: '/products/mobiles', 
    icon: 'https://cdn-icons-png.flaticon.com/128/186/186239.png',
    featured: true,
    description: 'Latest smartphones and accessories'
  },
  { 
    id: 'fashion',
    name: 'Fashion', 
    href: '/products/fashion', 
    icon: 'https://cdn-icons-png.flaticon.com/128/2331/2331966.png',
    description: 'Trendy clothing and apparel'
  },
  { 
    id: 'electronics',
    name: 'Electronics', 
    href: '/products/electronics', 
    icon: 'https://cdn-icons-png.flaticon.com/128/3659/3659899.png',
    featured: true,
    description: 'Gadgets and tech essentials'
  },
  { 
    id: 'home-furniture',
    name: 'Home & Furniture', 
    href: '/products/home-furniture', 
    icon: 'https://cdn-icons-png.flaticon.com/128/1084/1084226.png',
    description: 'Stylish decor for your space'
  },
  { 
    id: 'appliances',
    name: 'Appliances', 
    href: '/products/appliances', 
    icon: 'https://cdn-icons-png.flaticon.com/128/2267/2267951.png',
    description: 'Premium home appliances'
  },
  { 
    id: 'flight-bookings',
    name: 'Flight Bookings', 
    href: '/products/flight-bookings', 
    icon: 'https://cdn-icons-png.flaticon.com/128/723/723955.png',
    description: 'Best deals on flight tickets'
  },
  { 
    id: 'beauty-toys',
    name: 'Beauty & Toys', 
    href: '/products/beauty-toys', 
    icon: 'https://cdn-icons-png.flaticon.com/128/1906/1906968.png',
    description: 'Self-care products and toys'
  },
  { 
    id: 'two-wheelers',
    name: 'Two Wheelers', 
    href: '/products/two-wheelers', 
    icon: 'https://cdn-icons-png.flaticon.com/128/2972/2972185.png',
    description: 'Bikes and two-wheeler accessories'
  },
];

export function CategoryNavigation() {
  const pathname = usePathname();
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