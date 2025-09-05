'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import FilterSidebar, { FilterState } from '@/components/product/filters/FilterSidebar';
import { ProductListingCard } from '@/components/product/ProductListingCard';
import { getListingProducts } from '@/services/productlist-data';
import { useCategories } from '@/context/CategoryContext';
import { CategoryNode } from '@/types/categories';
import { CategoryBreadcrumb } from '@/components/product/CategoryBreadcrumb';
import { getProductsByCategorySlug } from '@/services/productService';
import { debounce } from 'lodash';
import Link from 'next/link';

// Define API response interfaces
interface ApiProductVariant {
  id: string;
  variantName: string;
  sku: string;
  price: string;
  stockQuantity: number;
  additionalPrice: string;
}

interface ApiProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  position: number;
}

interface ApiProductDeal {
  id: string;
  dealType: string;
  discount: string;
  startTime: string;
  endTime: string;
}

interface ApiProductTag {
  id: string;
  name: string;
}

interface ApiBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: string;
  discountPrice?: string;
  currency: string;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  visibility: string;
  averageRating: number;
  reviewCount: number;
  brand?: ApiBrand;
  category?: ApiCategory;
  subCategory?: ApiCategory;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
  tags: ApiProductTag[];
  deals: ApiProductDeal[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: ApiProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
  path: string;
}

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
  const slugArray = Array.isArray(params.slug) ? params.slug : [];
  const categorySlug = slugArray.length > 0 ? slugArray[slugArray.length - 1] : '';
  console.log(categorySlug,"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",slugArray)
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
    priceRange: [0, 500000000],
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
      
      // Extract the category slug
      const category = flatCategories.find(cat => cat.id === categoryId);
      if (!category) {
        setIsLoading(false);
        setProducts([]);
        return;
      }
      
      // Filter options for API call
      const params = {
        page: currentPage,
        limit: productsPerPage,
        sortBy: sortBy === 'popularity' ? 'averageRating' : sortBy,
        sortOrder: sortBy === 'price_low_to_high' ? 'asc' : 'desc',
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        inStock: filters.availability.includes('instock'),
        isFeatured: filters.brands.length > 0 ? undefined : undefined
      };
      
      // Get dummy products as fallback/template
      const dummyProducts = getListingProducts();
      
      try {
        // Make the real API call
        const response = await getProductsByCategorySlug(
          category.slug,
          true, // recursive
          params
        ) as ApiResponse;
        
        
        // If we have API data, transform it to match our UI format
        if (response && response.data && response.data.data && response.data.data.length > 0) {
          const apiProducts = response.data.data;
          const mappedProducts = apiProducts.map((apiProduct: ApiProduct) => {
            // Try to find a matching dummy product to use as a template
            const dummyProduct = dummyProducts[0]; // Use first one as template
            
            // Map API response to ProductListingCard format
            return {
              id: apiProduct.id,
              title: apiProduct.title,
              image: apiProduct.images && apiProduct.images.length > 0 
                ? apiProduct.images[0].imageUrl 
                : dummyProduct.image,
              price: apiProduct.discountPrice 
                ? parseFloat(apiProduct.discountPrice) 
                : parseFloat(apiProduct.price),
              originalPrice: apiProduct.discountPrice 
                ? parseFloat(apiProduct.price) 
                : undefined,
              link: `/${apiProduct.slug}/p/${apiProduct.id}`,
              isAssured: dummyProduct.isAssured, // Keep from dummy data
              rating: apiProduct.averageRating || dummyProduct.rating,
              reviewCount: apiProduct.reviewCount || dummyProduct.reviewCount,
              badge: apiProduct.deals && apiProduct.deals.length > 0 
                ? apiProduct.deals[0].dealType === 'DEAL_OF_DAY' 
                  ? 'Deal of the Day' 
                  : apiProduct.deals[0].dealType 
                : dummyProduct.badge,
              deliveryInfo: dummyProduct.deliveryInfo, // Keep from dummy data
              hasFreeDel: dummyProduct.hasFreeDel, // Keep from dummy data
              subtitle: apiProduct.shortDescription || dummyProduct.subtitle,
              discount: apiProduct.discountPrice 
                ? `${Math.round(((parseFloat(apiProduct.price) - parseFloat(apiProduct.discountPrice)) / parseFloat(apiProduct.price)) * 100)}% off` 
                : dummyProduct.discount,
              exchangeOffer: dummyProduct.exchangeOffer, // Keep from dummy data
              colorVariants: apiProduct.variants 
                ? apiProduct.variants.map((variant: ApiProductVariant, index: number) => ({
                    id: variant.id,
                    color: variant.variantName,
                    hex: dummyProduct.colorVariants && dummyProduct.colorVariants[index] 
                      ? dummyProduct.colorVariants[index].hex 
                      : '#000000',
                    image: dummyProduct.colorVariants && dummyProduct.colorVariants[index] 
                      ? dummyProduct.colorVariants[index].image 
                      : apiProduct.images && apiProduct.images.length > 0 
                        ? apiProduct.images[0].imageUrl 
                        : dummyProduct.image
                  }))
                : dummyProduct.colorVariants,
              sponsoredTag: dummyProduct.sponsoredTag, // Keep from dummy data
              currency: apiProduct.currency || dummyProduct.currency || 'INR'
            };
          });
          
          // Update the product state with API data
          setProducts(mappedProducts);
          console.log('Using API data for products:', mappedProducts.length);
          
          // Update pagination metadata if available from API
          // This could be used to show total counts and enable server-side pagination
          if (response.data) {
            const { total, totalPages } = response.data;
            console.log(`Total products from API: ${total}, Total pages: ${totalPages}`);
            // We could set server pagination state here if needed
            // but for now we'll continue using client-side pagination
          }
        } else {
          // Fallback to dummy data if no API results
          // setProducts(dummyProducts);
          console.log('Falling back to dummy data - no API results');
        }
      } catch (apiError) {
        console.error('API call error:', apiError);
        // Fallback to dummy data on error
        // setProducts(dummyProducts);
        console.log('Falling back to dummy data due to API error');
      }
      
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
    
    // Note: We're using client-side filtering here to maintain compatibility with both
    // API data and dummy data. In a production environment, you would typically
    // send these filters directly to the API and handle filtering server-side.
    // The current implementation allows for a graceful fallback to dummy data
    // while still letting users filter and sort the products they see.
    
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
  
  // Child categories component - shows any subcategories
  const ChildCategories = () => {
    if (childCategories.length === 0) return null;
    
    return (
      <>
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Browse Subcategories</h2>
        <div className="flex flex-wrap gap-1.5">
          {childCategories.map(category => (
            <Link 
              key={category.id}
              href={buildCategoryPath(category, flatCategories)}
              className="inline-flex items-center px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {category.name}
            </Link>
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
      {/* Mobile filter backdrop overlay */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm touch-none cursor-pointer"
          onClick={toggleMobileFilter}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Filter sidebar and category navigation */}
        <aside className={`
          md:block md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-transform duration-300 ease-in-out
          ${isMobileFilterOpen 
            ? 'fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-xs overflow-y-auto bg-white dark:bg-gray-900 translate-x-0 shadow-xl' 
            : 'hidden md:block md:transform-none md:shadow-none'
          }
        `}>
          {/* Mobile filter header - fixed at top */}
          {isMobileFilterOpen && (
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 mb-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filters</h2>
              <button
                onClick={toggleMobileFilter}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Filter content with proper padding on mobile */}
          <div className={isMobileFilterOpen ? 'px-4' : ''}>
            {/* Breadcrumb navigation */}
            <div className="mb-4 px-2">
              <Breadcrumbs />
            </div>
            
            {/* Category title */}
            <div className="mb-4 px-2">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentCategory?.name || 'Products'}
              </h1>
            </div>
            
            {/* Subcategories */}
            <div className="mb-4 px-2">
              <ChildCategories />
            </div>
            
            {/* Category description */}
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
            
            {/* Mobile Apply and Reset buttons */}
            {/* {isMobileFilterOpen && (
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 mt-4 flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Reset
                </button>
                <button
                  onClick={toggleMobileFilter}
                  className="flex-1 py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md font-medium"
                >
                  Apply Filters
                </button>
              </div>
            )} */}
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
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-3 whitespace-nowrap">Sort By</div>
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
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
            <div className="hidden md:flex items-center justify-end">
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