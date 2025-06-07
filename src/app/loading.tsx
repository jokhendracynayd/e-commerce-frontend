'use client';
import React from 'react';
export default function Loading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Category Navigation Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto py-3 px-4 flex overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 mr-8">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Showcase/Carousel Skeleton */}
      <div className="container mx-auto mt-4 px-4">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
      </div>

      {/* Product Categories Section Skeleton */}
      <div className="container mx-auto mt-8 px-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded p-4 flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Groups Section Skeleton */}
      <div className="container mx-auto mt-8 px-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-64 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-1/2 mb-3"></div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products Section Skeleton */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden">
                <div className="relative">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="absolute top-3 left-3 bg-gray-300 dark:bg-gray-600 animate-pulse h-6 w-12"></div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4"></div>
                  <div className="flex items-center">
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-3.5 w-3.5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
                      ))}
                    </div>
                    <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded ml-2"></div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                      <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    </div>
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day Section Skeleton */}
      <section className="pb-6 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded flex items-center">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full mr-2"></div>
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
            <div className="flex gap-1">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-80">
                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="absolute top-4 left-4 h-16 w-16 bg-gray-300 dark:bg-gray-600 animate-pulse flex flex-col items-center justify-center"></div>
              </div>
              <div className="p-6 md:p-8">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
                <div className="mb-6">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full mr-2"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 