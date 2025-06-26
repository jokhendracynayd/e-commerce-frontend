'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import FilterSidebar, { FilterState } from '@/components/product/filters/FilterSidebar';
import { ProductListingCard } from '@/components/product/ProductListingCard';
import { getListingProducts } from '@/services/productlist-data';
import { useCategories } from '@/context/CategoryContext';
import { CategoryNode } from '@/types/categories';
import { CategoryBreadcrumb } from '@/components/product/CategoryBreadcrumb';
import { PageViewTracker } from '@/components/tracking/PageViewTracker';
import { useActivityTracking } from '@/hooks/useActivityTracking';

type SortOption = {
  id: string;
  name: string;
};

type ViewMode = 'grid' | 'list';

const sortOptions: SortOption[] = [
  { id: 'popularity', name: 'Popularity' },
  { id: 'price_low_to_high', name: 'Price -- Low to High' },
  { id: 'price_high_to_low', name: 'Price -- High to Low' },
  { id: 'newest_first', name: 'Newest First' },
  { id: 'rating', name: 'Rating' }
];

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = typeof params.category === 'string' ? params.category : '';
  const { trackCategoryView, trackFilterUse, trackSortUse } = useActivityTracking();
  
  // Get categories from context
  const { categoryTree, flatCategories, isLoading: categoriesLoading } = useCategories();
  
  // Current category and child categories
  const [currentCategory, setCurrentCategory] = useState<CategoryNode | null>(null);
  const [childCategories, setChildCategories] = useState<CategoryNode[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<CategoryNode[]>([]);
  
  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    ratings: [],
    brands: [],
    availability: [],
    discount: []
  });
  
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  
  // Find current category and its children when categories load
  useEffect(() => {
    if (!categoriesLoading && flatCategories.length > 0 && categorySlug) {
      // Find the current category
      const category = flatCategories.find(cat => cat.slug === categorySlug);
      
      if (category) {
        setCurrentCategory(category);
        
        // Track category view
        trackCategoryView(category.id, category.name);
        
        // Find children of this category
        const children = flatCategories.filter(cat => cat.parentId === category.id);
        setChildCategories(children);
        
        // Build breadcrumb path
        const buildBreadcrumbPath = (categoryId: string, path: CategoryNode[] = []): CategoryNode[] => {
          const category = flatCategories.find(cat => cat.id === categoryId);
          if (!category) return path;
          
          const newPath = [category, ...path];
          if (category.parentId) {
            return buildBreadcrumbPath(category.parentId, newPath);
          }
          return newPath;
        };
        
        const path = category.parentId 
          ? buildBreadcrumbPath(category.parentId, [category])
          : [category];
          
        setBreadcrumbPath(path);
        
        // Fetch products for this category
        fetchCategoryProducts(category.id);
      }
    }
  }, [categoriesLoading, flatCategories, categorySlug]);
  
  // Fetch products by category
  const fetchCategoryProducts = async (categoryId: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would call your API with categoryId
      // const response = await productsApi.getProductsByCategory(categoryId);
      // setProducts(response);
      
      // For now, use the dummy data
      const dummyProducts = getListingProducts();
      setProducts(dummyProducts);
      
      // Wait a bit to simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
      setProducts([]);
    }
  };
  
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
    
    // Filter by brands
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
  }, [filters, sortBy, products]); // Only re-run when filters, sortBy or products change

  const handleFilterChange = (newFilters: FilterState) => {
    // Track filter usage
    Object.entries(newFilters).forEach(([filterType, filterValue]) => {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        trackFilterUse(filterType, filterValue.join(','), filteredProducts.length);
      } else if (Array.isArray(filterValue) && filterType === 'priceRange') {
        const [min, max] = filterValue as number[];
        if (min !== 0 || max !== 50000) {
          trackFilterUse('price', `${min}-${max}`, filteredProducts.length);
        }
      }
    });
    
    setFilters(newFilters);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };
  
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
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>
    );
  };

  // Breadcrumb component
  const Breadcrumbs = () => {
    if (!currentCategory) return null;
    
    return (
      <CategoryBreadcrumb 
        breadcrumbPath={breadcrumbPath} 
        className="text-xs flex-wrap"
      />
    );
  };

  // Child categories component - shows any subcategories
  const ChildCategories = () => {
    if (childCategories.length === 0) return null;
    
    return (
      <>
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Browse Subcategories</h2>
        <div className="flex flex-wrap gap-1.5">
          {childCategories.map(category => (
            <a 
              key={category.id} 
              href={`/products/${category.slug}`}
              className="inline-flex items-center px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>
      </>
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
    <div className="container mx-auto px-4 py-8">
      {/* Page View Tracking */}
      {currentCategory && (
        <PageViewTracker 
          pageCategory="category"
          metadata={{
            categoryId: currentCategory.id,
            categoryName: currentCategory.name,
            categorySlug: categorySlug,
            parentCategoryId: currentCategory.parentId,
            productsCount: products.length,
            filteredProductsCount: filteredProducts.length,
            currentPage,
            sortBy,
            activeFilters: Object.entries(filters).filter(([_, value]) => 
              Array.isArray(value) ? value.length > 0 : false
            ).map(([key, _]) => key),
            viewMode
          }}
        />
      )}
      
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Filter sidebar and category navigation */}
        <aside className={`
          md:block md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden
          ${isMobileFilterOpen ? 'fixed inset-0 z-40 p-4 overflow-y-auto bg-white dark:bg-gray-900' : 'hidden md:block'}
        `}>
          {/* Mobile filter header */}
          {isMobileFilterOpen && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filters</h2>
              <button
                onClick={toggleMobileFilter}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Breadcrumb navigation - moved to filter sidebar */}
          <div className="mb-4 px-2">
            <Breadcrumbs />
          </div>
          
          {/* Category title - moved to filter sidebar */}
          <div className="mb-4 px-2">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {currentCategory?.name || 'Products'}
            </h1>
          </div>
          
          {/* Subcategories - moved to filter sidebar */}
          <div className="mb-4 px-2">
            <ChildCategories />
          </div>
          
          {/* Category description - moved to filter sidebar */}
          {currentCategory?.description && (
            <div className="mb-4 px-2 text-xs text-gray-600 dark:text-gray-400">
              {currentCategory.description}
            </div>
          )}
          
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <FilterSidebar 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
              categoryName={currentCategory?.name || ''}
              totalProducts={products.length}
            />
          </div>
        </aside>
        
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4 w-full flex justify-between items-center">
          <div className="px-1">
            <Breadcrumbs />
          </div>
          <button
            onClick={toggleMobileFilter}
            className="flex items-center space-x-1 py-1.5 px-3 ml-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-700 dark:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>
        </div>
        
        {/* Product grid */}
        <div className="flex-1 mt-0">
          {/* Sort and view controls */}
          <div className="mb-6 flex flex-col gap-4">
            {/* Sort options as horizontal tabs */}
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-3 whitespace-nowrap">Sort By</div>
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    trackSortUse(option.id, option.name === 'Price -- Low to High' ? 'asc' : 
                                           option.name === 'Price -- High to Low' ? 'desc' : undefined);
                  }}
                  className={`text-sm font-medium whitespace-nowrap px-3 py-2 border-b-2 -mb-px transition-colors duration-200 ${
                    sortBy === option.id
                      ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'text-gray-700 border-transparent dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
            
            {/* View mode controls */}
            <div className="flex items-center justify-end">
              <div className="flex items-center bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center w-8 h-8 rounded ${
                    viewMode === 'grid' 
                      ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center w-8 h-8 rounded ${
                    viewMode === 'list' 
                      ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <ProductsSkeleton />
          ) : (
            <>
              {currentProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No products found</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                    We couldn't find any products matching your filters. Try adjusting your filters or browse other categories.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
                    : 'flex flex-col space-y-4'
                }>
                  {currentProducts.map((product, index) => (
                    <ProductListingCard 
                      key={product.id || index}
                      id={product.id || `product-${index}`}
                      title={product.title}
                      image={product.image}
                      price={product.price}
                      discount={product.discount}
                      originalPrice={product.originalPrice}
                      link={product.link || `/product/${product.id || index}`}
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
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <PaginationControls />
            </>
          )}
        </div>
      </div>
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