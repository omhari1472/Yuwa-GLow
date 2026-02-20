'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import API, { getImageUrl } from '@/lib/api';
import type { Blog } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    API.getBlogs().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setBlogs(res.data.slice(0, 3));
      }
    });
  }, []);

  if (blogs.length === 0) return null;

  const [feature, ...rest] = blogs;

  return (
    <section className="py-28 px-5 sm:px-8" style={{ background: '#faf8f4' }}>
      {/* Header */}
      <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 max-w-7xl mx-auto gap-4">
        <div>
          <span className="section-eyebrow mb-3">Latest Stories</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(34px, 4.5vw, 56px)' }}>
            From Our Journal
          </h2>
        </div>
        <Link href="/blog/" className="cta-link flex-shrink-0">
          All Stories
        </Link>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: 480 }}>

        {/* Feature card — large, left, 2/3 width */}
        <ScrollReveal className="lg:col-span-2">
          <Link href={`/blog/?slug=${feature.slug}`} className="block group h-full">
            <div
              className="relative h-full rounded-none overflow-hidden"
              style={{
                minHeight: 'clamp(340px, 48vw, 540px)',
                background: '#e8e0d8',
                boxShadow: '0 16px 56px rgba(0,0,0,0.1)',
              }}
            >
              {feature.image_url && (
                <Image
                  src={getImageUrl(feature.image_url)}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }}
              />

              {/* Tag */}
              <div className="absolute top-6 left-6">
                <span style={{
                  background: 'rgba(195,134,54,0.9)',
                  color: '#fff',
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  fontFamily: "'DM Sans', Arial, sans-serif",
                  fontWeight: 500,
                }}>
                  {feature.author || 'YuvaGlow'} &middot; Featured
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3
                  className="font-serif mb-3 transition-colors duration-300 group-hover:text-[#DCB264]"
                  style={{
                    fontSize: 'clamp(22px, 2.5vw, 32px)',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: 1.25,
                    letterSpacing: '0.01em',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, letterSpacing: '0.04em', fontFamily: "'DM Sans', Arial, sans-serif" }}>
                  {feature.excerpt || feature.content?.replace(/<[^>]*>/g, '').slice(0, 120)}
                </p>
                <span className="inline-flex items-center gap-2 mt-4 transition-all duration-300 group-hover:gap-3"
                  style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#DCB264', fontFamily: "'DM Sans', Arial, sans-serif", fontWeight: 500 }}>
                  Read Story →
                </span>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Two stacked smaller cards */}
        <div className="flex flex-col gap-6">
          {rest.map((blog, i) => (
            <ScrollReveal key={blog.id} delay={i * 0.1} className="flex-1">
              <Link href={`/blog/?slug=${blog.slug}`} className="block group h-full">
                <div
                  className="relative overflow-hidden h-full"
                  style={{
                    minHeight: 'clamp(180px, 22vw, 250px)',
                    background: '#e8e0d8',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  }}
                >
                  {blog.image_url && (
                    <Image
                      src={getImageUrl(blog.image_url)}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)' }} />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(220,178,100,0.8)', marginBottom: 6, fontFamily: "'DM Sans', Arial, sans-serif", fontWeight: 500 }}>
                      {blog.author || 'YuvaGlow'}
                    </p>
                    <h3
                      className="font-serif line-clamp-2 group-hover:text-[#DCB264] transition-colors duration-300"
                      style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3, letterSpacing: '0.01em' }}
                    >
                      {blog.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
