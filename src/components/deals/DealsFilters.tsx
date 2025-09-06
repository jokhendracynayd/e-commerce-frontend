'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X,
  Calendar,
  Tag,
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  Crown,
  Flame,
  Target,
  Rocket,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RefreshCw,
  Bookmark,
  Save,
  Eye,
  EyeOff,
  Check,
  Minus,
  Plus,
  Percent
} from 'lucide-react';
import { DealFiltersProps, DealType, DealStatus, DiscountType, DealSortOption } from '../../types/deal';

const DealsFilters: React.FC<DealFiltersProps> = ({
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  className = '',
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    status: false,
    discount: false,
    range: false
  });
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Quick filter presets
  const filterPresets = [
    {
      id: 'flash-deals',
      name: 'Flash Deals',
      icon: Zap,
      color: 'from-red-500 to-pink-500',
      filters: { type: [DealType.FLASH], status: [DealStatus.ACTIVE] }
    },
    {
      id: 'trending-deals',
      name: 'Trending',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      filters: { type: [DealType.TRENDING], status: [DealStatus.ACTIVE] }
    },
    {
      id: 'deal-of-day',
      name: 'Deal of Day',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      filters: { type: [DealType.DEAL_OF_DAY], status: [DealStatus.ACTIVE] }
    },
    {
      id: 'high-discount',
      name: 'High Discount',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      filters: { minDiscount: 50, status: [DealStatus.ACTIVE] }
    },
    {
      id: 'ending-soon',
      name: 'Ending Soon',
      icon: Clock,
      color: 'from-red-500 to-orange-500',
      filters: { status: [DealStatus.ACTIVE] }
    }
  ];

  // Enhanced functionality
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyPreset = (preset: typeof filterPresets[0]) => {
    onFiltersChange(preset.filters);
    setSearchQuery('');
  };

  const saveCurrentFilters = () => {
    const filterString = JSON.stringify(filters);
    if (!savedFilters.includes(filterString)) {
      setSavedFilters(prev => [...prev, filterString]);
    }
  };

  const loadSavedFilters = (filterString: string) => {
    const parsedFilters = JSON.parse(filterString);
    onFiltersChange(parsedFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleSearchFocus = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleTypeChange = (type: DealType, checked: boolean) => {
    const currentTypes = filters.type || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t: DealType) => t !== type);
    onFiltersChange({ ...filters, type: newTypes });
  };

  const handleStatusChange = (status: DealStatus, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter((s: DealStatus) => s !== status);
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handleDiscountTypeChange = (discountType: DiscountType, checked: boolean) => {
    const currentTypes = filters.discountType || [];
    const newTypes = checked
      ? [...currentTypes, discountType]
      : currentTypes.filter((t: DiscountType) => t !== discountType);
    onFiltersChange({ ...filters, discountType: newTypes });
  };

  const handleMinDiscountChange = (value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({ ...filters, minDiscount: numValue });
  };

  const handleMaxDiscountChange = (value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({ ...filters, maxDiscount: numValue });
  };

  const clearFilters = () => {
    setSearchQuery('');
    onFiltersChange({});
  };

  const hasActiveFilters = () => {
    return !!(
      filters.type?.length ||
      filters.status?.length ||
      filters.discountType?.length ||
      filters.minDiscount ||
      filters.maxDiscount ||
      filters.search ||
      filters.dateRange
    );
  };

  return (
    <div className={`bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl border border-white/20 shadow-xl backdrop-blur-sm ${className}`}>
      {/* Premium Header */}
      <div className="p-6 border-b border-gray-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Smart Filters</h3>
              <p className="text-sm text-gray-600">Find the perfect deals for you</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={saveCurrentFilters}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
              title="Save current filters"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSavedFilters(!showSavedFilters)}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
              title="Saved filters"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">Quick Filters</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {filterPresets.map((preset, index) => (
              <motion.button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative p-3 rounded-xl bg-gradient-to-r ${preset.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex flex-col items-center gap-2">
                  <preset.icon className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="text-xs font-medium text-center">{preset.name}</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Search and Sort */}
      <div className="p-6 border-b border-gray-100/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Enhanced Search */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search deals, products, or categories..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Premium Sort */}
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as DealSortOption)}
                className="appearance-none pl-4 pr-10 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md font-medium text-gray-700"
              >
                <option value={DealSortOption.NEWEST}>🆕 Newest First</option>
                <option value={DealSortOption.OLDEST}>📅 Oldest First</option>
                <option value={DealSortOption.HIGHEST_DISCOUNT}>💰 Highest Discount</option>
                <option value={DealSortOption.LOWEST_DISCOUNT}>💵 Lowest Discount</option>
                <option value={DealSortOption.MOST_POPULAR}>🔥 Most Popular</option>
                <option value={DealSortOption.ENDING_SOON}>⏰ Ending Soon</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                showFilters || hasActiveFilters()
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white border-primary shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50 shadow-sm hover:shadow-md'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Advanced</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100/50"
          >
            <div className="p-6">
              {/* Filter Sections */}
              <div className="space-y-6">
                {/* Deal Types Section */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <button
                    onClick={() => toggleSection('type')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Deal Types</h4>
                    </div>
                    {expandedSections.type ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.type && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.values(DealType).map((type) => (
                            <motion.label
                              key={type}
                              whileHover={{ scale: 1.02 }}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                filters.type?.includes(type)
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={filters.type?.includes(type) || false}
                                onChange={(e) => handleTypeChange(type, e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                filters.type?.includes(type)
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              }`}>
                                {filters.type?.includes(type) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{type}</span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Deal Status Section */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <button
                    onClick={() => toggleSection('status')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Status</h4>
                    </div>
                    {expandedSections.status ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.status && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.values(DealStatus).map((status) => (
                            <motion.label
                              key={status}
                              whileHover={{ scale: 1.02 }}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                filters.status?.includes(status)
                                  ? 'border-green-500 bg-green-50 text-green-700'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={filters.status?.includes(status) || false}
                                onChange={(e) => handleStatusChange(status, e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                filters.status?.includes(status)
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {filters.status?.includes(status) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{status}</span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Discount Range Section */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100/50">
                  <button
                    onClick={() => toggleSection('range')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Discount Range</h4>
                    </div>
                    {expandedSections.range ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.range && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum Discount (%)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="0"
                                value={filters.minDiscount || ''}
                                onChange={(e) => handleMinDiscountChange(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Percent className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Discount (%)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="100"
                                value={filters.maxDiscount || ''}
                                onChange={(e) => handleMaxDiscountChange(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Percent className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100/50">
                <div className="flex items-center gap-2">
                  {hasActiveFilters() && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear all filters
                    </motion.button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {Object.keys(filters).filter(key => filters[key as keyof typeof filters]).length} filters active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 border-t border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Active Filters</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {filters.type?.map((type: DealType, index) => (
                <motion.span
                  key={type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all duration-200"
                >
                  <Tag className="w-3 h-3" />
                  {type}
                  <button
                    onClick={() => handleTypeChange(type, false)}
                    className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              
              {filters.status?.map((status: DealStatus, index) => (
                <motion.span
                  key={status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:border-green-300 transition-all duration-200"
                >
                  <Clock className="w-3 h-3" />
                  {status}
                  <button
                    onClick={() => handleStatusChange(status, false)}
                    className="ml-1 p-0.5 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              
              {filters.discountType?.map((type: DiscountType, index) => (
                <motion.span
                  key={type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:border-blue-300 transition-all duration-200"
                >
                  <DollarSign className="w-3 h-3" />
                  {type.replace('_', ' ')}
                  <button
                    onClick={() => handleDiscountTypeChange(type, false)}
                    className="ml-1 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              
              {filters.minDiscount && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200 hover:border-yellow-300 transition-all duration-200"
                >
                  <Percent className="w-3 h-3" />
                  Min: {filters.minDiscount}%
                  <button
                    onClick={() => handleMinDiscountChange('')}
                    className="ml-1 p-0.5 rounded-full hover:bg-yellow-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              
              {filters.maxDiscount && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200 hover:border-yellow-300 transition-all duration-200"
                >
                  <Percent className="w-3 h-3" />
                  Max: {filters.maxDiscount}%
                  <button
                    onClick={() => handleMaxDiscountChange('')}
                    className="ml-1 p-0.5 rounded-full hover:bg-yellow-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              
              {filters.search && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <Search className="w-3 h-3" />
                  "{filters.search}"
                  <button
                    onClick={() => handleSearchChange('')}
                    className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200/50">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DealsFilters;
