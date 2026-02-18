'use client';

import { motion } from 'framer-motion';

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
}

// Soft atmospheric bokeh orb — warm golden glow, no hard edges
function BokehOrb({
  size, x, y, delay, opacity,
}: {
  size: number; x: string; y: string; delay: number; opacity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, rgba(195,134,54,${opacity}) 0%, rgba(195,134,54,${opacity * 0.4}) 35%, transparent 70%)`,
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 7 + delay * 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// Floating golden dust particle
function Particle({
  x, y, size, delay, duration,
}: {
  x: string; y: string; size: number; delay: number; duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: 'rgba(220,178,100,0.7)' }}
      animate={{ y: [0, -70, 0], opacity: [0, 0.9, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

const PARTICLES = [
  { x: '8%',  y: '72%', size: 2,   delay: 0,   duration: 6   },
  { x: '18%', y: '62%', size: 1.5, delay: 1.2, duration: 8   },
  { x: '30%', y: '78%', size: 2.5, delay: 0.5, duration: 7   },
  { x: '48%', y: '80%', size: 1.5, delay: 2.1, duration: 9   },
  { x: '58%', y: '68%', size: 2,   delay: 1.6, duration: 6.5 },
  { x: '70%', y: '74%', size: 1.5, delay: 0.9, duration: 7.5 },
  { x: '82%', y: '60%', size: 2,   delay: 2.6, duration: 8   },
  { x: '12%', y: '42%', size: 1.5, delay: 3.1, duration: 10  },
  { x: '42%', y: '52%', size: 1,   delay: 1.3, duration: 7   },
  { x: '74%', y: '46%', size: 1.5, delay: 0.4, duration: 9   },
  { x: '4%',  y: '86%', size: 2,   delay: 2.3, duration: 6   },
  { x: '92%', y: '82%', size: 1.5, delay: 1.9, duration: 8.5 },
  { x: '55%', y: '35%', size: 1,   delay: 3.5, duration: 11  },
  { x: '85%', y: '30%', size: 1.5, delay: 0.7, duration: 8   },
];

export default function HeroGeometric({
  badge = 'Professional Hair Care',
  title1 = 'Elevate Your',
  title2 = 'Beauty Ritual',
}: HeroGeometricProps) {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0600 0%, #1a0c00 55%, #0a0400 100%)' }}
    >
      {/* Atmospheric warm bokeh orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BokehOrb size={700} x="-12%"  y="-18%" delay={0}   opacity={0.13} />
        <BokehOrb size={550} x="62%"   y="45%"  delay={2}   opacity={0.10} />
        <BokehOrb size={380} x="18%"   y="52%"  delay={3.5} opacity={0.08} />
        <BokehOrb size={280} x="78%"   y="-8%"  delay={1.5} opacity={0.11} />
        <BokehOrb size={200} x="42%"   y="68%"  delay={4}   opacity={0.07} />
        <BokehOrb size={160} x="-5%"   y="35%"  delay={2.5} opacity={0.06} />
      </div>

      {/* Floating golden dust */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* Radial vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 38%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Badge line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-7"
        >
          <div className="h-px w-10" style={{ background: 'rgba(195,134,54,0.55)' }} />
          <span style={{
            color: '#DCB264',
            fontSize: 10,
            letterSpacing: '0.32em',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {badge}
          </span>
          <div className="h-px w-10" style={{ background: 'rgba(195,134,54,0.55)' }} />
        </motion.div>

        {/* Main serif headline */}
        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Garamond, serif",
            fontSize: 'clamp(54px, 9.5vw, 112px)',
            lineHeight: 1.0,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.93)',
            letterSpacing: '-0.01em',
          }}
        >
          {title1}
        </motion.h1>

        {/* Gold italic second line — the wow */}
        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Garamond, serif",
            fontSize: 'clamp(54px, 9.5vw, 112px)',
            lineHeight: 1.0,
            fontWeight: 500,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            background: 'linear-gradient(130deg, #C38636 0%, #DCB264 40%, #E7CC97 68%, #DCB264 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '2rem',
          }}
        >
          {title2}
        </motion.h1>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.95, ease: 'easeOut' }}
          className="flex items-center justify-center gap-4 mb-7"
          style={{ transformOrigin: 'center' }}
        >
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(195,134,54,0.65))' }} />
          <div className="w-[6px] h-[6px] rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(195,134,54,0.65))' }} />
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          style={{
            color: 'rgba(255,255,255,0.36)',
            fontSize: 13,
            letterSpacing: '0.08em',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
          }}
        >
          Premium salon-grade formulations crafted with nature&apos;s finest botanicals.
          <br className="hidden sm:block" />
          Cruelty-free. Science-backed. Luxurious.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/products/"
            style={{ background: '#C38636', color: '#fff' }}
            className="inline-block px-10 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-85"
          >
            Explore Products
          </a>
          <a
            href="/about/"
            style={{ border: '1px solid rgba(195,134,54,0.38)', color: 'rgba(220,178,100,0.85)' }}
            className="inline-block px-10 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:border-[#C38636] hover:text-[#C38636]"
          >
            Our Story
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span style={{ color: 'rgba(195,134,54,0.45)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', sans-serif" }}>
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(195,134,54,0.7), transparent)' }}
        />
      </motion.div>

      {/* Bottom fade into cream page */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #f5f2ed 0%, rgba(245,242,237,0.6) 40%, transparent 100%)' }}
      />
    </div>
  );
}
