'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CartIcon } from './cart/CartIcon';
import { useAuth } from '@/context/AuthContext';
import { categoriesApi } from '@/lib/api';
import { CategoryNode } from '@/types/categories';
import { SearchBar } from './search/SearchBar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [userMenuTimeout, setUserMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [categoryMenuTimeout, setCategoryMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [flatCategories, setFlatCategories] = useState<CategoryNode[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Wrap usePathname in a try-catch for error handling
  let pathname = '/';
  try {
    pathname = usePathname() || '/';
  } catch (error) {
    console.error('Error using pathname in Header:', error);
    // Use default pathname if there's an error
  }
  
  // Use auth context with isLoading state
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  
  // Helper function to flatten category tree
  const flattenCategoryTree = (categories: CategoryNode[]): CategoryNode[] => {
    return categories.reduce((acc, category) => {
      const { children, ...categoryWithoutChildren } = category;
      return [
        ...acc,
        categoryWithoutChildren,
        ...(children ? flattenCategoryTree(children) : [])
      ];
    }, [] as CategoryNode[]);
  };
  
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoriesApi.getCategoryTree();
        setCategories(categoriesData);
        
        // Create flattened list for easier path building
        const flattened = flattenCategoryTree(categoriesData);
        setFlatCategories(flattened);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setFlatCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };
  
  // Handle search expansion
  const expandSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };
  
  const collapseSearch = () => {
    if (searchInputRef.current?.value === '') {
      setIsSearchExpanded(false);
    }
  };
  
  // Function to handle hover state for user menu with delay
  const handleUserMenuEnter = () => {
    if (userMenuTimeout) {
      clearTimeout(userMenuTimeout);
      setUserMenuTimeout(null);
    }
    setIsUserMenuOpen(true);
  };
  
  const handleUserMenuLeave = () => {
    // Add a delay before closing the menu to give user time to move to dropdown
    const timeout = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 300); // 300ms delay
    
    setUserMenuTimeout(timeout);
  };

  // Function to handle hover state for category menu with delay
  const handleCategoryMenuEnter = () => {
    if (categoryMenuTimeout) {
      clearTimeout(categoryMenuTimeout);
      setCategoryMenuTimeout(null);
    }
    setIsCategoryMenuOpen(true);
  };
  
  const handleCategoryMenuLeave = () => {
    // Add a delay before closing the menu to give user time to move to dropdown
    const timeout = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 300); // 300ms delay
    
    setCategoryMenuTimeout(timeout);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (userMenuTimeout) {
        clearTimeout(userMenuTimeout);
      }
      if (categoryMenuTimeout) {
        clearTimeout(categoryMenuTimeout);
      }
    };
  }, [userMenuTimeout, categoryMenuTimeout]);

  // Logout function using auth context
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to render mobile nested categories
  const renderMobileCategories = (categories: CategoryNode[], level = 0) => {
    return (
      <>
        {categories.map(category => {
          const categoryPath = buildCategoryPath(category, flatCategories);
          
          return (
            <div key={category.id} className="space-y-1">
              <Link 
                href={categoryPath}
                className={`text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-1.5 sm:py-2 transition-colors block ${level > 0 ? `pl-${level * 4}` : ''}`}
                style={level > 0 ? { paddingLeft: `${level * 12}px` } : {}}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
              
              {category.children && category.children.length > 0 && (
                <div className="pl-4">
                  {renderMobileCategories(category.children, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Helper function to build hierarchical paths
  const buildCategoryPath = (category: CategoryNode, allCategories: CategoryNode[]): string => {
    const path: string[] = [category.slug];
    
    let currentCat = category;
    while (currentCat.parentId) {
      const parentCategory = allCategories.find(cat => cat.id === currentCat.parentId);
      if (parentCategory) {
        path.unshift(parentCategory.slug);
        currentCat = parentCategory;
      } else {
        break;
      }
    }
    return '/' + path.join('/');
  };

  // Helper function to render nested categories recursively
  const renderNestedCategories = (categories: CategoryNode[], isRoot = false) => {
    return (
      <>
        {categories.map(category => {
          const categoryPath = buildCategoryPath(category, flatCategories);
          
          return (
            <div key={category.id} className="category-item relative px-1 w-full">
              <Link 
                href={categoryPath} 
                className={`block px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md font-medium hover:text-primary dark:hover:text-primary-light transition-colors ${!isRoot ? 'flex justify-between items-center' : ''}`}
              >
                <span>{category.name}</span>
                {category.children && category.children.length > 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${isRoot ? 'inline-block ml-2' : 'ml-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRoot ? "M9 5l7 7-7 7" : "M9 5l7 7-7 7"} />
                  </svg>
                )}
              </Link>
              
              {/* Nested subcategories flyout */}
              {category.children && category.children.length > 0 && (
                <div 
                  className="absolute left-full top-0 ml-0 w-44 lg:w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 opacity-0 invisible submenu z-[100]"
                >
                  {renderNestedCategories(category.children, false)}
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Add CSS for correct hover behavior at component level
  useEffect(() => {
    // Add style tag to document head
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      /* Base styling for category items */
      .category-item {
        position: relative;
      }

      /* Show submenu on hover with a delay to prevent flickering */
      .category-item:hover > .submenu {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        transition-delay: 100ms;
      }
      
      /* Maintain visibility when moving to submenu */
      .submenu:hover {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      
      /* Create a safe hover area with invisible pseudo-element */
      .category-item::after {
        content: "";
        position: absolute;
        top: 0;
        right: -10px; /* Safety margin */
        width: 20px; /* Width of the safety area */
        height: 100%;
        background: transparent;
        z-index: 1;
      }
      
      /* Create a buffer zone between parent and child */
      .submenu::before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 10px;
        height: 100%;
        background: transparent;
        z-index: 2;
      }
      
      /* Reset submenu visibility when not hovering */
      .category-item .submenu {
        pointer-events: none;
        transition: opacity 150ms ease, visibility 150ms ease;
      }
    `;
    document.head.appendChild(styleTag);
    
    // Clean up function
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 w-full">
      {/* Announcement bar */}
      <div className="bg-primary/10 dark:bg-primary/20 text-[#d44506] italic dark:text-primary-light py-1.5 sm:py-2">
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm font-medium">
          <span className="hidden xs:inline">Free shipping on orders over $50</span>
          <span className="xs:hidden">Free shipping over $50</span>
          <span className="mx-1 sm:mx-2">|</span>
          <span>Use code <span className="font-bold">WELCOME10</span> for 10% off</span>
        </div>
      </div>
      
      {/* Main header section */}
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 dark:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-24 h-10 sm:w-28 sm:h-11 md:w-40 md:h-16 relative">
                <Image src="/images/logo/logo.svg" alt="Logo" fill className="object-contain" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 ml-4 lg:ml-8">
            <div 
              className="relative" 
              ref={categoryMenuRef}
              onMouseEnter={handleCategoryMenuEnter}
              onMouseLeave={handleCategoryMenuLeave}
            >
              <button 
                className={`flex items-center text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors ${isCategoryMenuOpen ? 'text-primary dark:text-primary-light' : ''}`}
                aria-expanded={isCategoryMenuOpen}
                aria-haspopup="true"
              >
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category dropdown menu */}
              <div 
                className={`absolute left-0 mt-2 w-56 lg:w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 grid grid-cols-1 ${isCategoryMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{transform: isCategoryMenuOpen ? 'translateY(0)' : 'translateY(-10px)'}}
              >
                {loadingCategories ? (
                  <div className="flex items-center justify-center px-4 py-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                  </div>
                ) : categories.length > 0 ? (
                  renderNestedCategories(categories, true)
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No categories found</div>
                )}
              </div>
            </div>

            <Link 
              href="/deals" 
              className={`text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors relative ${pathname === '/deals' ? 'text-primary dark:text-primary-light' : ''}`}
            >
              Deals
              <span className="absolute -top-2 -right-2 bg-[#d44506] text-white text-[10px] lg:text-xs font-bold px-1 py-0.5 rounded-full">Hot</span>
            </Link>
            
            <Link 
              href="/new-arrivals" 
              className={`text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors ${pathname === '/new-arrivals' ? 'text-primary dark:text-primary-light' : ''}`}
            >
              New Arrivals
            </Link>
            
            <Link 
              href="/bestsellers" 
              className={`text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors ${pathname === '/bestsellers' ? 'text-primary dark:text-primary-light' : ''}`}
            >
              Best Sellers
            </Link>
          </nav>

          {/* Search bar - hidden on mobile, visible on desktop */}
          <div className={`hidden md:flex items-center transition-all duration-300 ${isSearchExpanded ? 'flex-grow mx-4 lg:mx-8' : 'w-36 sm:w-40 lg:w-48 xl:w-64 mx-3 lg:mx-4'}`}>
            <SearchBar 
              onFocus={expandSearch}
              onBlur={collapseSearch}
              placeholder="Search products..."
              fullWidth
            />
          </div>

          {/* Right section - User and Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5">
            {/* Search icon for mobile */}
            <button 
              className="md:hidden text-gray-700 dark:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Wishlist */}
            <Link 
              href={isAuthenticated ? "/profile?section=wishlist" : "/login?returnUrl=/profile?section=wishlist"} 
              className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">3</span>
            </Link>
            
            {/* User menu */}
            <div 
              className="relative" 
              ref={userMenuRef}
              onMouseEnter={handleUserMenuEnter}
              onMouseLeave={handleUserMenuLeave}
            >
              {authLoading ? (
                // Show loading placeholder during authentication loading
                <div className="hidden md:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : isAuthenticated && user ? (
                <div>
                  <button 
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    {user && 'avatar' in user && user.avatar && typeof user.avatar === 'string' ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-sm sm:text-base lg:text-lg font-semibold uppercase">{user?.name.charAt(0) || 'U'}</span>
                    )}
                  </button>
                  
                  {/* User dropdown menu */}
                  <div 
                    className={`absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 transition-all duration-200 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    style={{transform: isUserMenuOpen ? 'translateY(0)' : 'translateY(-10px)'}}
                  >
                    <div className="px-4 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      
                      <Link 
                        href="/orders" 
                        className="flex items-center px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </Link>
                      
                      <Link 
                        href="/profile?section=wishlist" 
                        className="flex items-center px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Wishlist
                      </Link>
                      
                      <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                  <Link 
                    href="/login"
                    className="text-xs lg:text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Cart icon with badge */}
            <CartIcon />
          </div>
        </div>

        {/* Mobile search - only visible when menu is open */}
        {isMenuOpen && (
          <div className="mt-3 md:hidden">
            <SearchBar 
              placeholder="Search products..." 
              autoFocus={true}
              fullWidth={true}
              isMobile={true}
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 py-2">
            {/* Mobile categories */}
            <div className="py-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 font-heading">
                Categories
              </h3>
              {loadingCategories ? (
                <div className="flex items-center py-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <span className="ml-2 text-xs text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {renderMobileCategories(categories)}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 my-1 sm:my-2"></div>
            
            {/* Mobile navigation */}
            <div className="py-1 sm:py-2">
              <Link 
                href="/deals" 
                className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-1.5 sm:py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Deals</span>
                <span className="ml-2 bg-[#d44506] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Hot</span>
              </Link>
              <Link 
                href="/new-arrivals" 
                className="block text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-1.5 sm:py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link 
                href="/bestsellers" 
                className="block text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-1.5 sm:py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Best Sellers
              </Link>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 my-1 sm:my-2"></div>

            {/* Mobile auth buttons */}
            {authLoading ? (
              // Loading placeholder for mobile auth
              <div className="flex justify-center py-3 sm:py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : !isAuthenticated ? (
              <div className="flex space-x-2 sm:space-x-3 py-3 sm:py-4">
                <Link 
                  href="/login"
                  className="flex-1 text-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="flex-1 text-center text-xs sm:text-sm bg-primary text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="py-3 sm:py-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200">
                    <span className="text-sm sm:text-base font-semibold uppercase">{user?.name.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <Link 
                    href="/profile" 
                    className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 py-1.5 sm:py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link 
                    href="/orders" 
                    className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 py-1.5 sm:py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                  
                  <Link 
                    href="/profile?section=wishlist" 
                    className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 py-1.5 sm:py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Wishlist
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-xs sm:text-sm text-gray-700 dark:text-gray-200 py-1.5 sm:py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 