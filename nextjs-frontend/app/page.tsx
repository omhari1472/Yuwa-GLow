import BlogPreview from '@/components/home/BlogPreview';
import BrandPromises from '@/components/home/BrandPromises';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HeroSection from '@/components/home/HeroSection';
import IngredientMarquee from '@/components/home/IngredientMarquee';
import LeadershipSection from '@/components/home/LeadershipSection';
import TransformationStrip from '@/components/home/TransformationStrip';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

export const metadata = {
  title: 'YuvaGlow Professional Co. — Premium Salon Beauty',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <BrandPromises />
      <IngredientMarquee />
      <FeaturedProducts />
      <TransformationStrip />

      {/* ── TESTIMONIALS — light ivory panel ── */}
      <section
        className="relative py-28 px-4 overflow-hidden"
        style={{ background: '#faf8f4' }}
      >
        {/* Watermark quotation mark */}
        <div
          className="absolute pointer-events-none select-none"
          aria-hidden
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(200px, 30vw, 400px)',
            fontWeight: 700,
            color: 'rgba(195,134,54,0.06)',
            top: '-5%',
            left: '50%',
            transform: 'translateX(-50%)',
            lineHeight: 1,
          }}
        >
          &ldquo;
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-14" blur>
            <span
              className="section-eyebrow mb-3"
            >
              What They Say
            </span>
            <h2
              className="section-title"
              style={{ fontSize: 'clamp(34px, 4.5vw, 56px)' }}
            >
              Customer Stories
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div style={{ width: 40, height: 1, background: 'rgba(195,134,54,0.3)' }} />
              <div style={{ width: 5, height: 5, background: '#C38636', transform: 'rotate(45deg)' }} />
              <div style={{ width: 40, height: 1, background: 'rgba(195,134,54,0.3)' }} />
            </div>
          </ScrollReveal>
          <StaggerTestimonials />
        </div>
      </section>

      <LeadershipSection />
      <BlogPreview />
    </>
  );
}
