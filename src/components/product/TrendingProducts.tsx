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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-gray-800 overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={product.imageSrc} 
                    alt={product.name}
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#d44506] text-white text-xs font-medium px-3 py-1.5 z-10">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-end opacity-0 group-hover:opacity-100">
                  <button 
                    className="bg-gradient-to-r from-[#ed875a] to-[#ed8c61] text-white py-2.5 px-5 m-4 font-medium text-sm tracking-wide transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 group-hover:text-[#ed875a] transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none opacity-40'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-[#ed875a] transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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