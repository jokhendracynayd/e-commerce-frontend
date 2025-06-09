/**
 * URL utility functions for SEO-friendly product links
 */

/**
 * Generates a Meesho-style SEO-friendly URL for a product
 * Format: /product-slug/p/product-id
 * 
 * @param productSlug The product slug
 * @param productId The product ID
 * @returns SEO-friendly URL
 */
export const generateMeeshoStyleUrl = (productSlug: string, productId: string): string => {
  return `/${productSlug}/p/${productId}`;
};

/**
 * Generates a category-product SEO-friendly URL
 * Format: /category/product-slug-product-id
 * 
 * @param category The category name or slug
 * @param productSlug The product slug
 * @param productId The product ID
 * @returns SEO-friendly URL
 */
export const generateCategoryProductUrl = (
  category: string,
  productSlug: string, 
  productId: string
): string => {
  // Convert category to URL-friendly slug if needed
  const categorySlug = category
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `/${categorySlug}/${productSlug}-${productId}`;
};

/**
 * Determines the canonical URL for a product
 * This is useful for SEO to avoid duplicate content issues
 * 
 * @param productSlug The product slug
 * @param productId The product ID
 * @param category Optional category
 * @returns The canonical URL
 */
export const getCanonicalProductUrl = (
  productSlug: string,
  productId: string,
  category?: string
): string => {
  // Prefer category-based URL if category is available
  if (category) {
    return generateCategoryProductUrl(category, productSlug, productId);
  }
  
  // Fall back to Meesho-style URL
  return generateMeeshoStyleUrl(productSlug, productId);
}; 