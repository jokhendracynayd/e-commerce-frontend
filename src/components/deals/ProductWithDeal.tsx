'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Tag,
  Clock,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';
import { Product } from '../../types/product';
import { Deal } from '../../types/deal';
import { useProductDeal } from '../../hooks/useProductDeals';
import { DealsService } from '../../services/dealsService';
import DealBadge from './DealBadge';
import DealTimer from './DealTimer';

interface ProductWithDealProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showDealInfo?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onShare?: (productId: string) => void;
  className?: string;
}

const ProductWithDeal: React.FC<ProductWithDealProps> = ({
  product,
  variant = 'default',
  showDealInfo = true,
  onAddToCart,
  onAddToWishlist,
  onShare,
  className = '',
}) => {
  const { deal, bestDeal, loading: dealsLoading } = useProductDeal(product.id);
  
  const activeDeal = bestDeal || deal;
  const hasDeal = !!activeDeal && DealsService.isDealActive(activeDeal);
  
  const savings = hasDeal ? DealsService.calculateSavings(product.price, activeDeal) : 0;
  const finalPrice = hasDeal ? product.price - savings : product.price;
  const discountPercentage = hasDeal ? Math.round((savings / product.price) * 100) : 0;

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'FLASH':
        return <Zap className="w-3 h-3" />;
      case 'TRENDING':
        return <TrendingUp className="w-3 h-3" />;
      case 'DEAL_OF_DAY':
        return <Star className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'FLASH':
        return 'bg-red-500 text-white';
      case 'TRENDING':
        return 'bg-orange-500 text-white';
      case 'DEAL_OF_DAY':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 ${className}`}
      >
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={product.images?.[0]?.imageUrl || '/placeholder-product.jpg'}
              alt={product.name || 'Product'}
              fill
              className="object-cover"
            />
            {/* Deal Badge */}
            {hasDeal && (
              <div className="absolute top-1 left-1">
                <span className={`px-1 py-0.5 rounded text-xs font-medium ${getDealTypeColor(activeDeal.type)}`}>
                  {DealsService.formatDiscountValue(activeDeal)}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-3">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
              {product.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-primary">₹{finalPrice}</span>
              {hasDeal && (
                <>
                  <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                  <span className="text-xs text-green-600 font-medium">
                    Save ₹{savings}
                  </span>
                </>
              )}
            </div>

            {hasDeal && showDealInfo && (
              <DealTimer endDate={activeDeal.endDate} compact />
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-gray-200 overflow-hidden shadow-elevated hover:shadow-xl transition-all duration-300 ${className}`}
      >
        {/* Deal Badge */}
        {hasDeal && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getDealTypeColor(activeDeal.type)}`}>
              {getDealTypeIcon(activeDeal.type)}
              {activeDeal.type}
            </span>
          </div>
        )}

        <div className="p-6">
          {/* Product Image */}
          <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
            <Image
              src={product.images?.[0]?.imageUrl || '/placeholder-product.jpg'}
              alt={product.name || 'Product'}
              fill
              className="object-cover"
            />
          </div>

          {/* Timer */}
          {hasDeal && showDealInfo && (
            <div className="mb-4">
              <DealTimer endDate={activeDeal.endDate} />
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Deal Title */}
          {hasDeal && (
            <h4 className="text-lg font-semibold text-primary mb-3">
              {activeDeal.title}
            </h4>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-primary">₹{finalPrice}</span>
            {hasDeal && (
              <>
                <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                <span className="text-lg font-bold text-green-600">
                  Save ₹{savings}
                </span>
              </>
            )}
          </div>

          {/* Deal Description */}
          {hasDeal && activeDeal.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {activeDeal.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onAddToCart?.(product.id)}
              className="flex-1 py-3 px-6 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onAddToWishlist?.(product.id)}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => onShare?.(product.id)}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 ${className}`}
    >
      {/* Product Image */}
      <div className="relative w-full h-48">
        <Image
          src={product.images?.[0]?.imageUrl || '/placeholder-product.jpg'}
          alt={product.name || 'Product'}
          fill
          className="object-cover"
        />
        
        {/* Deal Badge */}
        {hasDeal && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDealTypeColor(activeDeal.type)}`}>
              {getDealTypeIcon(activeDeal.type)}
              {DealsService.formatDiscountValue(activeDeal)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => onAddToWishlist?.(product.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onShare?.(product.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Deal Info */}
        {hasDeal && showDealInfo && (
          <div className="mb-3">
            <h4 className="font-medium text-primary text-sm mb-1">
              {activeDeal.title}
            </h4>
            <DealTimer endDate={activeDeal.endDate} compact />
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">₹{finalPrice}</span>
          {hasDeal && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              <span className="text-sm text-green-600 font-medium">
                Save ₹{savings}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Add to Cart
          </button>
          {hasDeal && (
            <button
              onClick={() => onAddToCart?.(product.id)}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
            >
              Apply Deal
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductWithDeal;
