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
      <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-8">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center mb-4 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#d44506] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="relative">
                Deal of the Day
                <span className="absolute -bottom-1 left-0 w-2/3 h-1 bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hidden sm:block"></span>
              </span>
            </h2>
            <div className="flex gap-2 sm:gap-3 text-sm sm:text-base">
              <div className="bg-gray-900 dark:bg-gray-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-sm flex flex-col items-center min-w-[38px] sm:min-w-[44px]">
                <span className="font-bold">10</span>
                <span className="text-[10px] text-gray-300">HOURS</span>
              </div>
              <span className="text-gray-500 my-auto">:</span>
              <div className="bg-gray-900 dark:bg-gray-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-sm flex flex-col items-center min-w-[38px] sm:min-w-[44px]">
                <span className="font-bold">24</span>
                <span className="text-[10px] text-gray-300">MINS</span>
              </div>
              <span className="text-gray-500 my-auto">:</span>
              <div className="bg-gray-900 dark:bg-gray-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-sm flex flex-col items-center min-w-[38px] sm:min-w-[44px]">
                <span className="font-bold">36</span>
                <span className="text-[10px] text-gray-300">SECS</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg hover:shadow-md transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden aspect-square sm:aspect-auto sm:h-[350px] md:h-full">
                <Image 
                  src={dealOfTheDay.imageSrc} 
                  alt={dealOfTheDay.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  quality={90}
                />
                <div className="absolute top-4 left-4 bg-gradient-to-br from-[#d44506] to-[#ed875a] text-white text-base sm:text-lg font-bold w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-full shadow-lg transform -rotate-3">
                  <span>{dealOfTheDay.discount}%</span>
                  <span className="text-xs font-medium">OFF</span>
                </div>
              </div>
              <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {dealOfTheDay.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    ${dealOfTheDay.currentPrice}
                  </span>
                  <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${dealOfTheDay.originalPrice}
                  </span>
                  <span className="text-xs sm:text-sm font-medium px-2 py-0.5 bg-[#ed875a]/10 text-[#ed875a] rounded-sm">
                    Save ${dealOfTheDay.savings}
                  </span>
                </div>
                <div className="mb-4 sm:mb-6">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Key Features:</div>
                  <ul className="space-y-1.5">
                    {dealOfTheDay.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#ed875a] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button className="bg-gradient-to-r from-[#ed875a] to-[#ed8c61] hover:shadow-md text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-sm transition-all duration-300 hover:translate-y-[1px]">
                    Buy Now
                  </button>
                  <button className="bg-white dark:bg-gray-700 border border-[#ed875a] text-[#ed875a] dark:text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 hover:bg-[#ed875a]/5 transition-all duration-300 rounded-sm flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
                <div className="mt-4 sm:mt-5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Offer ends in limited time
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
