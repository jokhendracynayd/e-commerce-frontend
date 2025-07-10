import { specificationsApi } from '@/lib/api/specifications-api';
import type { ProductSpecification, GroupedProductSpecifications } from '@/types/specifications';

// Product Specification Service
export async function getProductSpecifications(
  productId: string
): Promise<ProductSpecification[]> {
  try {
    return await specificationsApi.getProductSpecifications(productId);
  } catch (error) {
    console.error(
      `Error fetching product specifications for product ${productId}:`,
      error
    );
    return [];
  }
}

/**
 * Get grouped specifications for a product
 */
export async function getGroupedProductSpecifications(
  productId: string
): Promise<GroupedProductSpecifications[]> {
  try {
    return await specificationsApi.getGroupedProductSpecifications(productId);
  } catch (error) {
    console.error(
      `Error fetching grouped product specifications for product ${productId}:`,
      error
    );
    return [];
  }
}
