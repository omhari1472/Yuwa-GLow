import ScrollReveal from '@/components/shared/ScrollReveal';

export default function LeadershipSection() {
  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: '#DCB264' }}
          >
            Our Vision
          </p>
          <blockquote
            className="font-serif text-3xl sm:text-4xl font-light leading-relaxed mb-8 italic"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            &ldquo;Beauty is not a luxury — it is self-expression. We craft products that honour
            both the science of hair care and the wisdom of nature.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-10 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, #C38636)' }}
            />
            <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C38636' }}>
              Founder, YuvaGlow Professional Co.
            </p>
            <div
              className="w-10 h-0.5"
              style={{ background: 'linear-gradient(90deg, #C38636, transparent)' }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
