'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductDetail, ColorVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import WishlistButton from '@/components/product/WishlistButton';
import { ProductAvailability, VariantAvailability } from '@/lib/api/inventory-api';
import { useProductAvailability } from '@/hooks/useProductAvailability';
import { formatCurrency, getCurrencySymbol } from '@/lib/utils';

interface ProductInfoProps {
  product: ProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | undefined>(
    product.colorVariants && product.colorVariants.length > 0 
      ? product.colorVariants[0] 
      : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState<ProductAvailability | VariantAvailability | null>(null);
  
  // Use the batch availability hook
  const { 
    productAvailability, 
    variantAvailability,
    isProductAvailable,
    isVariantAvailable,
    getProductStockStatus,
    getVariantStockStatus
  } = useProductAvailability({
    productIds: [product.id],
    variantIds: selectedColorVariant ? [selectedColorVariant.id] : [],
    refreshInterval: 60000
  });
  
  // Update inventory status whenever availability data changes
  useEffect(() => {
    if (selectedColorVariant && variantAvailability[selectedColorVariant.id]) {
      setInventoryStatus(variantAvailability[selectedColorVariant.id]);
    } else if (productAvailability[product.id]) {
      setInventoryStatus(productAvailability[product.id]);
    }
  }, [productAvailability, variantAvailability, product.id, selectedColorVariant]);
  
  // Calculate discount percentage if not provided
  const discountPercentage = product.discountPercentage || (
    product.price && product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : null
  );
  
  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };
  
