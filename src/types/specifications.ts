/**
 * Types for specifications module in the e-commerce frontend
 */

/**
 * Product specification returned by the API
 */
export interface ProductSpecification {
  id: string;
  productId: string;
  specKey: string;
  specValue: string;
  specGroup: string;
  sortOrder: number;
  isFilterable: boolean;
  createdAt: string;
  updatedAt: string;
}
/**
 * Grouped product specifications returned by the API
 */
export interface GroupedProductSpecifications {
  groupName: string;
  specifications: ProductSpecification[];
}
