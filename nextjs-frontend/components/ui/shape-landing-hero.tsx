'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { useEffect, useState } from 'react';

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
}

const STATS = [
  { value: '500+', label: 'SKUs' },
  { value: '10K+', label: 'Salons' },
  { value: '15+', label: 'Years' },
];

const HERO_IMAGES = [
  '/hero-bg.jpg',
  '/hero-bg-2.jpg',
  '/hero-bg-3.jpg',
];

export default function HeroGeometric({
  badge = 'Professional Beauty Manufacturer',
  title1 = 'Elevate Your',
  title2 = 'Beauty Ritual',
}: HeroGeometricProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[50vh] md:min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* ── FULL-BLEED HERO CAROUSEL ── */}
      {HERO_IMAGES.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`YuvaGlow — Luxury Beauty Slide ${idx + 1}`}
          fill
          priority={idx === 0}
          sizes="100vw"
          className="object-cover object-center transition-opacity duration-1000 ease-in-out"
          style={{
            objectPosition: 'center 20%',
            opacity: idx === currentSlide ? 1 : 0,
            zIndex: idx === currentSlide ? 1 : 0
          }}
        />
      ))}

      {/* ── DOT NAVIGATION ── */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 z-30 flex gap-2.5">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="rounded-full transition-all duration-500 ease-out"
            style={{
              width: idx === currentSlide ? 32 : 8,
              height: 8,
              background: idx === currentSlide ? '#C38636' : 'rgba(255,255,255,0.3)',
              boxShadow: idx === currentSlide ? '0 0 12px rgba(195,134,54,0.6)' : 'none'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── CINEMATIC OVERLAYS ── */}
      {/* Dark vignette from all edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(0,0,0,0.55) 80%),
            linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.65) 100%)
          `,
        }}
      />
      {/* Top dark gradient (for readable header) */}
      <div
        className="absolute top-0 inset-x-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' }}
      />
      {/* Bottom fade to page cream */}
      <div
        className="absolute bottom-0 inset-x-0 h-56 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #f5f2ed 0%, rgba(245,242,237,0.6) 40%, transparent 100%)' }}
      />

      {/* ── CONTENT — left-aligned for editorial feel ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-12 pb-10 sm:pb-24 pt-20 sm:pt-36">
        <div className="max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hidden sm:flex items-center gap-4 mb-4 sm:mb-8"
          >
            <div className="h-px w-10" style={{ background: 'rgba(195,134,54,0.7)' }} />
            <span style={{
              color: '#DCB264', fontSize: 9, letterSpacing: '0.35em',
              fontWeight: 600, textTransform: 'uppercase',
              fontFamily: "'DM Sans', Arial, sans-serif",
              textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            }}>
              {badge}
            </span>
          </motion.div>

          {/* Title line 1 */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', Garamond, serif",
              fontSize: 'clamp(36px, 9vw, 108px)',
              lineHeight: 0.95,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.01em',
              textShadow: '0 4px 32px rgba(0,0,0,0.5)',
              marginBottom: 8,
            }}
          >
            {title1}
          </motion.h1>

          {/* Title line 2 — gold gradient italic */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', Garamond, serif",
              fontSize: 'clamp(36px, 9vw, 108px)',
              lineHeight: 0.95,
              fontWeight: 500,
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              background: 'linear-gradient(130deg, #C38636 0%, #DCB264 42%, #F0DC9F 68%, #DCB264 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1.2rem',
              filter: 'drop-shadow(0 2px 16px rgba(195,134,54,0.4))',
            }}
          >
            {title2}
          </motion.h1>

          {/* Ornamental divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.95, ease: 'easeOut' }}
            className="hidden sm:flex items-center gap-4 mb-4 sm:mb-7"
            style={{ transformOrigin: 'left center' }}
          >
            <div className="w-[5px] h-[5px] rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div style={{ width: 80, height: 1, background: 'linear-gradient(to right, rgba(195,134,54,0.7), transparent)' }} />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="hidden sm:block"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              letterSpacing: '0.07em',
              lineHeight: 1.9,
              marginBottom: '1.2rem',
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontWeight: 300,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}
          >
            India&apos;s leading manufacturer of premium beauty formulations.
            <br />
            Crafted with botanicals. Cruelty-free. Science-backed.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a href="/products/" className="btn-solid-gold" style={{ paddingLeft: 36, paddingRight: 36 }}>
              Explore Products
            </a>
            <a href="/about/" className="btn-ghost-gold hidden sm:inline-flex" style={{
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              paddingLeft: 28, paddingRight: 28,
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(195,134,54,0.6)';
                (e.currentTarget as HTMLElement).style.color = '#DCB264';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              Our Story
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── STAT STRIP — bottom right ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-14 sm:bottom-20 right-6 sm:right-12 z-20 hidden sm:flex items-center gap-0"
      >
        {STATS.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <div className="text-right px-6">
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(20px, 2.4vw, 28px)',
                fontWeight: 500,
                background: 'linear-gradient(130deg, #C38636, #DCB264)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: 3,
                filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.5))',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', Arial, sans-serif",
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>
                {s.label}
              </div>
            </div>
            {i < STATS.length - 1 && (
              <div style={{ width: 1, height: 28, background: 'rgba(195,134,54,0.25)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20"
      >
        <span style={{
          color: 'rgba(195,134,54,0.5)', fontSize: 8,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          fontFamily: "'DM Sans', sans-serif",
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>
          Scroll
        </span>
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none" style={{ opacity: 0.4 }}>
          <rect x="1" y="1" width="16" height="26" rx="8" stroke="#C38636" strokeWidth="1.2" />
          <motion.rect
            x="7.5" y="5" width="3" height="6" rx="1.5" fill="#C38636"
            animate={{ y: [5, 12, 5], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
