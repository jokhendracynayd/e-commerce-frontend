'use client';

import { FilterState } from './FilterSidebar';

type ActiveFiltersProps = {
  filters: FilterState;
  brands: Array<{ id: string, name: string }>;
  onRemoveFilter: (filterType: keyof FilterState, value?: string | number) => void;
  // Additional option arrays for the new filter types
  dialShapes?: Array<{ id: string, name: string }>;
  displaySizes?: Array<{ id: string, name: string }>;
  strapColors?: Array<{ id: string, name: string }>;
  displayTypes?: Array<{ id: string, name: string }>;
  idealFor?: Array<{ id: string, name: string }>;
  compatibleOS?: Array<{ id: string, name: string }>;
  features?: Array<{ id: string, name: string }>;
  strapMaterials?: Array<{ id: string, name: string }>;
  usage?: Array<{ id: string, name: string }>;
  offers?: Array<{ id: string, name: string }>;
};

export default function ActiveFilters({ 
  filters, 
  brands,
  onRemoveFilter,
  dialShapes = [],
  displaySizes = [],
  strapColors = [],
  displayTypes = [],
  idealFor = [],
  compatibleOS = [],
  features = [],
  strapMaterials = [],
  usage = [],
  offers = []
}: ActiveFiltersProps) {
  // Check if any filters are active
  const hasActiveFilters = 
    filters.ratings.length > 0 || 
    filters.brands.length > 0 || 
    filters.availability.length > 0 || 
    filters.discount.length > 0 ||
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) ||
    filters.fAssured === true ||
    (filters.dialShape && filters.dialShape.length > 0) ||
    (filters.displaySize && filters.displaySize.length > 0) ||
    (filters.strapColor && filters.strapColor.length > 0) ||
    (filters.displayType && filters.displayType.length > 0) ||
    (filters.idealFor && filters.idealFor.length > 0) ||
    (filters.compatibleOS && filters.compatibleOS.length > 0) ||
    (filters.features && filters.features.length > 0) ||
    (filters.strapMaterial && filters.strapMaterial.length > 0) ||
    (filters.usage && filters.usage.length > 0) ||
    (filters.offers && filters.offers.length > 0) ||
    filters.gstInvoice === true;

  if (!hasActiveFilters) return null;

  // Helper function to render filter pills for array-based filters
  const renderArrayFilterPills = (
    filterKey: keyof FilterState, 
    options: Array<{ id: string, name: string }>,
    labelSuffix: string = ''
  ) => {
    const values = filters[filterKey] as string[] | undefined;
    if (!values || values.length === 0) return null;

    return values.map(value => {
      const option = options.find(o => o.id === value);
      return option ? (
        <div 
          key={`${filterKey}-${value}`}
          className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
        >
          <span className="mr-1 font-medium">{option.name}{labelSuffix}</span>
          <button 
            onClick={() => onRemoveFilter(filterKey, value)}
            className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : null;
    });
  };

  return (
    <div className="mb-3">
      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-1.5">
          {/* Price Range Pill */}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
            <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              <span className="mr-1 font-medium">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
              </span>
              <button
                onClick={() => onRemoveFilter('priceRange')}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Ratings Pills */}
          {filters.ratings.map((rating) => (
            <div
              key={`rating-${rating}`}
              className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
            >
              <span className="flex items-center mr-1 font-medium">
                {rating}
                <svg className="w-2.5 h-2.5 ml-0.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                & Up
              </span>
              <button
                onClick={() => onRemoveFilter('ratings', rating)}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}

          {/* Brand Pills */}
          {filters.brands.map((brandId) => {
            const brand = brands.find((b) => b.id === brandId);
            return (
              <div
                key={`brand-${brandId}`}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
              >
                <span className="mr-1 font-medium">{brand ? brand.name : brandId}</span>
                <button
                  onClick={() => onRemoveFilter('brands', brandId)}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            );
          })}

          {/* Boolean feature pills */}
          {filters.fAssured && (
            <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              <span className="mr-1">F-Assured</span>
              <button
                onClick={() => onRemoveFilter('fAssured')}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Add similar patterns for other filter categories */}
          {renderArrayFilterPills('dialShape', dialShapes)}
          {renderArrayFilterPills('displaySize', displaySizes)}
          {renderArrayFilterPills('strapColor', strapColors)}
          {renderArrayFilterPills('displayType', displayTypes)}
          {renderArrayFilterPills('idealFor', idealFor)}
          {renderArrayFilterPills('compatibleOS', compatibleOS)}
          {renderArrayFilterPills('features', features)}
          {renderArrayFilterPills('strapMaterial', strapMaterials)}
          {renderArrayFilterPills('usage', usage)}
          {renderArrayFilterPills('offers', offers)}
          
          {filters.gstInvoice && (
            <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              <span className="mr-1">GST Invoice</span>
              <button
                onClick={() => onRemoveFilter('gstInvoice')}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {filters.availability.map((availId) => {
            const availOption = [
              { id: 'instock', name: 'In Stock' },
              { id: 'exclude_out_of_stock', name: 'Exclude Out of Stock' },
            ].find((o) => o.id === availId);
            
            return (
              <div
                key={`avail-${availId}`}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
              >
                <span className="mr-1">{availOption ? availOption.name : availId}</span>
                <button
                  onClick={() => onRemoveFilter('availability', availId)}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            );
          })}

          {filters.discount.map((discountVal) => (
            <div
              key={`discount-${discountVal}`}
              className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
            >
              <span className="mr-1">{discountVal}% or more</span>
              <button
                onClick={() => onRemoveFilter('discount', discountVal)}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
} 