import ScrollReveal from '@/components/shared/ScrollReveal';

const PROMISES = [
  {
    icon: '🌿',
    title: 'Natural Ingredients',
    desc: 'Formulated with pure botanical extracts, free from harmful chemicals.',
  },
  {
    icon: '🐰',
    title: 'Cruelty-Free',
    desc: 'Never tested on animals. Certified by ethical beauty standards.',
  },
  {
    icon: '🏆',
    title: 'Premium Quality',
    desc: 'Professional-grade formulations trusted by salon experts across India.',
  },
  {
    icon: '🔬',
    title: 'Science Backed',
    desc: 'Clinically tested formulations that deliver real, visible results.',
  },
];

export default function BrandPromises() {
  return (
    <section
      className="py-20 px-4"
      style={{ background: 'linear-gradient(135deg, #f0e8da, #e8ddd0)' }}
    >
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
            Why Choose Us
          </p>
          <h2 className="section-title text-4xl sm:text-5xl">Our Promise</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROMISES.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.1} className="text-center">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4"
                style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                {p.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2" style={{ color: '#2c2c2c' }}>
                {p.title}
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: '#888' }}>
                {p.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
