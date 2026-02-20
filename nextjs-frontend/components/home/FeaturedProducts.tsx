'use client';

import ProductCard from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';
import ScrollReveal from '@/components/shared/ScrollReveal';
import API from '@/lib/api';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    <section className="py-28 px-5 sm:px-8">
      {/* Centered header with full-width rule */}
      <ScrollReveal className="text-center mb-16">
        <span className="section-eyebrow mb-3">Bestsellers</span>
        <h2
          className="section-title"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)', marginBottom: 16 }}
        >
          Featured Products
        </h2>
        <div className="luxury-divider mt-4">
          <div className="luxury-divider-gem" />
        </div>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length === 0 ? (
          <p className="text-center py-12" style={{ color: '#aaa', fontSize: 14, letterSpacing: '0.06em' }}>
            Products coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                category={(() => {
                  const n = (product.category?.name || '').toLowerCase();
                  if (n.includes('skin')) return 'skin';
                  if (n.includes('makeup') || n.includes('make up')) return 'makeup';
                  if (n.includes('salon') || n.includes('tool')) return 'salon';
                  return 'hair';
                })()}
                index={i}
                badge={i === 0 ? 'bestseller' : undefined}
              />
            ))}
          </div>
        )}

        {/* View all CTA */}
        <div className="text-center mt-14">
          <Link href="/products/" className="btn-ghost-gold">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
