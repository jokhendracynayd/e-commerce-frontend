'use client';

import { useState, useEffect, useCallback } from 'react';
import { DealsService } from '../services/dealsService';
import { Deal, DealStatus } from '../types/deal';
import { Product } from '../types/product';

interface UseProductDealsOptions {
  productId?: string;
  productIds?: string[];
  enabled?: boolean;
}

interface UseProductDealsReturn {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  getDealForProduct: (productId: string) => Deal | null;
  getBestDealForProduct: (productId: string) => Deal | null;
  calculateSavings: (product: Product, deal: Deal) => number;
  calculateFinalPrice: (product: Product, deal: Deal) => number;
  refetch: () => void;
}

export const useProductDeals = ({
  productId,
  productIds,
  enabled = true,
}: UseProductDealsOptions = {}): UseProductDealsReturn => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // If specific product IDs are provided, fetch deals for those products
      if (productIds && productIds.length > 0) {
        const allDeals: Deal[] = [];
        
        for (const id of productIds) {
          const result = await DealsService.getDealsByType('FLASH' as any);
          if (result.success && result.data) {
            allDeals.push(...result.data);
          }
        }
        
        setDeals(allDeals);
      } else {
        // Fetch all active deals
        const result = await DealsService.getDeals({
          status: [DealStatus.ACTIVE],
        });
        
        if (result.success) {
          setDeals(result.data || []);
        } else {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  }, [enabled, productIds]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const getDealForProduct = useCallback((productId: string): Deal | null => {
    return deals.find(deal => 
      deal.products?.some(productDeal => productDeal.productId === productId)
    ) || null;
  }, [deals]);

  const getBestDealForProduct = useCallback((productId: string): Deal | null => {
    const productDeals = deals.filter(deal => 
      deal.products?.some(productDeal => productDeal.productId === productId)
    );

    if (productDeals.length === 0) return null;

    // Sort by discount value (highest first)
    return productDeals.sort((a, b) => {
      const aValue = a.discountType === 'PERCENTAGE' ? a.discountValue : 0;
      const bValue = b.discountType === 'PERCENTAGE' ? b.discountValue : 0;
      return bValue - aValue;
    })[0];
  }, [deals]);

  const calculateSavings = useCallback((product: Product, deal: Deal): number => {
    return DealsService.calculateSavings(product.price, deal);
  }, []);

  const calculateFinalPrice = useCallback((product: Product, deal: Deal): number => {
    const savings = calculateSavings(product, deal);
    return Math.max(0, product.price - savings);
  }, [calculateSavings]);

  return {
    deals,
    loading,
    error,
    getDealForProduct,
    getBestDealForProduct,
    calculateSavings,
    calculateFinalPrice,
    refetch: fetchDeals,
  };
};

// Hook for getting deals for a specific product
export const useProductDeal = (productId: string) => {
  const { getDealForProduct, getBestDealForProduct, ...rest } = useProductDeals({
    productId,
    enabled: !!productId,
  });

  const deal = getDealForProduct(productId);
  const bestDeal = getBestDealForProduct(productId);

  return {
    ...rest,
    deal,
    bestDeal,
  };
};

// Hook for getting deals for multiple products
export const useProductsDeals = (productIds: string[]) => {
  const { deals, loading, error, getDealForProduct, getBestDealForProduct, ...rest } = useProductDeals({
    productIds,
    enabled: productIds.length > 0,
  });

  const productDeals = productIds.map(id => ({
    productId: id,
    deal: getDealForProduct(id),
    bestDeal: getBestDealForProduct(id),
  }));

  return {
    ...rest,
    deals,
    loading,
    error,
    productDeals,
  };
};
