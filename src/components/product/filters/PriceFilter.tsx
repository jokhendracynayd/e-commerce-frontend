'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type PriceFilterProps = {
  range: [number, number];
  onChange: (range: [number, number]) => void;
  min: number;
  max: number;
};

export default function PriceFilter({ range, onChange, min, max }: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState(range[0]);
  const [maxPrice, setMaxPrice] = useState(range[1]);
  const [isMinDropdownOpen, setIsMinDropdownOpen] = useState(false);
  const [isMaxDropdownOpen, setIsMaxDropdownOpen] = useState(false);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Keep track of previous values to prevent unnecessary updates
  const prevRangeRef = useRef<[number, number]>(range);
  const isUserChange = useRef(false);

  // Price options for dropdown (similar to Flipkart)
  const minOptions = [min, 1000, 5000, 10000, 15000, 20000];
  const maxOptions = [5000, 10000, 15000, 20000, 25000, max];
  // The "+" is just for display purposes
  const maxDisplayOptions = [5000, 10000, 15000, 20000, 25000, `${max}+`];

  // Update component state when props change
  useEffect(() => {
    // Only update local state if the incoming range is different from our current state
    // AND it's not coming from a user interaction we already handled
    if ((range[0] !== minPrice || range[1] !== maxPrice) && !isUserChange.current) {
      setMinPrice(range[0]);
      setMaxPrice(range[1]);
    }
    
    // Reset the user change flag after processing prop changes
    isUserChange.current = false;
  }, [range, minPrice, maxPrice]);

  // Calculate slider positions
  const getPercentage = (value: number) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  // Convert percentage position to price value
  const getValueFromPosition = useCallback((position: number) => {
    // Clamp position between 0 and 100
    const clampedPosition = Math.max(0, Math.min(100, position));
    // Calculate the corresponding value
    const rawValue = min + (clampedPosition / 100) * (max - min);
    // Round to nearest 100
    return Math.round(rawValue / 100) * 100;
  }, [min, max]);

  const minPos = getPercentage(minPrice);
  const maxPos = getPercentage(maxPrice);

  // Apply filter when min or max price changes
  useEffect(() => {
    // Only apply if min <= max (avoid overlapping)
    if (minPrice <= maxPrice) {
      const newRange: [number, number] = [minPrice, maxPrice];
      
      // Only call onChange if the values actually changed from previous
      if (prevRangeRef.current[0] !== newRange[0] || prevRangeRef.current[1] !== newRange[1]) {
        prevRangeRef.current = newRange;
        isUserChange.current = true;
        onChange(newRange);
      }
    }
  }, [minPrice, maxPrice, onChange]);

  const handleMinOptionSelect = (value: number) => {
    const newMin = Math.min(value, maxPrice);
    if (newMin !== minPrice) {
      isUserChange.current = true;
      setMinPrice(newMin);
    }
    setIsMinDropdownOpen(false);
  };

  const handleMaxOptionSelect = (value: number) => {
    const newMax = Math.max(value, minPrice);
    if (newMax !== maxPrice) {
      isUserChange.current = true;
      setMaxPrice(newMax);
    }
    setIsMaxDropdownOpen(false);
  };

  // Handle starting to drag a thumb
  const handleThumbMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  // Handle mouse movement during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    // Get slider dimensions
    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const sliderLeft = rect.left;
    
    // Calculate position as percentage of slider width
    let position = ((e.clientX - sliderLeft) / sliderWidth) * 100;
    position = Math.max(0, Math.min(100, position));
    
    // Calculate new price value
    const newValue = getValueFromPosition(position);
    
    // Update the correct thumb's position
    if (isDragging === 'min') {
      // Don't let min thumb go past max thumb
      const newMinPrice = Math.min(newValue, maxPrice);
      if (newMinPrice !== minPrice) {
        isUserChange.current = true;
        setMinPrice(newMinPrice);
      }
    } else {
      // Don't let max thumb go before min thumb
      const newMaxPrice = Math.max(newValue, minPrice);
      if (newMaxPrice !== maxPrice) {
        isUserChange.current = true;
        setMaxPrice(newMaxPrice);
      }
    }
  }, [isDragging, minPrice, maxPrice, getValueFromPosition]);

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Handle touch events for mobile devices
  const handleTouchStart = (thumb: 'min' | 'max') => (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !sliderRef.current || e.touches.length === 0) return;
    
    // Get the first touch
    const touch = e.touches[0];
    
    // Get slider dimensions
    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const sliderLeft = rect.left;
    
    // Calculate position as percentage of slider width
    let position = ((touch.clientX - sliderLeft) / sliderWidth) * 100;
    position = Math.max(0, Math.min(100, position));
    
    // Calculate new price value
    const newValue = getValueFromPosition(position);
    
    // Update the correct thumb's position
    if (isDragging === 'min') {
      // Don't let min thumb go past max thumb
      const newMinPrice = Math.min(newValue, maxPrice);
      if (newMinPrice !== minPrice) {
        isUserChange.current = true;
        setMinPrice(newMinPrice);
      }
    } else {
      // Don't let max thumb go before min thumb
      const newMaxPrice = Math.max(newValue, minPrice);
      if (newMaxPrice !== maxPrice) {
        isUserChange.current = true;
        setMaxPrice(newMaxPrice);
      }
    }
  }, [isDragging, minPrice, maxPrice, getValueFromPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add and remove event listeners for drag and touch
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
      
      // Prevent selection during drag
      document.body.style.userSelect = 'none';
      document.body.style.overflow = 'hidden'; // Prevent scrolling on mobile
    } else {
      // Mouse events
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Touch events
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      
      // Restore normal behavior
      document.body.style.userSelect = '';
      document.body.style.overflow = '';
    }
    
    return () => {
      // Mouse events
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Touch events
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      
      // Restore normal behavior
      document.body.style.userSelect = '';
      document.body.style.overflow = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Handle click on the track to move the closest thumb
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    // Get slider dimensions
    const rect = sliderRef.current.getBoundingClientRect();
    const clickPosition = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = getValueFromPosition(clickPosition);
    
    // Determine which thumb to move (whichever is closer)
    const minDistance = Math.abs(clickPosition - minPos);
    const maxDistance = Math.abs(clickPosition - maxPos);
    
    if (minDistance <= maxDistance) {
      // Move min thumb
      isUserChange.current = true;
      setMinPrice(Math.min(newValue, maxPrice));
    } else {
      // Move max thumb
      isUserChange.current = true;
      setMaxPrice(Math.max(newValue, minPrice));
    }
  };

  return (
    <div className="pb-4">
      {/* Selected price range display */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Min price dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsMinDropdownOpen(!isMinDropdownOpen);
              setIsMaxDropdownOpen(false);
            }}
            className="inline-flex items-center px-3 py-1.5 text-xs border border-[#ed875a]/20 dark:border-[#ed8c61]/20 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#ed875a] dark:hover:border-[#ed8c61]"
            type="button"
          >
            ₹{minPrice.toLocaleString('en-IN')}
            <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          {isMinDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 border border-[#ed875a]/20 dark:border-[#ed8c61]/20 w-auto shadow-lg">
              <ul className="text-xs text-gray-700 dark:text-gray-300">
                {minOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleMinOptionSelect(option)}
                      className={`block w-full px-4 py-2 text-left hover:bg-[#f5f1ed] dark:hover:bg-[#d44506]/10 ${
                        option === minPrice ? 'bg-[#f5f1ed] dark:bg-[#d44506]/10 text-[#ed875a] dark:text-[#ed8c61] font-medium' : ''
                      }`}
                    >
                      ₹{option.toLocaleString('en-IN')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <span className="text-xs text-gray-500">to</span>

        {/* Max price dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsMaxDropdownOpen(!isMaxDropdownOpen);
              setIsMinDropdownOpen(false);
            }}
            className="inline-flex items-center px-3 py-1.5 text-xs border border-[#ed875a]/20 dark:border-[#ed8c61]/20 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#ed875a] dark:hover:border-[#ed8c61]"
            type="button"
          >
            ₹{maxPrice.toLocaleString('en-IN')}
            <svg className="w-2.5 h-2.5 ml-2" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          {isMaxDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 border border-[#ed875a]/20 dark:border-[#ed8c61]/20 w-auto shadow-lg">
              <ul className="text-xs text-gray-700 dark:text-gray-300">
                {maxOptions.map((option, index) => (
                  <li key={option}>
                    <button
                      onClick={() => handleMaxOptionSelect(option)}
                      className={`block w-full px-4 py-2 text-left hover:bg-[#f5f1ed] dark:hover:bg-[#d44506]/10 ${
                        option === maxPrice ? 'bg-[#f5f1ed] dark:bg-[#d44506]/10 text-[#ed875a] dark:text-[#ed8c61] font-medium' : ''
                      }`}
                    >
                      ₹{maxDisplayOptions[index]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Price range slider */}
      <div 
        ref={sliderRef} 
        className="relative h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Active track */}
        <div 
          ref={trackRef}
          className="absolute h-full bg-[#ed875a] dark:bg-[#ed8c61]" 
          style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
        />
        
        {/* Min thumb */}
        <div 
          ref={minThumbRef}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-[#ed875a] dark:border-[#ed8c61] transform -translate-x-1/2 cursor-grab"
          style={{ left: `${minPos}%` }}
          onMouseDown={handleThumbMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minPrice}
          aria-label="Minimum price"
        />
        
        {/* Max thumb */}
        <div 
          ref={maxThumbRef}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-[#ed875a] dark:border-[#ed8c61] transform -translate-x-1/2 cursor-grab"
          style={{ left: `${maxPos}%` }}
          onMouseDown={handleThumbMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxPrice}
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
} 