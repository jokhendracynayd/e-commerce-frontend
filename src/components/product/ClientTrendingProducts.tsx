'use client';

import React, { useEffect, useState } from 'react';
import { TrendingProducts } from './TrendingProducts';
import { Product } from '@/types/product';
import { getTrendingProducts } from '@/services/productService';

type ClientTrendingProductsProps = {
  initialData?: Product[];
  title?: string;
  viewAllLink?: string;
  limit?: number;
  className?: string;
};

export const ClientTrendingProducts: React.FC<ClientTrendingProductsProps> = ({
  initialData,
  title,
  viewAllLink,
  limit = 4,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(!initialData);
  const [products, setProducts] = useState<Product[]>(initialData || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have initial data, don't fetch again
    if (initialData) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getTrendingProducts(limit);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error loading trending products:', err);
        setError('Failed to load trending products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialData, limit]);

  if (isLoading) {
    return (
      <section className={`py-12 px-4 ${className}`}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="flex justify-between mt-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-12 px-4 ${className}`}>
        <div className="container mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => getTrendingProducts(limit).then(setProducts).catch(e => setError(String(e)))}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <TrendingProducts 
      products={products} 
      title={title} 
      viewAllLink={viewAllLink} 
      className={className} 
    />
  );
};

export default ClientTrendingProducts; 