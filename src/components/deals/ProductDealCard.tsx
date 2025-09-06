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
import { Deal } from '../../types/deal';
import { Product } from '../../types/product';
import { DealsService } from '../../services/dealsService';
import DealBadge from './DealBadge';
import DealTimer from './DealTimer';

interface ProductDealCardProps {
  product: Product;
  deal: Deal;
  variant?: 'default' | 'compact' | 'featured';
  showTimer?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onShare?: (productId: string) => void;
  onApplyDeal?: (dealId: string) => void;
  className?: string;
}

const ProductDealCard: React.FC<ProductDealCardProps> = ({
  product,
  deal,
  variant = 'default',
  showTimer = true,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onApplyDeal,
  className = '',
}) => {
  const isActive = DealsService.isDealActive(deal);
  const discountText = DealsService.formatDiscountValue(deal);
  const savings = DealsService.calculateSavings(product.price, deal);
  const finalPrice = product.price - savings;
  const isUrgent = new Date(deal.endDate).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000;

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'FLASH':
        return <Zap className="w-4 h-4" />;
      case 'TRENDING':
        return <TrendingUp className="w-4 h-4" />;
      case 'DEAL_OF_DAY':
        return <Star className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
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
            <div className="absolute top-1 left-1">
              <span className={`px-1 py-0.5 rounded text-xs font-medium ${getDealTypeColor(deal.type)}`}>
                {discountText}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-3">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
              {product.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-primary">₹{finalPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              <span className="text-xs text-green-600 font-medium">
                Save ₹{savings}
              </span>
            </div>

            {showTimer && (
              <DealTimer endDate={deal.endDate} compact />
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
        {/* Featured Deal Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Featured Deal
          </span>
        </div>

        {/* Deal Type Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getDealTypeColor(deal.type)}`}>
            {getDealTypeIcon(deal.type)}
            {deal.type}
          </span>
        </div>

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
          {showTimer && (
            <div className="mb-4">
              <DealTimer endDate={deal.endDate} />
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Deal Title */}
          <h4 className="text-lg font-semibold text-primary mb-3">
            {deal.title}
          </h4>

          {/* Pricing */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-primary">₹{finalPrice}</span>
            <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
            <span className="text-lg font-bold text-green-600">
              Save ₹{savings}
            </span>
          </div>

          {/* Deal Description */}
          {deal.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {deal.description}
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
              onClick={() => onApplyDeal?.(deal.id)}
              className="px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/10 transition-colors font-semibold"
            >
              Apply Deal
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
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDealTypeColor(deal.type)}`}>
            {getDealTypeIcon(deal.type)}
            {discountText}
          </span>
        </div>

        {/* Urgent Badge */}
        {isUrgent && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 animate-pulse">
              Urgent
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
        {/* Deal Info */}
        <div className="mb-3">
          <h4 className="font-semibold text-primary text-sm mb-1">
            {deal.title}
          </h4>
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Timer */}
        {showTimer && (
          <div className="mb-3">
            <DealTimer endDate={deal.endDate} compact />
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">₹{finalPrice}</span>
          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
          <span className="text-sm text-green-600 font-medium">
            Save ₹{savings}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Add to Cart
          </button>
          <button
            onClick={() => onApplyDeal?.(deal.id)}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
          >
            Apply Deal
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDealCard;
