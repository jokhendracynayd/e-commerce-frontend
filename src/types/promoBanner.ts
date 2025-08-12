export type BannerPlacement =
  | 'HOME_TOP'
  | 'HOME_MIDDLE'
  | 'HOME_BOTTOM'
  | 'CATEGORY'
  | 'PRODUCT'
  | 'CHECKOUT'
  | 'GLOBAL';

export type BannerDevice = 'ALL' | 'DESKTOP' | 'MOBILE';

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  ctaText?: string;
  backgroundColor?: string;
  textColor?: string;
  placement: BannerPlacement;
  device: BannerDevice;
  isActive: boolean;
  sortOrder: number;
  visibleFrom?: string | null;
  visibleTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromoBannerListResponse {
  statusCode: number;
  message: string;
  data: PromoBanner[];
  timestamp: string;
  path: string;
}


