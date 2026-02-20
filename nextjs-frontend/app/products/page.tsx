import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: "Explore YuvaGlow's premium range of hair care, skin care, makeup, and salon products.",
};

export default function ProductsPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-28 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #faf8f5 0%, #f0e8da 60%, #e4d2b8 100%)' }}
      >
        {/* Ambient orb */}
        <div
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(195,134,54,0.12), transparent 70%)' }}
        />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#C38636' }}>
            Our Collections
          </p>
          <h1 className="section-title text-5xl sm:text-7xl mb-5" style={{ color: '#2c2c2c' }}>
            Products
          </h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-14" style={{ background: 'rgba(195,134,54,0.4)' }} />
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div className="h-px w-14" style={{ background: 'rgba(195,134,54,0.4)' }} />
          </div>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#777' }}>
            Premium salon-grade formulations crafted with nature&apos;s finest botanicals.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products/${cat.slug}/`} className="block group">
              <div
                className="rounded-2xl overflow-hidden p-8 text-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1"
                style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-5 transition-transform duration-300 group-hover:scale-110"
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
      </section>
    </div>
  );
}
