import { recommendationsApi, GetRecentlyViewedParams, GetTrendingParams } from '@/lib/api/recommendations-api';
import { Recommendation } from '@/types/recommendations';

/**
 * Fetch recently viewed products for a user or session.
 * @param params - Parameters for the request, such as userId, sessionId, and limit.
 * @returns A promise that resolves to an array of recommendations.
 */
export async function getRecentlyViewed(params: GetRecentlyViewedParams): Promise<Recommendation[]> {
  try {
    // A simple wrapper around the API call.
    // Complex logic like caching, retries, or transformations can be added here later.
    const recommendations = await recommendationsApi.getRecentlyViewed(params);
    return recommendations;
  } catch (error) {
    console.error('Error fetching recently viewed products:', error);
    // Depending on requirements, you might want to return an empty array
    // or re-throw the error to be handled by the caller.
    return [];
  }
}

/**
 * Fetch trending recommended products.
 * @param params - Parameters including optional category filter, limit, and includeProduct flag.
 */
export async function getTrending(params: GetTrendingParams): Promise<Recommendation[]> {
  try {
    const recommendations = await recommendationsApi.getTrending(params);
    return recommendations;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
} 