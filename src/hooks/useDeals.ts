'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DealsService } from '../services/dealsService';
import {
  Deal,
  DealType,
  DealFilters,
  DealSortOption,
  ApplyDealRequest,
  DealLimitsRequest,
  DealStats,
  AddProductValidationRequest,
} from '../types/deal';

// Hook for fetching deals with filters and pagination
export const useDeals = (
  filters?: DealFilters,
  sort?: DealSortOption,
  page = 1,
  limit = 20
) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Memoize the filters to prevent infinite loops
  const memoizedFilters = useMemo(() => filters, [
    filters?.type?.join(','),
    filters?.status?.join(','),
    filters?.discountType?.join(','),
    filters?.minDiscount,
    filters?.maxDiscount,
    filters?.search,
    filters?.dateRange?.start,
    filters?.dateRange?.end,
  ]);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getDeals(memoizedFilters, sort, page, limit);
    
    if (result.success) {
      setDeals(result.data || []);
      setPagination(result.pagination);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [memoizedFilters, sort, page, limit]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return {
    deals,
    loading,
    error,
    pagination,
    refetch: fetchDeals,
  };
};

// Hook for fetching a single deal
export const useDeal = (dealId: string) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeal = useCallback(async () => {
    if (!dealId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getDealById(dealId);
    
    if (result.success) {
      setDeal(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  return {
    deal,
    loading,
    error,
    refetch: fetchDeal,
  };
};

// Hook for fetching deals by type (returns products with deals)
export const useDealsByType = (type: DealType) => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getDealsByType(type);
    
    if (result.success) {
      setDeals(result.data || []);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [type]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
  };
};

// Hook for flash deals (returns products with flash deals)
export const useFlashDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getFlashDeals();
    
    if (result.success) {
      setDeals(result.data || []);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFlashDeals();
  }, [fetchFlashDeals]);

  return {
    deals,
    loading,
    error,
    refetch: fetchFlashDeals,
  };
};

// Hook for trending deals (returns products with trending deals)
export const useTrendingDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getTrendingDeals();
    
    if (result.success) {
      setDeals(result.data || []);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrendingDeals();
  }, [fetchTrendingDeals]);

  return {
    deals,
    loading,
    error,
    refetch: fetchTrendingDeals,
  };
};

// Hook for deal of the day (returns a single product with deal)
export const useDealOfTheDay = () => {
  const [deal, setDeal] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDealOfTheDay = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getDealOfTheDay();
    
    if (result.success) {
      setDeal(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDealOfTheDay();
  }, [fetchDealOfTheDay]);

  return {
    deal,
    loading,
    error,
    refetch: fetchDealOfTheDay,
  };
};

// Hook for applying deals
export const useApplyDeal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyDeal = useCallback(async (dealId: string, request: ApplyDealRequest) => {
    setLoading(true);
    setError(null);
    
    const result = await DealsService.applyDeal(dealId, request);
    
    setLoading(false);
    
    if (!result.success) {
      setError(result.error);
    }
    
    return result;
  }, []);

  return {
    applyDeal,
    loading,
    error,
  };
};

// Hook for deal statistics
export const useDealStats = (dealId: string) => {
  const [stats, setStats] = useState<DealStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!dealId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getDealStats(dealId);
    
    if (result.success) {
      setStats(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [dealId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Hook for checking if user can use deal
export const useCanUserUseDeal = (dealId: string, userId: string) => {
  const [canUse, setCanUse] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEligibility = useCallback(async () => {
    if (!dealId || !userId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await DealsService.canUserUseDeal(dealId, userId);
    
    if (result.success) {
      setCanUse(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [dealId, userId]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  return {
    canUse,
    loading,
    error,
    refetch: checkEligibility,
  };
};

// Hook for user deal usage history
export const useUserDealUsage = (userId: string) => {
  const [usage, setUsage] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await DealsService.getUserDealUsage(userId);
    
    if (result.success) {
      setUsage(result.data || []);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    loading,
    error,
    refetch: fetchUsage,
  };
};
