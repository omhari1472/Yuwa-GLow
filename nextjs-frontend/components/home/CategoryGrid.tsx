'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = [
  {
    slug: 'hair',
    label: 'Hair Care',
    sub: 'Nourishing treatments, serums & shampoos for luminous hair.',
    bg: '#1a0f06',
    bgImg: '/category-hair.jpg',
    accent: '#C38636',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4 C8 4, 4 10, 6 18 C8 24, 14 28, 16 28" />
        <path d="M16 4 C24 4, 28 10, 26 18 C24 24, 18 28, 16 28" />
        <path d="M10 14 Q16 10 22 14" />
        <path d="M9 19 Q16 15 23 19" />
      </svg>
    ),
    span: 'lg:col-span-2 lg:row-span-2',
    large: true,
  },
  {
    slug: 'skin',
    label: 'Skin Care',
    sub: 'Botanical serums & creams for radiant, healthy skin.',
    bg: '#0f1a18',
    bgImg: '/category-skin.jpg',
    accent: '#7DBBA8',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="10" />
        <path d="M14 4 Q18 10 14 14 Q10 18 14 24" />
        <path d="M4 14 Q10 10 14 14 Q18 18 24 14" />
      </svg>
    ),
    span: '',
    large: false,
  },
  {
    slug: 'makeup',
    label: 'Makeup',
    sub: 'Premium colour cosmetics for professional results.',
    bg: '#1a0d12',
    bgImg: '/category-makeup.jpg',
    accent: '#D4789A',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4 L16 18 Q14 22 12 18 Z" />
        <ellipse cx="14" cy="22" rx="4" ry="2" />
        <path d="M8 8 Q14 6 20 8" />
      </svg>
    ),
    span: '',
    large: false,
  },
  {
    slug: 'salon',
    label: 'Professional Tools',
    sub: 'Manufactured for precision & elegance in professional settings.',
    bg: '#0d1018',
    bgImg: '/category-salon.jpg',
    accent: '#8AA4C8',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4 L20 4 L20 8 Q14 10 8 8 Z" />
        <rect x="9" y="8" width="10" height="16" rx="2" />
        <path d="M12 12 L16 12 M12 15 L16 15 M12 18 L16 18" />
      </svg>
    ),
    span: 'lg:col-span-2',
    large: false,
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-28 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <ScrollReveal className="text-center mb-16">
        <span className="section-eyebrow mb-3">Explore Our Range</span>
        <h2
          className="section-title"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)', marginBottom: 16 }}
        >
          Product Collections
        </h2>
        <div className="luxury-divider mt-4">
          <div className="luxury-divider-gem" />
        </div>
      </ScrollReveal>

      {/* Magazine editorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/products/${cat.slug}/`} className="block group">
              {/* Image Container */}
              <div
                className="relative overflow-hidden w-full aspect-[3/4] mb-6"
                style={{
                  backgroundColor: cat.bg,
                }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${cat.bgImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Subtle dark overlay for luxury depth */}
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/0" />
              </div>

              {/* Text Below Container */}
              <div className="text-center">
                <h3
                  className="font-serif mb-2 transition-colors duration-300 group-hover:text-[#C38636]"
                  style={{
                    fontSize: 'clamp(24px, 2vw, 32px)',
                    fontWeight: 400,
                    color: '#2c2c2c',
                    letterSpacing: '0.02em',
                  }}
                >
                  {cat.label}
                </h3>
                <span
                  className="inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                  style={{
                    fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: '#C38636', fontFamily: "'DM Sans', Arial, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
