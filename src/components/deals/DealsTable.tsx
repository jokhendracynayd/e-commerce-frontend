'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar,
  Tag,
  Users,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Deal, DealSortOption } from '../../types/deal';
import DealCard from './DealCard';
import DealTimer from './DealTimer';

interface DealsTableProps {
  deals: Deal[];
  loading?: boolean;
  error?: string;
  onDealClick?: (deal: Deal) => void;
  onApplyDeal?: (dealId: string) => void;
  className?: string;
}

const DealsTable: React.FC<DealsTableProps> = ({
  deals,
  loading = false,
  error,
  onDealClick,
  onApplyDeal,
  className = '',
}) => {
  // Ensure deals is always an array
  const dealsArray = Array.isArray(deals) ? deals : [];
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Deals</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (dealsArray.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deals Found</h3>
        <p className="text-gray-600">Check back later for new deals and offers!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {dealsArray.map((deal, index) => (
        <motion.div
          key={deal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              {/* Deal Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    deal.type === 'FLASH' ? 'bg-red-100 text-red-700' :
                    deal.type === 'TRENDING' ? 'bg-orange-100 text-orange-700' :
                    deal.type === 'DEAL_OF_DAY' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {deal.type === 'FLASH' && <Clock className="w-3 h-3" />}
                    {deal.type === 'TRENDING' && <TrendingUp className="w-3 h-3" />}
                    {deal.type === 'DEAL_OF_DAY' && <Tag className="w-3 h-3" />}
                    {deal.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deal.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    deal.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {deal.status}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {deal.title}
                </h3>

                {deal.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {deal.description}
                  </p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Starts: {new Date(deal.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ends: {new Date(deal.endDate).toLocaleDateString()}</span>
                  </div>
                  {deal.minOrderValue && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>Min: ₹{deal.minOrderValue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timer */}
              <div className="ml-6">
                <DealTimer endDate={deal.endDate} />
              </div>
            </div>

            {/* Discount and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">
                  {deal.discountType === 'PERCENTAGE' ? `${deal.discountValue}% OFF` :
                   deal.discountType === 'FIXED_AMOUNT' ? `₹${deal.discountValue} OFF` :
                   deal.discountType === 'FREE_SHIPPING' ? 'FREE SHIPPING' :
                   'SPECIAL OFFER'}
                </span>
                {deal.stats && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{deal.stats.uniqueUsers} users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{deal.stats.totalUsage} used</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onApplyDeal?.(deal.id)}
                  disabled={deal.status !== 'ACTIVE'}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    deal.status === 'ACTIVE'
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {deal.status === 'ACTIVE' ? 'Apply Deal' : 'Expired'}
                </button>
                <button
                  onClick={() => onDealClick?.(deal)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DealsTable;
