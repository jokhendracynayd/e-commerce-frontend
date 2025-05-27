// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  tenantId?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  category: string;
  stock: number;
  tenantId: string;
  features?: string[];
  specifications?: Record<string, string>;
  relatedProducts?: string[];
}

// Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Address type
export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Tenant types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'free' | 'basic' | 'premium';
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  customDomain?: string;
  features: {
    multiCurrency: boolean;
    advancedAnalytics: boolean;
    customCheckout: boolean;
    aiRecommendations: boolean;
  }
} 