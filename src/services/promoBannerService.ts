import { promoBannersApi } from '@/lib/api/promo-banners-api';
import { PromoBanner } from '@/types/promoBanner';

export async function getHomeTopBanners(): Promise<PromoBanner[]> {
  try {
    return await promoBannersApi.list({ placement: 'HOME_TOP', device: 'ALL' });
  } catch (e) {
    return [];
  }
}


