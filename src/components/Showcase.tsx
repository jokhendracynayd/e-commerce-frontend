'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type SlideType = {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  brandLogo: string;
  productImage: string;
  backgroundColor: string;
  accentColor: string;
  link: string;
};

const slides: SlideType[] = [
  {
    id: 1,
    title: 'From Bharat, for all',
    subtitle: 'Coming soon',
    tagline: '#BuiltForYou',
    brandLogo: 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png',
    productImage: '/showcase/smartphone.png',
    backgroundColor: '#000000',
    accentColor: '#1976d2',
    link: '/products/smartphones',
  },
  {
    id: 2,
    title: 'Festival Season Sale',
    subtitle: 'Starts tomorrow',
    tagline: '#BigBillionDays',
    brandLogo: 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png',
    productImage: '/showcase/electronics.png',
    backgroundColor: '#2874f0',
    accentColor: '#ffd700',
    link: '/sale/festival',
  },
  {
    id: 3,
    title: 'New Collection',
    subtitle: 'Premium Fashion',
    tagline: '#StyleYourWay',
    brandLogo: 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png',
    productImage: '/showcase/fashion.png',
    backgroundColor: '#6a1b9a',
    accentColor: '#f48fb1',
    link: '/products/fashion',
  }
];

export function Showcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying]);
  
  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const slide = slides[currentSlide];
  
  return (
    <div className="relative w-full mt-2 h-[350px] md:h-[400px] overflow-hidden">
      <div
        className="relative w-full h-full flex items-center"
        style={{ backgroundColor: slide.backgroundColor }}
      >
        {/* Left arrow navigation */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-2 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Content container */}
        <div className="w-full h-full flex flex-row">
          {/* Product image and brand info - left side */}
          <div className="relative flex-1 flex items-center justify-between px-8 md:px-16">
            {/* Product Image - positioned absolutely */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex items-center justify-center">
              <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
                {/* We're using a placeholder div since we don't have the actual images */}
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <span className="text-sm">Product Image Placeholder</span>
                </div>
              </div>
            </div>
            
            {/* Brand and text info */}
            <div className="z-10 mr-auto">
              <div className="flex items-center space-x-2 mb-3">
                <Image 
                  src={slide.brandLogo} 
                  alt="Brand Logo" 
                  width={80} 
                  height={24} 
                  className="object-contain"
                />
                <span className="text-white text-sm">Unique</span>
              </div>
              <div className="space-y-2 text-white">
                <h2 className="text-2xl font-semibold">{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <p className="text-2xl font-bold">{slide.tagline}</p>
                <div className="text-xs mt-4">
                  <span>Powered by </span>
                  <span className="font-bold">nxt</span>
                  <span className="text-amber-400">★</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Blue accent section - right side */}
          <div 
            className="w-1/4 h-full relative flex items-center justify-center"
            style={{ backgroundColor: slide.accentColor }}
          >
            {/* Decorative elements */}
            <div className="absolute top-1/4 right-8">
              <div className="w-6 h-6 rounded-full bg-yellow-300/80"></div>
            </div>
            <div className="absolute top-1/3 right-16">
              <div className="w-8 h-8 rounded-full bg-yellow-300/90"></div>
            </div>
          </div>
        </div>
        
        {/* Right arrow navigation */}
        <button
          onClick={handleNextSlide}
          className="absolute right-2 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(index);
              }}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 