'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { ProductDetail } from '@/types/product';
import { getProductDetails, getRelatedProducts } from '@/data/productDetails';
import { ImageGallery } from '@/components/product/detail/ImageGallery';
import { ProductInfo } from '@/components/product/detail/ProductInfo';
import { ProductDetails } from '@/components/product/detail/ProductDetails';
import { RelatedProducts } from '@/components/product/detail/RelatedProducts';
import { PageViewTracker } from '@/components/tracking/PageViewTracker';
import { getCanonicalProductUrl } from '@/utils/url-utils';
import { getProductBySlug } from '@/services/productService';
import { productsApi } from '@/lib/api/products-api';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { UserActivityType } from '@/types/analytics';

// API response mapper - transforms API response to match UI's expected format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapApiResponseToProductDetail = (apiData: any, fallbackData: ProductDetail): ProductDetail => {
  if (!apiData) return fallbackData;
  
  // Extract data from API response
  const { data } = apiData;
  
  // Map API response to existing UI data structure
  return {
    id: data?.id || fallbackData.id,
    slug: data?.slug || fallbackData.slug,
    title: data?.title || fallbackData.title,
    subtitle: data?.shortDescription || fallbackData.subtitle,
    brand: data?.brand?.name || fallbackData.brand,
    description: data?.description || fallbackData.description,
    price: data?.discountPrice ? parseFloat(data.discountPrice) : (data?.price ? parseFloat(data.price) : fallbackData.price),
    originalPrice: data?.discountPrice ? (data?.price ? parseFloat(data.price) : fallbackData.originalPrice) : fallbackData.originalPrice,
    discount: data?.discountPrice && data?.price ? 
      `${Math.round(((parseFloat(data.price) - parseFloat(data.discountPrice)) / parseFloat(data.price)) * 100)}% off` : 
      fallbackData.discount,
    discountPercentage: data?.discountPrice && data?.price ? 
      Math.round(((parseFloat(data.price) - parseFloat(data.discountPrice)) / parseFloat(data.price)) * 100) : 
      fallbackData.discountPercentage,
    rating: data.averageRating || fallbackData.rating,
    reviewCount: data.reviewCount || fallbackData.reviewCount,
    inStock: data.stockQuantity > 0 || fallbackData.inStock,
    stockCount: data.stockQuantity || fallbackData.stockCount,
    isAssured: fallbackData.isAssured, // Keep UI value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    badges: data?.tags?.map((tag: any) => tag.name) || fallbackData.badges,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: data?.images?.map((img: any) => img.imageUrl) || fallbackData.images,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colorVariants: data?.variants?.map((variant: any, index: number) => ({
      id: variant.id,
      color: variant.variantName,
      hex: fallbackData.colorVariants?.[index]?.hex || '#000000',
      image: fallbackData.colorVariants?.[index]?.image || (data.images?.[0]?.imageUrl || ''),
    })) || fallbackData.colorVariants,
    specificationGroups: fallbackData.specificationGroups, // Keep UI value
    highlights: data.highlights || fallbackData.highlights,
    deliveryInfo: fallbackData.deliveryInfo, // Keep UI value
    hasFreeDel: fallbackData.hasFreeDel, // Keep UI value
    replacementDays: fallbackData.replacementDays, // Keep UI value
    warranty: fallbackData.warranty, // Keep UI value
    sellerName: fallbackData.sellerName, // Keep UI value
    sellerRating: fallbackData.sellerRating, // Keep UI value
    exchangeOffer: fallbackData.exchangeOffer, // Keep UI value
    bankOffers: fallbackData.bankOffers, // Keep UI value
    emiOptions: fallbackData.emiOptions, // Keep UI value
    reviews: fallbackData.reviews, // Keep UI value as API has empty reviews
    relatedProducts: fallbackData.relatedProducts, // Keep UI value
    faq: fallbackData.faq, // Keep UI value
    categories: [
      {
        id: data.category?.id || '',
        name: data.category?.name || '',
        slug: data.category?.slug || '',
      },
      // Include subcategory if available
      ...(data.subCategory ? [{
        id: data.subCategory.id,
        name: data.subCategory.name,
        slug: data.subCategory.slug,
      }] : []),
    ],
  };
};

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { trackProductView, trackActivity } = useActivityTracking();
  
  // The slug parameter here could be either:
  // 1. The actual product ID (from /:productName/p/:productId via rewrite)  
  // 2. The product slug (from /product/:slug direct access)
  const slugOrId = params ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([]);
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (slugOrId) {
        setIsLoading(true);
        
        try {
          // Get fallback UI data first to ensure we have something to display
          const fallbackUiData = getProductDetails('fastrack-optimus-pro');
          if (!fallbackUiData) {
            throw new Error('Could not load fallback UI data');
          }
          
          // Get real API data
          let productApiData = null;
          try {
            // Try fetching by ID first (in case of URL rewrites)
            productApiData = await productsApi.getProductById(slugOrId);
            console.log('API Product Data fetched:', productApiData);
                      } catch {
            try {
              // Try by slug if ID fails
              productApiData = await getProductBySlug(slugOrId);
              console.log('API Product Data fetched by slug:', productApiData);
            } catch (slugError) {
              console.log('Could not fetch product data, using fallback:', slugError);
            }
          }
          
          // Map API data to our UI format, using fallback data for missing fields
          const mappedProductData = mapApiResponseToProductDetail(productApiData, fallbackUiData);
          setProduct(mappedProductData);
          
          // Track product view once we have the product data
          if (mappedProductData.id) {
            trackProductView(mappedProductData.id, 'product_page');
            
            // Also track additional metadata for better analytics
            trackActivity(UserActivityType.PRODUCT_VIEW, {
              entityId: mappedProductData.id,
              entityType: 'product',
              metadata: {
                source: 'product_page',
                productSlug: mappedProductData.slug,
                productTitle: mappedProductData.title,
                productBrand: mappedProductData.brand,
                productPrice: mappedProductData.price,
                productCategory: mappedProductData.categories?.[0]?.name || 'uncategorized',
                hasDiscount: !!mappedProductData.originalPrice && mappedProductData.originalPrice > mappedProductData.price,
                inStock: mappedProductData.inStock,
                referrerSource: searchParams?.get('source') || 'direct',
                productRating: mappedProductData.rating,
                productReviews: mappedProductData.reviewCount
              }
            });
          }
          
          // Generate canonical URL for SEO
          const category = mappedProductData.categories?.[0]?.name;
          setCanonicalUrl(getCanonicalProductUrl(mappedProductData.slug, mappedProductData.id, category));
          
          // Get related products
          if (fallbackUiData.relatedProducts && fallbackUiData.relatedProducts.length > 0) {
            const related = getRelatedProducts(fallbackUiData.relatedProducts);
            setRelatedProducts(related);
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProductData();
  }, [slugOrId, searchParams, trackActivity, trackProductView]);
  
  // Show loading state
  if (isLoading) {
    return <ProductPageSkeleton />;
  }
  
  // Show not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="text-center py-12 md:py-16 bg-white dark:bg-gray-800 shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-lg text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Add canonical URL for SEO - prevents duplicate content issues */}
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </Head>
      
      {/* Page View Tracking */}
      <PageViewTracker 
        pageCategory="product"
        metadata={{
          productId: product.id,
          productSlug: product.slug,
          productTitle: product.title,
          productBrand: product.brand,
          productPrice: product.price,
          productCategory: product.categories?.[0]?.name || 'uncategorized',
          inStock: product.inStock,
          hasDiscount: !!product.originalPrice && product.originalPrice > product.price,
          source: searchParams?.get('source') || 'direct'
        }}
      />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-4 md:mb-6 text-xs sm:text-sm overflow-x-auto whitespace-nowrap pb-1 text-gray-500 dark:text-gray-400">
          <ol className="flex items-center">
            <li className="flex items-center">
              <Link href="/" className="hover:text-[#ed875a] dark:hover:text-[#ed8c61] transition-colors">Home</Link>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-1 sm:h-4 sm:w-4 sm:mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            {/* Show category in breadcrumb if available */}
            {(product.categories && product.categories[0]) ? (
              <li className="flex items-center">
                <Link 
                  href={`/${product.categories[0].slug}`} 
                  className="hover:text-[#ed875a] dark:hover:text-[#ed8c61] transition-colors"
                >
                  {product.categories[0].name}
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-1 sm:h-4 sm:w-4 sm:mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
            ) : (
              <li className="flex items-center">
                <Link href="/products/all" className="hover:text-[#ed875a] dark:hover:text-[#ed8c61] transition-colors">
                  Products
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-1 sm:h-4 sm:w-4 sm:mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
            )}
            <li className="text-gray-800 dark:text-white line-clamp-1 max-w-[150px] sm:max-w-[250px] md:max-w-none">{product.title}</li>
          </ol>
        </nav>
        
        {/* Main product section */}
        <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-3 sm:p-4 md:p-6 mb-5 md:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
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
        <div className="mb-5 md:mb-8">
          <ProductDetails product={product} />
        </div>
        
        {/* FAQ section */}
        {product.faq && product.faq.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-3 sm:p-4 md:p-6 mb-5 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              {product.faq.map((item, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 md:pb-4 last:pb-0">
                  <h3 className="text-sm md:text-md font-medium text-gray-800 dark:text-white mb-2">
                    Q: {item.question}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    A: {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Related products section */}
        {relatedProducts.length > 0 && (
          <div className="mb-5 md:mb-8">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
      {/* Breadcrumbs skeleton */}
      <div className="mb-4 md:mb-6 flex items-center space-x-2 overflow-x-hidden">
        <div className="h-2 w-10 md:w-12 bg-gray-200 dark:bg-gray-700 rounded-none animate-pulse"></div>
        <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-none animate-pulse"></div>
        <div className="h-2 w-12 md:w-16 bg-gray-200 dark:bg-gray-700 rounded-none animate-pulse"></div>
        <div className="h-2 w-2 bg-gray-200 dark:bg-gray-700 rounded-none animate-pulse"></div>
        <div className="h-2 w-24 md:w-32 bg-gray-200 dark:bg-gray-700 rounded-none animate-pulse"></div>
      </div>
      
      {/* Main product section skeleton */}
      <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] p-3 sm:p-4 md:p-6 mb-5 md:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left column - Image gallery skeleton */}
          <div>
            <div className="h-[250px] sm:h-[300px] md:h-[400px] bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            <div className="flex gap-2 mt-3 md:mt-4 overflow-x-auto pb-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex-shrink-0 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Right column - Product info skeleton */}
          <div className="space-y-3 md:space-y-4">
            <div className="h-2 w-16 md:w-20 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            <div className="h-5 md:h-6 w-full bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            <div className="h-3 md:h-4 w-1/2 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            <div className="flex gap-2 items-center">
              <div className="h-4 md:h-5 w-10 md:w-12 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-3 md:h-4 w-24 md:w-32 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-6 md:h-8 w-16 md:w-24 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-3 md:h-4 w-12 md:w-16 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-3 md:h-4 w-10 md:w-12 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 md:h-4 w-24 md:w-32 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-2 md:h-3 w-full bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-2 md:h-3 w-full bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            </div>
            <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="h-10 md:h-12 w-full bg-gradient-to-r from-[#ed875a] to-[#ed8c61] opacity-50 rounded-none animate-pulse"></div>
              <div className="h-10 md:h-12 w-full bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product details section skeleton */}
      <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] overflow-hidden mb-5 md:mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-3 md:px-4 py-2 md:py-3 flex-shrink-0">
              <div className="h-3 md:h-4 w-16 md:w-24 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="p-3 sm:p-4 space-y-4 md:space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 md:h-5 w-24 md:w-32 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-2 md:h-3 w-full bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-2 md:h-3 w-full bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
              <div className="h-2 md:h-3 w-3/4 bg-[#f5f1ed] dark:bg-gray-700 rounded-none animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 