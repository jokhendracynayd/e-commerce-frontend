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
  
  // Handle mouse move for zoom effect - disable on mobile/touch devices
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip zoom on small screens
    if (window.innerWidth < 768 || !imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };
  
  return (
    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
      {/* Thumbnails - horizontal on mobile, vertical on desktop */}
      <div className="flex md:flex-col order-2 md:order-1 gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-1 md:pb-0 md:pr-2 scrollbar-thin">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative min-w-[50px] h-[50px] sm:min-w-[60px] sm:h-[60px] md:min-w-[70px] md:h-[70px] border-2 rounded overflow-hidden flex-shrink-0 ${
              selectedImageIndex === index ? 'border-[#ed875a]' : 'border-gray-200 dark:border-gray-700'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 60px, 80px"
            />
          </button>
        ))}
      </div>
      
      {/* Main image with zoom functionality */}
      <div 
        ref={imageContainerRef}
        className="relative order-1 md:order-2 w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden bg-white dark:bg-gray-800 cursor-zoom-in"
        onMouseEnter={() => window.innerWidth >= 768 && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsZoomed(false)} // Ensure zoom is disabled on touch
      >
        {/* Regular image (visible when not zoomed) */}
        <Image
          src={displayImages[selectedImageIndex]}
          alt={`${title} - Selected Image`}
          fill
          className={`object-contain transition-opacity duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 350px, (max-width: 1024px) 450px, 500px"
        />
        
        {/* Zoomed image (visible on hover) - only on desktop */}
        {isZoomed && window.innerWidth >= 768 && (
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
        
        {/* Navigation arrows - make them more visible on mobile */}
        <div className="absolute inset-0 flex items-center justify-between p-2 sm:opacity-0 sm:hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Image counter for mobile */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs sm:hidden">
          {selectedImageIndex + 1} / {displayImages.length}
        </div>
      </div>
      
      {/* Add custom scrollbar styles for thumbnails */}
      <style jsx global>{`
        @media (max-width: 767px) {
          .scrollbar-thin::-webkit-scrollbar {
            height: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(237, 135, 90, 0.3);
            border-radius: 4px;
          }
        }
        @media (min-width: 768px) {
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(237, 135, 90, 0.3);
            border-radius: 4px;
          }
        }
      `}</style>
    </div>
  );
} 