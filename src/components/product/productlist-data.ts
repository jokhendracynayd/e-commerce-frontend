import { ProductListingCardProps } from './ProductListingCard';

// Product categories for navigation
export const productCategories = [
  { id: 'watches', name: 'Watches' },
  { id: 'smartwatches', name: 'Smartwatches' },
  { id: 'fitness-bands', name: 'Fitness Bands' },
  { id: 'headphones', name: 'Headphones' },
  { id: 'earbuds', name: 'Earbuds' },
  { id: 'speakers', name: 'Speakers' }
];

// Color variants with hex codes
export type ColorVariant = {
  id: string;
  color: string;
  hex: string;
  image: string;
};

// Product data for the listing page
export const listingProductsData: Omit<ProductListingCardProps, 'id'>[] = [
  {
    title: 'Fastrack Optimus Pro with 1.43" AMOLED Display',
    image: 'https://picsum.photos/id/1/600/600',
    price: 2995,
    originalPrice: 5995,
    link: '/product/fastrack-optimus-pro',
    isAssured: true,
    rating: 4.3,
    reviewCount: 1243,
    badge: 'Trending',
    deliveryInfo: 'Delivery by Tomorrow',
    hasFreeDel: true,
    subtitle: 'Blue Strap, Free Size',
    discount: '50% off',
    exchangeOffer: {
      available: true,
      maxDiscount: 300
    },
    colorVariants: [
      { id: 'blue', color: 'Blue', hex: '#1E90FF', image: 'https://picsum.photos/id/1/600/600' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/20/600/600' },
      { id: 'purple', color: 'Purple', hex: '#800080', image: 'https://picsum.photos/id/30/600/600' },
      { id: 'pink', color: 'Pink', hex: '#FFC0CB', image: 'https://picsum.photos/id/40/600/600' },
      { id: 'gold', color: 'Gold', hex: '#FFD700', image: 'https://picsum.photos/id/50/600/600' },
      { id: 'brown', color: 'Brown', hex: '#A52A2A', image: 'https://picsum.photos/id/60/600/600' }
    ],
  },
  {
    title: 'Noise ColorFit Pro 4 with 1.85" Display',
    image: 'https://picsum.photos/id/2/600/600',
    price: 1399,
    originalPrice: 5999,
    link: '/product/noise-colorfit-pro-4',
    isAssured: true,
    rating: 4.5,
    reviewCount: 3562,
    hasFreeDel: true,
    subtitle: 'Jet Black Strap, Regular',
    discount: '76% off',
    exchangeOffer: {
      available: true,
      maxDiscount: 300
    },
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/2/600/600' },
      { id: 'grey', color: 'Grey', hex: '#808080', image: 'https://picsum.photos/id/21/600/600' },
      { id: 'gold', color: 'Gold', hex: '#FFD700', image: 'https://picsum.photos/id/31/600/600' },
      { id: 'rose-gold', color: 'Rose Gold', hex: '#B76E79', image: 'https://picsum.photos/id/41/600/600' },
      { id: 'navy', color: 'Navy', hex: '#000080', image: 'https://picsum.photos/id/51/600/600' },
    ],
    sponsoredTag: true,
  },
  {
    title: 'REDMI Watch Move 1.85 Premium Edition with Bluetooth Calling',
    image: 'https://picsum.photos/id/3/600/600',
    price: 1999,
    originalPrice: 3999,
    link: '/product/redmi-watch-move',
    isAssured: true,
    rating: 4.2,
    reviewCount: 2341,
    badge: 'Early Bird Deal',
    hasFreeDel: true,
    subtitle: 'Gold Rush Strap, Free Size',
    discount: '50% off',
    colorVariants: [
      { id: 'gold-rush', color: 'Gold Rush', hex: '#D4AF37', image: 'https://picsum.photos/id/3/600/600' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/22/600/600' },
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://picsum.photos/id/32/600/600' },
    ],
    sponsoredTag: true,
  },
  {
    title: 'Fire-Boltt Ninja Call Pro with 1.69" Display',
    image: 'https://picsum.photos/id/4/600/600',
    price: 1299,
    originalPrice: 2999,
    link: '/product/fire-boltt-ninja',
    rating: 4.0,
    reviewCount: 987,
    deliveryInfo: 'Delivery in 2 days',
    hasFreeDel: false,
    subtitle: 'Black, Free Size',
    discount: '57% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/4/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/23/600/600' },
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://picsum.photos/id/33/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 200
    }
  },
  {
    title: 'Fastrack Revoltt FS1-1.83" Bluetooth Calling',
    image: 'https://picsum.photos/id/5/600/600',
    price: 1499,
    originalPrice: 3995,
    link: '/product/fastrack-revoltt',
    isAssured: true,
    rating: 4.7,
    reviewCount: 1321,
    badge: 'Only 3 left',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
    subtitle: 'Black Strap, Free Size',
    discount: '62% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/5/600/600' },
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://picsum.photos/id/24/600/600' },
      { id: 'purple', color: 'Purple', hex: '#800080', image: 'https://picsum.photos/id/34/600/600' },
      { id: 'pink', color: 'Pink', hex: '#FFC0CB', image: 'https://picsum.photos/id/44/600/600' },
      { id: 'olive', color: 'Olive', hex: '#808000', image: 'https://picsum.photos/id/54/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    }
  },
  {
    title: 'Apple Watch SE with Crash Detection',
    image: 'https://picsum.photos/id/6/600/600',
    price: 29999,
    originalPrice: 32999,
    link: '/product/apple-watch-se',
    isAssured: true,
    rating: 4.8,
    reviewCount: 2798,
    badge: 'Premium',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
    subtitle: 'Midnight, 40mm',
    discount: '9% off',
    colorVariants: [
      { id: 'midnight', color: 'Midnight', hex: '#121212', image: 'https://picsum.photos/id/6/600/600' },
      { id: 'starlight', color: 'Starlight', hex: '#E3C5A0', image: 'https://picsum.photos/id/25/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/35/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 2000
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Apple Watch SE with Crash Detection',
    image: 'https://picsum.photos/id/6/600/600',
    price: 29999,
    originalPrice: 32999,
    link: '/product/apple-watch-se',
    isAssured: true,
    rating: 4.8,
    reviewCount: 2798,
    badge: 'Premium',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
    subtitle: 'Midnight, 40mm',
    discount: '9% off',
    colorVariants: [
      { id: 'midnight', color: 'Midnight', hex: '#121212', image: 'https://picsum.photos/id/6/600/600' },
      { id: 'starlight', color: 'Starlight', hex: '#E3C5A0', image: 'https://picsum.photos/id/25/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/35/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 2000
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Apple Watch SE with Crash Detection',
    image: 'https://picsum.photos/id/6/600/600',
    price: 29999,
    originalPrice: 32999,
    link: '/product/apple-watch-se',
    isAssured: true,
    rating: 4.8,
    reviewCount: 2798,
    badge: 'Premium',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
    subtitle: 'Midnight, 40mm',
    discount: '9% off',
    colorVariants: [
      { id: 'midnight', color: 'Midnight', hex: '#121212', image: 'https://picsum.photos/id/6/600/600' },
      { id: 'starlight', color: 'Starlight', hex: '#E3C5A0', image: 'https://picsum.photos/id/25/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/35/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 2000
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Apple Watch SE with Crash Detection',
    image: 'https://picsum.photos/id/6/600/600',
    price: 29999,
    originalPrice: 32999,
    link: '/product/apple-watch-se',
    isAssured: true,
    rating: 4.8,
    reviewCount: 2798,
    badge: 'Premium',
    deliveryInfo: 'Express Delivery Available',
    hasFreeDel: true,
    subtitle: 'Midnight, 40mm',
    discount: '9% off',
    colorVariants: [
      { id: 'midnight', color: 'Midnight', hex: '#121212', image: 'https://picsum.photos/id/6/600/600' },
      { id: 'starlight', color: 'Starlight', hex: '#E3C5A0', image: 'https://picsum.photos/id/25/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/35/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 2000
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://picsum.photos/id/7/600/600',
    price: 11999,
    originalPrice: 14999,
    link: '/product/oneplus-watch-2',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/7/600/600' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://picsum.photos/id/26/600/600' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Realme Watch S Pro with AMOLED Display',
    image: 'https://picsum.photos/id/8/600/600',
    price: 8999,
    originalPrice: 10999,
    link: '/product/realme-watch-s-pro',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/8/600/600' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://picsum.photos/id/27/600/600' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  }
];

// Generate IDs for listing products
export const generateProductsWithIds = (products: Omit<ProductListingCardProps, 'id'>[]): ProductListingCardProps[] => {
  return products.map((product, index) => ({
    ...product,
    id: `listing-product-${index + 1}`,
  }));
};

// Function to get products with IDs for the listing page
export const getListingProducts = (): ProductListingCardProps[] => {
  return generateProductsWithIds(listingProductsData);
}; 