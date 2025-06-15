'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product as ApiProduct } from '@/types/product';
import { generateMeeshoStyleUrl } from '@/utils/url-utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import WishlistButton from './WishlistButton';

// Extended Product type for frontend display
type TrendingProduct = ApiProduct & {
  badge?: string;
  imageSrc?: string; // Optional override for the main product image
};

type TrendingCardProps = {
  product: TrendingProduct;
  priority?: boolean;
  className?: string;
};

const TrendingCard: React.FC<TrendingCardProps> = ({
  product,
  priority = false,
  className = "",
}) => {
  const {
    id,
    title,
    slug,
    price,
    currency,
    discountPrice,
    averageRating,
    reviewCount,
    images,
    badge
  } = product;

  const { addToCart, isLoading } = useCart();

  // Use the provided imageSrc or fall back to the first product image
  const imageSrc = product.imageSrc || (images && images.length > 0 ? images[0].imageUrl : '/placeholder-product.jpg');
  
  // Generate SEO-friendly URL using our URL utility function
  const productUrl = generateMeeshoStyleUrl(slug, id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling

    try {
      // Convert the ApiProduct to ProductDetail for cart context
      const productDetail = {
        id,
        title,
        slug,
        price: discountPrice || price,
        originalPrice: price,
        brand: product.brand?.name || '',
        description: product.description || '',
        rating: averageRating,
        reviewCount,
        inStock: (product.stockQuantity || 0) > 0,
        stockCount: product.stockQuantity || 0,
        isAssured: false,
        images: images ? images.map(img => img.imageUrl) : [imageSrc],
        specificationGroups: [],
        highlights: product.highlights || [],
        hasFreeDel: false,
        sellerName: '',
        reviews: []
      };

      // Add the product to cart with a quantity of 1
      addToCart(productDetail, 1);
      
      // Toast notification is handled by CartContext
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 overflow-hidden group transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] rounded-lg ${className}`}
    >
      <div className="relative">
        <div className="aspect-square relative overflow-hidden">
          <Image 
            src={imageSrc} 
            alt={title}
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            quality={90}
          />
        </div>
        {badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#d44506] to-[#ed875a] text-white text-xs font-semibold px-3 py-1.5 z-10 rounded-sm shadow-md">
            {badge}
          </span>
        )}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton 
            productId={id}
            size="sm"
            variant="icon"
            className="shadow-sm"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            className={`bg-white text-gray-900 py-3 px-6 m-4 font-medium text-sm tracking-wide transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl rounded-sm hover:bg-[#ed8c61] hover:text-white ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            style={{ letterSpacing: '0.05em' }}
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <Link href={productUrl}>
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2 group-hover:text-[#ed875a] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3.5 w-3.5 ${i < Math.floor(averageRating) ? 'fill-current' : 'stroke-current fill-none opacity-40'}`} 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            ({reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {currency === 'USD' ? '$' : '₹'}{discountPrice || price}
            </span>
            {discountPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {currency === 'USD' ? '$' : '₹'}{price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard; 