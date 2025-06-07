'use client';

import { ProductCategory, ProductType } from './ProductCategory';

// Define the category type that includes a title and array of products
export type CategoryType = {
  id: string;
  title: string;
  products: ProductType[];
};

// Sample data for multiple product categories
export const categories: CategoryType[] = [
  {
    id: 'apparel',
    title: 'Trendy Apparel Collections',
    products: [
      {
        id: 'apparel1',
        title: 'Men\'s Premium Cotton T-Shirt',
        image: 'https://i.pinimg.com/736x/eb/64/5f/eb645f0fc63967878657fe0bbb45fbaf.jpg',
        price: 799,
        originalPrice: 1299,
        link: '/products/mens-premium-tshirt',
        badge: 'Bestseller',
        rating: 4.6,
        reviewCount: 1256,
        hasFreeDel: true
      },
      {
        id: 'apparel2',
        title: 'Women\'s Casual Denim Jacket',
        image: 'https://i.pinimg.com/736x/fc/a7/02/fca7024e2f8e532e2cc166c3821cc0d7.jpg',
        price: 1499,
        originalPrice: 2999,
        link: '/products/womens-denim-jacket',
        badge: 'Sale',
        rating: 4.8,
        reviewCount: 724,
        hasFreeDel: true
      },
      {
        id: 'apparel3',
        title: 'Unisex Urban Streetwear Hoodie',
        image: 'https://i.pinimg.com/736x/bd/dd/32/bddd325200aed5e2ba8ff21ab60ce548.jpg',
        price: 1299,
        originalPrice: 1699,
        link: '/products/urban-hoodie',
        rating: 4.5,
        reviewCount: 892,
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'apparel4',
        title: 'Women\'s Floral Summer Dress',
        image: 'https://i.pinimg.com/736x/f9/85/38/f9853803568422d1d37686cef5b53816.jpg',
        price: 999,
        originalPrice: 1499,
        link: '/products/summer-dress',
        hasFreeDel: true,
        isAssured: true,
        rating: 4.7,
        reviewCount: 458
      },
      {
        id: 'apparel5',
        title: 'Men\'s Slim Fit Formal Shirt',
        image: 'https://i.pinimg.com/736x/ae/76/42/ae7642deb365d2a86cb7e3731f1d9e44.jpg',
        price: 899,
        originalPrice: 1399,
        link: '/products/formal-shirt',
        badge: 'New',
        hasFreeDel: true,
        rating: 4.4,
        reviewCount: 312
      },
      {
        id: 'apparel6',
        title: 'Premium Leather Fashion Belt',
        image: 'https://i.pinimg.com/736x/af/bf/4d/afbf4dbefe77429dd18188086e3d5ef3.jpg',
        price: 599,
        originalPrice: 999,
        link: '/products/leather-belt',
        hasFreeDel: true,
        rating: 4.3,
        reviewCount: 189
      }
    ]
  },
  {
    id: 'electronics',
    title: 'Best of Electronics',
    products: [
      {
        id: 'earbuds1',
        title: 'Best Truewireless Headphones',
        image: 'https://i.pinimg.com/736x/3a/e5/59/3ae5591d2fdb0d1f35f31ccc23edc668.jpg',
        discount: 'Grab Now',
        link: '/products/earbuds1',
        rating: 4.3,
        reviewCount: 5620,
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'watch1',
        title: 'Fastrack Smartwatch',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
        price: 1399,
        link: '/products/watch1',
        rating: 4.1,
        reviewCount: 2340,
        isAssured: true,
        deliveryInfo: 'Delivery in 2 days',
        hasFreeDel: false
      },
      {
        id: 'speaker1',
        title: 'Best Selling Mobile Speakers',
        image: 'https://i.pinimg.com/736x/28/5e/6b/285e6b926bef59d5f959a7650eec9b0a.jpg',
        price: 499,
        badge: 'New',
        link: '/products/speaker1',
        rating: 4.5,
        reviewCount: 1200,
        hasFreeDel: true
      },
      {
        id: 'printer1',
        title: 'Printers',
        image: 'https://i.pinimg.com/736x/b9/1e/06/b91e06812ac1da3415a79a92cf3c7a57.jpg',
        price: 2336,
        link: '/products/printer1',
        rating: 3.9,
        reviewCount: 456,
        deliveryInfo: 'Delivery in 3-5 days',
        hasFreeDel: false
      },
      {
        id: 'monitor1',
        title: 'ViewSonic Monitors',
        image: 'https://i.pinimg.com/736x/5a/af/2d/5aaf2d7a2a42ef5ae331be52af642141.jpg',
        price: 8000,
        link: '/products/monitor1',
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'monitor2',
        title: 'ASUS Monitors',
        image: 'https://i.pinimg.com/736x/61/c3/b4/61c3b487a6a8a81289e5724da8966fb9.jpg',
        price: 14999,
        link: '/products/monitor2',
        rating: 4.7,
        reviewCount: 3245,
        isAssured: true,
        hasFreeDel: true
      }
    ]
  },
  {
    id: 'beauty-toys',
    title: 'Beauty, Food, Toys & more',
    products: [
      {
        id: 'coffee1',
        title: 'Coffee Powder',
        image: 'https://i.pinimg.com/736x/e0/73/42/e0734299d874d8860b92ddd63f60abf2.jpg',
        discount: 'Upto 80% Off',
        link: '/products/coffee1',
        rating: 4.2,
        reviewCount: 980,
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'cycle1',
        title: 'Geared Cycles',
        image: 'https://i.pinimg.com/736x/19/46/73/19467334321de7f27e8b24cca0ecb8a0.jpg',
        discount: 'Up to 70% Off',
        link: '/products/cycle1',
        rating: 4.0,
        reviewCount: 560,
        deliveryInfo: 'Delivery by Tomorrow',
        hasFreeDel: true
      },
      {
        id: 'stationery1',
        title: 'Top Selling Stationery',
        image: 'https://i.pinimg.com/736x/6d/95/6c/6d956cee37967a3fdd91bb665ce254c6.jpg',
        price: 49,
        link: '/products/stationery1',
        rating: 4.6,
        reviewCount: 1350,
        hasFreeDel: false,
        deliveryInfo: 'Standard Delivery'
      },
      {
        id: 'toys1',
        title: 'Best of Action Toys',
        image: 'https://i.pinimg.com/736x/00/69/d8/0069d8aa9665cde19bdc8545b5c715dc.jpg',
        discount: 'Up to 70% Off',
        link: '/products/toys1',
        rating: 3.8,
        reviewCount: 230,
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'toys2',
        title: 'Soft Toys',
        image: 'https://i.pinimg.com/736x/38/a9/9e/38a99ef27007cfae409d65c0b935c9d8.jpg',
        discount: 'Upto 70% Off',
        link: '/products/toys2',
        rating: 4.4,
        reviewCount: 785,
        hasFreeDel: true
      },
      {
        id: 'cycle2',
        title: 'Electric Cycle',
        image: 'https://i.pinimg.com/736x/00/69/d8/0069d8aa9665cde19bdc8545b5c715dc.jpg',
        discount: 'Up to 40% Off',
        link: '/products/cycle2',
        rating: 4.1,
        reviewCount: 342,
        isAssured: true,
        deliveryInfo: 'Ships in 7 days',
        hasFreeDel: false
      }
    ]
  },
  {
    id: 'sports-healthcare',
    title: 'Sports, Healthcare & more',
    products: [
      {
        id: 'treadmill1',
        title: 'Treadmill, Exercise Bike',
        image: 'https://i.pinimg.com/736x/a2/85/7a/a2857ad17b6cb53f480ac499f8a40803.jpg',
        discount: 'Up to 70% Off',
        link: '/products/treadmill1',
        rating: 4.3,
        reviewCount: 428,
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'food1',
        title: 'Food Spreads',
        image: 'https://i.pinimg.com/736x/b9/12/be/b912be58fd415901f4cb65e084b6b337.jpg',
        discount: 'Upto 75% Off',
        link: '/products/food1',
        rating: 4.5,
        reviewCount: 1890,
        hasFreeDel: true
      },
      {
        id: 'toys3',
        title: 'Remote Control Toys',
        image: 'https://i.pinimg.com/736x/6b/ce/ce/6bcece46051787173cac6ae13050f206.jpg',
        discount: 'Up to 80% Off',
        link: '/products/toys3',
        rating: 3.9,
        reviewCount: 675,
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'yoga1',
        title: 'Yoga Mat',
        image: 'https://i.pinimg.com/736x/0e/55/69/0e55697e3dee530d9dd3c3cb2b447930.jpg',
        price: 159,
        link: '/products/yoga1',
        rating: 4.7,
        reviewCount: 3200,
        isAssured: true,
        deliveryInfo: 'Express Delivery',
        hasFreeDel: false
      },
      {
        id: 'puzzle1',
        title: 'Puzzles & Cubes',
        image: 'https://i.pinimg.com/736x/80/d6/8c/80d68cb05a994d6d6be60134d4e79f16.jpg',
        price: 79,
        link: '/products/puzzle1',
        rating: 4.2,
        reviewCount: 520,
        hasFreeDel: true
      },
      {
        id: 'food2',
        title: 'Dry Fruits',
        image: 'https://i.pinimg.com/736x/a4/18/81/a4188147397c64114fc1b61e41e93c63.jpg',
        discount: 'Upto 75% Off',
        link: '/products/food2',
        rating: 4.8,
        reviewCount: 2450,
        isAssured: true,
        hasFreeDel: true
      }
    ]
  }
];

export function ProductCategorySection() {
  return (
    <div className="w-full py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50/60 dark:bg-gray-900/80 px-2 sm:px-3 md:px-4">
      {categories.map((category) => (
        <ProductCategory 
          key={category.id}
          title={category.title}
          products={category.products}
        />
      ))}
    </div>
  );
} 