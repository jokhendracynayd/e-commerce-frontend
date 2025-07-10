'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductDetail } from '@/types/product';

interface ProductDetailsProps {
  product: ProductDetail;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  console.log('😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊😊', product.reviews);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [expandedSpecGroups, setExpandedSpecGroups] = useState<string[]>([]);
  
  const toggleSpecGroup = (title: string) => {
    if (expandedSpecGroups.includes(title)) {
      setExpandedSpecGroups(expandedSpecGroups.filter(group => group !== title));
    } else {
      setExpandedSpecGroups([...expandedSpecGroups, title]);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-[0_4px_20px_-2px_rgba(237,135,90,0.1)] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium flex-shrink-0 ${
            activeTab === 'description'
              ? 'text-[#ed875a] dark:text-[#ed8c61] border-b-2 border-[#ed875a] dark:border-[#ed8c61]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('specifications')}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium flex-shrink-0 ${
            activeTab === 'specifications'
              ? 'text-[#ed875a] dark:text-[#ed8c61] border-b-2 border-[#ed875a] dark:border-[#ed8c61]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium flex-shrink-0 ${
            activeTab === 'reviews'
              ? 'text-[#ed875a] dark:text-[#ed8c61] border-b-2 border-[#ed875a] dark:border-[#ed8c61]'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          Reviews
        </button>
      </div>
      
      {/* Tab content */}
      <div className="p-3 sm:p-4">
        {/* Description tab */}
        {activeTab === 'description' && (
          <div className="space-y-4 md:space-y-6">
            {/* Highlights */}
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2">
                {product.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-[#ed875a] dark:text-[#ed8c61] mt-0.5">•</span>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Description */}
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Description</h3>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Specifications tab */}
        {activeTab === 'specifications' && (
          <div className="space-y-3 sm:space-y-4">
            {product.specificationGroups.map((group, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-2 sm:pb-3 last:pb-0">
                <button
                  onClick={() => toggleSpecGroup(group.title)}
                  className="w-full flex items-center justify-between py-2 sm:py-3 font-medium text-sm sm:text-base text-gray-800 dark:text-white"
                >
                  <span>{group.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${
                      expandedSpecGroups.includes(group.title) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Specs list - either always visible or toggled */}
                <div className={`space-y-1 sm:space-y-2 mt-1 sm:mt-2 ${expandedSpecGroups.includes(group.title) ? 'block' : 'hidden'}`}>
                  {group.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex py-1 sm:py-1.5">
                      <span className="w-1/3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{spec.specKey}</span>
                      <span className="w-2/3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 md:space-y-6">
            {/* Rating summary */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="text-center md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-6">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{product.rating.toFixed(1)}/5</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Based on {product.reviewCount} ratings</div>
              </div>
              
              <div className="flex-1">
                <div className="space-y-1.5 sm:space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    // Calculate percentage - this is just a simulation
                    const percentage = star === 5 ? 60 : 
                                      star === 4 ? 25 : 
                                      star === 3 ? 10 : 
                                      star === 2 ? 4 : 1;
                    
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 w-6 sm:w-8">
                          {star} ★
                        </div>
                        <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              star >= 4 ? 'bg-green-500 dark:bg-green-600' : 
                              star === 3 ? 'bg-yellow-500 dark:bg-yellow-600' : 
                              'bg-red-500 dark:bg-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-8 sm:w-12">
                          {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Review list */}
            <div className="space-y-4 md:space-y-6">
              {product.reviews.map(review => (
                <div key={review.id} className="pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className={`text-white text-xs px-1.5 py-0.5 ${
                        review.rating >= 4 ? 'bg-green-500 dark:bg-green-600' : 
                        review.rating === 3 ? 'bg-yellow-500 dark:bg-yellow-600' : 
                        'bg-red-500 dark:bg-red-600'
                      }`}>
                        {review.rating} ★
                      </span>
                      <h4 className="font-medium text-xs sm:text-sm text-gray-800 dark:text-white">{review.title}</h4>
                    </div>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs text-[#ed875a] dark:text-[#ed8c61] font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">{review.comment}</p>
                  
                  {/* Review images if any */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 my-2 md:my-3 overflow-x-auto pb-1">
                      {review.images.map((img, i) => (
                        <div key={i} className="relative w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                          <Image 
                            src={img} 
                            alt={`Review image ${i+1}`} 
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 48px, 64px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 md:mt-3 text-xs">
                    <div className="text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">
                      {review.user} | {review.date}
                    </div>
                    <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-[#ed875a] dark:hover:text-[#ed8c61]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span className="hidden xs:inline">Helpful</span> ({review.helpfulCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show more reviews button */}
            {product.reviewCount > product.reviews.length && (
              <div className="text-center">
                <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-[#f5f1ed] dark:hover:bg-gray-600 transition-colors">
                  Show more reviews
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Custom breakpoint for extra small devices */
        @media (min-width: 400px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
} 