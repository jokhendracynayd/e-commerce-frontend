'use client';

import Link from 'next/link';
import { CategoryNode } from '@/types/categories';

interface CategoryBreadcrumbProps {
  breadcrumbPath: CategoryNode[];
  className?: string;
}

export function CategoryBreadcrumb({ breadcrumbPath, className = '' }: CategoryBreadcrumbProps) {
  if (!breadcrumbPath.length) return null;
  
  // Build paths for each breadcrumb item
  const getBreadcrumbPaths = (path: CategoryNode[]): string[] => {
    const result: string[] = [];
    let currentPath = '';
    
    // For each category in the path, build its full URL
    for (let i = 0; i < path.length; i++) {
      currentPath = currentPath 
        ? `${currentPath}/${path[i].slug}` 
        : path[i].slug;
      result.push(`/${currentPath}`);
    }
    
    return result;
  };
  
  const breadcrumbPaths = getBreadcrumbPaths(breadcrumbPath);
  
  return (
    <nav className={`flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      <Link 
        href="/"
        className="hover:text-primary dark:hover:text-primary-light transition-colors"
      >
        Home
      </Link>
      <span className="mx-2">/</span>
      
      {breadcrumbPath.map((category, index) => (
        <div key={category.id} className="flex items-center">
          {index < breadcrumbPath.length - 1 ? (
            <>
              <Link
                href={breadcrumbPaths[index]}
                className="hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : (
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {category.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
} 