'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CartIcon } from './cart/CartIcon';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [userMenuTimeout, setUserMenuTimeout] = useState<NodeJS.Timeout | null>(null);
  const [categoryMenuTimeout, setCategoryMenuTimeout] = useState<NodeJS.Timeout | null>(null);
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
  
  // Use auth context instead of mock values
  const { isAuthenticated, user, logout } = useAuth();
  
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

  // Sample category data
  const categories = [
    { id: 1, name: "Electronics", slug: "electronics", subcategories: ["Phones", "Laptops", "Accessories"] },
    { id: 2, name: "Fashion", slug: "fashion", subcategories: ["Men's Clothing", "Women's Clothing", "Jewelry"] },
    { id: 3, name: "Home & Garden", slug: "home-garden", subcategories: ["Furniture", "Decor", "Kitchen"] },
    { id: 4, name: "Sports", slug: "sports", subcategories: ["Fitness", "Outdoor", "Team Sports"] },
    { id: 5, name: "Toys", slug: "toys", subcategories: ["Action Figures", "Board Games", "Educational"] }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      {/* Announcement bar */}
      <div className="bg-primary/10 dark:bg-primary/20 text-[#d44506] italic dark:text-primary-light py-2">
        <div className="container mx-auto px-4 text-center text-sm font-medium">
          Free shipping on orders over $50 | Use code WELCOME10 for 10% off your first order
        </div>
      </div>
      
      {/* Main header section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo/logo.svg" alt="Logo" width={100} height={100} />
              {/* <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline-block">MyStore</span> */}
            </Link>
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <div 
              className="relative" 
              ref={categoryMenuRef}
              onMouseEnter={handleCategoryMenuEnter}
              onMouseLeave={handleCategoryMenuLeave}
            >
              <button 
                className={`flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors ${isCategoryMenuOpen ? 'text-primary dark:text-primary-light' : ''}`}
                aria-expanded={isCategoryMenuOpen}
                aria-haspopup="true"
              >
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category dropdown menu */}
              <div 
                className={`absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 grid grid-cols-1 ${isCategoryMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{transform: isCategoryMenuOpen ? 'translateY(0)' : 'translateY(-10px)'}}
              >
                {categories.map(category => (
                  <div key={category.id} className="group relative px-1">
                    <Link 
                      href={`/category/${category.slug}`} 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md font-medium group-hover:text-primary dark:group-hover:text-primary-light transition-colors"
                    >
                      {category.name}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    {/* Subcategories flyout */}
                    <div className="absolute left-full top-0 ml-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {category.subcategories.map((subcat, index) => (
                        <Link 
                          key={index} 
                          href={`/category/${category.slug}/${subcat.toLowerCase().replace(/\s+/g, '-')}`} 
                          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md hover:text-primary dark:hover:text-primary-light transition-colors"
                        >
                          {subcat}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link 
              href="/deals" 
              className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors relative ${pathname === '/deals' ? 'text-primary dark:text-primary-light' : ''}`}
            >
              Deals
              <span className="absolute -top-2 -right-2 bg-[#d44506] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">Hot</span>
            </Link>
            
            <Link 
              href="/new-arrivals" 
              className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors ${pathname === '/new-arrivals' ? 'text-primary dark:text-primary-light' : ''}`}
            >
              New Arrivals
            </Link>
            
            <Link 
              href="/bestsellers" 
              className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors ${pathname === '/bestsellers' ? 'text-primary dark:text-primary-light' : ''}`}
            >
              Best Sellers
            </Link>
          </nav>

          {/* Search bar - hidden on mobile, visible on desktop */}
          <div className={`hidden md:flex items-center transition-all duration-300 ${isSearchExpanded ? 'flex-grow mx-8' : 'w-48 xl:w-64 mx-4'}`}>
            <div className="relative w-full">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search products..." 
                className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-transparent focus:border-primary dark:focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-light transition-all"
                onFocus={expandSearch}
                onBlur={collapseSearch}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors" 
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right section - User and Cart */}
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Search icon for mobile */}
            <button 
              className="md:hidden text-gray-700 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </Link>
            
            {/* User menu */}
            <div 
              className="relative" 
              ref={userMenuRef}
              onMouseEnter={handleUserMenuEnter}
              onMouseLeave={handleUserMenuLeave}
            >
              {isAuthenticated && user ? (
                <div>
                  <button 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold uppercase">{user?.name.charAt(0) || 'U'}</span>
                    )}
                  </button>
                  
                  {/* User dropdown menu */}
                  <div 
                    className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 transition-all duration-200 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    style={{transform: isUserMenuOpen ? 'translateY(0)' : 'translateY(-10px)'}}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      
                      <Link 
                        href="/orders" 
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </Link>
                      
                      <Link 
                        href="/wishlist" 
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Wishlist
                      </Link>
                      
                      <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link 
                    href="/login"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full font-medium transition-colors"
                  >
                    Sign Up
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
          <div className="mt-4 md:hidden">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                autoFocus
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="container mx-auto px-4 py-2">
            {/* Mobile categories */}
            <div className="py-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 font-heading">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <Link 
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
            
            {/* Mobile navigation */}
            <div className="py-2">
              <Link 
                href="/deals" 
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Deals</span>
                <span className="ml-2 bg-[#d44506] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">Hot</span>
              </Link>
              <Link 
                href="/new-arrivals" 
                className="block text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link 
                href="/bestsellers" 
                className="block text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Best Sellers
              </Link>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

            {/* Mobile auth buttons */}
            {!isAuthenticated ? (
              <div className="flex space-x-3 py-4">
                <Link 
                  href="/login"
                  className="flex-1 text-center text-gray-700 dark:text-gray-200 py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="flex-1 text-center bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="py-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200">
                    <span className="text-lg font-semibold uppercase">{user?.name.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link 
                    href="/profile" 
                    className="flex items-center text-gray-700 dark:text-gray-200 py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link 
                    href="/orders" 
                    className="flex items-center text-gray-700 dark:text-gray-200 py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                  
                  <Link 
                    href="/wishlist" 
                    className="flex items-center text-gray-700 dark:text-gray-200 py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Wishlist
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-gray-700 dark:text-gray-200 py-2 hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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