'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Hair Stylist, Mumbai',
    content:
      'YuvaGlow products have completely transformed my salon services. My clients keep coming back for that signature shine treatment. The formulas are professional-grade yet remarkably gentle.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Anika Reddy',
    role: 'Beauty Influencer',
    content:
      'I have tried hundreds of hair care products and nothing compares to YuvaGlow. The botanical ingredients actually work — my hair has never felt so nourished and healthy.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sunita Patel',
    role: 'Salon Owner, Ahmedabad',
    content:
      'As a salon owner, I need products that deliver consistent results. YuvaGlow delivers every single time. My entire team swears by these formulas.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Meera Iyer',
    role: 'Ayurvedic Wellness Coach',
    content:
      'Finally, a hair care brand that aligns with holistic wellness. YuvaGlow is cruelty-free, nature-inspired, and actually effective. I recommend it to all my clients.',
    rating: 5,
  },
];

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
}

export default function TestimonialSlider({ testimonials = DEFAULT_TESTIMONIALS }: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const go = (next: number) => {
    setDirection(next > current ? 1 : -1);
    setCurrent((next + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, filter: 'blur(4px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, filter: 'blur(4px)' }),
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-3xl mx-auto px-4">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center px-4 sm:px-8"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1.5 mb-8">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} fill="#C38636" stroke="none" />
              ))}
            </div>

            {/* Large quote */}
            <blockquote
              className="font-serif mb-10"
              style={{
                fontSize: 'clamp(22px, 3.5vw, 42px)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.01em',
              }}
            >
              &ldquo;{t.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-1"
                style={{ background: 'linear-gradient(135deg, #C38636, #DCB264)', fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t.name.charAt(0)}
              </div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.04em',
              }}>
                {t.name}
              </p>
              <p style={{
                fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#C38636', fontFamily: "'DM Sans', Arial, sans-serif",
              }}>
                {t.role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={() => go(current - 1)}
          style={{
            width: 38, height: 38, border: '1px solid rgba(195,134,54,0.25)',
            color: 'rgba(195,134,54,0.6)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease', cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#C38636';
            (e.currentTarget as HTMLElement).style.color = '#C38636';
            (e.currentTarget as HTMLElement).style.background = 'rgba(195,134,54,0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(195,134,54,0.25)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(195,134,54,0.6)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2 items-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Testimonial ${i + 1}`}
              className="transition-all duration-400 rounded-full"
              style={{
                width: i === current ? 28 : 7,
                height: 7,
                background: i === current ? '#C38636' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(current + 1)}
          style={{
            width: 38, height: 38, border: '1px solid rgba(195,134,54,0.25)',
            color: 'rgba(195,134,54,0.6)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease', cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#C38636';
            (e.currentTarget as HTMLElement).style.color = '#C38636';
            (e.currentTarget as HTMLElement).style.background = 'rgba(195,134,54,0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(195,134,54,0.25)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(195,134,54,0.6)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
          aria-label="Next testimonial"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
