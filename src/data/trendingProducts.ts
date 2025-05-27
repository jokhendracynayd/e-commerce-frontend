import { Product } from '@/components/product/TrendingProducts';

// This mock data would normally come from an API
export const trendingProductsData: Product[] = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 249.99,
    discountPrice: 199.99,
    rating: 4.8,
    reviewCount: 245,
    imageSrc: "https://picsum.photos/id/367/300/300",
    badge: "Trending",
    slug: "wireless-noise-cancelling-headphones"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    discountPrice: 149.99,
    rating: 4.6,
    reviewCount: 189,
    imageSrc: "https://picsum.photos/id/175/300/300",
    badge: "20% Off",
    slug: "smart-fitness-watch"
  },
  {
    id: 3,
    name: "Ultra HD Smart TV 55\"",
    price: 899.99,
    discountPrice: 799.99,
    rating: 4.7,
    reviewCount: 327,
    imageSrc: "https://picsum.photos/id/401/300/300",
    badge: "New",
    slug: "ultra-hd-smart-tv-55"
  },
  {
    id: 4,
    name: "Professional Camera",
    price: 1299.99,
    discountPrice: 1099.99,
    rating: 4.9,
    reviewCount: 156,
    imageSrc: "https://picsum.photos/id/250/300/300",
    badge: "Hot",
    slug: "professional-camera"
  },
  {
    id: 5,
    name: "Smartphone with Triple Camera",
    price: 899.99,
    discountPrice: 799.99,
    rating: 4.8,
    reviewCount: 214,
    imageSrc: "https://picsum.photos/id/160/300/300",
    badge: "Popular",
    slug: "smartphone-triple-camera"
  },
  {
    id: 6,
    name: "Ergonomic Office Chair",
    price: 299.99,
    discountPrice: 249.99,
    rating: 4.7,
    reviewCount: 178,
    imageSrc: "https://picsum.photos/id/164/300/300",
    slug: "ergonomic-office-chair"
  },
  {
    id: 7,
    name: "Gaming Laptop",
    price: 1499.99,
    discountPrice: 1299.99,
    rating: 4.9,
    reviewCount: 132,
    imageSrc: "https://picsum.photos/id/119/300/300",
    badge: "Best Seller",
    slug: "gaming-laptop"
  },
  {
    id: 8,
    name: "Bluetooth Portable Speaker",
    price: 129.99,
    discountPrice: 99.99,
    rating: 4.5,
    reviewCount: 265,
    imageSrc: "https://picsum.photos/id/143/300/300",
    badge: "30% Off",
    slug: "bluetooth-portable-speaker"
  }
];

export default trendingProductsData; 