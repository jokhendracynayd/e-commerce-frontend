'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthModalContext } from '@/context/AuthModalContext';
import { useWishlist } from '@/context/WishlistContext';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  withText?: boolean;
}

export default function WishlistButton({
  productId,
  className = '',
  size = 'md',
  variant = 'icon',
  withText = false
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { openAuthModal } = useAuthModalContext();
  const { isInWishlist, addItem, removeItem } = useWishlist();

  const isInWishlistStatus = isInWishlist(productId);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (isInWishlistStatus) {
        // Remove from wishlist
        result = await removeItem(productId);
      } else {
        // Add to wishlist
        result = await addItem(productId);
      }
      
      if (result.success) {
        // Show toast notification
        if (isInWishlistStatus) {
          toast.success('Product removed from wishlist');
        } else {
          toast.success('Product added to wishlist');
        }
      } else {
        // Handle authentication required
        if (result.error === 'Authentication required') {
          openAuthModal(
            'Please sign in to add items to your wishlist',
            'login'
          );
        } else {
          toast.error(result.error || 'Failed to update wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  // Determine icon size
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleWishlistToggle}
        className={`${sizeClasses[size]} ${isInWishlistStatus ? 'bg-[#fff2ee] dark:bg-[#3a3333]' : 'bg-white/90 dark:bg-gray-800/90'} transition-all transform hover:scale-105 rounded-full flex items-center justify-center ${className}`}
        aria-label={isInWishlistStatus ? "Remove from wishlist" : "Add to wishlist"}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className={`animate-spin ${iconSize[size]} text-gray-400`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg 
            className={`${iconSize[size]} ${isInWishlistStatus ? 'text-[#ed875a]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
            viewBox="0 0 24 24" 
            fill={isInWishlistStatus ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth={isInWishlistStatus ? "0" : "2"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </button>
    );
  }

  // Button variant
  return (
    <button
      onClick={handleWishlistToggle}
      className={`inline-flex items-center justify-center px-4 py-2 ${
        isInWishlistStatus
          ? 'bg-[#fff2ee] dark:bg-[#3a3333] text-[#ed875a] border border-[#ed875a]/20' 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700'
      } rounded-md transition-all hover:shadow-sm ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg 
          className={`${iconSize[size]} mr-2 ${isInWishlistStatus ? 'text-[#ed875a]' : ''}`}
          viewBox="0 0 24 24" 
          fill={isInWishlistStatus ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth={isInWishlistStatus ? "0" : "2"}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
      {withText && (isInWishlistStatus ? 'Remove from Wishlist' : 'Add to Wishlist')}
    </button>
  );
} 