'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import API, { getImageUrl } from '@/lib/api';
import type { Blog } from '@/lib/types';
import { BlogCardSkeleton, DetailSkeleton } from '@/components/shared/LoadingSkeleton';

function BlogDetail({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.getBlog(slug).then((res) => {
      if (res.success && res.data) setBlog(res.data);
      else setError(true);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-10 flex-wrap">
        <Link href="/" className="hover:text-[#C38636]">Home</Link>
        <span>/</span>
        <Link href="/blog/" className="hover:text-[#C38636]">Blog</Link>
        {blog && <><span>/</span><span style={{ color: '#C38636' }}>{blog.title}</span></>}
      </nav>

      {loading && <DetailSkeleton />}

      {!loading && error && (
        <div className="text-center py-20">
          <h2 className="font-serif text-3xl mb-4">Post Not Found</h2>
          <Link href="/blog/" className="cta-link">Back to Blog</Link>
        </div>
      )}

      {!loading && blog && (
        <article>
          {blog.image_url && (
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-[#f0e8da]">
              <Image
                src={getImageUrl(blog.image_url)}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <p className="text-[10px] tracking-[0.15em] uppercase mb-3" style={{ color: '#C38636' }}>
            {blog.author && <span>{blog.author} &middot; </span>}
            {blog.published_at && new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-8 leading-tight" style={{ color: '#2c2c2c' }}>
            {blog.title}
          </h1>
          <div
            className="prose prose-lg prose-headings:font-serif prose-a:text-[#C38636] max-w-none text-sm leading-relaxed"
            style={{ color: '#555' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <div className="mt-12 pt-8 border-t border-[#e8ddd0]">
            <Link href="/blog/" className="cta-link">← Back to Blog</Link>
          </div>
        </article>
      )}
    </div>
  );
}

function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getBlogs().then((res) => {
      if (res.success && Array.isArray(res.data)) setBlogs(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
          Stories & Tips
        </p>
        <h1 className="section-title text-4xl sm:text-5xl mb-4">Our Blog</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Expert hair care tips, beauty rituals, and the latest from YuvaGlow.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/?slug=${blog.slug}`} className="block group">
              <div
                className="rounded-2xl overflow-hidden transition-shadow duration-300 group-hover:shadow-xl"
                style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <div className="relative h-52 bg-[#f0e8da]">
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
                <div className="p-6">
                  <p className="text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: '#C38636' }}>
                    {blog.author || 'YuvaGlow'} &middot; {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                  <h2
                    className="font-serif text-xl font-semibold mb-2 line-clamp-2 group-hover:text-[#C38636] transition-colors"
                    style={{ color: '#2c2c2c' }}
                  >
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 120)}
                  </p>
                  <span className="cta-link text-[10px] mt-4 inline-block">Read More</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  if (slug) return <BlogDetail slug={slug} />;
  return <BlogList />;
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16"><DetailSkeleton /></div>}>
      <BlogPageContent />
    </Suspense>
  );
}
