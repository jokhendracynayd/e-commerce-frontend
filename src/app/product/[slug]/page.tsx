'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductDetail } from '@/types/product';
import { getProductDetails, getRelatedProducts } from '@/data/productDetails';
import { ImageGallery } from '@/components/product/detail/ImageGallery';
import { ProductInfo } from '@/components/product/detail/ProductInfo';
import { ProductDetails } from '@/components/product/detail/ProductDetails';
import { RelatedProducts } from '@/components/product/detail/RelatedProducts';

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([]);
  
  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      const productData = getProductDetails(slug);
      
      if (productData) {
        setProduct(productData);
        
        // Get related products
        if (productData.relatedProducts && productData.relatedProducts.length > 0) {
          const related = getRelatedProducts(productData.relatedProducts);
          setRelatedProducts(related);
        }
      }
      
      setIsLoading(false);
    }
  }, [slug]);
  
  // Show loading state
  if (isLoading) {
    return <ProductPageSkeleton />;
  }
  
  // Show not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center">
          <li className="flex items-center">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="flex items-center">
            <Link href="/products/all" className="hover:text-blue-600 dark:hover:text-blue-400">
              Products
            </Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-800 dark:text-white line-clamp-1">{product.title}</li>
        </ol>
      </nav>
      
      {/* Main product section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Image gallery */}
          <div>
            <ImageGallery images={product.images} title={product.title} />
          </div>
          
          {/* Right column - Product info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
      
      {/* Product details section */}
      <div className="mb-8">
        <ProductDetails product={product} />
      </div>
      
      {/* FAQ section */}
      {product.faq && product.faq.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {product.faq.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                  Q: {item.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Related products section */}
      {relatedProducts.length > 0 && (
        <div className="mb-8">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumbs skeleton */}
      <div className="mb-6 flex items-center space-x-2">
        <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      {/* Main product section skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Image gallery skeleton */}
          <div>
            <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[60px] h-[60px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Right column - Product info skeleton */}
          <div className="space-y-4">
            <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex gap-2 items-center">
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="pt-6 flex gap-4">
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product details section skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 