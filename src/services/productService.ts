import type { Product } from '@/types/product';
import { trendingProductsData } from '@/data/trendingProducts';
import { productsApi } from '@/lib/api/products-api';

// Fallback deal of the day for when API fails
const fallbackDealOfTheDay = {
  id: "deal-fallback",
  title: "Premium Espresso Machine",
  slug: "premium-espresso-machine",
  price: 399.99,
  originalPrice: 599.99,
  discount: 33,
  currency: "USD",
  averageRating: 4.8,
  reviewCount: 142,
  imageSrc: "https://i.pinimg.com/736x/91/fb/55/91fb55d198e4c999f4436dc991958d51.jpg",
  features: ["15 bar pressure", "Milk frother", "Programmable", "Energy efficient"],
  highlights: ["Italian design", "2-year warranty", "Auto cleaning function"],
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  stockQuantity: 15,
  isActive: true,
  isFeatured: true,
  images: [{
    id: "img1",
    imageUrl: "https://i.pinimg.com/736x/91/fb/55/91fb55d198e4c999f4436dc991958d51.jpg",
    altText: "Premium Espresso Machine",
    position: 1
  }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Helper function to map API product to the format used by the TrendingProducts component
function mapApiProductToTrendingProduct(apiProduct: any): any {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    price: apiProduct.originalPrice ? 
      (typeof apiProduct.originalPrice === 'string' ? parseFloat(apiProduct.originalPrice) : apiProduct.originalPrice) : 
      (typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : apiProduct.price),
    discountPrice: apiProduct.originalPrice ? 
      (typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : apiProduct.price) : 
      undefined,
    rating: apiProduct.averageRating || apiProduct.rating || 0,
    currency: apiProduct.currency || 'INR',
    reviewCount: apiProduct.reviewCount || 0,
    imageSrc: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0].imageUrl : '',
    badge: apiProduct.badge,
    slug: apiProduct.slug
  };
}

// Fetch products by category slug
export async function getProductsByCategorySlug(
  categorySlug: string,
  recursive: boolean = true,
  params: any = {}
): Promise<any> {
  try {
    // Use the API service to fetch products by category slug
    const response = await productsApi.getProductsByCategorySlug(
      categorySlug,
      recursive,
      params
    );
    
    console.log('API Response via productService:', response);
    
    // Return the raw response to let the component handle it
    return response;
  } catch (error: any) {
    // Better error reporting
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    console.error(`Error fetching products for category slug ${categorySlug}:`, error);
    
    // Return empty response object with products array
    return { 
      statusCode: error.response?.status || 0, 
      message: error.response?.data?.message || 'Failed to retrieve products',
      data: { data: [], total: 0 } 
    };
  }
}

// Fetch trending products
export async function getTrendingProducts(limit?: number): Promise<Product[]> {
  try {
    // Use the API service to fetch trending products
    const products = await productsApi.getTrendingProducts(limit, 1);
    
    // Map the API response to the format expected by the TrendingProducts component
    return products.map(mapApiProductToTrendingProduct);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    // Fallback to mock data if API call fails
    console.warn('Falling back to mock data for trending products');
    return limit ? trendingProductsData.slice(0, limit) : trendingProductsData;
  }
}

// Fetch a single product by ID
export async function getProductById(id: string | number): Promise<Product | null> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the product in our mock data
    const product = trendingProductsData.find(product => product.id === id);
    return product || null;
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch product with ID ${id}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// Fetch deal of the day
export async function getDealOfTheDay(): Promise<Product | null> {
  try {
    // Use the API service to fetch deal of the day product
    const products = await productsApi.getDealOfTheDay();
    
    // Map the API response to the format expected by the component
    if (products && products.length > 0) {
      const dealProduct = mapApiProductToTrendingProduct(products[0]);
      return {
        ...dealProduct,
        features: dealProduct.features || dealProduct.highlights || []
      };
    }
    console.warn('No deal of the day products returned from API, using fallback');
    return fallbackDealOfTheDay as Product;
  } catch (error) {
    console.error('Error fetching deal of the day:', error);
    // Return fallback if API call fails
    console.warn('Using fallback deal of the day');
    return fallbackDealOfTheDay as Product;
  }
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(`${PRODUCTS_ENDPOINT}/slug/${slug}`);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the product in our mock data
    const product = trendingProductsData.find(product => product.slug === slug);
    return product || null;
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch product with slug ${slug}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

// Search products by keyword
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(`${PRODUCTS_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple search implementation on mock data
    const searchResults = trendingProductsData.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    return searchResults;
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error(`Failed to search products with query ${query}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error(`Error searching products with query ${query}:`, error);
    return [];
  }
} 