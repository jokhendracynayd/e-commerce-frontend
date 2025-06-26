'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import type { Product, ProductListParams, ApiProductListResponse } from '@/types/product';
import { SearchBar } from './SearchBar';
import { PageViewTracker } from '@/components/tracking/PageViewTracker';
import { useActivityTracking } from '@/hooks/useActivityTracking';

export function ProductSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const { trackSearch, trackFilterUse, trackSortUse } = useActivityTracking();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProductListParams>({
    page: 1,
    limit: 20,
    search: query,
    sortBy: 'popularity',
    sortDirection: 'desc',
  });
  
  // Categories state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, name: string, count: number}>>([]);
  
  // Brands state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<Array<{id: string, name: string, count: number}>>([]);
  
  // Price range state
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 1000 });
  const [currentPriceRange, setCurrentPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 1000 });
  
  // Sort options
  const sortOptions = [
    { label: 'Popularity', value: 'popularity:desc' },
    { label: 'Newest', value: 'newest:desc' },
    { label: 'Price: Low to High', value: 'price:asc' },
    { label: 'Price: High to Low', value: 'price:desc' },
    { label: 'Rating', value: 'rating:desc' },
  ];
  
  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: ApiProductListResponse = await productsApi.getProducts({
        ...filters,
        search: query || filters.search,
        categoryId: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        brandId: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
        minPrice: currentPriceRange.min > 0 ? currentPriceRange.min : undefined,
        maxPrice: currentPriceRange.max < 1000 ? currentPriceRange.max : undefined,
      });
      
      // Handle different API response structures
      let productsData = response.products;
      let totalItems = response.totalCount;
      
      // Check if the response has a data property (nested structure)
      if (response.data && Array.isArray(response.data)) {
        productsData = response.data;
      }
      
      // Check if the response has a different total count property
      if (response.total !== undefined) {
        totalItems = response.total;
      }
      
      console.log('API Response products:', productsData);
      
      setProducts(productsData);
      setTotalCount(totalItems);
      
      // Track search if there's a query and results
      if (query && query.trim()) {
        trackSearch(query, totalItems, {
          categories: selectedCategories,
          brands: selectedBrands,
          priceRange: currentPriceRange,
          sortBy: filters.sortBy,
          page: filters.page
        });
      }
      
      // Update available filters based on response (if the API supports this)
      // This is a mock for now - in a real app, this data would come from the API
      if (productsData.length > 0) {
        // Extract unique categories from products
        const categoriesMap = new Map<string, number>();
        const brandsMap = new Map<string, number>();
        let minPrice = Number.MAX_VALUE;
        let maxPrice = 0;
        
        productsData.forEach((product: Product) => {
          // Categories
          if (product.category) {
            const count = categoriesMap.get(product.category.id) || 0;
            categoriesMap.set(product.category.id, count + 1);
          }
          
          // Brands
          if (product.brand) {
            const count = brandsMap.get(product.brand.id) || 0;
            brandsMap.set(product.brand.id, count + 1);
          }
          
          // Price range
          if (product.price < minPrice) minPrice = product.price;
          if (product.price > maxPrice) maxPrice = product.price;
        });
        
        // Convert maps to arrays
        const categories = Array.from(categoriesMap).map(([id, count]) => {
          const product = productsData.find((p: Product) => p.category && p.category.id === id);
          return {
            id,
            name: product?.category?.name || 'Unknown',
            count: count as number,
          };
        });
        
        const brands = Array.from(brandsMap).map(([id, count]) => {
          const product = productsData.find((p: Product) => p.brand && p.brand.id === id);
          return {
            id,
            name: product?.brand?.name || 'Unknown',
            count: count as number,
          };
        });
        
        setAvailableCategories(categories);
        setAvailableBrands(brands);
        setPriceRange({ min: minPrice, max: maxPrice });
        
        // Initialize current price range if not set
        if (currentPriceRange.min === 0 && currentPriceRange.max === 1000) {
          setCurrentPriceRange({ min: minPrice, max: maxPrice });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, query, selectedCategories, selectedBrands, currentPriceRange]);
  
  // Fetch products when filters or query changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Update filters when search params change
  useEffect(() => {
    if (query) {
      setFilters(prev => ({ ...prev, search: query }));
    }
  }, [query]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle sort change
  const handleSortChange = (sortString: string) => {
    const [sortBy, sortDirection] = sortString.split(':');
    
    // Track sort usage
    trackSortUse(sortBy, sortDirection as 'asc' | 'desc');
    
    setFilters(prev => ({ 
      ...prev, 
      sortBy: sortBy as 'price' | 'popularity' | 'rating' | 'newest',
      sortDirection: sortDirection as 'asc' | 'desc',
      page: 1
    }));
    setCurrentPage(1);
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      // Track filter usage
      const categoryName = availableCategories.find(cat => cat.id === categoryId)?.name || categoryId;
      trackFilterUse('category', categoryName, totalCount);
      
      return newCategories;
    });
    setFilters(prev => ({ ...prev, page: 1 }));
    setCurrentPage(1);
  };
  
  // Handle brand selection
  const handleBrandChange = (brandId: string) => {
    setSelectedBrands(prev => {
      const newBrands = prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId];
      
      // Track filter usage
      const brandName = availableBrands.find(brand => brand.id === brandId)?.name || brandId;
      trackFilterUse('brand', brandName, totalCount);
      
      return newBrands;
    });
    setFilters(prev => ({ ...prev, page: 1 }));
    setCurrentPage(1);
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setCurrentPriceRange({ min, max });
    setFilters(prev => ({ ...prev, page: 1 }));
    setCurrentPage(1);
  };
  
  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  // Format currency
  const formatCurrency = (price: number, currency: string = 'USD') => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page View Tracking */}
      <PageViewTracker 
        pageCategory="search"
        metadata={{
          searchQuery: query,
          resultsCount: totalCount,
          currentPage,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection,
          selectedCategories,
          selectedBrands,
          priceRange: currentPriceRange,
          hasResults: products.length > 0
        }}
      />
      
      {/* Search bar */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {query ? `Search results for "${query}"` : 'All Products'}
        </h1>
        <div className="max-w-2xl">
          <SearchBar 
            placeholder="Search again..." 
            autoFocus={false}
            fullWidth
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - shown on larger screens */}
        <div className="hidden lg:block w-64 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Categories</h3>
            {availableCategories.length > 0 ? (
              <div className="space-y-1">
                {availableCategories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category.name} ({category.count})
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Brands</h3>
            {availableBrands.length > 0 ? (
              <div className="space-y-1">
                {availableBrands.map(brand => (
                  <div key={brand.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {brand.name} ({brand.count})
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No brands available</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Price Range</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formatCurrency(currentPriceRange.min)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatCurrency(currentPriceRange.max)}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={currentPriceRange.min}
                  onChange={(e) => setCurrentPriceRange({ ...currentPriceRange, min: Number(e.target.value) })}
                  className="w-full"
                />
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={currentPriceRange.max}
                  onChange={(e) => setCurrentPriceRange({ ...currentPriceRange, max: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <button
                onClick={() => handlePriceRangeChange(currentPriceRange.min, currentPriceRange.max)}
                className="w-full py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm rounded transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Sort options and result count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <p className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `Showing ${products.length} of ${totalCount} results`}
            </p>
            
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                id="sort"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md focus:ring-primary focus:border-primary p-2"
                value={`${filters.sortBy}:${filters.sortDirection}`}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Products grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  href={product.category ? `/${product.category.slug}` : `/product/${product.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].imageUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {product.discountPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    {/* Brand */}
                    {product.brand && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {product.brand.name}
                      </p>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(product.averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-end gap-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatCurrency(product.discountPrice, product.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setCurrentPriceRange({ min: priceRange.min, max: priceRange.max });
                  setFilters({
                    page: 1,
                    limit: 20,
                    search: query,
                    sortBy: 'popularity',
                    sortDirection: 'desc',
                  });
                }}
                className="py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {totalCount > filters.limit! && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, Math.ceil(totalCount / filters.limit!)) }, (_, i) => {
                  // Logic to display page numbers around current page
                  let pageNum;
                  const totalPages = Math.ceil(totalCount / filters.limit!);
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(totalCount / filters.limit!)}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    currentPage === Math.ceil(totalCount / filters.limit!)
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 