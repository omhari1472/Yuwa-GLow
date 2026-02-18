import ProductCard from './ProductCard';
import ComingSoon from '@/components/shared/ComingSoon';
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  category: string;
  loading: boolean;
}

export default function ProductGrid({ products, category, loading }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={6} />;

  if (products.length === 0) return <ComingSoon category={category} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} category={category} index={i} />
      ))}
    </div>
  );
}
