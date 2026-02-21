import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products',
  description: "Explore YuvaGlow's premium range of hair care, skin care, makeup, and salon products.",
};

const CATEGORIES_ENHANCED = [
  { slug: 'hair', bgImg: '/testv9/category-hair.jpg', bg: '#1a0f06' },
  { slug: 'skin', bgImg: '/testv9/category-skin.jpg', bg: '#0f1a18' },
  { slug: 'makeup', bgImg: '/testv9/category-makeup.jpg', bg: '#1a0d12' },
  { slug: 'salon', bgImg: '/testv9/category-salon.jpg', bg: '#0d1018' },
];

export default function ProductsPage() {
  const mergedCategories = PRODUCT_CATEGORIES.map(base => {
    const enhanced = CATEGORIES_ENHANCED.find(e => e.slug === base.slug);
    return { ...base, ...enhanced };
  });

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Hero */}
      <section
        className="py-32 px-4 text-center relative overflow-hidden bg-[#0A0804]"
      >
        {/* Ambient lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(195,134,54,0.4), transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="block text-[11px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#DCB264' }}>
            Our Collections
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl mb-6 text-[#faf8f4]">
            Products
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
          </div>
          <p className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Premium salon-grade formulations crafted with nature&apos;s finest botanicals.
            Engineered for professionals, perfected for you.
          </p>
        </div>
      </section>

      {/* Category Editorial Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {mergedCategories.map((cat, i) => (
            <Link key={cat.slug} href={`/products/${cat.slug}/`} className="block group">
              {/* Image Container */}
              <div
                className="relative overflow-hidden w-full aspect-[3/4] mb-6 rounded-sm"
                style={{ backgroundColor: cat.bg || '#111' }}
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
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/10" />

                {/* Floating label for interaction cue */}
                <div className="absolute bottom-6 left-0 right-0 text-center opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-block px-6 py-2 bg-[#0A0804]/80 backdrop-blur-md border border-[#C38636]/30 text-[#DCB264] text-[10px] tracking-[0.2em] uppercase font-semibold mx-auto">
                    Explore Collection
                  </span>
                </div>
              </div>

              {/* Text Below Container */}
              <div className="text-center px-4">
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
                <p className="text-[12px] leading-relaxed text-[#777] max-w-xs mx-auto">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
