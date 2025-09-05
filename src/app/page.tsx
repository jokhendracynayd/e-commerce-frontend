import Image from "next/image";
import { Showcase } from "@/components/Showcase";
import { ProductCategorySection } from "@/components/product/ProductCategorySection";
import { CategoryNavigation } from "@/components/product/CategoryNavigation";
import { CategoryGroups } from "@/components/product/CategoryGroups";
import { TrendingProducts } from "@/components/product/TrendingProducts";
import { DealOfTheDay } from "@/components/product/DealOfTheDay";
import { getCategoryGroups } from "@/services/categoryService";
import { getTrendingProducts, getDealOfTheDay } from "@/services/productService";
import RecentlyViewedProducts from "@/components/product/RecentlyViewedProducts";
import TrendingRecommendations from "@/components/product/TrendingRecommendations";

// Use proper server component data fetching
export default async function Home() {
  // Fetch category groups from the service
  const categoryGroups = await getCategoryGroups();
  
  // Fetch trending products from the service
  const trendingProducts = await getTrendingProducts(4);
  
  // Fetch deal of the day from the service
  const dealOfTheDay = await getDealOfTheDay();
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Category Navigation Section */}
      <CategoryNavigation />

      {/* Showcase/Carousel Section */}
      <Showcase />

      {/* Trending Products Section */}
      <TrendingRecommendations />
    
      {/* Product Categories Section */}
      <ProductCategorySection />

      {/* Recently Viewed Products Section */}
      <RecentlyViewedProducts />

      {/* Category Groups Section */}
      {/* <CategoryGroups groups={categoryGroups} /> */}
      
      {/* Trending Products Section */}
      <TrendingProducts products={trendingProducts} />
      
      {/* Deal of the Day Section */}
      <DealOfTheDay dealProduct={dealOfTheDay} />
    </div>
  );
}
