'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
  direction?: 'up' | 'left' | 'right';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  blur = false,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const offsets = { up: { x: 0, y: 28 }, left: { x: -40, y: 0 }, right: { x: 40, y: 0 } };
  const { x: startX, y: startY } = offsets[direction];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '-40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: startX,
        y: startY,
        filter: blur ? 'blur(6px)' : 'blur(0px)',
      }}
      animate={
        visible
          ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, x: startX, y: startY, filter: blur ? 'blur(6px)' : 'blur(0px)' }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
