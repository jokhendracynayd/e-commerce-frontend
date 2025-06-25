'use client';

import React, { useRef } from 'react';
import { RecommendationResponseDto } from '@/types/recommendations';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationSectionProps {
  title: string;
  recommendations: RecommendationResponseDto[];
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  source: string;
  showScore?: boolean;
  className?: string;
  emptyMessage?: string;
  cardSize?: 'sm' | 'md' | 'lg';
  showNavigation?: boolean;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  recommendations,
  loading,
  error,
  onRefresh,
  source,
  showScore = false,
  className = '',
  emptyMessage = 'No recommendations available',
  cardSize = 'md',
  showNavigation = true
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (error) {
    return (
      <section className={`py-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Retry
            </button>
          )}
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Failed to load recommendations</p>
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (!loading && recommendations.length === 0) {
    return (
      <section className={`py-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Refresh
            </button>
          )}
          {showNavigation && (
            <div className="hidden md:flex gap-1">
              <button
                onClick={() => scroll('left')}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${
                cardSize === 'sm' ? 'w-40 h-56' :
                cardSize === 'md' ? 'w-60 h-80' :
                'w-72 h-96'
              }`}>
                <div className="h-2/3 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                  <div className="h-9 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Recommendation cards
          recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              position={index}
              source={source}
              showScore={showScore}
              size={cardSize}
              className="flex-shrink-0"
              priority={index < 4}
            />
          ))
        )}
      </div>

      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default RecommendationSection; 