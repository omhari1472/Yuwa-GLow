'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function CategoryGrid() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
          Explore Our Range
        </p>
        <h2 className="section-title text-4xl sm:text-5xl">Product Categories</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCT_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <Link href={`/products/${cat.slug}/`} className="block group">
              <div
                className="relative rounded-2xl overflow-hidden p-8 text-center transition-shadow duration-300 group-hover:shadow-xl"
                style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-5"
                  style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                >
                  {cat.emoji}
                </div>

                <h3
                  className="font-serif text-xl font-semibold mb-2 group-hover:text-[#C38636] transition-colors"
                  style={{ color: '#2c2c2c' }}
                >
                  {cat.label}
                </h3>
                <p className="text-[12px] leading-relaxed mb-5" style={{ color: '#888' }}>
                  {cat.description}
                </p>

                <span className="cta-link text-[10px]">Shop Now</span>

                {/* Hover gold line */}
                <div
                  className="absolute bottom-0 inset-x-0 h-0.5 transition-all duration-300 scale-x-0 group-hover:scale-x-100"
                  style={{ background: '#C38636', transformOrigin: 'left' }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
