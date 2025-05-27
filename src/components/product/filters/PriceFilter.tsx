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
    <div className="space-y-5">
      {/* Slider track */}
      <div 
        className="relative h-2 mt-7 mb-5" 
        ref={sliderRef}
        onClick={handleTrackClick}
      >
        {/* Background track */}
        <div 
          className="absolute h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full top-1/2 -translate-y-1/2 cursor-pointer"
          ref={trackRef}
        ></div>
        
        {/* Active track */}
        <div 
          className="absolute h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full top-1/2 -translate-y-1/2 cursor-pointer" 
          style={{ 
            left: `${minPos}%`, 
            right: `${100 - maxPos}%` 
          }}
        ></div>
        
        {/* Min thumb */}
        <div 
          ref={minThumbRef}
          className={`absolute w-4 h-4 bg-white dark:bg-gray-800 border border-blue-500 dark:border-blue-400 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-md ${isDragging === 'min' ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''}`}
          style={{ left: `${minPos}%` }}
          onMouseDown={handleThumbMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
        ></div>
        
        {/* Max thumb */}
        <div 
          ref={maxThumbRef}
          className={`absolute w-4 h-4 bg-white dark:bg-gray-800 border border-blue-500 dark:border-blue-400 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-md ${isDragging === 'max' ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''}`}
          style={{ left: `${maxPos}%` }}
          onMouseDown={handleThumbMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
        ></div>
      </div>
      
      {/* Min/Max Input Dropdowns */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <button 
            onClick={() => {
              setIsMinDropdownOpen(!isMinDropdownOpen);
              setIsMaxDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded py-1.5 px-2 text-xs text-gray-700 dark:text-gray-300"
          >
            <span className="block truncate font-medium">Min {minPrice > 0 ? `₹${minPrice}` : ''}</span>
            <span className="ml-1 pointer-events-none">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          
          {isMinDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
              <ul className="max-h-36 overflow-auto py-1">
                {minOptions.map((option) => (
                  <li 
                    key={option}
                    onClick={() => handleMinOptionSelect(option)}
                    className={`cursor-pointer px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-750 ${option === minPrice ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    ₹{option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <span className="text-xs text-gray-500 dark:text-gray-400">to</span>
        
        <div className="relative flex-1">
          <button 
            onClick={() => {
              setIsMaxDropdownOpen(!isMaxDropdownOpen);
              setIsMinDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded py-1.5 px-2 text-xs text-gray-700 dark:text-gray-300"
          >
            <span className="block truncate font-medium">₹{maxPrice === max ? `${max}+` : maxPrice}</span>
            <span className="ml-1 pointer-events-none">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          
          {isMaxDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
              <ul className="max-h-36 overflow-auto py-1">
                {maxOptions.map((option, index) => (
                  <li 
                    key={option}
                    onClick={() => handleMaxOptionSelect(option)}
                    className={`cursor-pointer px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-750 ${option === maxPrice ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    ₹{maxDisplayOptions[index]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 