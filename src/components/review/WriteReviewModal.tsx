'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { reviewService } from '@/services/reviewService';
import { CreateReviewRequest, EligibleProductForReview } from '@/types/review';
import Image from 'next/image';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: EligibleProductForReview;
  onReviewSubmitted: () => void;
}

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transform transition-all duration-200 hover:scale-110"
          >
            <svg
              className={`w-10 h-10 transition-all duration-300 ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-current drop-shadow-lg scale-110'
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <div className="ml-4 flex items-center space-x-2">
          <span className="text-lg font-semibold text-yellow-500">
            {rating}/5
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full">
            {getRatingText(rating)}
          </span>
        </div>
      )}
    </div>
  );
};

const getRatingText = (rating: number) => {
  switch (rating) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return '';
  }
};

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: CreateReviewRequest = {
        productId: product.product.id,
        orderId: product.orderId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      };

      await reviewService.createReview(reviewData);
      
      toast.success('🎉 Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      
      onReviewSubmitted();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setTitle('');
      setComment('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Background overlay with animated entrance */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal with enhanced styling */}
      <div className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transform transition-all duration-300 w-full max-w-2xl max-h-[95vh] overflow-hidden ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#ed875a] via-[#f4a261] to-[#e76f51] p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-1"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">Write a Review</h3>
              <p className="text-orange-100 text-sm">Share your experience with other customers</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content with custom scrollbar */}
        <div className="p-6 max-h-[calc(95vh-140px)] overflow-y-auto custom-scrollbar">
          
          {/* Product Info Card */}
          <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 relative">
                <Image
                  src={product.product.imageUrl || '/placeholder-product.jpg'}
                  alt={product.product.title}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover shadow-md"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.product.title}
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order #{product.orderNumber}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Purchased on {new Date(product.orderDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rating Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                How would you rate this product? *
              </label>
              <StarRating rating={rating} onRatingChange={setRating} />
              {rating > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ✨ Thank you for rating! Your feedback helps other customers make informed decisions.
                  </p>
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <label htmlFor="review-title" className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Review Title (Optional)
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Give your review a helpful title
              </p>
              <input
                type="text"
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Great product, highly recommended!'"
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-[#ed875a] transition-all duration-200"
                disabled={isSubmitting}
              />
              <div className="mt-2 text-right">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {title.length}/100 characters
                </span>
              </div>
            </div>

            {/* Comment Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <label htmlFor="review-comment" className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your Review *
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Tell others about your experience with this product
              </p>
              <div className="relative">
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike about this product? How did it meet your expectations? What should others know before purchasing?"
                  rows={5}
                  maxLength={1000}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-[#ed875a] transition-all duration-200 resize-none"
                  disabled={isSubmitting}
                  required
                />
                {comment.length >= 10 && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${
                    comment.length >= 10 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {comment.length >= 10 ? '✓ Minimum length met' : 'Minimum 10 characters'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {comment.length}/1000 characters
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || !comment.trim() || comment.length < 10}
                className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#ed875a] to-[#e76f51] hover:from-[#d44506] hover:to-[#c44513] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Review...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Review
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ed875a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d44506;
        }
      `}</style>
    </div>
  );
};

export default WriteReviewModal; 