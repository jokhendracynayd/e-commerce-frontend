import Image from "next/image";
import { Showcase } from "@/components/Showcase";
import { ProductCategorySection } from "@/components/product/ProductCategorySection";
import { CategoryNavigation } from "@/components/product/CategoryNavigation";
import { CategoryGroups } from "@/components/product/CategoryGroups";
import { TrendingProducts } from "@/components/product/TrendingProducts";
import { DealOfTheDay } from "@/components/product/DealOfTheDay";
import { PageViewTracker } from "@/components/tracking/PageViewTracker";
import { getCategoryGroups } from "@/services/categoryService";
import { getTrendingProducts, getDealOfTheDay } from "@/services/productService";

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
      {/* Page View Tracking */}
      <PageViewTracker 
        pageCategory="home"
        metadata={{
          categoriesCount: categoryGroups.length,
          trendingProductsCount: trendingProducts.length,
          hasDealOfTheDay: !!dealOfTheDay
        }}
      />
      
      {/* Category Navigation Section */}
      <CategoryNavigation />

      {/* Showcase/Carousel Section */}
      <Showcase />
    
      {/* Product Categories Section */}
      <ProductCategorySection />
      
      {/* Category Groups Section */}
      <CategoryGroups groups={categoryGroups} />
      
      {/* Trending Products Section */}
      <TrendingProducts products={trendingProducts} />
      
      {/* Deal of the Day Section */}
      <DealOfTheDay dealProduct={dealOfTheDay} />
    </div>
  );
}
