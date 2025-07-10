'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { debounce } from 'lodash';
import { productsApi } from '@/lib/api';
import { useAnalyticsContext } from '@/context/AnalyticsContext';
import type { Product } from '@/types/product';

interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  isMobile?: boolean;
}

export function SearchBar({
  onFocus,
  onBlur,
  placeholder = 'Search products...',
  className = '',
  autoFocus = false,
  fullWidth = false,
  isMobile = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const router = useRouter();
  const analytics = useAnalyticsContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks to close the search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Debounced search function to prevent too many API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term || term.trim().length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const results = await productsApi.searchProducts(term, 8);
        setSearchResults(results);
        
        // Track search analytics
        analytics.trackSearch(
          term,
          results.length,
          undefined, // filters - not applicable for basic search
          undefined, // sortBy - not applicable for basic search
          {
            source: 'search_bar',
            autocomplete: true,
            hasResults: results.length > 0,
          }
        );
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        
        // Track failed search
        analytics.trackSearch(
          term,
          0,
          undefined,
          undefined,
          {
            source: 'search_bar',
            autocomplete: true,
            hasResults: false,
            error: 'search_failed',
          }
        );
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );
  
  // Call the debounced search when the search term changes
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      setIsLoading(true);
      setShowResults(true);
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
    
    // Reset the selected result index when search term changes
    setSelectedResultIndex(-1);
  }, [searchTerm, debouncedSearch]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedResultIndex >= 0 && searchResults[selectedResultIndex]) {
      // Navigate to the selected product
      const selectedProduct = searchResults[selectedResultIndex];
      
      // Track product click from search
      analytics.trackProductClick(
        selectedProduct.id,
        'search_autocomplete',
        selectedResultIndex,
        {
          productTitle: selectedProduct.title,
          searchTerm: searchTerm.trim(),
          productPrice: selectedProduct.price,
          categoryName: selectedProduct.category?.name,
        }
      );
      
      router.push(selectedProduct.category ? `/${selectedProduct.category.slug}` : `/product/${selectedProduct.slug}`);
    } else if (searchTerm.trim()) {
      // Track search submission
      analytics.trackSearch(
        searchTerm.trim(),
        searchResults.length,
        undefined,
        undefined,
        {
          source: 'search_bar',
          autocomplete: false,
          submissionType: 'manual',
          hasResults: searchResults.length > 0,
        }
      );
      
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
    
    // Close the search results
    setShowResults(false);
    // Blur the input if on mobile
    if (isMobile) {
      inputRef.current?.blur();
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };
  
  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setShowResults(searchTerm.trim().length > 1);
              onFocus?.();
            }}
            onBlur={() => {
              // Delay hiding results slightly to allow clicking on them
              setTimeout(() => onBlur?.(), 200);
            }}
            autoFocus={autoFocus}
            className={`w-full py-1.5 lg:py-2 px-3 lg:px-4 pr-8 lg:pr-10 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 border border-transparent focus:border-primary dark:focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-light transition-all ${isMobile ? 'py-2 sm:py-3 px-3 sm:px-4 pr-8 sm:pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' : ''}`}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 lg:h-5 lg:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Search results dropdown */}
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-auto"
        >
          {isLoading ? (
            <div className="py-4 px-3 text-center">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="p-2">
                {searchResults.map((product, index) => (
                  <Link
                    key={product.id}
                    href={product.category ? `/${product.category.slug}` : `/product/${product.slug}`}
                    className={`flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors ${
                      index === selectedResultIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => setShowResults(false)}
                  >
                    {product.images && product.images[0] ? (
                      <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0].imageUrl}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
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
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {truncateText(product.title, 40)}
                      </p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs font-medium text-primary dark:text-primary-light">
                          {product.price.toLocaleString('en-US', {
                            style: 'currency',
                            currency: product.currency || 'USD',
                          })}
                        </p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-500 line-through ml-2">
                            {product.discountPrice.toLocaleString('en-US', {
                              style: 'currency',
                              currency: product.currency || 'USD',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href={`/search?q=${encodeURIComponent(searchTerm.trim())}`}
                  className="block text-center py-1.5 text-sm text-primary dark:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  View all results
                </Link>
              </div>
            </div>
          ) : searchTerm.trim().length > 1 ? (
            <div className="py-3 px-3 text-center text-sm text-gray-500">
              No products found for "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 