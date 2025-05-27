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
    id: 'electronics',
    title: 'Best of Electronics',
    products: [
      {
        id: 'earbuds1',
        title: 'Best Truewireless Headphones',
        image: 'https://picsum.photos/seed/earbuds/300/300',
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
        image: 'https://picsum.photos/seed/smartwatch/300/300',
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
        image: 'https://picsum.photos/seed/speaker/300/300',
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
        image: 'https://picsum.photos/seed/printer/300/300',
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
        image: 'https://picsum.photos/seed/viewsonic/300/300',
        price: 8000,
        link: '/products/monitor1',
        isAssured: true,
        hasFreeDel: true
      },
      {
        id: 'monitor2',
        title: 'ASUS Monitors',
        image: 'https://picsum.photos/seed/asus/300/300',
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
        image: 'https://picsum.photos/seed/coffee/300/300',
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
        image: 'https://picsum.photos/seed/cycle/300/300',
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
        image: 'https://picsum.photos/seed/stationery/300/300',
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
        image: 'https://picsum.photos/seed/actiontoys/300/300',
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
        image: 'https://picsum.photos/seed/teddy/300/300',
        discount: 'Upto 70% Off',
        link: '/products/toys2',
        rating: 4.4,
        reviewCount: 785,
        hasFreeDel: true
      },
      {
        id: 'cycle2',
        title: 'Electric Cycle',
        image: 'https://picsum.photos/seed/ecycle/300/300',
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
        image: 'https://picsum.photos/seed/treadmill/300/300',
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
        image: 'https://picsum.photos/seed/foodspread/300/300',
        discount: 'Upto 75% Off',
        link: '/products/food1',
        rating: 4.5,
        reviewCount: 1890,
        hasFreeDel: true
      },
      {
        id: 'toys3',
        title: 'Remote Control Toys',
        image: 'https://picsum.photos/seed/rctoy/300/300',
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
        image: 'https://picsum.photos/seed/yogamat/300/300',
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
        image: 'https://picsum.photos/seed/puzzle/300/300',
        price: 79,
        link: '/products/puzzle1',
        rating: 4.2,
        reviewCount: 520,
        hasFreeDel: true
      },
      {
        id: 'food2',
        title: 'Dry Fruits',
        image: 'https://picsum.photos/seed/dryfruits/300/300',
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
    <div className="w-full space-y-2 bg-gray-50 dark:bg-gray-900">
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