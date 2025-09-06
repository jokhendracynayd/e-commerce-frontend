'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Filter, 
  Grid, 
  List, 
  Search,
  TrendingUp,
  Zap,
  Star,
  Clock,
  Sparkles,
  Gift,
  Award,
  Users,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  Bell,
  Share2,
  Heart,
  Eye,
  Timer,
  Percent,
  Crown,
  Flame,
  Target,
  Rocket,
  AlertCircle
} from 'lucide-react';
import { 
  useDeals, 
  useFlashDeals, 
  useTrendingDeals, 
  useDealOfTheDay 
} from '../../hooks/useDeals';
import { DealFilters, DealSortOption } from '../../types/deal';
import { DealsFilters, DealsGrid, DealsTable, DealsSection } from '../../components/deals';

const DealsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState<DealFilters>({});
  const [sortOption, setSortOption] = useState<DealSortOption>(DealSortOption.NEWEST);
  const [activeTab, setActiveTab] = useState<'all' | 'flash' | 'trending' | 'deal-of-day'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalDeals: 0,
    activeUsers: 1247,
    totalSavings: 0,
    dealsEndingSoon: 0
  });

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch different types of deals
  const { deals: allDeals, loading: allLoading, error: allError } = useDeals(filters, sortOption);
  const { deals: flashDeals, loading: flashLoading, error: flashError } = useFlashDeals();
  const { deals: trendingDeals, loading: trendingLoading, error: trendingError } = useTrendingDeals();
  const { deal: dealOfDay, loading: dayLoading, error: dayError } = useDealOfTheDay();

  const getCurrentDeals = () => {
    switch (activeTab) {
      case 'flash':
        return { deals: flashDeals, loading: flashLoading, error: flashError };
      case 'trending':
        return { deals: trendingDeals, loading: trendingLoading, error: trendingError };
      case 'deal-of-day':
        return { deals: dealOfDay ? [dealOfDay] : [], loading: dayLoading, error: dayError };
      default:
        return { deals: allDeals, loading: allLoading, error: allError };
    }
  };

  const { deals, loading, error } = getCurrentDeals();

  // Update live stats
  useEffect(() => {
    const totalDeals = Array.isArray(allDeals) ? allDeals.length : 0;
    const flashCount = Array.isArray(flashDeals) ? flashDeals.length : 0;
    const trendingCount = Array.isArray(trendingDeals) ? trendingDeals.length : 0;
    const dayCount = dealOfDay ? 1 : 0;
    
    setLiveStats(prev => ({
      ...prev,
      totalDeals: totalDeals + flashCount + trendingCount + dayCount,
      dealsEndingSoon: Math.floor(totalDeals * 0.3), // Simulate 30% ending soon
      totalSavings: Math.floor(totalDeals * 1250) // Simulate average savings
    }));
  }, [allDeals, flashDeals, trendingDeals, dealOfDay]);

  const handleDealClick = (deal: any) => {
    // Navigate to deal details or show modal
    console.log('Deal clicked:', deal);
  };

  const handleApplyDeal = (dealId: string) => {
    // Apply deal logic
    console.log('Apply deal:', dealId);
  };

  const handleShareDeals = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Amazing Deals & Offers',
        text: 'Check out these incredible deals!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Deals', icon: Tag, count: Array.isArray(allDeals) ? allDeals.length : 0 },
    { id: 'flash', label: 'Flash Deals', icon: Zap, count: Array.isArray(flashDeals) ? flashDeals.length : 0 },
    { id: 'trending', label: 'Trending', icon: TrendingUp, count: Array.isArray(trendingDeals) ? trendingDeals.length : 0 },
    { id: 'deal-of-day', label: 'Deal of Day', icon: Star, count: dealOfDay ? 1 : 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 animate-bounce delay-300">
          <Sparkles className="w-8 h-8 text-primary/60" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce delay-700">
          <Gift className="w-6 h-6 text-purple-500/60" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce delay-1000">
          <Award className="w-7 h-7 text-pink-500/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg"
            >
              <Crown className="w-4 h-4" />
              Premium Deals Collection
              <Sparkles className="w-4 h-4" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary to-purple-600 bg-clip-text text-transparent mb-6"
            >
              Amazing Deals & Offers
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Discover incredible savings on your favorite products. Limited time offers that you won't want to miss!
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => setActiveTab('flash')}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                View Flash Deals
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={handleShareDeals}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary/30"
              >
                <Share2 className="w-5 h-5" />
                Share Deals
              </button>
            </motion.div>

            {/* Live Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total Deals</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{liveStats.totalDeals}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% this week
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Active Users</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{liveStats.activeUsers.toLocaleString()}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Live now
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Percent className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total Savings</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{liveStats.totalSavings.toLocaleString()}</div>
                <div className="text-xs text-purple-600 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  Saved today
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Timer className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Ending Soon</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{liveStats.dealsEndingSoon}</div>
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Hurry up!
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Premium Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Sticky Navigation */}
          <div className={`sticky top-4 z-10 transition-all duration-300 ${
            isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-white/20' : ''
          }`}>
            <div className="flex flex-wrap gap-3 justify-center p-4">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-xl'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-primary/30 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <tab.icon className={`w-5 h-5 transition-all ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-600 group-hover:text-primary'
                    }`} />
                    <span className="text-sm md:text-base">{tab.label}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      {tab.count}
                    </span>
                  </div>

                  {/* Hover effect */}
                  {activeTab !== tab.id && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Premium Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Quick Actions Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Quick Filter Pills */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('flash')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'flash'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                }`}
              >
                <Flame className="w-4 h-4" />
                Flash Deals
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'trending'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setActiveTab('deal-of-day')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'deal-of-day'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                }`}
              >
                <Crown className="w-4 h-4" />
                Deal of Day
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1 bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'table'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                Showing {Array.isArray(deals) ? deals.length : 0} deals
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live updates
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                showFilters
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <DealsFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Premium Deals Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span className="text-gray-600 font-medium">Loading amazing deals...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Deals Content */}
          {!loading && !error && (
            <div className="space-y-8">
              {/* View Mode Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-600">Live</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {viewMode === 'grid' ? 'Grid View' : 'Table View'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleShareDeals}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Deals Grid/Table */}
              <div className="relative">
                {viewMode === 'grid' ? (
                <DealsGrid
                  deals={deals}
                  loading={loading}
                  error={error || undefined}
                  onDealClick={handleDealClick}
                  onApplyDeal={handleApplyDeal}
                  columns={3}
                  className="gap-8"
                />
                ) : (
                  <DealsTable
                    deals={deals}
                    loading={loading}
                    error={error || undefined}
                    onDealClick={handleDealClick}
                    onApplyDeal={handleApplyDeal}
                  />
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Premium Special Sections */}
        {activeTab === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 space-y-20"
          >
            {/* Flash Deals Section */}
            {Array.isArray(flashDeals) && flashDeals.length > 0 && (
              <div className="relative">
                {/* Section Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-pink-50 to-orange-50 rounded-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative p-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">⚡ Flash Deals</h2>
                      <p className="text-gray-600">Limited time offers - act fast!</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <Timer className="w-4 h-4" />
                        Ending Soon
                      </div>
                    </div>
                  </div>
                  
                  <DealsSection
                    deals={flashDeals.slice(0, 6)}
                    title=""
                    subtitle=""
                    showViewAll={false}
                    onDealClick={handleDealClick}
                    onApplyDeal={handleApplyDeal}
                    className="bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* Trending Deals Section */}
            {Array.isArray(trendingDeals) && trendingDeals.length > 0 && (
              <div className="relative">
                {/* Section Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-yellow-50 to-red-50 rounded-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">🔥 Trending Deals</h2>
                      <p className="text-gray-600">Most popular deals right now</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        <Target className="w-4 h-4" />
                        Hot Picks
                      </div>
                    </div>
                  </div>
                  
                  <DealsSection
                    deals={trendingDeals.slice(0, 6)}
                    title=""
                    subtitle=""
                    showViewAll={false}
                    onDealClick={handleDealClick}
                    onApplyDeal={handleApplyDeal}
                    className="bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* Deal of the Day Section */}
            {dealOfDay && (
              <div className="relative">
                {/* Section Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">⭐ Deal of the Day</h2>
                      <p className="text-gray-600">Today's special offer - don't miss out!</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4" />
                        Exclusive
                      </div>
                    </div>
                  </div>
                  
                  <DealsSection
                    deals={[dealOfDay]}
                    title=""
                    subtitle=""
                    showViewAll={false}
                    onDealClick={handleDealClick}
                    onApplyDeal={handleApplyDeal}
                    className="bg-transparent"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Premium Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-white/20">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-sm font-medium mb-6 shadow-lg"
              >
                <Rocket className="w-4 h-4" />
                Don't Miss Out
                <Sparkles className="w-4 h-4" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with New Deals
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Get notified about the latest deals and exclusive offers. Never miss a great deal again!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Bell className="w-5 h-5 group-hover:animate-pulse" />
                  Get Deal Alerts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary/30">
                  <Heart className="w-5 h-5" />
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DealsPage;
