'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : ['https://picsum.photos/id/1/800/800'];
  
  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails - vertical on desktop, horizontal on mobile */}
      <div className="flex md:flex-col order-2 md:order-1 gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0 md:pr-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative min-w-[60px] h-[60px] md:min-w-[80px] md:h-[80px] border-2 rounded overflow-hidden ${
              selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-contain"
            />
          </button>
        ))}
      </div>
      
      {/* Main image with zoom functionality */}
      <div 
        ref={imageContainerRef}
        className="relative order-1 md:order-2 w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-white dark:bg-gray-800 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Regular image (visible when not zoomed) */}
        <Image
          src={displayImages[selectedImageIndex]}
          alt={`${title} - Selected Image`}
          fill
          className={`object-contain transition-opacity duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
          priority
        />
        
        {/* Zoomed image (visible on hover) */}
        {isZoomed && (
          <div 
            className="absolute inset-0 overflow-hidden"
          >
            <div
              className="absolute w-[200%] h-[200%] transition-transform duration-100"
              style={{
                backgroundImage: `url(${displayImages[selectedImageIndex]})`,
                backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                transform: 'scale(1.5)',
                transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                left: '-50%',
                top: '-50%',
                width: '200%',
                height: '200%'
              }}
            />
          </div>
        )}
        
        {/* Navigation arrows for mobile/touch */}
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 