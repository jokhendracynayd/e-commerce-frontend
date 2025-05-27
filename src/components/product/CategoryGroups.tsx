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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group, groupIndex) => (
            <div key={group.id || groupIndex} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{group.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {group.categories.map((category, catIndex) => (
                  <div key={category.id || catIndex} className="group">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square relative mb-2">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{category.name}</p>
                  </div>
                ))}
              </div>
              <Link 
                href={group.ctaLink || `/category/${group.title.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-blue-600 dark:text-blue-400 text-sm font-medium inline-block mt-4 hover:underline"
              >
                {group.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGroups; 