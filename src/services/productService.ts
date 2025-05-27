import { Product } from '@/components/product/TrendingProducts';
import { trendingProductsData } from '@/data/trendingProducts';

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;
const TRENDING_PRODUCTS_ENDPOINT = `${API_BASE_URL}/products/trending`;

// Fetch trending products
export async function getTrendingProducts(limit?: number): Promise<Product[]> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(`${TRENDING_PRODUCTS_ENDPOINT}?limit=${limit || 8}`);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data with optional limit
    const products = limit ? trendingProductsData.slice(0, limit) : trendingProductsData;
    return products;
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error('Failed to fetch trending products');
    // }
    // return await response.json();
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
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