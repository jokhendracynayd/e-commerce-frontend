'use client';

import { useEffect, useState } from 'react';
import { ProductCategory, ProductType } from './ProductCategory';
import { useCategories } from '@/context/CategoryContext';
import { ProductFilterParams } from '@/types/product';
import { getCategoryProductsRecursive } from '@/services/categoryService';
import { CategoryWithProducts } from '@/types/categories';

// Define the category type that includes a title and array of products
export type CategoryType = {
  id: string;
  title: string;
  products: ProductType[];
  viewAllLink?: string;
};

// Skeleton component for product cards
const ProductCardSkeleton = () => (
  <div className="flex-none snap-start">
    <div className="w-[120px] xs:w-[150px] sm:w-[210px] md:w-[240px] lg:w-[280px] bg-white dark:bg-gray-800 overflow-hidden rounded-lg">
      {/* Image Container Skeleton */}
      <div className="relative h-28 xs:h-36 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        
        {/* Badge skeletons */}
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1 sm:gap-1.5">
          <div className="h-5 xs:h-6 sm:h-7 w-12 xs:w-14 sm:w-16 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-md"></div>
        </div>
        
        {/* Wishlist button skeleton */}
        <div className="absolute right-1 top-1 sm:right-2 sm:top-2">
          <div className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full"></div>
        </div>
      </div>
      
      {/* Product Info Skeleton */}
      <div className="p-1.5 xs:p-2 sm:p-3 md:p-4">
        {/* Title skeleton */}
        <div className="space-y-1 mb-2">
          <div className="h-3 xs:h-3.5 sm:h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full"></div>
          <div className="h-3 xs:h-3.5 sm:h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4"></div>
        </div>
        
        {/* Availability badge skeleton */}
        <div className="h-4 xs:h-5 sm:h-6 w-16 xs:w-18 sm:w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-1 xs:mb-1.5 sm:mb-2"></div>
        
        {/* Price skeleton */}
        <div className="flex items-baseline flex-wrap gap-1 mb-1">
          <div className="h-4 xs:h-5 sm:h-6 w-12 xs:w-14 sm:w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="h-3 xs:h-4 sm:h-5 w-8 xs:w-10 sm:w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
        
        {/* Delivery info skeleton */}
        <div className="h-3 xs:h-3.5 sm:h-4 w-20 xs:w-24 sm:w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    </div>
  </div>
);