  // Handle Add to Cart
  const handleAddToCart = () => {
    setAddingToCart(true);
    
    // Add to cart with a slight delay to show animation
    setTimeout(() => {
      addToCart(product, quantity, selectedColorVariant);
      setAddingToCart(false);
      setCartSuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setCartSuccess(false);
      }, 2000);
    }, 500);
  };
  
  // Handle Buy Now
  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColorVariant);
    
    // Check if user is logged in
    if (user) {
      // Make sure we redirect to checkout page, not home page
      setTimeout(() => {
        router.push('/checkout');
      }, 1000);
    } else {
      // If not logged in, redirect to login page with return URL
      router.push(`/login?returnUrl=${encodeURIComponent('/checkout')}`);
    }
  };
  
  // Check if the product or selected variant is out of stock
  const isOutOfStock = selectedColorVariant 
    ? !isVariantAvailable(selectedColorVariant.id)
    : !isProductAvailable(product.id);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Brand */}
      <div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
      </div>
      
      {/* Title */}
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
      
      {/* Subtitle */}
      {product.subtitle && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{product.subtitle}</p>
      )}
      
      {/* Rating and reviews */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center">
          <span className="bg-[#d44506] text-white text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 flex items-center">
            {product.rating.toFixed(1)} ★
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 sm:ml-2">
            {product.reviewCount.toLocaleString()} Ratings
          </span>
        </div>
        
        {/* Assured badge */}
        {product.isAssured && (
          <div className="flex items-center">
            <span className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#ed875a] dark:text-[#ed8c61]" viewBox="0 0 16 16" fill="currentColor">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              <span className="ml-1 text-xs font-medium text-[#ed875a] dark:text-[#ed8c61]">Assured</span>
            </span>
          </div>
        )}
      </div>
      
      {/* Pricing */}
      <div className="space-y-1 sm:space-y-2">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getCurrencySymbol(product.currency || 'INR')}{formatCurrency(product.price, product.currency)}
          </span>
          
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
              {getCurrencySymbol(product.currency || 'INR')}{formatCurrency(product.originalPrice, product.currency)}
            </span>
          )}
          
          {discountPercentage && (
            <span className="text-xs sm:text-sm font-semibold text-[#d44506] dark:text-[#ed875a]">
              {discountPercentage}% off
            </span>
          )}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">inclusive of all taxes</p>
      </div>
      
      {/* Bank offers */}
      {product.bankOffers && product.bankOffers.length > 0 && (
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Available offers</p>
          <ul className="space-y-1">
            {product.bankOffers.slice(0, 3).map((offer, index) => (
              <li key={index} className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>{offer}</span>
              </li>
            ))}
            {product.bankOffers.length > 3 && (
              <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                View {product.bankOffers.length - 3} more offers
              </button>
            )}
          </ul>
        </div>
      )}
      
      {/* Color variants */}
      {product.colorVariants && product.colorVariants.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Color</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {selectedColorVariant?.color || product.colorVariants[0].color}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {product.colorVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedColorVariant(variant)}
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                  selectedColorVariant?.id === variant.id 
                    ? 'ring-2 ring-[#ed875a] dark:ring-[#ed8c61]' 
                    : 'ring-1 ring-gray-300 dark:ring-gray-600'
                }`}
                aria-label={`Select ${variant.color} color`}
              >
                <span 
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full" 
                  style={{ backgroundColor: variant.hex }}
                  title={variant.color}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Delivery info */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Delivery</p>
          
          {/* Free delivery badge */}
          {product.hasFreeDel && (
            <span className="text-xs bg-[#f5f1ed] dark:bg-[#d44506]/20 text-[#d44506] dark:text-[#ed875a] px-1.5 sm:px-2 py-0.5">
              Free
            </span>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {product.deliveryInfo || 'Standard Delivery'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter pincode for exact delivery dates
            </p>
            <div className="mt-2 sm:mt-3 relative">
              <div className="flex w-full max-w-[300px] shadow-sm rounded-md overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Enter pincode" 
                  className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ed875a] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  maxLength={6}
                />
                <button className="bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-md text-white px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all flex items-center justify-center">
                  Check
                </button>
              </div>
              <div className="mt-1.5 sm:mt-2 text-xs text-[#ed875a] dark:text-[#ed8c61] font-medium">
                <button className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Use my current location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* After the delivery info section, add inventory status */}
      <div className="flex items-center mt-2 sm:mt-3">
        {/* Render inventory status based on current data */}
        {inventoryStatus && (
          <div className="inventory-status">
            {inventoryStatus.stockStatus === 'IN_STOCK' && (
              <span className="text-green-600 dark:text-green-400 flex items-center text-xs sm:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Stock
              </span>
            )}
            {inventoryStatus.stockStatus === 'LOW_STOCK' && (
              <span className="text-yellow-600 dark:text-yellow-400 flex items-center text-xs sm:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Only {inventoryStatus.availableQuantity} left
              </span>
            )}
            {inventoryStatus.stockStatus === 'OUT_OF_STOCK' && (
              <span className="text-red-600 dark:text-red-400 flex items-center text-xs sm:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Out of Stock
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Quantity selector */}
      <div className="space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</p>
        <div className="flex items-center w-24 sm:w-28 md:w-32">
          <button 
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-l-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <div className="h-6 sm:h-8 px-2 sm:px-4 flex items-center justify-center border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
            {quantity}
          </div>
          <button 
            onClick={incrementQuantity}
            disabled={quantity >= 10}
            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-r-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className={`flex-1 min-w-24 h-10 sm:h-12 rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 ${
            addingToCart
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#d44506] to-[#ed875a] hover:shadow-md text-white'
          } transition-all`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        
        <button
          onClick={handleBuyNow}
          // disabled={isOutOfStock}
          className={`flex-1 min-w-24 h-10 sm:h-12 rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-md text-white transition-all`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Buy Now
        </button>
      </div>
      
      {/* Wishlist button */}
      <div className="pt-2">
        <WishlistButton 
          productId={product.id}
          variant="button"
          withText={true}
          size="md"
          className="w-full h-10 sm:h-12"
        />
      </div>
      
      {/* Exchange offer */}
      {/* {product.exchangeOffer?.available && (
        <div className="flex items-start gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Save up to ₹{product.exchangeOffer.maxDiscount} with exchange
            </p>
            <button className="text-xs text-[#ed875a] dark:text-[#ed8c61] font-medium mt-1">
              Check eligibility
            </button>
          </div>
        </div>
      )} */}
      
      {/* Warranty */}
      {product.warranty && (
        <div className="flex items-start gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {product.warranty}
            </p>
            {product.replacementDays && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {product.replacementDays}-Day Replacement
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Seller info */}
      <div className="flex items-start gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Sold by <span className="font-medium text-blue-600 dark:text-blue-400">{product.sellerName}</span>
            {product.sellerRating && (
              <span className="ml-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">
                {product.sellerRating.toFixed(1)} ★
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 