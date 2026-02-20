import ScrollReveal from '@/components/shared/ScrollReveal';

const PROMISES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Natural Ingredients',
    desc: 'Formulated with pure botanical extracts, free from harmful chemicals.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 12 Q8 18 12 22 Q16 18 12 12" />
        <path d="M6 10 Q4 14 6 17 M18 10 Q20 14 18 17" />
      </svg>
    ),
    title: 'Cruelty-Free',
    desc: 'Never tested on animals. Certified by global ethical beauty standards.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Premium Quality',
    desc: 'Professional-grade formulations manufactured for beauty experts across India.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v6M14 2v6M8 8h8l-1 10H9z" />
        <path d="M8 12h8" />
      </svg>
    ),
    title: 'Science-Backed',
    desc: 'Clinically tested formulations that deliver real, visible, lasting results.',
  },
];

export default function BrandPromises() {
  return (
    <section
      className="relative py-28 px-5 sm:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0804 0%, #1a0c00 55%, #0a0804 100%)' }}
    >
      {/* Ambient glow accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full"
          style={{ left: '-5%', top: '-20%', background: 'radial-gradient(circle, rgba(195,134,54,0.07), transparent 70%)', filter: 'blur(2px)' }} />
        <div className="absolute w-72 h-72 rounded-full"
          style={{ right: '5%', bottom: '-10%', background: 'radial-gradient(circle, rgba(195,134,54,0.05), transparent 70%)', filter: 'blur(2px)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Two-column split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — editorial statement */}
          <ScrollReveal>
            <span className="section-eyebrow mb-4" style={{ color: 'rgba(195,134,54,0.6)' }}>
              Our Promise
            </span>
            <h2
              className="font-serif mb-8"
              style={{
                fontSize: 'clamp(34px, 4.5vw, 56px)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.15,
                letterSpacing: '0.02em',
              }}
            >
              Everything we make,
              <br />
              <span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(130deg, #C38636, #DCB264)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                we make with intention.
              </span>
            </h2>
            <p style={{
              fontSize: 14, lineHeight: 1.9, color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.04em', maxWidth: 420,
              fontFamily: "'DM Sans', Arial, sans-serif",
            }}>
              From the first botanical extract to the final formulation, every
              YuvaGlow product is built on a foundation of ethical sourcing,
              scientific rigour, and a deep respect for nature.
            </p>

            {/* Thin gold rule */}
            <div className="mt-10 flex items-center gap-3">
              <div style={{ width: 40, height: 1, background: 'rgba(195,134,54,0.4)' }} />
              <div style={{ width: 5, height: 5, background: '#C38636', transform: 'rotate(45deg)' }} />
              <div style={{ width: 40, height: 1, background: 'rgba(195,134,54,0.4)' }} />
            </div>
          </ScrollReveal>

          {/* Right — promise pillars */}
          <div className="flex flex-col gap-0">
            {PROMISES.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.08}>
                <div
                  className="flex items-start gap-5 py-7 group transition-all duration-300"
                  style={{ borderBottom: '1px solid rgba(195,134,54,0.08)' }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                    style={{ color: 'rgba(195,134,54,0.5)' }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <h3
                      className="font-serif mb-2"
                      style={{ fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em' }}
                    >
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, letterSpacing: '0.04em', fontFamily: "'DM Sans', Arial, sans-serif" }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