// Skeleton component for product category
const ProductCategorySkeleton = () => (
  <section className="py-3 sm:py-4 md:py-6 px-2 sm:px-3 md:px-4 bg-white dark:bg-gray-800 rounded-lg my-2 sm:my-3">
    <div className="w-full">
      {/* Title and View All skeleton */}
      <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 px-2">
        <div className="h-6 sm:h-7 md:h-8 w-48 sm:w-56 md:w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        <div className="h-4 sm:h-5 w-16 sm:w-18 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
      
      <div className="relative">
        {/* Left scroll button skeleton */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
        
        {/* Products container skeleton */}
        <div className="flex overflow-hidden gap-2 xs:gap-3 sm:gap-4 py-4 sm:py-5 md:py-6 px-2 sm:px-3 md:px-4">
          {[...Array(6)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
        
        {/* Right scroll button skeleton */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
        
        {/* Mobile scroll indicator dots skeleton */}
        <div className="flex justify-center mt-2 md:hidden">
          <div className="flex space-x-1.5">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main skeleton component for the entire section
const ProductCategoriesSkeleton = () => (
  <div className="w-full py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50/60 dark:bg-gray-900/80 px-2 sm:px-3 md:px-4">
    {[...Array(3)].map((_, index) => (
      <ProductCategorySkeleton key={index} />
    ))}
  </div>
);

// Sample data for reference - not used in production

// export const categories: CategoryType[] = [
//   {
//     id: 'apparel',
//     title: 'Trendy Apparel Collections',
//     products: [
//       {
//         id: 'apparel1',
//         title: 'Men\'s Premium Cotton T-Shirt',
//         image: 'https://i.pinimg.com/736x/eb/64/5f/eb645f0fc63967878657fe0bbb45fbaf.jpg',
//         price: 799,
//         originalPrice: 1299,
//         link: '/products/mens-premium-tshirt',
//         badge: 'Bestseller',
//         rating: 4.6,
//         reviewCount: 1256,
//         hasFreeDel: true
//       },
//       {
//         id: 'apparel2',
//         title: 'Women\'s Casual Denim Jacket',
//         image: 'https://i.pinimg.com/736x/fc/a7/02/fca7024e2f8e532e2cc166c3821cc0d7.jpg',
//         price: 1499,
//         originalPrice: 2999,
//         link: '/products/womens-denim-jacket',
//         badge: 'Sale',
//         rating: 4.8,
//         reviewCount: 724,
//         hasFreeDel: true
//       },
//       {
//         id: 'apparel3',
//         title: 'Unisex Urban Streetwear Hoodie',
//         image: 'https://i.pinimg.com/736x/bd/dd/32/bddd325200aed5e2ba8ff21ab60ce548.jpg',
//         price: 1299,
//         originalPrice: 1699,
//         link: '/products/urban-hoodie',
//         rating: 4.5,
//         reviewCount: 892,
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'apparel4',
//         title: 'Women\'s Floral Summer Dress',
//         image: 'https://i.pinimg.com/736x/f9/85/38/f9853803568422d1d37686cef5b53816.jpg',
//         price: 999,
//         originalPrice: 1499,
//         link: '/products/summer-dress',
//         hasFreeDel: true,
//         isAssured: true,
//         rating: 4.7,
//         reviewCount: 458
//       },
//       {
//         id: 'apparel5',
//         title: 'Men\'s Slim Fit Formal Shirt',
//         image: 'https://i.pinimg.com/736x/ae/76/42/ae7642deb365d2a86cb7e3731f1d9e44.jpg',
//         price: 899,
//         originalPrice: 1399,
//         link: '/products/formal-shirt',
//         badge: 'New',
//         hasFreeDel: true,
//         rating: 4.4,
//         reviewCount: 312
//       },
//       {
//         id: 'apparel6',
//         title: 'Premium Leather Fashion Belt',
//         image: 'https://i.pinimg.com/736x/af/bf/4d/afbf4dbefe77429dd18188086e3d5ef3.jpg',
//         price: 599,
//         originalPrice: 999,
//         link: '/products/leather-belt',
//         hasFreeDel: true,
//         rating: 4.3,
//         reviewCount: 189
//       }
//     ]
//   },
//   {
//     id: 'electronics',
//     title: 'Best of Electronics',
//     products: [
//       {
//         id: 'earbuds1',
//         title: 'Best Truewireless Headphones',
//         image: 'https://i.pinimg.com/736x/3a/e5/59/3ae5591d2fdb0d1f35f31ccc23edc668.jpg',
//         discount: 'Grab Now',
//         link: '/products/earbuds1',
//         rating: 4.3,
//         reviewCount: 5620,
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'watch1',
//         title: 'Fastrack Smartwatch',
//         image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
//         price: 1399,
//         link: '/products/watch1',
//         rating: 4.1,
//         reviewCount: 2340,
//         isAssured: true,
//         deliveryInfo: 'Delivery in 2 days',
//         hasFreeDel: false
//       },
//       {
//         id: 'speaker1',
//         title: 'Best Selling Mobile Speakers',
//         image: 'https://i.pinimg.com/736x/28/5e/6b/285e6b926bef59d5f959a7650eec9b0a.jpg',
//         price: 499,
//         badge: 'New',
//         link: '/products/speaker1',
//         rating: 4.5,
//         reviewCount: 1200,
//         hasFreeDel: true
//       },
//       {
//         id: 'printer1',
//         title: 'Printers',
//         image: 'https://i.pinimg.com/736x/b9/1e/06/b91e06812ac1da3415a79a92cf3c7a57.jpg',
//         price: 2336,
//         link: '/products/printer1',
//         rating: 3.9,
//         reviewCount: 456,
//         deliveryInfo: 'Delivery in 3-5 days',
//         hasFreeDel: false
//       },
//       {
//         id: 'monitor1',
//         title: 'ViewSonic Monitors',
//         image: 'https://i.pinimg.com/736x/5a/af/2d/5aaf2d7a2a42ef5ae331be52af642141.jpg',
//         price: 8000,
//         link: '/products/monitor1',
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'monitor2',
//         title: 'ASUS Monitors',
//         image: 'https://i.pinimg.com/736x/61/c3/b4/61c3b487a6a8a81289e5724da8966fb9.jpg',
//         price: 14999,
//         link: '/products/monitor2',
//         rating: 4.7,
//         reviewCount: 3245,
//         isAssured: true,
//         hasFreeDel: true
//       }
//     ]
//   },
//   {
//     id: 'beauty-toys',
//     title: 'Beauty, Food, Toys & more',
//     products: [
//       {
//         id: 'coffee1',
//         title: 'Coffee Powder',
//         image: 'https://i.pinimg.com/736x/e0/73/42/e0734299d874d8860b92ddd63f60abf2.jpg',
//         discount: 'Upto 80% Off',
//         link: '/products/coffee1',
//         rating: 4.2,
//         reviewCount: 980,
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'cycle1',
//         title: 'Geared Cycles',
//         image: 'https://i.pinimg.com/736x/19/46/73/19467334321de7f27e8b24cca0ecb8a0.jpg',
//         discount: 'Up to 70% Off',
//         link: '/products/cycle1',
//         rating: 4.0,
//         reviewCount: 560,
//         deliveryInfo: 'Delivery by Tomorrow',
//         hasFreeDel: true
//       },
//       {
//         id: 'stationery1',
//         title: 'Top Selling Stationery',
//         image: 'https://i.pinimg.com/736x/6d/95/6c/6d956cee37967a3fdd91bb665ce254c6.jpg',
//         price: 49,
//         link: '/products/stationery1',
//         rating: 4.6,
//         reviewCount: 1350,
//         hasFreeDel: false,
//         deliveryInfo: 'Standard Delivery'
//       },
//       {
//         id: 'toys1',
//         title: 'Best of Action Toys',
//         image: 'https://i.pinimg.com/736x/00/69/d8/0069d8aa9665cde19bdc8545b5c715dc.jpg',
//         discount: 'Up to 70% Off',
//         link: '/products/toys1',
//         rating: 3.8,
//         reviewCount: 230,
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'toys2',
//         title: 'Soft Toys',
//         image: 'https://i.pinimg.com/736x/38/a9/9e/38a99ef27007cfae409d65c0b935c9d8.jpg',
//         discount: 'Upto 70% Off',
//         link: '/products/toys2',
//         rating: 4.4,
//         reviewCount: 785,
//         hasFreeDel: true
//       },
//       {
//         id: 'cycle2',
//         title: 'Electric Cycle',
//         image: 'https://i.pinimg.com/736x/00/69/d8/0069d8aa9665cde19bdc8545b5c715dc.jpg',
//         discount: 'Up to 40% Off',
//         link: '/products/cycle2',
//         rating: 4.1,
//         reviewCount: 342,
//         isAssured: true,
//         deliveryInfo: 'Ships in 7 days',
//         hasFreeDel: false
//       }
//     ]
//   },
//   {
//     id: 'sports-healthcare',
//     title: 'Sports, Healthcare & more',
//     products: [
//       {
//         id: 'treadmill1',
//         title: 'Treadmill, Exercise Bike',
//         image: 'https://i.pinimg.com/736x/a2/85/7a/a2857ad17b6cb53f480ac499f8a40803.jpg',
//         discount: 'Up to 70% Off',
//         link: '/products/treadmill1',
//         rating: 4.3,
//         reviewCount: 428,
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'food1',
//         title: 'Food Spreads',
//         image: 'https://i.pinimg.com/736x/b9/12/be/b912be58fd415901f4cb65e084b6b337.jpg',
//         discount: 'Upto 75% Off',
//         link: '/products/food1',
//         rating: 4.5,
//         reviewCount: 1890,
//         hasFreeDel: true
//       },
//       {
//         id: 'toys3',
//         title: 'Remote Control Toys',
//         image: 'https://i.pinimg.com/736x/6b/ce/ce/6bcece46051787173cac6ae13050f206.jpg',
//         discount: 'Up to 80% Off',
//         link: '/products/toys3',
//         rating: 3.9,
//         reviewCount: 675,
//         isAssured: true,
//         hasFreeDel: true
//       },
//       {
//         id: 'yoga1',
//         title: 'Yoga Mat',
//         image: 'https://i.pinimg.com/736x/0e/55/69/0e55697e3dee530d9dd3c3cb2b447930.jpg',
//         price: 159,
//         link: '/products/yoga1',
//         rating: 4.7,
//         reviewCount: 3200,
//         isAssured: true,
//         deliveryInfo: 'Express Delivery',
//         hasFreeDel: false
//       },
//       {
//         id: 'puzzle1',
//         title: 'Puzzles & Cubes',
//         image: 'https://i.pinimg.com/736x/80/d6/8c/80d68cb05a994d6d6be60134d4e79f16.jpg',
//         price: 79,
//         link: '/products/puzzle1',
//         rating: 4.2,
//         reviewCount: 520,
//         hasFreeDel: true
//       },
//       {
//         id: 'food2',
//         title: 'Dry Fruits',
//         image: 'https://i.pinimg.com/736x/a4/18/81/a4188147397c64114fc1b61e41e93c63.jpg',
//         discount: 'Upto 75% Off',
//         link: '/products/food2',
//         rating: 4.8,
//         reviewCount: 2450,
//         isAssured: true,
//         hasFreeDel: true
//       }
//     ]
//   }
// ];


export function ProductCategorySection() {
  const { categoryTree, isLoading: isCategoriesLoading } = useCategories();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreProducts, setHasMoreProducts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (categoryTree.length === 0 || isCategoriesLoading) return;
      
      try {
        setIsLoading(true);
        // Get top-level categories only
        const topLevelCategories = categoryTree.filter(cat => !cat.parentId);
        
        // Get up to 6 top categories
        const categoriesToDisplay = topLevelCategories.slice(0, 6);
        
        // Array to store categories with their products
        const categoriesWithProducts: CategoryType[] = [];
        const moreProductsFlags: Record<string, boolean> = {};
        
        // Fetch products for each top-level category using the service
        for (const category of categoriesToDisplay) {
          try {
            // Set up parameters for the API call
            const params: ProductFilterParams = {
              page: 1,
              limit: 6, // Display up to 6 products per category
              sortBy: 'title',
              sortOrder: 'asc'
            };
            
            // Use our service instead of direct API call
            const result = await getCategoryProductsRecursive(category.id, params);
            
            if (result.error) {
              console.warn(`Warning for category ${category.name || category.id}: ${result.error}`);
              continue;
            }
            
            // Add the category if we have products
            if (result.categoryWithProducts) {
              // Convert from CategoryWithProducts to local CategoryType
              categoriesWithProducts.push({
                id: result.categoryWithProducts.id,
                title: result.categoryWithProducts.title,
                products: result.categoryWithProducts.products.map(p => ({
                  id: p.id,
                  title: p.title,
                  image: p.image,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  link: p.link,
                  badge: p.badge,
                  rating: p.rating,
                  reviewCount: p.reviewCount,
                  currency: p.currency,
                  isAssured: p.isAssured,
                  deliveryInfo: p.deliveryInfo,
                  hasFreeDel: p.hasFreeDel,
                  discount: p.discount,
                  
                  // Enhanced fields for ProductCard
                  subtitle: p.subtitle,
                  colorVariants: p.colorVariants,
                  bankOffer: p.bankOffer,
                  exchangeOffer: p.exchangeOffer,
                  isNew: p.isNew,
                  isBestSeller: p.isBestSeller,
                  isSponsored: p.isSponsored,
                  sponsoredTag: p.sponsoredTag,
                  isLimitedDeal: p.isLimitedDeal,
                })),
                viewAllLink: result.categoryWithProducts.viewAllLink
              });
              moreProductsFlags[category.id] = result.hasMore;
            }
          } catch (err) {
            console.error(`Error fetching products for category ${category.name || category.id}:`, err);
          }
        }
        
        setCategories(categoriesWithProducts);
        setHasMoreProducts(moreProductsFlags);
        setError(null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load product categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryTree, isCategoriesLoading]);

  if (isLoading || isCategoriesLoading) {
    return <ProductCategoriesSkeleton />;
  }

  if (error) {
    return <div className="w-full py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50/60 dark:bg-gray-900/80 px-2 sm:px-3 md:px-4">
      <div className="py-8 text-center text-red-500">{error}</div>
    </div>;
  }

  // No categories or no products found
  if (categories.length === 0) {
    return <div className="w-full py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50/60 dark:bg-gray-900/80 px-2 sm:px-3 md:px-4">
      <div className="py-8 text-center text-gray-500">No products found</div>
    </div>;
  } 

  return (
    <div className="w-full py-2 sm:py-3 md:py-4 space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50/60 dark:bg-gray-900/80 px-2 sm:px-3 md:px-4">
      {categories.map((category) => (
        <ProductCategory 
          key={category.id}
          title={category.title}
          products={category.products}
          viewAllLink={hasMoreProducts[category.id] ? category.viewAllLink : undefined}
        />
      ))}
    </div>
  );
} 