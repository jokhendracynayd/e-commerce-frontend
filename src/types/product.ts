export type ColorVariant = {
  id: string;
  color: string;
  hex: string;
  image: string;
};

export type Specification = {
  key: string;
  value: string;
};

export type SpecificationGroup = {
  title: string;
  specs: Specification[];
};

export type ProductReview = {
  id: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
};

export type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  discount?: string;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  isAssured: boolean;
  badges?: string[];
  images: string[];
  colorVariants?: ColorVariant[];
  specificationGroups: SpecificationGroup[];
  highlights: string[];
  deliveryInfo?: string;
  hasFreeDel: boolean;
  replacementDays?: number;
  warranty?: string;
  sellerName: string;
  sellerRating?: number;
  exchangeOffer?: { available: boolean; maxDiscount: number };
  bankOffers?: string[];
  emiOptions?: boolean;
  reviews: ProductReview[];
  relatedProducts?: string[];
  faq?: { question: string; answer: string }[];
}; 