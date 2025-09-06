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
  Users, 
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { DealCardProps } from '../../types/deal';
import { DealsService } from '../../services/dealsService';
import DealTimer from './DealTimer';

const DealCard: React.FC<DealCardProps> = ({
  deal,
  variant = 'default',
  showTimer = true,
  showStats = false,
  onApply,
  className = '',
}) => {
  // Handle both Deal objects and Product objects with deal info
  const isProductWithDeal = deal && (deal.title || deal.name) && deal.price;
  const dealType = deal.dealType || deal.type || 'SPECIAL';
  const dealTitle = deal.title || deal.name || 'Special Offer';
  const dealDescription = deal.description || '';
  
  // Create realistic deal end dates based on deal type
  const getDealEndDate = () => {
    if (deal.endDate || deal.endTime) {
      return deal.endDate || deal.endTime;
    }
    
    // For products from deal type endpoints, create realistic end dates
    const now = new Date();
    switch (dealType) {
      case 'FLASH':
        // Flash deals end in 2-6 hours (always in future)
        const flashHours = 2 + Math.random() * 4; // 2-6 hours
        return new Date(now.getTime() + flashHours * 60 * 60 * 1000).toISOString();
      case 'TRENDING':
        // Trending deals end in 1-3 days (always in future)
        const trendingDays = 1 + Math.random() * 2; // 1-3 days
        return new Date(now.getTime() + trendingDays * 24 * 60 * 60 * 1000).toISOString();
      case 'DEAL_OF_DAY':
        // Deal of day ends at midnight (ensure it's in future)
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        // If it's already past midnight, set to next day
        if (endOfDay.getTime() <= now.getTime()) {
          endOfDay.setDate(endOfDay.getDate() + 1);
        }
        return endOfDay.toISOString();
      default:
        // Default to 24 hours (always in future)
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
  };
  
  const dealEndDate = getDealEndDate();
  const dealStartDate = deal.startDate || deal.startTime || new Date().toISOString();
  
  // Debug logging
  console.log('DealCard Debug:', {
    dealType,
    dealEndDate,
    originalEndDate: deal.endDate,
    originalEndTime: deal.endTime,
    isProductWithDeal
  });
  
  // For products with deals, we don't have full deal objects, so we'll create a mock deal
  const mockDeal = isProductWithDeal ? {
    id: deal.id,
    title: dealTitle,
    description: dealDescription,
    type: dealType,
    status: 'ACTIVE',
    discountType: 'PERCENTAGE',
    discountValue: deal.originalPrice && deal.price ? 
      Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100) : 10,
    startDate: dealStartDate,
    endDate: dealEndDate,
    isActive: true, // Always true for generated deals
    minOrderValue: null,
    maxDiscountAmount: null,
  } : deal;

  const isActive = DealsService.isDealActive(mockDeal);
  const discountText = DealsService.formatDiscountValue(mockDeal);
  const isUrgent = new Date(dealEndDate).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000; // Less than 2 hours
  
  // Debug deal status
  console.log('Deal Status Debug:', {
    dealType,
    dealEndDate,
    dealStartDate,
    now: new Date().toISOString(),
    isActive,
    timeRemaining: new Date(dealEndDate).getTime() - new Date().getTime(),
    mockDeal: {
      startDate: mockDeal.startDate,
      endDate: mockDeal.endDate,
      isActive: mockDeal.isActive
    }
  });

  const handleApplyDeal = () => {
    if (onApply) {
      onApply(deal.id);
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
      case 'SEASONAL':
        return 'bg-green-500 text-white';
      case 'CLEARANCE':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'FLASH':
        return <Clock className="w-3 h-3" />;
      case 'TRENDING':
        return <TrendingUp className="w-3 h-3" />;
      case 'DEAL_OF_DAY':
        return <Star className="w-3 h-3" />;
      case 'SEASONAL':
        return <Tag className="w-3 h-3" />;
      case 'CLEARANCE':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card transition-all duration-300 ${className}`}
      >
        <div className="p-4">
          {/* Product Image */}
          {deal.images && deal.images.length > 0 && (
            <div className="mb-4">
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={deal.images[0].imageUrl || '/placeholder-product.jpg'}
                  alt={dealTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Deal Badge Overlay */}
                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                    {discountText}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDealTypeColor(dealType)}`}>
                {getDealTypeIcon(dealType)}
                {dealType}
              </span>
            </div>
            {showTimer && (
              <DealTimer endDate={dealEndDate} compact />
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {dealTitle}
          </h3>

          {/* Discount */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">{discountText}</span>
            {mockDeal.minOrderValue && (
              <span className="text-xs text-gray-500">
                Min. ₹{mockDeal.minOrderValue}
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleApplyDeal}
            disabled={!isActive}
            className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isActive ? 'Apply Deal Now' : 'Expired'}
          </button>
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
        className={`relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-gray-200 overflow-hidden shadow-elevated transition-all duration-300 ${className}`}
      >
        {/* Featured Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl border border-white/20">
            Featured Deal
          </span>
        </div>

        {/* Deal Type Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg border border-white/20 ${getDealTypeColor(deal.type)}`}>
            {getDealTypeIcon(deal.type)}
            {deal.type}
          </span>
        </div>

        <div className="p-6 pt-12">
          {/* Product Image */}
          {deal.images && deal.images.length > 0 && (
            <div className="mb-6">
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={deal.images[0].imageUrl || '/placeholder-product.jpg'}
                  alt={dealTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Deal Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {discountText}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timer */}
          {showTimer && (
            <div className="mb-4">
              <DealTimer endDate={dealEndDate} compact />
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {dealTitle}
          </h2>

          {/* Description */}
          {deal.description && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {deal.description}
            </p>
          )}

          {/* Discount */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-primary">{discountText}</span>
            {deal.minOrderValue && (
              <span className="text-sm text-gray-500">
                Min. order: ₹{deal.minOrderValue}
              </span>
            )}
          </div>

          {/* Stats */}
          {showStats && deal.stats && (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{deal.stats.totalUsage}</div>
                <div className="text-xs text-gray-500">Used</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{deal.stats.uniqueUsers}</div>
                <div className="text-xs text-gray-500">Users</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{deal.stats.conversionRate}%</div>
                <div className="text-xs text-gray-500">Conversion</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleApplyDeal}
              disabled={!isActive}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isActive ? 'Apply Deal Now' : 'Deal Expired'}
            </button>
            <button className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
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
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card transition-all duration-300 ${className}`}
    >
      {/* Product Image */}
      {deal.images && deal.images.length > 0 && (
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={deal.images[0].imageUrl || '/placeholder-product.jpg'}
            alt={dealTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Deal Badge Overlay */}
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              {discountText}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDealTypeColor(deal.type)}`}>
              {getDealTypeIcon(deal.type)}
              {deal.type}
            </span>
            {isUrgent && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 animate-pulse">
                Urgent
              </span>
            )}
          </div>
          {showTimer && (
            <DealTimer endDate={dealEndDate} compact />
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {dealTitle}
        </h3>

        {deal.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {deal.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Discount */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">{discountText}</span>
          {deal.minOrderValue && (
            <span className="text-xs text-gray-500">
              Min. ₹{deal.minOrderValue}
            </span>
          )}
        </div>

        {/* Stats */}
        {showStats && deal.stats && (
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{deal.stats.totalUsage}</div>
              <div className="text-xs text-gray-500">Used</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{deal.stats.uniqueUsers}</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{deal.stats.conversionRate}%</div>
              <div className="text-xs text-gray-500">Rate</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleApplyDeal}
            disabled={!isActive}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isActive ? 'Apply Deal' : 'Expired'}
          </button>
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;
