import { AxiosResponse } from 'axios';
import axiosClient from './axios-client';
import { ENDPOINTS } from './endpoints';
import { handleApiError } from './error-handler';
import { PromoBanner, PromoBannerListResponse, BannerPlacement, BannerDevice } from '@/types/promoBanner';

export const promoBannersApi = {
  list: async (params: { placement?: BannerPlacement; device?: BannerDevice } = {}): Promise<PromoBanner[]> => {
    try {
      const res: AxiosResponse<PromoBannerListResponse> = await axiosClient.get(
        ENDPOINTS.PROMO_BANNERS.BASE,
        { params }
      );
      return res.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default promoBannersApi;


