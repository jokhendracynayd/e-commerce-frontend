'use client';

import { useState } from 'react';
import PriceFilter from '@/components/product/filters/PriceFilter';
import RatingFilter from '@/components/product/filters/RatingFilter';
import CheckboxFilter from '@/components/product/filters/CheckboxFilter';
import ActiveFilters from '@/components/product/filters/ActiveFilters';
import Image from 'next/image';
import Link from 'next/link';

export type FilterState = {
  priceRange: [number, number];
  ratings: number[];
  brands: string[];
  availability: string[];
  discount: string[];
  fAssured?: boolean;
  dialShape?: string[];
  displaySize?: string[];
  strapColor?: string[];
  displayType?: string[];
  idealFor?: string[];
  compatibleOS?: string[];
  features?: string[];
  strapMaterial?: string[];
  usage?: string[];
  offers?: string[];
  gstInvoice?: boolean;
};

type FilterSidebarProps = {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  categoryName: string;
  totalProducts: number;
  parentCategory?: string;
  parentCategoryUrl?: string;
};

export default function FilterSidebar({ 
  onFilterChange, 
  initialFilters = {}, 
  categoryName,
  totalProducts,
  parentCategory,
  parentCategoryUrl
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters.priceRange || [0, 50000],
    ratings: initialFilters.ratings || [],
    brands: initialFilters.brands || [],
    availability: initialFilters.availability || [],
    discount: initialFilters.discount || [],
    fAssured: initialFilters.fAssured || false,
    dialShape: initialFilters.dialShape || [],
    displaySize: initialFilters.displaySize || [],
    strapColor: initialFilters.strapColor || [],
    displayType: initialFilters.displayType || [],
    idealFor: initialFilters.idealFor || [],
    compatibleOS: initialFilters.compatibleOS || [],
    features: initialFilters.features || [],
    strapMaterial: initialFilters.strapMaterial || [],
    usage: initialFilters.usage || [],
    offers: initialFilters.offers || [],
    gstInvoice: initialFilters.gstInvoice || false
  });

  // Track which sections are expanded/collapsed
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: false,
    customerRatings: true,
    dialShape: false,
    displaySize: false,
    discount: false,
    strapColor: false,
    displayType: false,
    idealFor: false,
    compatibleOS: false,
    features: false,
    strapMaterial: false,
    usage: false,
    offers: true,
    gstInvoice: false,
    availability: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const updateFilters = (key: keyof FilterState, value: any) => {
    // Check if the value has actually changed before updating
    const currentValue = filters[key];
    const isEqual = Array.isArray(currentValue) && Array.isArray(value)
      ? JSON.stringify(currentValue) === JSON.stringify(value)
      : currentValue === value;
    
    // Only update if the value has changed
    if (!isEqual) {
      const newFilters = {
        ...filters,
        [key]: value
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleRemoveFilter = (filterType: keyof FilterState, value?: string | number) => {
    let newFilters = { ...filters };
    
    if (filterType === 'priceRange') {
      newFilters.priceRange = [0, 50000];
    } else if (value !== undefined && Array.isArray(newFilters[filterType])) {
      // For array-based filters like brands, ratings, etc.
      // Use type assertion to ensure TypeScript knows we're working with an array
      const arrayFilter = newFilters[filterType] as unknown as Array<string | number>;
      newFilters[filterType] = arrayFilter.filter(v => v !== value) as any;
    } else if (typeof newFilters[filterType] === 'boolean') {
      // For boolean filters like fAssured, gstInvoice
      newFilters[filterType] = false as any;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Sample brands for demo
  const brands = [
    { id: 'samsung', name: 'Samsung' },
    { id: 'apple', name: 'Apple' },
    { id: 'mi', name: 'Mi' },
    { id: 'boat', name: 'boAt' },
    { id: 'sony', name: 'Sony' },
    { id: 'fastrack', name: 'Fastrack' },
    { id: 'noise', name: 'Noise' },
    { id: 'fossil', name: 'Fossil' }
  ];

  // Sample availability options
  const availability = [
    { id: 'instock', name: 'In Stock' },
    { id: 'exclude_out_of_stock', name: 'Exclude Out of Stock' }
  ];

  // Sample discount options
  const discountRanges = [
    { id: '10', name: '10% or more' },
    { id: '20', name: '20% or more' },
    { id: '30', name: '30% or more' },
    { id: '40', name: '40% or more' },
    { id: '50', name: '50% or more' },
    { id: '60', name: '60% or more' },
    { id: '70', name: '70% or more' }
  ];

  // Sample dial shapes
  const dialShapes = [
    { id: 'round', name: 'Round' },
    { id: 'square', name: 'Square' },
    { id: 'rectangular', name: 'Rectangular' },
    { id: 'oval', name: 'Oval' }
  ];

  // Sample display sizes
  const displaySizes = [
    { id: 'small', name: 'Small (< 1.5")' },
    { id: 'medium', name: 'Medium (1.5" - 1.75")' },
    { id: 'large', name: 'Large (1.75" - 2.0")' },
    { id: 'extra_large', name: 'Extra Large (> 2.0")' }
  ];

  // Sample strap colors
  const strapColors = [
    { id: 'black', name: 'Black' },
    { id: 'blue', name: 'Blue' },
    { id: 'brown', name: 'Brown' },
    { id: 'gray', name: 'Gray' },
    { id: 'green', name: 'Green' },
    { id: 'pink', name: 'Pink' },
    { id: 'red', name: 'Red' }
  ];

  // Sample display types
  const displayTypes = [
    { id: 'amoled', name: 'AMOLED' },
    { id: 'lcd', name: 'LCD' },
    { id: 'oled', name: 'OLED' },
    { id: 'led', name: 'LED' }
  ];

  // Sample ideal for options
  const idealFor = [
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'boys', name: 'Boys' },
    { id: 'girls', name: 'Girls' },
    { id: 'unisex', name: 'Unisex' }
  ];

  // Sample compatible OS
  const compatibleOS = [
    { id: 'android', name: 'Android' },
    { id: 'ios', name: 'iOS' },
    { id: 'both', name: 'Android & iOS' }
  ];

  // Sample features
  const features = [
    { id: 'heart_rate', name: 'Heart Rate Monitor' },
    { id: 'gps', name: 'GPS' },
    { id: 'bluetooth_calling', name: 'Bluetooth Calling' },
    { id: 'voice_assistant', name: 'Voice Assistant' },
    { id: 'water_resistant', name: 'Water Resistant' },
    { id: 'step_counter', name: 'Step Counter' },
    { id: 'spo2', name: 'SpO2 Monitor' }
  ];

  // Sample strap materials
  const strapMaterials = [
    { id: 'silicone', name: 'Silicone' },
    { id: 'leather', name: 'Leather' },
    { id: 'metal', name: 'Metal' },
    { id: 'nylon', name: 'Nylon' },
    { id: 'plastic', name: 'Plastic' }
  ];

  // Sample usage
  const usageOptions = [
    { id: 'fitness', name: 'Fitness & Outdoor' },
    { id: 'casual', name: 'Casual Wear' },
    { id: 'sports', name: 'Sports' },
    { id: 'business', name: 'Business' }
  ];

  // Sample offers
  const offersOptions = [
    { id: 'buy_more_save_more', name: 'Buy More, Save More' },
    { id: 'special_price', name: 'Special Price' },
    { id: 'bank_offers', name: 'Bank Offers' },
    { id: 'no_cost_emi', name: 'No Cost EMI' }
  ];

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 50000],
      ratings: [],
      brands: [],
      availability: [],
      discount: [],
      fAssured: false,
      dialShape: [],
      displaySize: [],
      strapColor: [],
      displayType: [],
      idealFor: [],
      compatibleOS: [],
      features: [],
      strapMaterial: [],
      usage: [],
      offers: [],
      gstInvoice: false
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Generic section component to avoid repetition
  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-[#f5f1ed] dark:border-[#d44506]/10 py-3">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => toggleSection(sectionKey)}
      >
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</h3>
        <svg 
          className={`w-4 h-4 text-[#ed875a] dark:text-[#ed8c61] transition-transform ${expandedSections[sectionKey] ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {expandedSections[sectionKey] && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-850 shadow-[0_4px_15px_rgba(237,135,90,0.1)] border border-[#f5f1ed] dark:border-[#d44506]/10">
      {/* Filter header with clear all button */}
      <div className="flex items-center justify-between p-4 border-b border-[#f5f1ed] dark:border-[#d44506]/10">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Filters</h2>
        <button 
          onClick={clearAllFilters}
          className="text-xs text-[#ed875a] dark:text-[#ed8c61] hover:text-[#d44506] dark:hover:text-[#ed875a] hover:underline uppercase tracking-wide font-medium"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Active filters (pills) */}
      <div className="px-3 pt-3">
        <ActiveFilters 
          filters={filters} 
          brands={brands} 
          onRemoveFilter={handleRemoveFilter} 
          dialShapes={dialShapes}
          displaySizes={displaySizes}
          strapColors={strapColors}
          displayTypes={displayTypes}
          idealFor={idealFor}
          compatibleOS={compatibleOS}
          features={features}
          strapMaterials={strapMaterials}
          usage={usageOptions}
          offers={offersOptions}
        />
      </div>

      {/* Category navigation */}
      <div className="px-3 py-2 border-b border-[#f5f1ed] dark:border-[#d44506]/10">
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">CATEGORIES</h3>
        {parentCategory && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Link href={parentCategoryUrl || '#'} className="hover:text-[#ed875a] dark:hover:text-[#ed8c61] flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {parentCategory}
            </Link>
          </div>
        )}
        <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-200">
          {categoryName}
        </div>
      </div>

      <div className="p-3 space-y-1">
        {/* Price filter */}
        <FilterSection title="PRICE" sectionKey="price">
          <PriceFilter 
            range={filters.priceRange} 
            onChange={(range: [number, number]) => updateFilters('priceRange', range)} 
            min={0}
            max={50000}
          />
        </FilterSection>

        {/* Assured checkbox */}
        <div className="py-3 border-b border-[#f5f1ed] dark:border-[#d44506]/10">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              checked={filters.fAssured === true}
              onChange={() => updateFilters('fAssured', !filters.fAssured)}
            />
            <div className="w-5 h-5 border border-[#ed875a]/40 dark:border-[#ed8c61]/40 flex items-center justify-center">
              {filters.fAssured && (
                <svg className="w-3 h-3 text-[#ed875a] dark:text-[#ed8c61]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center ml-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium Assured</span>
              <div className="ml-2 text-gray-500 cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </label>
        </div>

        {/* Brand filter */}
        <FilterSection title="BRAND" sectionKey="brand">
          <CheckboxFilter 
            options={brands}
            selectedValues={filters.brands}
            onChange={(brands: string[]) => updateFilters('brands', brands)}
          />
        </FilterSection>

        {/* Customer Rating filter */}
        <FilterSection title="CUSTOMER RATINGS" sectionKey="customerRatings">
          <RatingFilter 
            selectedRatings={filters.ratings}
            onChange={(ratings: number[]) => updateFilters('ratings', ratings)}
          />
        </FilterSection>

        {/* Dial Shape filter */}
        <FilterSection title="DIAL SHAPE" sectionKey="dialShape">
          <CheckboxFilter 
            options={dialShapes}
            selectedValues={filters.dialShape || []}
            onChange={(values: string[]) => updateFilters('dialShape', values)}
          />
        </FilterSection>

        {/* Display Size filter */}
        <FilterSection title="DISPLAY SIZE" sectionKey="displaySize">
          <CheckboxFilter 
            options={displaySizes}
            selectedValues={filters.displaySize || []}
            onChange={(values: string[]) => updateFilters('displaySize', values)}
          />
        </FilterSection>

        {/* Discount filter */}
        <FilterSection title="DISCOUNT" sectionKey="discount">
          <CheckboxFilter 
            options={discountRanges}
            selectedValues={filters.discount}
            onChange={(discount: string[]) => updateFilters('discount', discount)}
          />
        </FilterSection>

        {/* Strap Color filter */}
        <FilterSection title="STRAP COLOR" sectionKey="strapColor">
          <CheckboxFilter 
            options={strapColors}
            selectedValues={filters.strapColor || []}
            onChange={(values: string[]) => updateFilters('strapColor', values)}
          />
        </FilterSection>

        {/* Display Type filter */}
        <FilterSection title="DISPLAY TYPE" sectionKey="displayType">
          <CheckboxFilter 
            options={displayTypes}
            selectedValues={filters.displayType || []}
            onChange={(values: string[]) => updateFilters('displayType', values)}
          />
        </FilterSection>

        {/* Ideal For filter */}
        <FilterSection title="IDEAL FOR" sectionKey="idealFor">
          <CheckboxFilter 
            options={idealFor}
            selectedValues={filters.idealFor || []}
            onChange={(values: string[]) => updateFilters('idealFor', values)}
          />
        </FilterSection>

        {/* Compatible OS filter */}
        <FilterSection title="COMPATIBLE OS" sectionKey="compatibleOS">
          <CheckboxFilter 
            options={compatibleOS}
            selectedValues={filters.compatibleOS || []}
            onChange={(values: string[]) => updateFilters('compatibleOS', values)}
          />
        </FilterSection>

        {/* Features filter */}
        <FilterSection title="FEATURES" sectionKey="features">
          <CheckboxFilter 
            options={features}
            selectedValues={filters.features || []}
            onChange={(values: string[]) => updateFilters('features', values)}
          />
        </FilterSection>

        {/* Strap Material filter */}
        <FilterSection title="STRAP MATERIAL" sectionKey="strapMaterial">
          <CheckboxFilter 
            options={strapMaterials}
            selectedValues={filters.strapMaterial || []}
            onChange={(values: string[]) => updateFilters('strapMaterial', values)}
          />
        </FilterSection>

        {/* Usage filter */}
        <FilterSection title="USAGE" sectionKey="usage">
          <CheckboxFilter 
            options={usageOptions}
            selectedValues={filters.usage || []}
            onChange={(values: string[]) => updateFilters('usage', values)}
          />
        </FilterSection>

        {/* Offers filter */}
        <FilterSection title="OFFERS" sectionKey="offers">
          <CheckboxFilter 
            options={offersOptions}
            selectedValues={filters.offers || []}
            onChange={(values: string[]) => updateFilters('offers', values)}
          />
        </FilterSection>

        {/* GST Invoice Available filter */}
        <FilterSection title="GST INVOICE AVAILABLE" sectionKey="gstInvoice">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              checked={filters.gstInvoice === true}
              onChange={() => updateFilters('gstInvoice', !filters.gstInvoice)}
            />
            <div className="w-5 h-5 border border-[#ed875a]/40 dark:border-[#ed8c61]/40 flex items-center justify-center">
              {filters.gstInvoice && (
                <svg className="w-3 h-3 text-[#ed875a] dark:text-[#ed8c61]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">GST Invoice Available</span>
          </label>
        </FilterSection>

        {/* Availability filter */}
        <FilterSection title="AVAILABILITY" sectionKey="availability">
          <CheckboxFilter 
            options={availability}
            selectedValues={filters.availability}
            onChange={(availability: string[]) => updateFilters('availability', availability)}
          />
        </FilterSection>
      </div>
    </div>
  );
} 