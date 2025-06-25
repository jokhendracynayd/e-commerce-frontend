'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RecommendationResponseDto } from '@/types/recommendations';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import WishlistButton from '@/components/product/WishlistButton';
import { ProductDetail } from '@/types/product';

interface RecommendationCardProps {
  recommendation: RecommendationResponseDto;
  position: number;
  source: string;
  showScore?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  position,
  source,
  showScore = false,
  className = '',
  size = 'md',
  priority = false
}) => {
  const { trackProductClick, trackAddToCart } = useActivityTracking();
  const { addToCart } = useCart();
  const product = recommendation.product;

  if (!product) {
    return null; // Don't render if product details not included
  }

  const handleProductClick = () => {
    trackProductClick(product.id, source, position);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Track the action
      trackAddToCart(product.id, 1, product.discountPrice || product.price);
      
      // Create a ProductDetail object that matches the expected interface
      const productDetail: ProductDetail = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        subtitle: '',
        brand: product.brand?.name || '',
        description: '',
        price: product.price,
        originalPrice: product.price,
        discountPrice: product.discountPrice,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        inStock: product.inStock,
        isAssured: false,
        images: product.images || [],
        specificationGroups: [],
        highlights: [],
        hasFreeDel: false,
        sellerName: '',
        reviews: []
      };
      
      addToCart(productDetail, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const sizeClasses = {
    sm: 'w-40 h-56',
    md: 'w-60 h-80',
    lg: 'w-72 h-96'
  };

  const imageSizes = {
    sm: '160px',
    md: '240px',
    lg: '288px'
  };

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 ${sizeClasses[size]} ${className}`}>
      <Link 
        href={`/product/${product.slug || product.id}`}
        onClick={handleProductClick}
        className="block h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative flex-1 overflow-hidden rounded-t-lg bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={`(max-width: 768px) 50vw, ${imageSizes[size]}`}
            priority={priority}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
            {showScore && (
              <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                {Math.round(recommendation.score * 100)}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <WishlistButton
              productId={product.id}
              size="sm"
              variant="icon"
              className="shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Brand & Category */}
          {(product.brand || product.category) && (
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              {product.brand && <span>{product.brand.name}</span>}
              {product.category && <span>{product.category.name}</span>}
            </div>
          )}

          {/* Title */}
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors flex-grow">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full h-9 text-sm font-medium rounded-md transition-colors ${
              product.inStock 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
            </svg>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default RecommendationCard; 