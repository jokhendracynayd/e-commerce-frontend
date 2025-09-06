'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Clock, 
  TrendingUp, 
  Star, 
  Zap,
  AlertCircle
} from 'lucide-react';
import { Deal } from '../../types/deal';
import { DealsService } from '../../services/dealsService';
import DealTimer from './DealTimer';

interface DealBadgeProps {
  deal: Deal;
  variant?: 'small' | 'medium' | 'large';
  showTimer?: boolean;
  className?: string;
}

const DealBadge: React.FC<DealBadgeProps> = ({
  deal,
  variant = 'medium',
  showTimer = false,
  className = '',
}) => {
  const isActive = DealsService.isDealActive(deal);
  const discountText = DealsService.formatDiscountValue(deal);
  const isUrgent = new Date(deal.endDate).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000;

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'FLASH':
        return <Zap className="w-3 h-3" />;
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

  if (variant === 'small') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDealTypeColor(deal.type)}`}>
          {getDealTypeIcon(deal.type)}
          {discountText}
        </span>
        {isUrgent && (
          <span className="px-1 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 animate-pulse">
            !
          </span>
        )}
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-card ${className}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getDealTypeColor(deal.type)}`}>
              {getDealTypeIcon(deal.type)}
              {deal.type}
            </span>
            {isUrgent && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 animate-pulse">
                Urgent
              </span>
            )}
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {deal.title}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">{discountText}</span>
          {deal.minOrderValue && (
            <span className="text-xs text-gray-500">
              Min. ₹{deal.minOrderValue}
            </span>
          )}
        </div>

        {showTimer && (
          <div className="mb-3">
            <DealTimer endDate={deal.endDate} compact />
          </div>
        )}

        <div className="text-xs text-gray-500">
          {deal.description && (
            <p className="line-clamp-2 mb-2">{deal.description}</p>
          )}
          <div className="flex items-center gap-4">
            <span>Starts: {new Date(deal.startDate).toLocaleDateString()}</span>
            <span>Ends: {new Date(deal.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  }

  // Medium variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-lg border border-gray-200 p-3 shadow-card ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDealTypeColor(deal.type)}`}>
            {getDealTypeIcon(deal.type)}
            {deal.type}
          </span>
          {isUrgent && (
            <span className="px-1 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 animate-pulse">
              !
            </span>
          )}
        </div>
        {showTimer && (
          <DealTimer endDate={deal.endDate} compact />
        )}
      </div>

      <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">
        {deal.title}
      </h4>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-primary">{discountText}</span>
        {deal.minOrderValue && (
          <span className="text-xs text-gray-500">
            Min. ₹{deal.minOrderValue}
          </span>
        )}
      </div>

      {deal.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {deal.description}
        </p>
      )}
    </motion.div>
  );
};

export default DealBadge;
