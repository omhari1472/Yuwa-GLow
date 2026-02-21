'use client';

import { getImageUrl } from '@/lib/api';
import type { Product } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
            className="relative overflow-hidden w-full aspect-[4/5] bg-[#faf8f4] flex items-center justify-center group-hover:bg-white transition-colors duration-500"
          >
            <Image
              src={imgUrl}
              alt={product.name}
              fill
              className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
              }}
            />

            {/* Badge */}
            {resolvedBadge && (
              <div className="absolute top-4 left-4 z-10">
                {resolvedBadge === 'bestseller' ? (
                  <span
                    className="text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full shadow-sm"
                    style={{ background: '#C38636', color: '#fff' }}
                  >
                    Bestseller
                  </span>
                ) : (
                  <span
                    className="text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full shadow-sm"
                    style={{ background: '#2c2c2c', color: '#fff' }}
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
