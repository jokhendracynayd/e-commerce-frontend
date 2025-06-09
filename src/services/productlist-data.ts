import { ProductListingCardProps } from '../components/product/ProductListingCard';

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
    image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg',
    price: 2995,
    originalPrice: 5995,
    link: '/fastrack-optimus-pro/p/opt-123',
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
      { id: 'blue', color: 'Blue', hex: '#1E90FF', image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg' },
      { id: 'purple', color: 'Purple', hex: '#800080', image: 'https://i.pinimg.com/736x/90/3f/66/903f66db561c426d8f8e9c551ece7cee.jpg' },
      { id: 'pink', color: 'Pink', hex: '#FFC0CB', image: 'https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg' },
      { id: 'gold', color: 'Gold', hex: '#FFD700', image: 'https://i.pinimg.com/736x/97/38/4e/97384ecd78fbf41c73d3ce3112ee05db.jpg' },
      { id: 'brown', color: 'Brown', hex: '#A52A2A', image: 'https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg' }
    ],
  },
  {
    title: 'Noise ColorFit Pro 4 with 1.85" Display',
    image: 'https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg',
    price: 1399,
    originalPrice: 5999,
    link: '/noise-colorfit-pro-4/p/ncp-456',
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
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg' },
      { id: 'grey', color: 'Grey', hex: '#808080', image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg' },
      { id: 'gold', color: 'Gold', hex: '#FFD700', image: 'https://i.pinimg.com/736x/97/38/4e/97384ecd78fbf41c73d3ce3112ee05db.jpg' },
      { id: 'rose-gold', color: 'Rose Gold', hex: '#B76E79', image: 'https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg' },
      { id: 'navy', color: 'Navy', hex: '#000080', image: 'https://i.pinimg.com/736x/90/3f/66/903f66db561c426d8f8e9c551ece7cee.jpg' },
    ],
    sponsoredTag: true,
  },
  {
    title: 'REDMI Watch Move 1.85 Premium Edition with Bluetooth Calling',
    image: 'https://i.pinimg.com/736x/3d/37/d7/3d37d7aa9787256dda0591dc2c121001.jpg',
    price: 1999,
    originalPrice: 3999,
    link: '/redmi-watch-move/p/rwm-789',
    isAssured: true,
    rating: 4.2,
    reviewCount: 2341,
    badge: 'Early Bird Deal',
    hasFreeDel: true,
    subtitle: 'Gold Rush Strap, Free Size',
    discount: '50% off',
    colorVariants: [
      { id: 'gold-rush', color: 'Gold Rush', hex: '#D4AF37', image: 'https://i.pinimg.com/736x/3d/37/d7/3d37d7aa9787256dda0591dc2c121001.jpg' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/37/a8/ae/37a8ae2095512429d5d0ffa5d8675378.jpg' },
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg' },
    ],
    sponsoredTag: true,
  },
  {
    title: 'Fire-Boltt Ninja Call Pro with 1.69" Display',
    image: 'https://i.pinimg.com/736x/39/15/e4/3915e4b87e3ed23b1f8670609b99710a.jpg',
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
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/39/15/e4/3915e4b87e3ed23b1f8670609b99710a.jpg' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://i.pinimg.com/736x/c9/b3/f1/c9b3f1814dfbc03e9964b429a5e39966.jpg' },
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 200
    }
  },
  {
    title: 'Fastrack Revoltt FS1-1.83" Bluetooth Calling',
    image: 'https://i.pinimg.com/736x/90/3f/66/903f66db561c426d8f8e9c551ece7cee.jpg',
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
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/90/3f/66/903f66db561c426d8f8e9c551ece7cee.jpg' },
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://i.pinimg.com/736x/43/15/ae/4315ae69df9daa2550203db798b0d77f.jpg' },
      { id: 'purple', color: 'Purple', hex: '#800080', image: 'https://i.pinimg.com/736x/39/15/e4/3915e4b87e3ed23b1f8670609b99710a.jpg' },
      { id: 'pink', color: 'Pink', hex: '#FFC0CB', image: 'https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg' },
      { id: 'olive', color: 'Olive', hex: '#808000', image: 'https://i.pinimg.com/736x/ec/30/90/ec3090a071542a6ffa54237e30fcb220.jpg' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    }
  },
  {
    title: 'Apple Watch SE with Crash Detection',
    image: 'https://i.pinimg.com/736x/c9/b3/f1/c9b3f1814dfbc03e9964b429a5e39966.jpg',
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
      { id: 'midnight', color: 'Midnight', hex: '#121212', image: 'https://i.pinimg.com/736x/c9/b3/f1/c9b3f1814dfbc03e9964b429a5e39966.jpg' },
      { id: 'starlight', color: 'Starlight', hex: '#E3C5A0', image: 'https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://i.pinimg.com/736x/97/38/4e/97384ecd78fbf41c73d3ce3112ee05db.jpg' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 2000
    },
    sponsoredTag: false
  },
  {
    title: 'OnePlus Watch 2 with 100+ Workout Modes',
    image: 'https://i.pinimg.com/736x/ec/30/90/ec3090a071542a6ffa54237e30fcb220.jpg',
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
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/ec/30/90/ec3090a071542a6ffa54237e30fcb220.jpg' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://i.pinimg.com/736x/b5/1c/88/b51c880227de78a3131e52aa5ff7d581.jpg' },
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
    image: 'https://i.pinimg.com/736x/76/3f/44/763f4454ee41c086f9cfd296400ab387.jpg',
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
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/76/3f/44/763f4454ee41c086f9cfd296400ab387.jpg' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://i.pinimg.com/736x/c7/12/b7/c712b7f6ea05c2dc48ea7665f0122be0.jpg' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Premium Wireless Headphones with Noise Cancellation',
    image: 'https://i.pinimg.com/736x/c7/12/b7/c712b7f6ea05c2dc48ea7665f0122be0.jpg',
    price: 8999,
    originalPrice: 10999,
    link: '/product/premium-headphones',
    isAssured: false,
    rating: 4.1,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '18% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/c7/12/b7/c712b7f6ea05c2dc48ea7665f0122be0.jpg' },
      { id: 'silver', color: 'Silver', hex: '#C0C0C0', image: 'https://i.pinimg.com/736x/76/3f/44/763f4454ee41c086f9cfd296400ab387.jpg' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Luxury Smart Fashion Accessories',
    image: 'https://i.pinimg.com/736x/94/1d/9f/941d9fee290f2e088558f909aa84268a.jpg',
    price: 11999,
    originalPrice: 14999,
    link: '/product/luxury-fashion',
    isAssured: true,
    rating: 4.4,
    reviewCount: 1456,
    hasFreeDel: true,
    subtitle: 'Black, Free Size',
    discount: '20% off',
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/94/1d/9f/941d9fee290f2e088558f909aa84268a.jpg' },
      { id: 'green', color: 'Green', hex: '#008000', image: 'https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1500
    },
    badge: undefined,
    sponsoredTag: false
  },
  {
    title: 'Designer Hats Collection',
    image: 'https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg',
    price: 1499,
    originalPrice: 2499,
    link: '/product/designer-hats',
    isAssured: true,
    rating: 4.6,
    reviewCount: 832,
    hasFreeDel: true,
    subtitle: 'Premium Collection',
    discount: '40% off',
    badge: 'Limited Edition',
    colorVariants: [
      { id: 'beige', color: 'Beige', hex: '#F5F5DC', image: 'https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/94/1d/9f/941d9fee290f2e088558f909aa84268a.jpg' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Premium Ceramic Coffee Mugs',
    image: 'https://i.pinimg.com/736x/97/38/4e/97384ecd78fbf41c73d3ce3112ee05db.jpg',
    price: 999,
    originalPrice: 1499,
    link: '/product/ceramic-mugs',
    isAssured: true,
    rating: 4.8,
    reviewCount: 1240,
    hasFreeDel: true,
    subtitle: 'Handcrafted Design',
    discount: '33% off',
    badge: 'Trending',
    colorVariants: [
      { id: 'white', color: 'White', hex: '#FFFFFF', image: 'https://i.pinimg.com/736x/97/38/4e/97384ecd78fbf41c73d3ce3112ee05db.jpg' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg' },
    ],
    exchangeOffer: {
      available: false,
      maxDiscount: 0
    },
    sponsoredTag: false
  },
  {
    title: 'Modern Clothing Collection',
    image: 'https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg',
    price: 2999,
    originalPrice: 3999,
    link: '/product/modern-clothing',
    isAssured: true,
    rating: 4.5,
    reviewCount: 876,
    hasFreeDel: true,
    subtitle: 'All Sizes Available',
    discount: '25% off',
    badge: 'Best Seller',
    colorVariants: [
      { id: 'blue', color: 'Blue', hex: '#0000FF', image: 'https://i.pinimg.com/736x/24/a5/c2/24a5c2fe42201494dfe5cf71280b7845.jpg' },
      { id: 'red', color: 'Red', hex: '#FF0000', image: 'https://i.pinimg.com/736x/94/1d/9f/941d9fee290f2e088558f909aa84268a.jpg' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 500
    },
    sponsoredTag: false
  },
  {
    title: 'Special Deals Collection',
    image: 'https://i.pinimg.com/736x/06/9d/87/069d878908ddacd172e0a8976e1fedac.jpg',
    price: 4999,
    originalPrice: 7999,
    link: '/product/special-deals',
    isAssured: true,
    rating: 4.9,
    reviewCount: 1543,
    hasFreeDel: true,
    subtitle: 'Limited Time Offer',
    discount: '38% off',
    badge: 'Hot Deal',
    colorVariants: [
      { id: 'multi', color: 'Multi', hex: '#FF6347', image: 'https://i.pinimg.com/736x/06/9d/87/069d878908ddacd172e0a8976e1fedac.jpg' },
      { id: 'classic', color: 'Classic', hex: '#000000', image: 'https://i.pinimg.com/736x/e0/bd/2f/e0bd2fb7e82af3a51ad06bc9831f925b.jpg' },
    ],
    exchangeOffer: {
      available: true,
      maxDiscount: 1000
    },
    sponsoredTag: true
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