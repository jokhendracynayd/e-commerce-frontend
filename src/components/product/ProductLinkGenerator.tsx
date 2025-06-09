'use client';

import React, { useMemo } from 'react';
import { getCanonicalProductUrl } from '@/utils/url-utils';
import { ProductDetail } from '@/types/product';

export type ProductLinkProps = {
  product: {
    id: string;
    slug: string;
    categories?: { id: string; name: string; slug: string }[];
  };
};

/**
 * Utility hook to generate consistent SEO-friendly product URLs
 * 
 * @param product The product object containing id, slug, and optionally categories
 * @returns SEO-friendly product URL
 */
export function useProductLink(product: ProductLinkProps['product']): string {
  return useMemo(() => {
    const category = product.categories && product.categories.length > 0 
      ? product.categories[0].name 
      : undefined;
    
    return getCanonicalProductUrl(product.slug, product.id, category);
  }, [product]);
}

/**
 * Gets a SEO-friendly product URL without React hooks
 * Useful for server components or non-React contexts
 * 
 * @param product The product object
 * @returns SEO-friendly product URL
 */
export function getProductLink(product: ProductLinkProps['product']): string {
  const category = product.categories && product.categories.length > 0 
    ? product.categories[0].name 
    : undefined;
  
  return getCanonicalProductUrl(product.slug, product.id, category);
}

/**
 * Wrapper component for links that converts a product object to a URL
 * This is just an example - generally you'd use the hooks above directly
 */
export function ProductLink({ 
  product, 
  children 
}: ProductLinkProps & { children: React.ReactNode }): React.ReactElement {
  const url = useProductLink(product);
  
  return (
    <a href={url}>
      {children}
    </a>
  );
} 