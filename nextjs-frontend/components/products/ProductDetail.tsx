'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { getImageUrl } from '@/lib/api';
import type { Product, ProductVariant } from '@/lib/types';

interface ProductDetailProps {
  product: Product;
  category: string;
}

export default function ProductDetail({ product, category }: ProductDetailProps) {
  const [mainImage, setMainImage] = useState<string>(
    getImageUrl(product.images?.[0]?.image_url)
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  );

  const displayPrice = selectedVariant?.price ?? product.price;
  const waMsg = encodeURIComponent(`Hi, I am interested in ${product.name}`);
  const waLink = `${BRAND.whatsapp}?text=${waMsg}`;

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Images */}
      <div>
        <div
          className="relative rounded-2xl overflow-hidden mb-4"
          style={{ height: 420, background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
        >
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
            }}
          />
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, i) => {
              const url = getImageUrl(img.image_url);
              return (
                <button
                  key={img.id}
                  onClick={() => setMainImage(url)}
                  className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                  style={{
                    width: 72, height: 72,
                    border: mainImage === url ? '2px solid #C38636' : '2px solid #e8ddd0',
                    background: 'radial-gradient(circle, #f0e8da, #ddd4c4)',
                  }}
                >
                  <Image
                    src={url}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="72px"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase mb-2" style={{ color: '#C38636' }}>
          {product.category?.name || 'YuvaGlow'}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>
          {product.name}
        </h1>
        <p className="text-2xl font-semibold mb-6" style={{ color: '#C38636' }}>
          ₹{parseFloat(String(displayPrice)).toFixed(2)}
        </p>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: '#888' }}>
              Available Options
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className="px-4 py-2 text-[12px] font-medium border transition-all duration-200"
                  style={{
                    border: selectedVariant?.id === v.id ? '2px solid #C38636' : '1.5px solid #e8ddd0',
                    color: selectedVariant?.id === v.id ? '#C38636' : '#555',
                    background: selectedVariant?.id === v.id ? 'rgba(195,134,54,0.05)' : 'white',
                  }}
                >
                  {v.variant_name}{v.variant_value ? `: ${v.variant_value}` : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div
            className="prose prose-sm max-w-none mb-8 text-sm leading-relaxed"
            style={{ color: '#555' }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[12px] tracking-[0.1em] uppercase text-white transition-all duration-200 hover:opacity-90"
            style={{ background: '#25D366' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <Link
            href={`/contact/?subject=${encodeURIComponent('Enquiry: ' + product.name)}`}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[12px] tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[#C38636] hover:text-white"
            style={{ border: '1.5px solid #C38636', color: '#C38636' }}
          >
            Enquire Now
          </Link>
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link href={`/products/${category}/`} className="cta-link text-[10px]">
            ← Back to {category.charAt(0).toUpperCase() + category.slice(1)} Products
          </Link>
        </div>
      </div>
    </div>
  );
}
