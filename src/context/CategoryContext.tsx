'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { categoriesApi } from '@/lib/api/categories-api';
import { CategoryNode } from '@/types/categories';

interface CategoryContextType {
  categoryTree: CategoryNode[];
  flatCategories: CategoryNode[];
  isLoading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextType>({
  categoryTree: [],
  flatCategories: [],
  isLoading: false,
  error: null
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [flatCategories, setFlatCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoriesApi.getCategoryTree();
        setCategoryTree(data);
        
        // Create flat list for easier lookup
        const flattened = flattenCategories(data);
        setFlatCategories(flattened);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Helper function to flatten nested categories
  const flattenCategories = (categories: CategoryNode[]): CategoryNode[] => {
    return categories.reduce((acc, category) => {
      const { children, ...categoryWithoutChildren } = category;
      return [
        ...acc, 
        categoryWithoutChildren,
        ...(children ? flattenCategories(children) : [])
      ];
    }, [] as CategoryNode[]);
  };

  return (
    <CategoryContext.Provider value={{ categoryTree, flatCategories, isLoading, error }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext); 