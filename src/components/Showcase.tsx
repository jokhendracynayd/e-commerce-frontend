'use client';

import { useState, useEffect, useMemo } from 'react';
import { HeroImage, OptimizedImage } from '@/components/ui/OptimizedImage';
import Link from 'next/link';
import { getHomeTopBanners } from '@/services/promoBannerService';
import { PromoBanner } from '@/types/promoBanner';

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

const fallbackSlides: SlideType[] = [
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
  const [banners, setBanners] = useState<PromoBanner[] | null>(null);
  
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
  
  useEffect(() => {
    // Fetch promo banners for HOME_TOP; fallback to static slides
    (async () => {
      const data = await getHomeTopBanners();
      setBanners(data && data.length > 0 ? data : []);
    })();
  }, []);

  const slides: SlideType[] = useMemo(() => {
    if (!banners) return fallbackSlides;
    if (banners.length === 0) return fallbackSlides;
    return banners.map((b, idx) => ({
      id: idx + 1,
      title: b.title,
      subtitle: b.subtitle || '',
      tagline: b.ctaText || '',
      brandLogo: b.imageUrl,
      productImage: b.imageUrl,
      backgroundColor: b.backgroundColor || '#000000',
      accentColor: '#1976d2',
      link: b.linkUrl || '#',
    }));
  }, [banners]);

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const slide = slides[currentSlide] || fallbackSlides[0];
  
  return (
    <div className="relative w-full mt-1 sm:mt-2 h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden">
      <div
        className="relative w-full h-full flex items-center"
        style={{ backgroundColor: slide.backgroundColor }}
      >
        {/* Left arrow navigation */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-1 sm:left-2 md:left-4 z-20 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Content container */}
        <div className="w-full h-full flex flex-row relative">
          {/* Background portrait image - covers entire slide */}
          <div className="absolute inset-0 w-full h-full">
            <HeroImage 
              src={slide.productImage}
              alt={slide.title}
              className="object-cover object-center opacity-85"
              style={{ zIndex: 1 }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>
          </div>
          
          {/* Product image and brand info - left side */}
          <div className="relative flex-1 flex items-center justify-between px-3 xs:px-5 sm:px-8 md:px-16" style={{ zIndex: 5 }}>
            {/* Brand and text info */}
            <div className="z-10 mr-auto ml-1 xs:ml-2 sm:ml-4 md:ml-8 lg:ml-16">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2 md:mb-3">
                <div className="relative h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12">
                  <OptimizedImage 
                    src={slide.brandLogo} 
                    alt="Brand Logo" 
                    fill
                    sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                    className="object-cover rounded-full border-2 border-white/70"
                    quality={70}
                  />
                </div>
                <span className="text-white text-xs sm:text-sm">Unique</span>
              </div>
              <div className="space-y-1 sm:space-y-2 text-white drop-shadow-lg">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-semibold font-heading">{slide.title}</h2>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl">{slide.subtitle}</p>
                <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">{slide.tagline}</p>
                <div className="text-[10px] xs:text-xs mt-2 sm:mt-3 md:mt-4">
                  <span>Powered by </span>
                  <span className="font-bold">nxt</span>
                  <span className="text-amber-400">★</span>
                </div>
              </div>
              
              {/* Shop now button - Only visible on md and larger screens */}
              <Link 
                href={slide.link}
                className="hidden md:inline-block mt-5 px-6 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-full transition-all"
              >
                Shop now
              </Link>
            </div>
          </div>
          
          {/* Blue accent section - right side */}
          <div className="absolute right-0 h-full w-12 xs:w-16 sm:w-20 md:w-24 lg:w-32" style={{ zIndex: 3 }}>
            <div 
              className="h-full w-full flex items-center justify-center opacity-75"
              style={{ backgroundColor: slide.accentColor }}
            >
              {/* Decorative elements */}
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 right-3 xs:right-5 sm:right-6 md:right-8">
                  <div className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-yellow-300/80"></div>
                </div>
                <div className="absolute top-1/3 right-2 xs:right-4 sm:right-6 md:right-12">
                  <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-yellow-300/90"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right arrow navigation */}
        <button
          onClick={handleNextSlide}
          className="absolute right-1 sm:right-2 md:right-4 z-20 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Mobile shop now button - Fixed at bottom, only visible on small screens */}
        <Link 
          href={slide.link}
          className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 px-4 py-1.5 xs:px-5 xs:py-2 bg-white/20 hover:bg-white/30 text-white text-xs xs:text-sm font-medium rounded-full transition-all"
        >
          Shop now
        </Link>
        
        {/* Slide indicators */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(index);
              }}
              className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full ${
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