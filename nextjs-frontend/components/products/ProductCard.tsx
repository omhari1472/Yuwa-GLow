'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/api';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  category: string;
  index?: number;
  badge?: 'bestseller' | 'new' | null;
}

export default function ProductCard({ product, category, index = 0, badge }: ProductCardProps) {
  const imgUrl = getImageUrl(product.images?.[0]?.image_url);
  const displayPrice =
    product.variants?.length > 0
      ? product.variants[0].price
      : product.price;

  // Auto-detect "new" based on created_at (within 90 days)
  const resolvedBadge = badge ?? (() => {
    if (product.created_at) {
      const created = new Date(product.created_at);
      const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (diff < 90) return 'new' as const;
    }
    return null;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/products/${category}/?id=${product.id}`} className="block group">
        <div
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 18px 44px rgba(0,0,0,0.13)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
          }}
        >
          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{ height: 320, background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
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

            {/* Badge */}
            {resolvedBadge && (
              <div className="absolute top-3 left-3">
                {resolvedBadge === 'bestseller' ? (
                  <span
                    className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                    style={{ background: '#C38636', color: '#fff' }}
                  >
                    Bestseller
                  </span>
                ) : (
                  <span
                    className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(44,44,44,0.85)', color: '#fff' }}
                  >
                    New
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 text-center">
            <p className="text-[10px] tracking-[0.12em] uppercase mb-1" style={{ color: '#C38636' }}>
              {product.category?.name || 'YuvaGlow'}
            </p>
            <h3
              className="font-serif text-lg font-semibold mb-2 group-hover:text-[#C38636] transition-colors line-clamp-1"
              style={{ color: '#2c2c2c' }}
            >
              {product.name}
            </h3>
            <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
              {product.description?.replace(/<[^>]*>/g, '').slice(0, 80)}
              {product.description && product.description.replace(/<[^>]*>/g, '').length > 80 ? '…' : ''}
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="font-semibold text-lg" style={{ color: '#C38636' }}>
                ₹{parseFloat(String(displayPrice)).toFixed(0)}
              </p>
              <span
                className="text-[10px] font-semibold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: '#C38636' }}
              >
                View →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
