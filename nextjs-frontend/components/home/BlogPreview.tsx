'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import API, { getImageUrl } from '@/lib/api';
import type { Blog } from '@/lib/types';
import ScrollReveal from '@/components/shared/ScrollReveal';

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

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
            Latest Stories
          </p>
          <h2 className="section-title text-4xl sm:text-5xl">From Our Blog</h2>
        </div>
        <Link href="/blog/" className="cta-link hidden sm:block">All Posts</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {blogs.map((blog, i) => (
          <ScrollReveal key={blog.id} delay={i * 0.1}>
            <Link href={`/blog/?slug=${blog.slug}`} className="block group">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div className="relative h-48 bg-[#f0e8da]">
                  {blog.image_url && (
                    <Image
                      src={getImageUrl(blog.image_url)}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: '#C38636' }}>
                    {blog.author || 'YuvaGlow'}
                  </p>
                  <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-[#C38636] transition-colors line-clamp-2" style={{ color: '#2c2c2c' }}>
                    {blog.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 line-clamp-2">
                    {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 100)}
                  </p>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
