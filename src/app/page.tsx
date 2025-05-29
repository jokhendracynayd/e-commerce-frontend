import Image from "next/image";
import { Showcase } from "@/components/Showcase";
import { ProductCategorySection } from "@/components/product/ProductCategorySection";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { CategoryGroups } from "@/components/product/CategoryGroups";
import { TrendingProducts } from "@/components/product/TrendingProducts";
import { getCategoryGroups } from "@/services/categoryService";
import { getTrendingProducts } from "@/services/productService";

export default async function Home() {
  // Fetch category groups from the service
  const categoryGroups = await getCategoryGroups();
  
  // Fetch trending products from the service
  const trendingProducts = await getTrendingProducts(4);
  
  // Sample deals data - in a real app, this would come from an API
  const dealOfTheDay = {
    id: 8,
    name: "Premium Espresso Machine",
    originalPrice: 599.99,
    currentPrice: 399.99,
    savings: 200,
    discount: 33,
    imageSrc: "https://i.pinimg.com/736x/91/fb/55/91fb55d198e4c999f4436dc991958d51.jpg",
    features: ["15 bar pressure", "Milk frother", "Programmable", "Energy efficient"],
    endTime: "2023-12-31T23:59:59"
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
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
      <section className="pb-6 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#d44506] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Deal of the Day
            </h2>
            <div className="flex gap-1 text-sm">
              <div className="bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5">10</div>
              <span className="text-gray-500 my-auto">:</span>
              <div className="bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5">24</div>
              <span className="text-gray-500 my-auto">:</span>
              <div className="bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5">36</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden h-80 md:h-auto">
                <Image 
                  src={dealOfTheDay.imageSrc} 
                  alt={dealOfTheDay.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#d44506] text-white text-lg font-bold w-16 h-16 flex flex-col items-center justify-center">
                  <span>{dealOfTheDay.discount}%</span>
                  <span className="text-xs">OFF</span>
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {dealOfTheDay.name}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    ${dealOfTheDay.currentPrice}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${dealOfTheDay.originalPrice}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#ed875a' }}>
                    Save ${dealOfTheDay.savings}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Key Features:</div>
                  <ul className="space-y-1">
                    {dealOfTheDay.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ed875a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-md text-white font-medium py-3 px-6 transition-all duration-300">
                    Buy Now
                  </button>
                  <button className="bg-white dark:bg-gray-700 border border-[#ed875a] text-[#ed875a] dark:text-white font-medium py-3 px-6 hover:bg-[#ed875a]/5 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
