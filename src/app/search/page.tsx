import { Metadata } from 'next';
import { ProductSearch } from '@/components/search/ProductSearch';

export const metadata: Metadata = {
  title: 'Search Products',
  description: 'Search for products in our store',
};

export default function SearchPage() {
  return <ProductSearch />;
} 