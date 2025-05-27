import { ProductCardProps } from './ProductCard';

// Product categories
export const productCategories = [
  { id: 'watches', name: 'Watches' },
  { id: 'smartwatches', name: 'Smartwatches' },
  { id: 'fitness-bands', name: 'Fitness Bands' },
  { id: 'headphones', name: 'Headphones' },
  { id: 'earbuds', name: 'Earbuds' },
  { id: 'speakers', name: 'Speakers' }
];

// Basic product data - simplified version
export const dummySmartWatches: Omit<ProductCardProps, 'id'>[] = [
  {
    title: 'Fastrack Optimus Pro with 1.43" AMOLED Display',
    image: 'https://picsum.photos/id/1/300/300',
    price: 2995,
    originalPrice: 5995,
    link: '/product/fastrack-optimus-pro',
    isAssured: true,
    rating: 4.3,
    reviewCount: 1243,
    badge: 'Trending',
    deliveryInfo: 'Delivery by Tomorrow',
    hasFreeDel: true,
  },
  {
    title: 'Noise ColorFit Pro 4 with 1.85" Display',
    image: 'https://picsum.photos/id/2/300/300',
    price: 3499,
    originalPrice: 6999,
    link: '/product/noise-colorfit-pro-4',
    isAssured: true,
    rating: 4.5,
    reviewCount: 3562,
    hasFreeDel: true,
  },
  {
    title: 'boAt Wave Flex Connect with 1.83" HD Display',
    image: 'https://picsum.photos/id/3/300/300',
    price: 1499,
    originalPrice: 2999,
    link: '/product/boat-wave-flex',
    isAssured: true,
    rating: 4.2,
    reviewCount: 2341,
    badge: 'New Launch',
    hasFreeDel: true,
  },
  {
    title: 'Fire-Boltt Ninja Call Pro with 1.69" Display',
    image: 'https://picsum.photos/id/4/300/300',
    price: 1299,
    originalPrice: 2999,
    link: '/product/fire-boltt-ninja',
    rating: 4.0,
    reviewCount: 987,
    deliveryInfo: 'Delivery in 2 days',
    hasFreeDel: false,
  },
  {
    title: 'Samsung Galaxy Watch 4 with Advanced Health Tracking',
    image: 'https://picsum.photos/id/5/300/300',
    price: 12999,
    originalPrice: 16999,
    link: '/product/samsung-galaxy-watch4',
    isAssured: true,
    rating: 4.7,
    reviewCount: 4321,
    badge: 'Premium',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
  },
  {
    title: 'Apple Watch SE with Crash Detection',
    image: 'https://picsum.photos/id/6/300/300',
    price: 29999,
    originalPrice: 32999,
    link: '/product/apple-watch-se',
    isAssured: true,
    rating: 4.8,
    reviewCount: 2798,
    badge: 'Premium',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/300/300',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/300/300',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
  }
];

// Generate IDs for products if they don't have one
export const generateProductsWithIds = (products: Omit<ProductCardProps, 'id'>[]): ProductCardProps[] => {
  return products.map((product, index) => ({
    ...product,
    id: `product-${index + 1}`, // Simple ID generation
  }));
};

// Function to get smartwatches with IDs
export const getSmartWatches = (): ProductCardProps[] => {
  return generateProductsWithIds(dummySmartWatches);
}; 