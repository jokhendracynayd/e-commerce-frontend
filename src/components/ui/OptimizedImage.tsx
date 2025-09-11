'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

// Base64 encoded placeholder for better perceived performance
const PLACEHOLDER_BLUR = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  placeholder = 'blur',
  blurDataURL = PLACEHOLDER_BLUR,
  quality = 75,
  loading = 'lazy',
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = (error: any) => {
    setHasError(true);
    onError?.();
  };

  // Error fallback - show a placeholder div
  if (hasError && !imageLoaded) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  }

  // Use regular img tag for maximum reliability
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        ...(fill ? { 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        } : { width, height })
      }}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

// Specialized components for common use cases
export function ProductImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 480px) 120px, (max-width: 640px) 150px, (max-width: 768px) 190px, 250px',
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-contain ${className}`}
      priority={priority}
      sizes={sizes}
      quality={80}
      style={style}
    />
  );
}

export function ListingImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 640px) 320px, (max-width: 768px) 400px, 500px',
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-contain ${className}`}
      sizes={sizes}
      quality={85}
      style={style}
    />
  );
}

export function HeroImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority
      sizes={sizes}
      quality={90}
      style={style}
    />
  );
}
