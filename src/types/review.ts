export interface ReviewUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface ReviewProduct {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user?: ReviewUser;
  product?: ReviewProduct;
}

export interface CreateReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
}

export interface EligibleProductForReview {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  product: ReviewProduct;
  quantity: number;
}

export interface PaginatedReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ReviewFilterParams {
  productId?: string;
  userId?: string;
  orderId?: string;
  minRating?: number;
  maxRating?: number;
  verifiedOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating' | 'helpfulCount' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
} 