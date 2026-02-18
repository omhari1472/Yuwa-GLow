'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import API, { getImageUrl } from '@/lib/api';
import type { Product } from '@/lib/types';
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';

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
          {products.map((product, i) => {
            const imgUrl = getImageUrl(product.images?.[0]?.image_url);
            const displayPrice =
              product.variants?.length > 0
                ? product.variants[0].price
                : product.price;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link href={`/products/hair/?id=${product.id}`} className="block group">
                  <div
                    className="rounded-2xl overflow-hidden transition-shadow duration-300 group-hover:shadow-xl"
                    style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ height: 300, background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                    >
                      <Image
                        src={imgUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="p-5 text-center">
                      <p className="text-[10px] tracking-[0.12em] uppercase mb-1" style={{ color: '#C38636' }}>
                        {product.category?.name || 'YuvaGlow'}
                      </p>
                      <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-[#C38636] transition-colors" style={{ color: '#2c2c2c' }}>
                        {product.name}
                      </h3>
                      <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                        {product.description?.replace(/<[^>]*>/g, '').slice(0, 80)}
                        {product.description && product.description.length > 80 ? '…' : ''}
                      </p>
                      <p className="font-semibold" style={{ color: '#C38636', fontSize: 18 }}>
                        ₹{parseFloat(String(displayPrice)).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-10 sm:hidden">
        <Link href="/products/" className="cta-link">View All Products</Link>
      </div>
    </section>
  );
}
