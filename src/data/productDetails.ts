import { ProductDetail } from '../types/product';

export const productDetailsData: Record<string, ProductDetail> = {
  'fastrack-optimus-pro': {
    id: 'product-1',
    slug: 'fastrack-optimus-pro',
    title: 'Fastrack Optimus Pro with 1.43" AMOLED Display, Bluetooth Calling & AI Voice Assistant',
    subtitle: 'Blue Strap, Free Size',
    brand: 'Fastrack',
    description: 'Fastrack Optimus Pro is a stylish and feature-rich smartwatch designed for the modern user. With its stunning 1.43" AMOLED display, you can enjoy vibrant visuals and crisp text. The Bluetooth calling feature allows you to make and receive calls directly from your wrist, while the AI Voice Assistant helps you control your watch with simple voice commands. It also includes multiple sports modes, health tracking features, and a long-lasting battery.',
    price: 2995,
    originalPrice: 5995,
    discountPercentage: 50,
    rating: 4.3,
    reviewCount: 1243,
    inStock: true,
    stockCount: 100,
    isAssured: true,
    badges: ['Trending', 'Best Seller'],
    images: [
      'https://picsum.photos/id/1/800/800',
      'https://picsum.photos/id/20/800/800',
      'https://picsum.photos/id/30/800/800',
      'https://picsum.photos/id/40/800/800',
      'https://picsum.photos/id/50/800/800'
    ],
    colorVariants: [
      { id: 'blue', color: 'Blue', hex: '#1E90FF', image: 'https://picsum.photos/id/1/800/800' },
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/20/800/800' },
      { id: 'purple', color: 'Purple', hex: '#800080', image: 'https://picsum.photos/id/30/800/800' },
      { id: 'pink', color: 'Pink', hex: '#FFC0CB', image: 'https://picsum.photos/id/40/800/800' },
      { id: 'gold', color: 'Gold', hex: '#FFD700', image: 'https://picsum.photos/id/50/800/800' }
    ],
    specificationGroups: [
      {
        title: 'General',
        specs: [
          { specKey: 'Model Name', specValue: 'Optimus Pro' },
          { specKey: 'Color', specValue: 'Blue' },
          { specKey: 'Dial Shape', specValue: 'Round' },
          { specKey: 'Strap Color', specValue: 'Blue' },
          { specKey: 'Strap Material', specValue: 'Silicone' }
        ]
      },
      {
        title: 'Display',
        specs: [
          { specKey: 'Display Type', specValue: 'AMOLED' },
          { specKey: 'Display Size', specValue: '1.43 inches' },
          { specKey: 'Resolution', specValue: '466 x 466 pixels' },
          { specKey: 'Touch Screen', specValue: 'Yes' },
          { specKey: 'Brightness', specValue: '600 nits' }
        ]
      },
      {
        title: 'Features',
        specs: [
          { specKey: 'Call Function', specValue: 'Yes' },
          { specKey: 'Bluetooth Calling', specValue: 'Yes' },
          { specKey: 'Voice Assistant', specValue: 'Yes' },
          { specKey: 'Heart Rate Monitoring', specValue: 'Yes' },
          { specKey: 'SpO2 Monitoring', specValue: 'Yes' },
          { specKey: 'Step Counter', specValue: 'Yes' },
          { specKey: 'Sleep Tracking', specValue: 'Yes' },
          { specKey: 'GPS', specValue: 'Yes' },
          { specKey: 'Water Resistant', specValue: 'IP68' }
        ]
      },
      {
        title: 'Battery',
        specs: [
          { specKey: 'Battery Life', specValue: 'Up to 7 days' },
          { specKey: 'Charging Time', specValue: '2 hours' },
          { specKey: 'Battery Type', specValue: 'Lithium Polymer' }
        ]
      }
    ],
    highlights: [
      '1.43" AMOLED Display',
      'Bluetooth Calling',
      'AI Voice Assistant',
      'Up to 7 Days Battery Life',
      'IP68 Water Resistant',
      'Heart Rate & SpO2 Monitoring',
      '100+ Sports Modes'
    ],
    deliveryInfo: 'Delivery by Tomorrow',
    hasFreeDel: true,
    replacementDays: 7,
    warranty: '1 Year Manufacturer Warranty',
    sellerName: 'Fastrack Official Store',
    sellerRating: 4.8,
    exchangeOffer: {
      available: true,
      maxDiscount: 300
    },
    bankOffers: [
      'Get 5% cashback on Flipkart Axis Bank Card',
      'Sign up for Flipkart Pay Later and get free gift card worth ₹100',
      '5% off with HDFC Bank Credit Card EMI'
    ],
    emiOptions: true,
    reviews: [
      {
        id: 'rev1',
        user: 'Rahul S.',
        rating: 5,
        title: 'Worth the money!',
        comment: 'The watch is amazing. The display is bright and vibrant, the battery lasts for days, and the calling feature works perfectly. Highly recommended!',
        date: '2023-09-15',
        isVerifiedPurchase: true,
        helpfulCount: 45
      },
      {
        id: 'rev2',
        user: 'Priya M.',
        rating: 4,
        title: 'Good but could be better',
        comment: 'The watch is good overall. The display and features are excellent, but the battery life is not as advertised. It lasts about 4-5 days with regular use.',
        date: '2023-08-22',
        isVerifiedPurchase: true,
        helpfulCount: 32
      },
      {
        id: 'rev3',
        user: 'Amit K.',
        rating: 5,
        title: 'Excellent value for money',
        comment: 'Absolutely love this watch! The AMOLED display is stunning, and the features work as advertised. The blue color looks premium.',
        date: '2023-07-30',
        isVerifiedPurchase: true,
        helpfulCount: 28,
        images: ['https://picsum.photos/id/60/300/300', 'https://picsum.photos/id/61/300/300']
      }
    ],
    relatedProducts: [
      'noise-colorfit-pro-4',
      'redmi-watch-move',
      'fire-boltt-ninja'
    ],
    faq: [
      {
        question: 'Does this watch support WhatsApp calls?',
        answer: 'No, it supports regular Bluetooth calling but not WhatsApp or other app-specific calls.'
      },
      {
        question: 'Is the strap replaceable?',
        answer: 'Yes, the watch has standard 22mm detachable straps that can be replaced with any compatible third-party straps.'
      },
      {
        question: 'Does it work with iPhone?',
        answer: 'Yes, it works with both Android and iOS. However, some features may be limited on iOS.'
      }
    ]
  },
  
  'noise-colorfit-pro-4': {
    id: 'product-2',
    slug: 'noise-colorfit-pro-4',
    title: 'Noise ColorFit Pro 4 with 1.85" Display, Bluetooth Calling & 100+ Watch Faces',
    subtitle: 'Jet Black Strap, Regular',
    brand: 'Noise',
    description: 'The Noise ColorFit Pro 4 is a feature-packed smartwatch with a large 1.85" display. It comes with Bluetooth calling functionality, allowing you to make and receive calls directly from your wrist. With 100+ watch faces, you can customize your watch to match your style. The watch also offers various health tracking features like heart rate monitoring, SpO2 tracking, and sleep monitoring. It has a durable build with an IP68 water resistance rating.',
    price: 1399,
    originalPrice: 5999,
    discountPercentage: 76,
    rating: 4.5,
    reviewCount: 3562,
    inStock: true,
    isAssured: true,
    badges: ['Best Seller'],
    images: [
      'https://picsum.photos/id/2/800/800',
      'https://picsum.photos/id/21/800/800',
      'https://picsum.photos/id/31/800/800',
      'https://picsum.photos/id/41/800/800'
    ],
    colorVariants: [
      { id: 'black', color: 'Black', hex: '#000000', image: 'https://picsum.photos/id/2/800/800' },
      { id: 'grey', color: 'Grey', hex: '#808080', image: 'https://picsum.photos/id/21/800/800' },
      { id: 'gold', color: 'Gold', hex: '#FFD700', image: 'https://picsum.photos/id/31/800/800' },
      { id: 'rose-gold', color: 'Rose Gold', hex: '#B76E79', image: 'https://picsum.photos/id/41/800/800' }
    ],
    specificationGroups: [
      {
        title: 'General',
        specs: [
          { specKey: 'Model Name', specValue: 'ColorFit Pro 4' },
          { specKey: 'Color', specValue: 'Jet Black' },
          { specKey: 'Dial Shape', specValue: 'Square' },
          { specKey: 'Strap Color', specValue: 'Black' },
          { specKey: 'Strap Material', specValue: 'Silicone' }
        ]
      },
      {
        title: 'Display',
        specs: [
          { specKey: 'Display Type', specValue: 'TFT LCD' },
          { specKey: 'Display Size', specValue: '1.85 inches' },
          { specKey: 'Resolution', specValue: '240 x 280 pixels' },
          { specKey: 'Touch Screen', specValue: 'Yes' }
        ]
      },
      {
        title: 'Features',
        specs: [
          { specKey: 'Call Function', specValue: 'Yes' },
          { specKey: 'Bluetooth Calling', specValue: 'Yes' },
          { specKey: 'Heart Rate Monitoring', specValue: 'Yes' },
          { specKey: 'SpO2 Monitoring', specValue: 'Yes' },
          { specKey: 'Step Counter', specValue: 'Yes' },
          { specKey: 'Sleep Tracking', specValue: 'Yes' },
          { specKey: 'Water Resistant', specValue: 'IP68' }
        ]
      }
    ],
    highlights: [
      '1.85" TFT Color Display',
      'Bluetooth Calling',
      '100+ Watch Faces',
      'IP68 Water & Dust Resistant',
      'Heart Rate & SpO2 Monitoring',
      'Up to 7 Days Battery Life'
    ],
    deliveryInfo: 'Delivery in 2 days',
    hasFreeDel: true,
    replacementDays: 7,
    warranty: '1 Year Manufacturer Warranty',
    sellerName: 'Noise Official Store',
    sellerRating: 4.6,
    exchangeOffer: {
      available: true,
      maxDiscount: 300
    },
    bankOffers: [
      'Get 5% cashback on Flipkart Axis Bank Card',
      '5% off with HDFC Bank Credit Card EMI'
    ],
    emiOptions: true,
    reviews: [
      {
        id: 'rev1',
        user: 'Sneha R.',
        rating: 5,
        title: 'Best budget smartwatch',
        comment: 'Amazing watch at this price point. The display is clear and bright, calling feature works well, and battery lasts for about 5 days with moderate use.',
        date: '2023-10-05',
        isVerifiedPurchase: true,
        helpfulCount: 67
      },
      {
        id: 'rev2',
        user: 'Karan T.',
        rating: 4,
        title: 'Good value for money',
        comment: 'For the price, this watch offers a lot of features. The build quality is decent, and it does what it promises. The only downside is the charging mechanism could be better.',
        date: '2023-09-18',
        isVerifiedPurchase: true,
        helpfulCount: 42
      }
    ],
    relatedProducts: [
      'fastrack-optimus-pro',
      'redmi-watch-move',
      'fire-boltt-ninja'
    ]
  }
};

export const getProductDetails = (slug: string): ProductDetail | undefined => {
  return productDetailsData[slug];
};

export const getRelatedProducts = (productSlugs: string[]): ProductDetail[] => {
  return productSlugs
    .map(slug => productDetailsData[slug])
    .filter(product => product !== undefined) as ProductDetail[];
}; 