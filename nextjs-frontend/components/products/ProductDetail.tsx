'use client';

import { getImageUrl } from '@/lib/api';
import { BRAND } from '@/lib/constants';
import type { Product, ProductVariant } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  category: string;
  relatedProducts?: Product[];
}

export default function ProductDetail({ product, category, relatedProducts = [] }: ProductDetailProps) {
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
    <>
      {/* Immersive Editorial Split Layout (Fixed Frame) */}
      <div
        className="grid lg:grid-cols-2 rounded-lg sm:rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] bg-[#0A0804] h-[calc(100vh-80px)] overflow-hidden"
        style={{ border: '1px solid rgba(0,0,0,0.05)' }}
      >
        {/* LEFT: Complete Full-Bleed Image Frame */}
        <div className="bg-[#f8f5f0] relative h-[40vh] sm:h-[50vh] lg:h-full w-full overflow-hidden block">

          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover object-center transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
            }}
          />

          {/* Thumbnails (Overlay) */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 z-10 flex gap-3 overflow-x-auto px-6 justify-center pb-2" style={{ scrollbarWidth: 'none' }}>
              {product.images.map((img, i) => {
                const url = getImageUrl(img.image_url);
                const isActive = mainImage === url;
                return (
                  <button
                    key={img.id}
                    onClick={() => setMainImage(url)}
                    className="relative flex-shrink-0 overflow-hidden transition-all duration-300 rounded-md bg-white/80 backdrop-blur-md"
                    style={{
                      width: 64, height: 64,
                      border: isActive ? '1.5px solid #C38636' : '1px solid rgba(0,0,0,0.1)',
                      opacity: isActive ? 1 : 0.7,
                      transform: isActive ? 'translateY(-4px)' : 'none',
                      boxShadow: isActive ? '0 8px 15px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Image
                      src={url}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-cover p-0.5"
                      sizes="64px"
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

        {/* RIGHT: Scrolling Content Area */}
        <div className="bg-[#0A0804] text-[#faf8f4] flex flex-col relative z-10 p-8 sm:p-10 lg:p-14 h-full overflow-y-auto border-t lg:border-t-0 lg:border-l border-[rgba(195,134,54,0.15)] pb-24 lg:pb-14 webkit-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(195,134,54,0.3) transparent' }}>
          <style dangerouslySetInnerHTML={{
            __html: `
            .webkit-scrollbar::-webkit-scrollbar { width: 6px; }
            .webkit-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .webkit-scrollbar::-webkit-scrollbar-thumb { background: rgba(195,134,54,0.3); border-radius: 10px; }
          `}} />

          <p className="text-[10px] tracking-[0.25em] uppercase mb-5 text-[#DCB264] font-semibold flex-shrink-0">
            {product.category?.name || 'YuvaGlow'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-5 leading-tight text-white/95">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
            <p className="text-2xl font-serif text-[#C38636]">
              ₹{parseFloat(String(displayPrice)).toFixed(2)}
            </p>
            {selectedVariant && (
              <span className="text-[10px] tracking-widest uppercase text-white/40">
                {selectedVariant.variant_name}{selectedVariant.variant_value ? ` • ${selectedVariant.variant_value}` : ''}
              </span>
            )}
          </div>

          <div className="w-12 h-px bg-[#C38636]/40 mb-8" />

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-10">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-4 text-white/50 font-medium">
                Available Options
              </p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className="px-5 py-2.5 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 rounded-sm"
                    style={{
                      border: selectedVariant?.id === v.id ? '1px solid #C38636' : '1px solid rgba(255,255,255,0.15)',
                      color: selectedVariant?.id === v.id ? '#DCB264' : 'rgba(255,255,255,0.6)',
                      background: selectedVariant?.id === v.id ? 'rgba(195,134,54,0.05)' : 'transparent',
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
              className="prose prose-sm max-w-none mb-10 text-[13px] leading-relaxed 
                         [&_*]:!text-white/60 [&_ul]:!p-0 [&_ul]:!m-0 [&_li]:!text-white/60
                         [&>p]:mb-4 [&>ul]:pl-5 [&>ul]:list-disc
                         [&_strong]:!text-[#DCB264] [&_strong]:!font-serif [&_strong]:!text-lg [&_strong]:!font-normal [&_strong]:mb-2 [&_strong]:block
                         [&_span]:!text-white/70 
                         [&_b]:!text-[#DCB264] [&_b]:!font-serif [&_b]:!text-lg [&_b]:!font-normal [&_b]:mb-2 [&_b]:block
                         [&>h1]:!text-[#DCB264] [&>h1]:!font-serif
                         [&>h2]:!text-[#DCB264] [&>h2]:!font-serif
                         [&>h3]:!text-[#DCB264] [&>h3]:!font-serif [&>h3]:!text-lg [&>h3]:!mb-3 [&>h3]:!mt-6"
              dangerouslySetInnerHTML={{ __html: product.description.replace(/color:\s*(?:#0000ff|blue|rgb\(0, 0, 255\))/gi, 'color: inherit') }}
            />
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10">
            {['100% Natural', 'Cruelty-Free', 'Salon Grade'].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-white/50"
              >
                <div className="w-1.5 h-1.5 rotate-45 bg-[#C38636]" />
                {badge}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 text-[11px] tracking-[0.2em] uppercase font-bold text-[#0A0804] transition-all duration-300 hover:scale-[1.02] rounded-sm"
              style={{ background: '#DCB264', boxShadow: '0 10px 30px rgba(195,134,54,0.15)' }}
            >
              Order via WhatsApp
            </a>
            <Link
              href={`/contact/?subject=${encodeURIComponent('Enquiry: ' + product.name)}`}
              className="flex-1 flex items-center justify-center px-6 py-4 text-[11px] tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:bg-white/5 rounded-sm"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#faf8f4' }}
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-32 mb-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow mb-3">From the Collection</span>
            <h3 className="section-title text-4xl sm:text-5xl text-[#2c2c2c] mb-6">You May Also Like</h3>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12" style={{ background: 'rgba(195,134,54,0.4)' }} />
              <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
              <div className="h-px w-12" style={{ background: 'rgba(195,134,54,0.4)' }} />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} category={category} index={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
