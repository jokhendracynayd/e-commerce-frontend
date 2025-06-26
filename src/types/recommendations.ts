// Recommendation Types - Following the backend implementation

export enum RecommendationType {
  PERSONALIZED = 'PERSONALIZED',
  SIMILAR_PRODUCTS = 'SIMILAR_PRODUCTS', 
  FREQUENTLY_BOUGHT_TOGETHER = 'FREQUENTLY_BOUGHT_TOGETHER',
  TRENDING = 'TRENDING',
  RECENTLY_VIEWED = 'RECENTLY_VIEWED',
  TOP_RATED = 'TOP_RATED',
  BESTSELLERS = 'BESTSELLERS',
  NEW_ARRIVALS = 'NEW_ARRIVALS',
  SEASONAL = 'SEASONAL',
  PRICE_DROP = 'PRICE_DROP',
  CATEGORY_TRENDING = 'CATEGORY_TRENDING'
}

export interface RecommendationQueryDto {
  type: RecommendationType;
  userId?: string;
  sessionId?: string;
  productId?: string;
  categoryId?: string;
  limit?: number;
  includeProduct?: boolean;
}

export interface RecommendationResponseDto {
  id: string;
  productId: string;
  score: number;
  recommendationType: string;
  position?: number;
  metadata?: Record<string, any>;
  product?: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
    brand?: {
      id: string;
      name: string;
      slug: string;
    };
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface GetRecommendationsParams {
  type: RecommendationType;
  userId?: string;
  sessionId?: string;
  productId?: string;
  categoryId?: string;
  limit?: number;
  includeProduct?: boolean;
} 