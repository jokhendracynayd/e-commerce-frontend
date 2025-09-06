import { DealsAPI } from '../lib/api/deals-api';
import {
  Deal,
  DealType,
  DealStatus,
  ApplyDealRequest,
  ApplyDealResponse,
  DealLimitsRequest,
  DealStats,
  AddProductValidationRequest,
  DealFilters,
  DealSortOption,
  DealUsage,
} from '../types/deal';

export class DealsService {
  // Get deals with caching and error handling
  static async getDeals(
    filters?: DealFilters,
    sort?: DealSortOption,
    page = 1,
    limit = 20
  ) {
    try {
      const response = await DealsAPI.getDeals(filters, sort, page, limit);
      
      // Handle backend response structure: { statusCode, message, data: { deals, total, totalPages } }
      const responseData = response.data || response;
      const deals = responseData.deals || [];
      const pagination = {
        total: responseData.total,
        totalPages: responseData.totalPages,
        page: responseData.page || page,
        limit: responseData.limit || limit,
      };
      
      return {
        success: true,
        data: deals,
        pagination: pagination,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        pagination: null,
        error: error.response?.data?.message || 'Failed to fetch deals',
      };
    }
  }

  // Get deal by ID with error handling
  static async getDealById(id: string) {
    try {
      const deal = await DealsAPI.getDealById(id);
      return {
        success: true,
        data: deal,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch deal',
      };
    }
  }

  // Get deals by type with caching
  static async getDealsByType(type: DealType) {
    try {
      const response = await DealsAPI.getDealsByType(type);
      
      // Handle backend response structure: { statusCode, message, data: { products, total, totalPages, page, limit, dealType } }
      const responseData = response.data || response;
      const products = responseData.products || [];
      const pagination = {
        total: responseData.total,
        totalPages: responseData.totalPages,
        page: responseData.page,
        limit: responseData.limit,
      };
      
      return {
        success: true,
        data: products,
        pagination: pagination,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        pagination: null,
        error: error.response?.data?.message || 'Failed to fetch deals by type',
      };
    }
  }

  // Get flash deals
  static async getFlashDeals() {
    try {
      const response = await DealsAPI.getFlashDeals();
      
      // Handle backend response structure: { statusCode, message, data: { products, total, totalPages, page, limit, dealType } }
      const responseData = response.data || response;
      const products = responseData.products || [];
      const pagination = {
        total: responseData.total,
        totalPages: responseData.totalPages,
        page: responseData.page,
        limit: responseData.limit,
      };
      
      return {
        success: true,
        data: products,
        pagination: pagination,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        pagination: null,
        error: error.response?.data?.message || 'Failed to fetch flash deals',
      };
    }
  }

  // Get trending deals
  static async getTrendingDeals() {
    try {
      const response = await DealsAPI.getTrendingDeals();
      
      // Handle backend response structure: { statusCode, message, data: { products, total, totalPages, page, limit, dealType } }
      const responseData = response.data || response;
      const products = responseData.products || [];
      const pagination = {
        total: responseData.total,
        totalPages: responseData.totalPages,
        page: responseData.page,
        limit: responseData.limit,
      };
      
      return {
        success: true,
        data: products,
        pagination: pagination,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        pagination: null,
        error: error.response?.data?.message || 'Failed to fetch trending deals',
      };
    }
  }

  // Get deal of the day
  static async getDealOfTheDay() {
    try {
      const response = await DealsAPI.getDealOfTheDay();
      
      // Handle backend response structure: { statusCode, message, data: { products, total, totalPages, page, limit, dealType } }
      const responseData = response.data || response;
      const products = responseData.products || [];
      
      // For deal of the day, we expect only one product
      const deal = products.length > 0 ? products[0] : null;
      
      return {
        success: true,
        data: deal,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch deal of the day',
      };
    }
  }

  // Apply deal with validation
  static async applyDeal(dealId: string, request: ApplyDealRequest) {
    try {
      const result = await DealsAPI.applyDeal(dealId, request);
      return {
        success: true,
        data: result,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to apply deal',
      };
    }
  }

  // Set deal limits (Admin)
  static async setDealLimits(dealId: string, limits: DealLimitsRequest) {
    try {
      await DealsAPI.setDealLimits(dealId, limits);
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set deal limits',
      };
    }
  }

  // Get deal statistics
  static async getDealStats(dealId: string) {
    try {
      const stats = await DealsAPI.getDealStats(dealId);
      return {
        success: true,
        data: stats,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch deal stats',
      };
    }
  }

  // Add products to deal
  static async addProductsToDeal(dealId: string, productIds: string[]) {
    try {
      await DealsAPI.addProductsToDeal(dealId, productIds);
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add products to deal',
      };
    }
  }

  // Add products with validation
  static async addProductsWithValidation(
    dealId: string,
    request: AddProductValidationRequest
  ) {
    try {
      await DealsAPI.addProductsWithValidation(dealId, request);
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add products with validation',
      };
    }
  }

  // Remove product from deal
  static async removeProductFromDeal(dealId: string, productId: string) {
    try {
      await DealsAPI.removeProductFromDeal(dealId, productId);
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove product from deal',
      };
    }
  }

  // Create deal (Admin)
  static async createDeal(dealData: Partial<Deal>) {
    try {
      const deal = await DealsAPI.createDeal(dealData);
      return {
        success: true,
        data: deal,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to create deal',
      };
    }
  }

  // Update deal (Admin)
  static async updateDeal(dealId: string, dealData: Partial<Deal>) {
    try {
      const deal = await DealsAPI.updateDeal(dealId, dealData);
      return {
        success: true,
        data: deal,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to update deal',
      };
    }
  }

  // Delete deal (Admin)
  static async deleteDeal(dealId: string) {
    try {
      await DealsAPI.deleteDeal(dealId);
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete deal',
      };
    }
  }

  // Get user deal usage
  static async getUserDealUsage(userId: string) {
    try {
      const usage = await DealsAPI.getUserDealUsage(userId);
      return {
        success: true,
        data: usage,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to fetch user deal usage',
      };
    }
  }

  // Check if user can use deal
  static async canUserUseDeal(dealId: string, userId: string) {
    try {
      const canUse = await DealsAPI.canUserUseDeal(dealId, userId);
      return {
        success: true,
        data: canUse,
        error: null,
      };
    } catch (error: any) {
      return {
        success: false,
        data: false,
        error: error.response?.data?.message || 'Failed to check deal eligibility',
      };
    }
  }

  // Utility methods
  static formatDiscountValue(deal: Deal): string {
    if (deal.discountType === 'PERCENTAGE') {
      return `${deal.discountValue}% OFF`;
    } else if (deal.discountType === 'FIXED_AMOUNT') {
      return `₹${deal.discountValue} OFF`;
    } else if (deal.discountType === 'FREE_SHIPPING') {
      return 'FREE SHIPPING';
    } else if (deal.discountType === 'BUY_X_GET_Y') {
      return 'BUY X GET Y';
    }
    return 'SPECIAL OFFER';
  }

  static calculateSavings(originalPrice: number, deal: Deal): number {
    if (deal.discountType === 'PERCENTAGE') {
      return (originalPrice * deal.discountValue) / 100;
    } else if (deal.discountType === 'FIXED_AMOUNT') {
      return Math.min(deal.discountValue, originalPrice);
    }
    return 0;
  }

  static isDealActive(deal: Deal): boolean {
    const now = new Date();
    const startDate = new Date(deal.startDate);
    const endDate = new Date(deal.endDate);
    return deal.isActive && now >= startDate && now <= endDate;
  }

  static getTimeRemaining(endDate: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }
}

export default DealsService;
