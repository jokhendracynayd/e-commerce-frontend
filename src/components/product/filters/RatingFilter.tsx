'use client';

import { useState } from 'react';

type RatingFilterProps = {
  selectedRatings: number[];
  onChange: (ratings: number[]) => void;
};

export default function RatingFilter({ selectedRatings, onChange }: RatingFilterProps) {
  const handleToggle = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      onChange(selectedRatings.filter(r => r !== rating));
    } else {
      onChange([...selectedRatings, rating]);
    }
  };

  return (
    <div className="space-y-2">
      {[4, 3, 2, 1].map((rating) => (
        <label key={rating} className="flex items-center cursor-pointer group">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              className="hidden"
              checked={selectedRatings.includes(rating)}
              onChange={() => handleToggle(rating)}
            />
            <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center group-hover:border-blue-500 dark:group-hover:border-blue-400">
              {selectedRatings.includes(rating) && (
                <svg className="w-3 h-3 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <div className="ml-2 flex items-center">
            <div className="flex">
              {[...Array(rating)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {[...Array(5 - rating)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
              & Up
            </span>
          </div>
        </label>
      ))}
    </div>
  );
} 