import { Product } from '@/types';

// Mock products for development
const mockProducts: Record<string, Product> = {
  'product-1': {
    id: 'product-1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 199.99,
    images: ['/images/products/headphones-1.jpg', '/images/products/headphones-2.jpg'],
    slug: 'wireless-headphones',
    category: 'Electronics',
    stock: 50,
    tenantId: 'tenant1',
    features: ['Noise cancellation', 'Bluetooth 5.0', '30-hour battery life'],
    specifications: {
      'Weight': '250g',
      'Battery': '500mAh',
      'Charging': 'USB-C',
      'Warranty': '2 years'
    }
  },
  'product-2': {
    id: 'product-2',
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected with this smart watch.',
    price: 299.99,
    images: ['/images/products/watch-1.jpg', '/images/products/watch-2.jpg'],
    slug: 'smart-watch',
    category: 'Electronics',
    stock: 30,
    tenantId: 'tenant1',
    features: ['Heart rate monitor', 'GPS', 'Water resistant', '7-day battery life'],
    specifications: {
      'Weight': '45g',
      'Display': 'AMOLED',
      'Battery': '300mAh',
      'Compatibility': 'iOS, Android',
      'Warranty': '1 year'
    }
  },
  'product-3': {
    id: 'product-3',
    name: 'Designer Backpack',
    description: 'Stylish and functional backpack for everyday use.',
    price: 89.99,
    images: ['/images/products/backpack-1.jpg', '/images/products/backpack-2.jpg'],
    slug: 'designer-backpack',
    category: 'Fashion',
    stock: 100,
    tenantId: 'tenant2',
    features: ['Water resistant', 'Laptop compartment', 'Multiple pockets'],
    specifications: {
      'Material': 'Polyester',
      'Capacity': '25L',
      'Dimensions': '45cm x 30cm x 15cm',
      'Weight': '0.8kg'
    }
  }
};

/**
 * Get all products for a tenant
 */
export async function getProducts(tenantId: string): Promise<Product[]> {
  // In a real app, this would make an API request to fetch products
  // For development, we'll filter our mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Object.values(mockProducts).filter(product => product.tenantId === tenantId);
}

/**
 * Get a product by slug
 */
export async function getProductBySlug(slug: string, tenantId: string): Promise<Product | null> {
  // In a real app, this would make an API request to fetch a product
  // For development, we'll filter our mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = Object.values(mockProducts).find(
    p => p.slug === slug && p.tenantId === tenantId
  );
  
  return product || null;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string, tenantId: string): Promise<Product[]> {
  // In a real app, this would make an API request to fetch products by category
  // For development, we'll filter our mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Object.values(mockProducts).filter(
    product => product.category === category && product.tenantId === tenantId
  );
}

/**
 * Search products
 */
export async function searchProducts(query: string, tenantId: string): Promise<Product[]> {
  // In a real app, this would make an API request to search products
  // For development, we'll filter our mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const lowerQuery = query.toLowerCase();
  
  return Object.values(mockProducts).filter(product => 
    (product.name.toLowerCase().includes(lowerQuery) || 
     product.description.toLowerCase().includes(lowerQuery)) && 
    product.tenantId === tenantId
  );
} 