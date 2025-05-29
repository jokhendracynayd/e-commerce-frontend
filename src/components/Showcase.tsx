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
    brandLogo: 'https://img.freepik.com/free-photo/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera_1258-118763.jpg?semt=ais_items_boosted&w=740',
    productImage: 'https://img.freepik.com/free-photo/shopping-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-smiling-looking-camera_1258-118763.jpg?semt=ais_items_boosted&w=740',
    backgroundColor: '#000000',
    accentColor: '#1976d2',
    link: '/products/smartphones',
  },
  {
    id: 2,
    title: 'Festival Season Sale',
    subtitle: 'Starts tomorrow',
    tagline: '#BigBillionDays',
    brandLogo: 'https://img.freepik.com/free-photo/concept-holidays-celebration-young-man-looking-surprised-as-take-out-gift-from-shopping-bag-s_1258-155541.jpg?ga=GA1.1.1106494499.1748528192&semt=ais_items_boosted&w=740',
    productImage: 'https://img.freepik.com/free-photo/concept-holidays-celebration-young-man-looking-surprised-as-take-out-gift-from-shopping-bag-s_1258-155541.jpg?ga=GA1.1.1106494499.1748528192&semt=ais_items_boosted&w=740',
    backgroundColor: '#868845',
    accentColor: '#ffd700',
    link: '/sale/festival',
  },
  {
    id: 3,
    title: 'New Collection',
    subtitle: 'Premium Fashion',
    tagline: '#StyleYourWay',
    brandLogo: 'https://img.freepik.com/free-photo/rear-view-man-hiding-gift-from-her-girlfriend-pink-background_23-2147890370.jpg?ga=GA1.1.1106494499.1748528192&semt=ais_items_boosted&w=740',
    productImage: 'https://img.freepik.com/free-photo/rear-view-man-hiding-gift-from-her-girlfriend-pink-background_23-2147890370.jpg?ga=GA1.1.1106494499.1748528192&semt=ais_items_boosted&w=740',
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
          className="absolute left-2 z-20 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Content container */}
        <div className="w-full h-full flex flex-row relative">
          {/* Background portrait image - covers entire slide */}
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src={slide.productImage}
              alt={slide.title}
              fill
              priority
              className="object-cover object-center opacity-85"
              style={{ zIndex: 1 }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>
          </div>
          
          {/* Product image and brand info - left side */}
          <div className="relative flex-1 flex items-center justify-between px-8 md:px-16" style={{ zIndex: 5 }}>
            {/* Brand and text info */}
            <div className="z-10 mr-auto ml-4 md:ml-8 lg:ml-16">
              <div className="flex items-center space-x-2 mb-3">
                <Image 
                  src={slide.brandLogo} 
                  alt="Brand Logo" 
                  width={60}
                  height={60}
                  className="object-cover rounded-full h-12 w-12 border-2 border-white/70"
                />
                <span className="text-white text-sm">Unique</span>
              </div>
              <div className="space-y-2 text-white drop-shadow-lg">
                <h2 className="text-3xl md:text-4xl font-semibold font-heading">{slide.title}</h2>
                <p className="text-lg md:text-xl">{slide.subtitle}</p>
                <p className="text-2xl md:text-3xl font-bold">{slide.tagline}</p>
                <div className="text-xs mt-4">
                  <span>Powered by </span>
                  <span className="font-bold">nxt</span>
                  <span className="text-amber-400">★</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Blue accent section - right side */}
          <div className="absolute right-0 h-full w-24 md:w-32" style={{ zIndex: 3 }}>
            <div 
              className="h-full w-full flex items-center justify-center opacity-75"
              style={{ backgroundColor: slide.accentColor }}
            >
              {/* Decorative elements */}
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 right-8">
                  <div className="w-6 h-6 rounded-full bg-yellow-300/80"></div>
                </div>
                <div className="absolute top-1/3 right-6 md:right-12">
                  <div className="w-8 h-8 rounded-full bg-yellow-300/90"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right arrow navigation */}
        <button
          onClick={handleNextSlide}
          className="absolute right-2 z-20 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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