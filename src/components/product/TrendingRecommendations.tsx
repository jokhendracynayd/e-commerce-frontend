'use client';

import React, { useEffect, useState } from 'react';
import { getTrending } from '@/services/recommendationService';
import { Recommendation } from '@/types/recommendations';
import { ProductCategory, ProductType } from './ProductCategory';
import { useAuth } from '@/context/AuthContext';
import { getSessionId } from '@/utils/analytics-utils';

// Helper: map Recommendation.recommendedProduct to ProductCard props
function mapToProductCardProps(reco: Recommendation) {
  const p = reco.recommendedProduct;
  if (!p) return null;

  let discountPercentage: string | undefined;
  if (p.discountPrice && p.price && p.price > p.discountPrice) {
    const percent = Math.round(((p.price - p.discountPrice) / p.price) * 100);
    discountPercentage = `${percent}% OFF`;
  }

  return {
    id: p.id,
    title: p.title,
    image: p.images?.[0]?.imageUrl || '/images/placeholder.svg',
    price: p.discountPrice ?? p.price,
    originalPrice: p.price,
    discount: discountPercentage,
    link: `/${p.slug}/p/${p.id}`,
    hasFreeDel: false,
    rating: p.averageRating,
    reviewCount: p.reviewCount,
    badge: undefined,
  };
}

const TrendingRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const recos = await getTrending({
          categoryId: undefined,
          limit: 12,
          includeProduct: true,
        });
        setRecommendations(recos);
      } catch (err) {
        console.error('Error loading trending recommendations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [user]);

  if (loading) return null;
  if (!recommendations.length) return null;

  const productCards = recommendations
    .map(mapToProductCardProps)
    .filter((p): p is NonNullable<ReturnType<typeof mapToProductCardProps>> => p !== null);

  if (!productCards.length) return null;

  return (
    <ProductCategory
      title="Trending Products"
      products={productCards as ProductType[]}
    />
  );
};

export default TrendingRecommendations; 