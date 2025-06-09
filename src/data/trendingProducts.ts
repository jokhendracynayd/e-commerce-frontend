import { Product } from '@/types/product';

// This mock data would normally come from an API
export const trendingProductsData: Product[] = [
  {
    id: "1",
    title: "Wireless Noise Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    price: 249.99,
    discountPrice: 199.99,
    currency: "USD",
    stockQuantity: 100,
    averageRating: 4.8,
    reviewCount: 245,
    isActive: true,
    isFeatured: true,
    images: [{
      id: "img1",
      imageUrl: "https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg",
      altText: "Wireless Noise Cancelling Headphones",
      position: 0
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    price: 199.99,
    discountPrice: 149.99,
    currency: "USD",
    stockQuantity: 75,
    averageRating: 4.6,
    reviewCount: 189,
    isActive: true,
    isFeatured: true,
    images: [{
      id: "img1",
      imageUrl: "https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg",
      altText: "Smart Fitness Watch",
      position: 0
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Ultra HD Smart TV 55\"",
    slug: "ultra-hd-smart-tv-55",
    price: 899.99,
    discountPrice: 799.99,
    currency: "USD",
    stockQuantity: 50,
    averageRating: 4.7,
    reviewCount: 327,
    isActive: true,
    isFeatured: true,
    images: [{
      id: "img1",
      imageUrl: "https://i.pinimg.com/736x/3d/37/d7/3d37d7aa9787256dda0591dc2c121001.jpg",
      altText: "Ultra HD Smart TV",
      position: 0
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Professional Camera",
    slug: "professional-camera",
    price: 1299.99,
    discountPrice: 1099.99,
    currency: "USD",
    stockQuantity: 30,
    averageRating: 4.9,
    reviewCount: 156,
    isActive: true,
    isFeatured: true,
    images: [{
      id: "img1",
      imageUrl: "https://i.pinimg.com/736x/c9/b3/f1/c9b3f1814dfbc03e9964b429a5e39966.jpg",
      altText: "Professional Camera",
      position: 0
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default trendingProductsData; 