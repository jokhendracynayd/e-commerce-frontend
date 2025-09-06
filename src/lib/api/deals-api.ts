import { axiosClient } from './axios-client';
import { ENDPOINTS } from './endpoints';
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
} from '../../types/deal';

export class DealsAPI {
  // Get all deals with filters and pagination
  static async getDeals(
    filters?: DealFilters,
    sort?: DealSortOption,
    page = 1,
    limit = 20
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.type?.length) {
        params.append('type', filters.type.join(','));
      }
      if (filters.status?.length) {
        params.append('status', filters.status.join(','));
      }
      if (filters.discountType?.length) {
        params.append('discountType', filters.discountType.join(','));
      }
      if (filters.minDiscount !== undefined) {
        params.append('minDiscount', filters.minDiscount.toString());
      }
      if (filters.maxDiscount !== undefined) {
        params.append('maxDiscount', filters.maxDiscount.toString());
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }

    if (sort) {
      params.append('sort', sort);
    }

    const response = await axiosClient.get(`${ENDPOINTS.DEALS.BASE}?${params}`);
    return response.data;
  }

  // Get deal by ID
  static async getDealById(id: string): Promise<Deal> {
    const response = await axiosClient.get(ENDPOINTS.DEALS.DETAIL(id));
    return response.data;
  }

  // Get deals by type (returns products with deals)
  static async getDealsByType(type: DealType) {
    const params = new URLSearchParams({
      status: 'Active',
      limit: '20',
    });
    const endpoint = type === DealType.TRENDING ? ENDPOINTS.DEALS.TRENDING :
                    type === DealType.FLASH ? ENDPOINTS.DEALS.FLASH_DEALS :
                    type === DealType.DEAL_OF_DAY ? ENDPOINTS.DEALS.DEAL_OF_DAY :
                    ENDPOINTS.DEALS.BY_TYPE(type);
    const response = await axiosClient.get(`${endpoint}?${params}`);
    return response.data;
  }

  // Get flash deals (returns products with flash deals)
  static async getFlashDeals() {
    const params = new URLSearchParams({
      status: 'Active',
      limit: '20',
    });
    const response = await axiosClient.get(`${ENDPOINTS.DEALS.FLASH_DEALS}?${params}`);
    return response.data;
  }

  // Get trending deals (returns products with trending deals)
  static async getTrendingDeals() {
    const params = new URLSearchParams({
      status: 'Active',
      limit: '20',
    });
    const response = await axiosClient.get(`${ENDPOINTS.DEALS.TRENDING}?${params}`);
    return response.data;
  }

  // Get deal of the day (returns products with deal of the day)
  static async getDealOfTheDay() {
    const params = new URLSearchParams({
      status: 'Active',
      limit: '1',
    });
    const response = await axiosClient.get(`${ENDPOINTS.DEALS.DEAL_OF_DAY}?${params}`);
    return response.data;
  }

  // Apply deal
  static async applyDeal(
    dealId: string,
    request: ApplyDealRequest
  ): Promise<ApplyDealResponse> {
    const response = await axiosClient.post(
      ENDPOINTS.DEALS.APPLY(dealId),
      request
    );
    return response.data;
  }

  // Set deal limits (Admin only)
  static async setDealLimits(
    dealId: string,
    limits: DealLimitsRequest
  ): Promise<void> {
    await axiosClient.post(ENDPOINTS.DEALS.LIMITS(dealId), limits);
  }

  // Get deal statistics
  static async getDealStats(dealId: string): Promise<DealStats> {
    const response = await axiosClient.get(ENDPOINTS.DEALS.STATS(dealId));
    return response.data;
  }

  // Add products to deal
  static async addProductsToDeal(
    dealId: string,
    productIds: string[]
  ): Promise<void> {
    await axiosClient.post(ENDPOINTS.DEALS.ADD_PRODUCTS(dealId), {
      productIds,
    });
  }

  // Add products to deal with validation
  static async addProductsWithValidation(
    dealId: string,
    request: AddProductValidationRequest
  ): Promise<void> {
    await axiosClient.post(
      ENDPOINTS.DEALS.ADD_PRODUCTS_VALIDATE(dealId),
      request
    );
  }

  // Remove product from deal
  static async removeProductFromDeal(
    dealId: string,
    productId: string
  ): Promise<void> {
    await axiosClient.delete(
      ENDPOINTS.DEALS.REMOVE_PRODUCT(dealId, productId)
    );
  }

  // Create new deal (Admin only)
  static async createDeal(dealData: Partial<Deal>): Promise<Deal> {
    const response = await axiosClient.post(ENDPOINTS.DEALS.BASE, dealData);
    return response.data;
  }

  // Update deal (Admin only)
  static async updateDeal(dealId: string, dealData: Partial<Deal>): Promise<Deal> {
    const response = await axiosClient.put(
      ENDPOINTS.DEALS.DETAIL(dealId),
      dealData
    );
    return response.data;
  }

  // Delete deal (Admin only)
  static async deleteDeal(dealId: string): Promise<void> {
    await axiosClient.delete(ENDPOINTS.DEALS.DETAIL(dealId));
  }

  // Get user's deal usage history
  static async getUserDealUsage(userId: string) {
    const response = await axiosClient.get(`/deals/user/${userId}/usage`);
    return response.data;
  }

  // Check if user can use deal
  static async canUserUseDeal(dealId: string, userId: string): Promise<boolean> {
    const response = await axiosClient.get(
      `/deals/${dealId}/can-use/${userId}`
    );
    return response.data.canUse;
  }
}

export default DealsAPI;
