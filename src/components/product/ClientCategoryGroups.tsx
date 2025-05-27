'use client';

import React, { useEffect, useState } from 'react';
import { CategoryGroups, CategoryGroup } from './CategoryGroups';
import { getCategoryGroups } from '@/services/categoryService';

type ClientCategoryGroupsProps = {
  initialData?: CategoryGroup[];
  className?: string;
};

export const ClientCategoryGroups: React.FC<ClientCategoryGroupsProps> = ({ 
  initialData,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(!initialData);
  const [groups, setGroups] = useState<CategoryGroup[]>(initialData || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have initial data, don't fetch again
    if (initialData) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getCategoryGroups();
        setGroups(data);
        setError(null);
      } catch (err) {
        console.error('Error loading category groups:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  if (isLoading) {
    return (
      <div className={`py-12 px-4 ${className}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-12 px-4 ${className}`}>
        <div className="container mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => getCategoryGroups().then(setGroups).catch(e => setError(String(e)))}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <CategoryGroups groups={groups} className={className} />;
};

export default ClientCategoryGroups; 