'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '@/lib/api';
import type { Product } from '@/lib/types';
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getProducts().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data.slice(0, 6));
      }
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
            Bestsellers
          </p>
          <h2 className="section-title text-4xl sm:text-5xl">Featured Products</h2>
        </div>
        <Link href="/products/" className="cta-link hidden sm:block">View All</Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Products loading soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              category={product.category?.name?.toLowerCase().includes('hair') ? 'hair' : 'hair'}
              index={i}
              badge={i === 0 ? 'bestseller' : undefined}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-10 sm:hidden">
        <Link href="/products/" className="cta-link">View All Products</Link>
      </div>
    </section>
  );
}
