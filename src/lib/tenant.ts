import { headers } from 'next/headers';
import { Tenant } from '@/types';

// In a real application, this would fetch from a database or API
const mockTenants: Record<string, Tenant> = {
  'tenant1': {
    id: 'tenant1',
    name: 'Tenant 1 Store',
    domain: 'tenant1.example.com',
    plan: 'basic',
    settings: {
      logo: '/logos/tenant1-logo.svg',
      primaryColor: '#2563eb',
      secondaryColor: '#9333ea',
      fontFamily: 'Inter',
      features: {
        multiCurrency: false,
        advancedAnalytics: false,
        customCheckout: false,
        aiRecommendations: false
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'tenant2': {
    id: 'tenant2',
    name: 'Tenant 2 Premium',
    domain: 'tenant2.example.com',
    plan: 'premium',
    settings: {
      logo: '/logos/tenant2-logo.svg',
      primaryColor: '#0891b2',
      secondaryColor: '#4f46e5',
      fontFamily: 'Poppins',
      customDomain: 'shop.tenant2.com',
      features: {
        multiCurrency: true,
        advancedAnalytics: true,
        customCheckout: true,
        aiRecommendations: true
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

/**
 * Get the current tenant from the request headers
 * This is set by the middleware
 */
export async function getCurrentTenant(): Promise<Tenant | null> {
  if (typeof window !== 'undefined') {
    // Client-side: We can't use headers() as it's server-side only
    // In a real app, you might get this from a global state or context
    // For demo purposes, we'll return a default tenant
    return mockTenants['tenant1'];
  }

  // Server-side
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  if (!tenantId) {
    // Default tenant for development
    return mockTenants['tenant1'];
  }
  
  return mockTenants[tenantId] || null;
}

/**
 * Check if a tenant exists by domain
 */
export function getTenantByDomain(domain: string): Tenant | null {
  const tenant = Object.values(mockTenants).find(
    t => t.domain === domain || t.settings.customDomain === domain
  );
  
  return tenant || null;
}

/**
 * Get tenant-specific configuration
 */
export function getTenantConfig(tenantId: string) {
  const tenant = mockTenants[tenantId];
  
  if (!tenant) {
    return {
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#9333ea',
        fontFamily: 'Inter'
      },
      features: {
        multiCurrency: false,
        advancedAnalytics: false,
        customCheckout: false,
        aiRecommendations: false
      }
    };
  }
  
  return {
    theme: {
      primaryColor: tenant.settings.primaryColor || '#2563eb',
      secondaryColor: tenant.settings.secondaryColor || '#9333ea',
      fontFamily: tenant.settings.fontFamily || 'Inter'
    },
    features: tenant.settings.features
  };
} 