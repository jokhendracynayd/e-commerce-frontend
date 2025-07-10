import { CategoryGroup } from '@/components/product/CategoryGroups';
import { categoryGroupsData } from '@/data/categoryGroups';
import { categoriesApi } from '@/lib/api/categories-api';
import { ProductFilterParams, ProductDetail } from '@/types/product';
import { CategoryProductType, CategoryWithProducts } from '@/types/categories';

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(CATEGORY_GROUPS_ENDPOINT);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return categoryGroupsData;
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error('Failed to fetch category groups');
    // }
    // return await response.json();
  } catch (error) {
    console.error('Error fetching category groups:', error);
    return [];
  }
}

// Fetch a single category group by ID
export async function getCategoryGroupById(id: string | number): Promise<CategoryGroup | null> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(`${CATEGORY_GROUPS_ENDPOINT}/${id}`);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the category group in our mock data
    const group = categoryGroupsData.find(group => group.id === id);
    return group || null;
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch category group with ID ${id}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error(`Error fetching category group with ID ${id}:`, error);
    return null;
  }
}

// Fetch categories by group ID
export async function getCategoriesByGroupId(groupId: string | number): Promise<CategoryGroup['categories'] | []> {
  try {
    // In a real app, this would be a fetch call to your backend API
    // const response = await fetch(`${CATEGORY_GROUPS_ENDPOINT}/${groupId}/categories`);
    
    // For development, we'll use the mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the category group in our mock data
    const group = categoryGroupsData.find(group => group.id === groupId);
    return group ? group.categories : [];
    
    // In production, you'd uncomment the fetch code:
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch categories for group ID ${groupId}`);
    // }
    // return await response.json();
  } catch (error) {
    console.error(`Error fetching categories for group ID ${groupId}:`, error);
    return [];
  }
}

/**
 * Fetch products for a category recursively (including all subcategories)
 * 
 * @param categoryId The ID of the category
 * @param params Filter parameters
 * @returns An object containing the category with products and pagination info
 */
export async function getCategoryProductsRecursive(
  categoryId: string,
  params: ProductFilterParams
): Promise<{
  categoryWithProducts: CategoryWithProducts | null;
  hasMore: boolean;
  error: string | null;
}> {
  try {
    // Call the API to get products for this category and its subcategories
    const response = await categoriesApi.getCategoryProductsRecursive(categoryId, params);
    
    if (!response?.data?.success || !response.data.data) {
      return {
        categoryWithProducts: null,
        hasMore: false,
        error: 'Failed to load category products'
      };
    }
    
    const categoryData = response.data.data;
    
    // Transform API products to our component's CategoryProductType format
    const products = categoryData.products.map((product: any): CategoryProductType => {
      // Determine the image URL based on the format of product.images
      let imageUrl = 'https://via.placeholder.com/300x300'; // Default placeholder
      
      if (product.images && product.images.length > 0) {
        if (typeof product.images[0] === 'string') {
          // If images is a string array (ProductDetail format)
          imageUrl = product.images[0];
        } else if (product.images[0] && typeof product.images[0] === 'object') {
          // If images is an array of objects with imageUrl property (ApiProduct format)
          imageUrl = product.images[0].imageUrl || imageUrl;
        }
      }
      
      // Map color variants from API product variants
      const colorVariants = product.variants?.map((variant: any) => ({
        id: variant.id,
        color: variant.color || variant.variantName,
        hex: variant.colorHex || '#CCCCCC',
        image: variant.variantImage || imageUrl
      })).filter((variant: any) => variant.color) || [];
      
      // Determine product badges
      let badge: string | undefined;
      if (product.isNew) badge = 'New';
      else if (product.isBestSeller) badge = 'Bestseller';
      else if (product.badges && product.badges.length > 0) badge = product.badges[0];
      
      // Calculate original price if discount is available
      let originalPrice = product.originalPrice;
      if (!originalPrice && product.discountPrice) {
        originalPrice = product.price;
      }
      
      return {
        id: product.id,
        title: product.title,
        image: imageUrl,
        price: product.discountPrice || product.price,
        originalPrice: originalPrice,
        link: `/${product.slug}/p/${product.id}`,
        badge: badge,
        rating: product.averageRating || product.rating,
        reviewCount: product.reviewCount,
        currency: product.currency || "INR",
        isAssured: product.isAssured || false,
        hasFreeDel: product.hasFreeDel || false,
        deliveryInfo: product.deliveryInfo,
        discount: product.discount,
        
        // Enhanced fields for ProductCard
        subtitle: product.subtitle,
        colorVariants: colorVariants.length > 0 ? colorVariants : undefined,
        bankOffer: product.bankOffer ? {
          available: product.bankOffer.available || false,
          discount: product.bankOffer.discount || 0,
          bankName: product.bankOffer.bankName,
          terms: product.bankOffer.terms,
          validUntil: product.bankOffer.validUntil
        } : undefined,
        exchangeOffer: product.exchangeOffer ? {
          available: product.exchangeOffer.available || false,
          maxDiscount: product.exchangeOffer.maxDiscount || 0,
          terms: product.exchangeOffer.terms,
          brands: product.exchangeOffer.brands
        } : undefined,
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
        isSponsored: product.isSponsored || false,
        sponsoredTag: product.isSponsored || false,
        isLimitedDeal: product.isLimitedDeal || false,
      };
    });
    
    // Only return if we have products
    if (products.length > 0) {
      const categoryWithProducts: CategoryWithProducts = {
        id: categoryId,
        title: categoryData.name,
        products: products,
        viewAllLink: `/${categoryData.slug}`
      };
      
      // Check if there are more products available (for "View All" link)
      const hasMore = categoryData.pagination.hasNextPage || 
                      categoryData.pagination.total > products.length;
      
      return {
        categoryWithProducts,
        hasMore,
        error: null
      };
    }
    
    return {
      categoryWithProducts: null,
      hasMore: false,
      error: 'No products found for this category'
    };
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return {
      categoryWithProducts: null,
      hasMore: false,
      error: `Failed to load products for this category: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
} 