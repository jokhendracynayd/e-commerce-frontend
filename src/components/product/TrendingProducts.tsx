import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define types for product data structure
export type Product = {
  id: string | number;
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  imageSrc: string;
  badge?: string;
  slug?: string;
};

type TrendingProductsProps = {
  products: Product[];
  title?: string;
  viewAllLink?: string;
  className?: string;
};

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  products,
  title = "Trending Products",
  viewAllLink = "/products",
  className = ""
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 px-4 ${className}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <Link href={viewAllLink} className="text-primary hover:text-primary-dark flex items-center text-sm font-medium">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={product.imageSrc} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </div>
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-4">
                  <button className="bg-primary text-white py-2 px-4 mx-auto block rounded-full font-medium text-sm flex items-center justify-center gap-2 w-[80%] hover:bg-primary-dark transition-colors shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 h-12">
                  {product.name}
                </h3>
                <div className="flex items-center mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <button className="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts; 