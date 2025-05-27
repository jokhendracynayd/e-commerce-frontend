import { CategoryGroup } from '@/components/product/CategoryGroups';
import { categoryGroupsData } from '@/data/categoryGroups';

// API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;
const CATEGORY_GROUPS_ENDPOINT = `${API_BASE_URL}/category-groups`;

// Fetch all category groups
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