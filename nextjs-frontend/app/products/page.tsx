import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore YuvaGlow\'s premium range of hair care, skin care, makeup, and salon products.',
};

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Page header */}
      <div className="text-center mb-14">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
          Our Collections
        </p>
        <h1 className="section-title text-4xl sm:text-5xl mb-4">Products</h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Premium salon-grade formulations crafted with nature&apos;s finest botanicals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCT_CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/products/${cat.slug}/`} className="block group">
            <div
              className="rounded-2xl overflow-hidden p-8 text-center transition-shadow duration-300 group-hover:shadow-xl"
              style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-5"
                style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
              >
                {cat.emoji}
              </div>
              <h2
                className="font-serif text-xl font-semibold mb-2 group-hover:text-[#C38636] transition-colors"
                style={{ color: '#2c2c2c' }}
              >
                {cat.label}
              </h2>
              <p className="text-[12px] leading-relaxed mb-5" style={{ color: '#888' }}>
                {cat.description}
              </p>
              <span className="cta-link text-[10px]">Explore</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
