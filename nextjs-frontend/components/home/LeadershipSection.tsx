import ScrollReveal from '@/components/shared/ScrollReveal';

function BokehOrb({ size, x, y, delay, opacity }: {
  size: number; x: string; y: string; delay: number; opacity: number;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, left: x, top: y,
        background: `radial-gradient(circle, rgba(195,134,54,${opacity}) 0%, transparent 70%)`,
        filter: 'blur(1px)',
      }}
    />
  );
}

export default function LeadershipSection() {
  return (
    <section
      className="relative py-32 px-5 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0804 0%, #1a0c00 55%, #0a0804 100%)' }}
    >
      {/* Ambient orbs for visual cohesion with hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BokehOrb size={500} x="-8%" y="-15%" delay={0} opacity={0.09} />
        <BokehOrb size={350} x="70%" y="50%" delay={2} opacity={0.07} />
        <BokehOrb size={200} x="40%" y="70%" delay={3} opacity={0.05} />
      </div>

      {/* Large decorative quotation mark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(200px, 28vw, 360px)',
          fontWeight: 700,
          color: 'rgba(195,134,54,0.04)',
          top: '-4%',
          left: '50%',
          transform: 'translateX(-50%)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }}
      >
        &ldquo;
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <ScrollReveal>
          <span className="section-eyebrow mb-6" style={{ color: 'rgba(195,134,54,0.55)', letterSpacing: '0.32em' }}>
            Our Vision
          </span>

          <blockquote
            className="font-serif mb-10"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 58px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.25,
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: '0.01em',
            }}
          >
            &ldquo;Beauty is not a luxury — it is self-expression. We craft products that
            honour both the{' '}
            <span style={{
              background: 'linear-gradient(130deg, #C38636, #DCB264)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              science of hair care
            </span>
            {' '}and the wisdom of nature.&rdquo;
          </blockquote>

          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(195,134,54,0.5))' }} />
            <div style={{ width: 4, height: 4, background: '#C38636', transform: 'rotate(45deg)' }} />
            <div style={{ width: 48, height: 1, background: 'linear-gradient(to left, transparent, rgba(195,134,54,0.5))' }} />
          </div>

          <p
            style={{
              fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(195,134,54,0.7)',
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontWeight: 500,
            }}
          >
            Founder, YuvaGlow Professional Co.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
