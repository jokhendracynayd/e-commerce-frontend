export interface RecommendedProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  averageRating: number;
  reviewCount: number;
  currency: string;
  images?: Array<{
    imageUrl: string;
    altText?: string;
  }>;
  brand?: {
    id:string;
    name: string;
    logo?: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface Recommendation {
  id: string;
  userId?: string;
  sessionId?: string;
  productId?: string;
  recommendedProductId: string;
  recommendationType: string; // Prisma's RecommendationType is a string enum
  score: number;
  position?: number;
  algorithmVersion?: string;
  metadata?: Record<string, any>;
  viewed: boolean;
  clicked: boolean;
  converted: boolean;
  expiresAt?: string; // Dates will be strings in JSON
  createdAt: string;
  updatedAt: string;
  recommendedProduct?: RecommendedProduct;
} 