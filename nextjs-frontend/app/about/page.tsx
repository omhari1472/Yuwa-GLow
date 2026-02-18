import { Metadata } from 'next';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about YuvaGlow Professional Co. — our story, mission, and commitment to premium hair care.',
};

const VALUES = [
  { icon: '🌿', title: 'Natural First', desc: 'We source only the finest botanical ingredients, ensuring each formula is as close to nature as possible.' },
  { icon: '🐰', title: 'Cruelty-Free', desc: 'Every product is developed without animal testing. Beauty should never come at the cost of compassion.' },
  { icon: '🔬', title: 'Science-Backed', desc: 'Our R&D team combines Ayurvedic wisdom with modern cosmetic science for proven, effective results.' },
  { icon: '🏆', title: 'Professional Grade', desc: 'Trusted by salons and stylists across India — formulations built to perform in professional settings.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}
      >
        <ScrollReveal>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#DCB264' }}>
            Our Story
          </p>
          <h1 className="section-title text-4xl sm:text-6xl mb-6" style={{ color: 'rgba(255,255,255,0.95)' }}>
            About YuvaGlow
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Born from a passion for nature and a commitment to professional-grade results.
          </p>
        </ScrollReveal>
      </section>

      {/* Story */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div
              className="rounded-2xl p-10"
              style={{ background: 'white', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#C38636' }}>
                Who We Are
              </p>
              <h2 className="font-serif text-3xl font-light mb-6" style={{ color: '#2c2c2c' }}>
                Crafting Beauty with Purpose
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>
                YuvaGlow Professional Co. was founded with a single vision: to create hair care products that
                honour both the artistry of beauty and the intelligence of nature. We believe that every person
                deserves access to salon-quality formulations — crafted with integrity.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                Our team of cosmetic scientists and Ayurvedic experts work in harmony to develop products that
                deliver real, visible results while remaining gentle on hair, skin, and the environment.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                >
                  🌱
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: '#2c2c2c' }}>
                    Founded with Passion
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
                    Started by beauty enthusiasts who wanted to fill the gap between luxury and accessibility.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                >
                  🤝
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: '#2c2c2c' }}>
                    Trusted by Professionals
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
                    Our products are used by leading salons and stylists across India.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                >
                  🌍
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: '#2c2c2c' }}>
                    Growing Network
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
                    Expanding across India with dedicated stockists and distributors in every region.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}>
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#DCB264' }}>
              What Drives Us
            </p>
            <h2 className="section-title text-4xl sm:text-5xl" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Vision &amp; Mission
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div
                className="rounded-2xl p-8 h-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(195,134,54,0.3)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-2xl"
                  style={{ background: 'rgba(195,134,54,0.15)', border: '1px solid rgba(195,134,54,0.4)' }}
                >
                  ✦
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#DCB264' }}>Our Vision</p>
                <h3 className="font-serif text-2xl font-light mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
                  India&apos;s Most Trusted Beauty Brand
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  To be India&apos;s most trusted and aspirational professional hair care brand — bridging the
                  gap between luxury salon quality and everyday accessibility, making premium beauty
                  available to every individual who seeks it.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div
                className="rounded-2xl p-8 h-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(195,134,54,0.3)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-2xl"
                  style={{ background: 'rgba(195,134,54,0.15)', border: '1px solid rgba(195,134,54,0.4)' }}
                >
                  ◈
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: '#DCB264' }}>Our Mission</p>
                <h3 className="font-serif text-2xl font-light mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
                  Science Meets Nature, Every Day
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  To develop science-backed, nature-inspired formulations that empower every individual
                  to achieve salon-quality results at home — while equipping professional stylists with
                  products they can trust, stand behind, and be proud to use.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #f0e8da, #e8ddd0)' }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
              What We Stand For
            </p>
            <h2 className="section-title text-4xl sm:text-5xl">Our Values</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="font-serif text-lg font-semibold mb-2" style={{ color: '#2c2c2c' }}>{v.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: '#888' }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visionary Leadership */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #f5f2ed 100%)' }}>
        <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
            The People Behind the Brand
          </p>
          <h2 className="section-title text-4xl sm:text-5xl">Visionary Leadership</h2>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: '#ddd4c4' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#C38636' }} />
            <div className="h-px w-16" style={{ background: '#ddd4c4' }} />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            {
              name: 'Manish Rathod',
              role: 'Managing Director',
              image: '/assets/images/manish-rathod.webp',
              bio: 'Starting as a delivery boy in Limbdi, Manish grew through the ranks—from Sales Officer to RSM—over 20 years in the cosmetics industry. His persistence laid the foundation for YuvaGlow Professional Company.',
              exp: '20 Yrs',
              focus: 'Cosmetics',
            },
            {
              name: 'Sandeep Singh',
              role: 'MD & Lead Director',
              image: '/assets/images/sandeep-singh.webp',
              bio: 'A versatile leader with 15 years of expertise in Hair Care. Sandeep brings a unique perspective as a Business Consultant and entrepreneur, driving the brand with a vision for excellence and strategic growth.',
              exp: '15 Yrs',
              focus: 'Hair Care',
            },
            {
              name: 'Jaiprakash Rathod',
              role: 'Director',
              image: '/assets/images/jaiprakash-rathod.webp',
              bio: 'A strategic visionary committed to scaling YuvaGlow\'s reach. Jaiprakash combines industry insight with a passion for innovation, driving expansion and ensuring products reach every corner of the market.',
              exp: '12+ Yrs',
              focus: 'Expansion',
            },
          ].map((leader, i) => (
            <ScrollReveal key={leader.name} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center group">

                {/* Portrait with gold ring frame */}
                <div className="relative mb-6">
                  {/* Outer gold ring */}
                  <div
                    className="absolute -inset-[5px] rounded-full"
                    style={{ background: 'conic-gradient(#C38636 0deg, #DCB264 90deg, #C38636 180deg, #ddd4c4 270deg, #C38636 360deg)' }}
                  />
                  {/* White gap ring */}
                  <div className="absolute -inset-[3px] rounded-full bg-white" />
                  {/* Photo */}
                  <div
                    className="relative w-36 h-36 rounded-full overflow-hidden"
                    style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                  >
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      sizes="144px"
                    />
                  </div>
                  {/* Gold dot accent bottom */}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: '#C38636' }}
                  />
                </div>

                {/* Name & role */}
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: '#C38636' }}>
                  {leader.role}
                </p>
                <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: '#2c2c2c' }}>
                  {leader.name}
                </h3>

                {/* Thin gold line */}
                <div className="w-8 h-px my-3" style={{ background: '#C38636' }} />

                {/* Bio */}
                <p className="text-[12px] leading-relaxed max-w-xs" style={{ color: '#888' }}>
                  {leader.bio}
                </p>

                {/* Stat pills */}
                <div className="flex gap-3 mt-5">
                  <span
                    className="text-[10px] font-semibold tracking-wide px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(195,134,54,0.08)', color: '#C38636', border: '1px solid rgba(195,134,54,0.2)' }}
                  >
                    {leader.exp}
                  </span>
                  <span
                    className="text-[10px] font-semibold tracking-wide px-3 py-1.5 rounded-full"
                    style={{ background: '#f0e8da', color: '#888' }}
                  >
                    {leader.focus}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <ScrollReveal>
          <h2 className="font-serif text-3xl font-light mb-4" style={{ color: '#2c2c2c' }}>
            Ready to Experience YuvaGlow?
          </h2>
          <p className="text-sm text-gray-500 mb-8">Discover our range of premium products.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/products/" className="btn-ghost-gold">Explore Products</Link>
            <Link href="/contact/" className="cta-link">Contact Us</Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
