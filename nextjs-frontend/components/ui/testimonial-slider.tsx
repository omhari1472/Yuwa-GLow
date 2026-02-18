'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Hair Stylist, Mumbai',
    content:
      'YuvaGlow products have completely transformed my salon services. My clients keep coming back for that signature shine treatment. The formulas are professional-grade yet gentle.',
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
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const go = (next: number) => {
    setDirection(next > current ? 1 : -1);
    setCurrent((next + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
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
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center px-4"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} fill="#C38636" stroke="none" />
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="font-serif text-xl sm:text-2xl font-light leading-relaxed mb-8 italic"
              style={{ color: '#2c2c2c' }}
            >
              &ldquo;{t.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mb-2"
                style={{ background: 'linear-gradient(135deg, #C38636, #DCB264)' }}
              >
                {t.name.charAt(0)}
              </div>
              <p className="font-semibold text-sm tracking-wide" style={{ color: '#2c2c2c' }}>{t.name}</p>
              <p className="text-xs tracking-[0.1em] uppercase" style={{ color: '#C38636' }}>{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={() => go(current - 1)}
          className="w-9 h-9 border border-[#C38636]/30 flex items-center justify-center hover:border-[#C38636] hover:bg-[#C38636] hover:text-white transition-all duration-200 text-[#C38636]"
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? '#C38636' : '#ddd',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(current + 1)}
          className="w-9 h-9 border border-[#C38636]/30 flex items-center justify-center hover:border-[#C38636] hover:bg-[#C38636] hover:text-white transition-all duration-200 text-[#C38636]"
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
