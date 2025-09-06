'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { Deal } from '../../types/deal';
import DealCard from './DealCard';
import DealTimer from './DealTimer';

interface DealsSectionProps {
  deals: any[]; // Can be Deal[] or Product[] with deal info
  loading?: boolean;
  error?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  onDealClick?: (deal: any) => void;
  onApplyDeal?: (dealId: string) => void;
  className?: string;
}

const DealsSection: React.FC<DealsSectionProps> = ({
  deals,
  loading = false,
  error,
  title = "Hot Deals",
  subtitle = "Don't miss out on these amazing offers",
  showViewAll = true,
  onDealClick,
  onApplyDeal,
  className = '',
}) => {
  // Ensure deals is always an array
  const dealsArray = Array.isArray(deals) ? deals : [];
  const getSectionIcon = () => {
    if (title.toLowerCase().includes('flash')) return <Zap className="w-6 h-6" />;
    if (title.toLowerCase().includes('trending')) return <TrendingUp className="w-6 h-6" />;
    if (title.toLowerCase().includes('day')) return <Star className="w-6 h-6" />;
    return <Clock className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Deals</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (dealsArray.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deals Available</h3>
            <p className="text-gray-600">Check back later for new deals and offers!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-primary">
              {getSectionIcon()}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          
          {showViewAll && (
            <div className="mt-6">
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View All Deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Featured Deal */}
        {dealsArray.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <DealCard
              deal={dealsArray[0]}
              variant="featured"
              showTimer={true}
              showStats={true}
              onApply={onApplyDeal}
              onDealClick={onDealClick}
            />
          </motion.div>
        )}

        {/* Deals Grid */}
        {dealsArray.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dealsArray.slice(1, 7).map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <DealCard
                  deal={deal}
                  variant="default"
                  showTimer={true}
                  showStats={false}
                  onApply={onApplyDeal}
                  onDealClick={onDealClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View More Button */}
        {dealsArray.length > 7 && showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              View All {dealsArray.length} Deals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DealsSection;
