'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Tag } from 'lucide-react';
import { Deal } from '../../types/deal';
import DealCard from './DealCard';

interface DealsGridProps {
  deals: any[]; // Can be Deal[] or Product[] with deal info
  loading?: boolean;
  error?: string;
  onDealClick?: (deal: any) => void;
  onApplyDeal?: (dealId: string) => void;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

const DealsGrid: React.FC<DealsGridProps> = ({
  deals,
  loading = false,
  error,
  onDealClick,
  onApplyDeal,
  className = '',
  columns = 3,
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Ensure deals is always an array
  const dealsArray = Array.isArray(deals) ? deals : [];

  if (loading) {
    return (
      <div className={`grid gap-6 ${getGridCols()} ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
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
    <div className={`grid gap-6 ${getGridCols()} ${className}`}>
      {dealsArray.map((deal, index) => (
        <motion.div
          key={deal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DealCard
            deal={deal}
            variant="default"
            showTimer={true}
            showStats={true}
            onApply={onApplyDeal}
            onDealClick={onDealClick}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DealsGrid;
