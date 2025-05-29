import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define types for category data structure
export type Category = {
  id?: string | number;
  name: string;
  image: string;
  slug?: string;
};

export type CategoryGroup = {
  id?: string | number;
  title: string;
  categories: Category[];
  ctaText: string;
  ctaLink?: string;
};

type CategoryGroupsProps = {
  groups: CategoryGroup[];
  className?: string;
};

export const CategoryGroups: React.FC<CategoryGroupsProps> = ({ 
  groups,
  className = ""
}) => {
  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 px-4 ${className}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {groups.map((group, groupIndex) => (
            <div 
              key={group.id || groupIndex} 
              className="bg-white dark:bg-gray-800 p-5 transition-all duration-300 dark:border-gray-700"
            >
              <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-5 dark:border-gray-700 pb-3">{group.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {group.categories.map((category, catIndex) => (
                  <Link 
                    href={category.slug ? `/category/${category.slug}` : '#'}
                    key={category.id || catIndex} 
                    className="group transition-all duration-300"
                  >
                    <div className="bg-[#e7e1dc] dark:bg-gray-700 overflow-hidden aspect-square relative mb-3">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#ed8c61] transition-colors duration-300">{category.name}</p>
                  </Link>
                ))}
              </div>
              <Link
                href={group.ctaLink || `/category/${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center text-[#ed8c61] hover:text-[#d44506] dark:text-[#ed8c61] dark:hover:text-[#ff9d73] text-sm font-medium mt-5 pt-4 dark:border-gray-700 transition-colors duration-300 w-full justify-between"
              >
                <span>{group.ctaText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGroups; 