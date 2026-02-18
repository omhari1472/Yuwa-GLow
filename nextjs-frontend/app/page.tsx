import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import BrandPromises from '@/components/home/BrandPromises';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TransformationStrip from '@/components/home/TransformationStrip';
import LeadershipSection from '@/components/home/LeadershipSection';
import BlogPreview from '@/components/home/BlogPreview';
import TestimonialSlider from '@/components/ui/testimonial-slider';

export const metadata = {
  title: 'YuvaGlow Professional Co. — Premium Salon Hair Care',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <BrandPromises />
      <FeaturedProducts />
      <TransformationStrip />

      {/* Testimonials */}
      <section className="py-20 px-4" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
              What They Say
            </p>
            <h2 className="section-title text-4xl sm:text-5xl">Customer Stories</h2>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      <LeadershipSection />
      <BlogPreview />
    </>
  );
}
