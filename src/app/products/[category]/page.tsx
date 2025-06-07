'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import FilterSidebar, { FilterState } from '@/components/product/filters/FilterSidebar';

// Import the new ProductListingCard component
import { ProductListingCard } from '@/components/product/ProductListingCard';
import { getListingProducts } from '@/components/product/productlist-data';

type SortOption = {
  id: string;
  name: string;
};

type ViewMode = 'grid' | 'list';

const sortOptions: SortOption[] = [
  { id: 'popularity', name: 'Popularity' },
  { id: 'price_low_to_high', name: 'Price: Low to High' },
  { id: 'price_high_to_low', name: 'Price: High to Low' },
  { id: 'newest_first', name: 'Newest First' },
  { id: 'rating', name: 'Rating' }
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = typeof params.category === 'string' ? params.category : '';
  
  // Use listing data for the product listing page - memoize to prevent infinite loops
  const products = useMemo(() => getListingProducts(), []);
  
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    ratings: [],
    brands: [],
    availability: [],
    discount: []
  });
  
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Set viewMode based on screen width - default to list for mobile
  useEffect(() => {
    // Handle initial viewMode setting based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      } else {
        setViewMode('grid');
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // Calculate the current products to display based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Initialize filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when products change
  }, [products]);

  // Apply filters and sorting when filters or sort option changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay for demonstration purposes
    const timer = setTimeout(() => {
      let result = [...products];
      
      // Filter by price
      result = result.filter(product => {
        const price = product.price || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
      
      // Filter by ratings
      if (filters.ratings.length > 0) {
        result = result.filter(product => {
          return product.rating && filters.ratings.some(rating => product.rating! >= rating);
        });
      }
      
      // Filter by brands (dummy implementation since we don't have brands in our data)
      if (filters.brands.length > 0) {
        // In a real app, you would filter by actual brand property
        // result = result.filter(product => filters.brands.includes(product.brand));
      }
      
      // Filter by availability
      if (filters.availability.includes('instock')) {
        // In a real app, you would check stock status
        // result = result.filter(product => product.inStock);
      }
      
      // Filter by discount
      if (filters.discount.length > 0) {
        result = result.filter(product => {
          if (!product.price || !product.originalPrice) return false;
          
          const discountPercentage = ((product.originalPrice - product.price) / product.originalPrice) * 100;
          return filters.discount.some(d => discountPercentage >= parseInt(d));
        });
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'price_low_to_high':
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_high_to_low':
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest_first':
          // For demo purposes, we're not sorting by date as we don't have this property
          break;
        case 'popularity':
        default:
          // For demo purposes, we're using rating as a proxy for popularity
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
      
      setFilteredProducts(result);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, sortBy, products]); // Only re-run when filters, sortBy or products change

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };
  
  // Format category name for display
  const categoryName = categoryId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Handle pagination
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Pagination controls
  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex flex-col justify-center items-center mt-10 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-2">
          <nav className="flex items-center space-x-1">
            {/* Previous button */}
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md transition-all duration-300 ${
                currentPage === 1 
                  ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-[#ed875a]/10 dark:hover:bg-[#ed8c61]/20 hover:text-[#ed875a] dark:hover:text-[#ed8c61]'
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              
              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`min-w-[2.5rem] h-10 px-3 py-2 rounded-md transition-all duration-300 font-medium ${
                      currentPage === pageNumber
                        ? 'bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white shadow-md transform scale-105'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#ed875a] dark:hover:text-[#ed8c61]'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              
              // Add ellipsis (but only once)
              if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={pageNumber} className="px-3 py-2 text-gray-500 dark:text-gray-400">
                    •••
                  </span>
                );
              }
              
              return null;
            })}
            
            {/* Next button */}
            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md transition-all duration-300 ${
                currentPage === totalPages 
                  ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-[#ed875a]/10 dark:hover:bg-[#ed8c61]/20 hover:text-[#ed875a] dark:hover:text-[#ed8c61]'
              }`}
            >
              <span className="sr-only">Next</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
        
        {/* Page indicator */}
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Page <span className="font-medium text-[#ed875a] dark:text-[#ed8c61]">{currentPage}</span> of {totalPages}
        </div>
      </div>
    );
  };
  
  // Loading skeleton for products
  const ProductsSkeleton = () => (
    <div className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
        : 'space-y-4'
    }`}>
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 ${
            viewMode === 'list' ? 'flex items-center space-x-4' : ''
          }`}
        >
          <div className={`${
            viewMode === 'list' ? 'w-32 h-32' : 'h-52 w-full mb-4'
          } bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md`}></div>
          <div className={`${viewMode === 'list' ? 'flex-1' : ''} space-y-2`}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="container mx-auto mt-2 px-2 sm:px-4">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={toggleMobileFilter}
          className="flex items-center justify-center w-full py-3.5 bg-white dark:bg-gray-800 border border-[#ed875a]/10 dark:border-[#ed8c61]/20 rounded-lg shadow-none hover:border-[#ed875a]/30 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#ed875a] dark:text-[#ed8c61]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-gray-800 dark:text-white">Filters & Sort</span>
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-2">
        
        {/* Filters sidebar - hidden on mobile unless toggled */}
        <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:w-1/5 max-w-[280px] z-40 fixed lg:static top-0 left-0 w-full h-full lg:h-auto bg-white dark:bg-gray-900 lg:bg-transparent overflow-auto pb-20 lg:pb-0`}>
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-[#ed875a]/10 dark:border-[#ed8c61]/10">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Filters & Sort</h3>
            <button 
              onClick={toggleMobileFilter} 
              className="p-2 rounded-full text-[#ed875a] dark:text-[#ed8c61] bg-[#ed875a]/5 dark:bg-[#ed8c61]/10 hover:bg-[#ed875a]/10 dark:hover:bg-[#ed8c61]/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sort options and view toggle */}
          <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(237,135,90,0.05)] border border-[#f5f1ed] dark:border-[#d44506]/10 p-4 md:p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center">
                <h2 className="font-medium dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#ed875a] dark:text-[#ed8c61]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                  <span className="text-gray-800 dark:text-gray-100">{filteredProducts.length} Results</span>
                </h2>
                {isLoading && (
                  <div className="ml-3 flex items-center bg-[#f5f1ed] dark:bg-[#d44506]/10 py-1 px-2 rounded-sm">
                    <svg className="animate-spin h-4 w-4 text-[#ed875a] dark:text-[#ed8c61] mr-1" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-[#ed875a] dark:text-[#ed8c61]">Updating...</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                {/* View toggle */}
                <div className="hidden sm:flex items-center bg-[#f5f1ed] dark:bg-[#d44506]/10 border border-[#ed875a]/20 dark:border-[#ed8c61]/20 overflow-hidden shadow-sm p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center justify-center w-8 h-8 transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-[#ed875a] dark:bg-[#ed8c61] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-[#ed875a]/10 dark:hover:bg-[#ed8c61]/20'
                    }`}
                    aria-label="Grid view"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center justify-center w-8 h-8 transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-[#ed875a] dark:bg-[#ed8c61] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-[#ed875a]/10 dark:hover:bg-[#ed8c61]/20'
                    }`}
                    aria-label="List view"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                {/* Sort dropdown */}
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2 whitespace-nowrap hidden xs:inline-block">Sort By:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-[#f5f1ed] dark:bg-[#d44506]/10 border border-[#ed875a]/20 dark:border-[#ed8c61]/20 py-2 pl-3 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#ed875a] dark:focus:border-[#ed8c61] shadow-sm hover:border-[#ed875a] dark:hover:border-[#ed8c61] transition-colors w-40"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#ed875a] dark:text-[#ed8c61]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FilterSidebar 
            onFilterChange={handleFilterChange}
            initialFilters={filters}
            categoryName={categoryName}
            totalProducts={products.length}
          />
        </div>
        
        {/* Product listing section */}
        <div className="lg:flex-1 lg:ml-4">
          {/* Products display */}
          {isLoading ? (
            <ProductsSkeleton />
          ) : filteredProducts.length > 0 ? (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
                : 'space-y-2 sm:space-y-4 flex flex-col'
              }>
                {currentProducts.map((product) => (
                  <div key={product.id} className={`${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-800 rounded-lg shadow-none p-2 border border-gray-100 dark:border-gray-700' 
                      : 'bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 h-full'
                  }`}>
                    {/* Product Card */}
                    <ProductListingCard 
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
                      subtitle={product.subtitle}
                      colorVariants={product.colorVariants}
                      exchangeOffer={product.exchangeOffer}
                      sponsoredTag={product.sponsoredTag}
                      viewMode={viewMode}
                      isMobileFilterOpen={isMobileFilterOpen}
                    />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <PaginationControls />
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">No Products Found</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Try adjusting your filters or search terms
              </p>
              <button 
                onClick={clearAllFilters}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal overlay when filter sidebar is open on mobile */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={toggleMobileFilter}
        ></div>
      )}
    </div>
  );
  
  function clearAllFilters() {
    setFilters({
      priceRange: [0, 50000],
      ratings: [],
      brands: [],
      availability: [],
      discount: []
    });
    setSortBy('popularity');
  }
} 