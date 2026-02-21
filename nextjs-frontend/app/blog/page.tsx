'use client';

import { BlogCardSkeleton, DetailSkeleton } from '@/components/shared/LoadingSkeleton';
import API, { getImageUrl } from '@/lib/api';
import type { Blog } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

/* strip excessive &nbsp; the CMS injects into blog content */
function cleanContent(html: string): string {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00A0/g, ' ');
}

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

  /* resolve the image — API may return featured_image or image_url */
  const blogImage = blog
    ? blog.featured_image || blog.image_url
    : undefined;

  return (
    <div className="max-w-3xl mx-auto px-5 py-16 sm:py-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-[#C38636] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog/" className="hover:text-[#C38636] transition-colors">Blog</Link>
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
          {/* Featured Image */}
          {blogImage && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-[#f0e8da]"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            >
              <Image
                src={getImageUrl(blogImage)}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#C38636' }}>
              {blog.author && <>{blog.author} &middot; </>}
              {(blog.published_at || blog.created_at) &&
                new Date(blog.published_at || blog.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })
              }
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-serif text-3xl sm:text-4xl font-semibold mb-8 leading-tight"
            style={{ color: '#2c2c2c' }}
          >
            {blog.title}
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-[5px] h-[5px] rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, rgba(195,134,54,0.6), transparent)' }} />
          </div>

          {/* Blog Content */}
          <div
            className="blog-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: cleanContent(blog.content) }}
          />

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-[#e8ddd0]">
            <Link href="/blog/" className="cta-link cta-link-back">← Back to Blog</Link>
          </div>
        </article>
      )}

      {/* Scoped blog content styles */}
      <style jsx global>{`
        .blog-content {
          color: #444;
          font-size: 16px;
          line-height: 1.85;
          font-family: 'DM Sans', Arial, sans-serif;
        }
        .blog-content p {
          margin-bottom: 1.25em;
        }
        .blog-content p:empty {
          display: none;
        }
        .blog-content h2, .blog-content h3 {
          font-family: 'Cormorant Garamond', Garamond, serif;
          color: #2c2c2c;
          margin-top: 2em;
          margin-bottom: 0.75em;
          font-weight: 600;
          line-height: 1.3;
        }
        .blog-content h2 { font-size: 1.75rem; }
        .blog-content h3 { font-size: 1.4rem; }
        .blog-content h4 {
          font-family: 'DM Sans', Arial, sans-serif;
          color: #2c2c2c;
          font-weight: 600;
          font-size: 1.1rem;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .blog-content ul, .blog-content ol {
          padding-left: 1.5em;
          margin-bottom: 1.25em;
        }
        .blog-content li {
          margin-bottom: 0.5em;
        }
        .blog-content ul li {
          list-style-type: disc;
        }
        .blog-content ol li {
          list-style-type: decimal;
        }
        .blog-content strong {
          color: #2c2c2c;
          font-weight: 600;
        }
        .blog-content a {
          color: #C38636;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .blog-content a:hover {
          color: #a06e2a;
        }
        .blog-content blockquote {
          border-left: 3px solid #C38636;
          padding-left: 1.25em;
          margin: 1.5em 0;
          color: #666;
          font-style: italic;
        }
      `}</style>
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
          {blogs.map((blog) => {
            const img = blog.featured_image || blog.image_url;
            return (
              <Link key={blog.id} href={`/blog/?slug=${blog.slug}`} className="block group">
                <div
                  className="rounded-2xl overflow-hidden transition-shadow duration-300 group-hover:shadow-xl"
                  style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <div className="relative h-52 bg-[#f0e8da]">
                    {img && (
                      <Image
                        src={getImageUrl(img)}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: '#C38636' }}>
                      {blog.author || 'YuvaGlow'} &middot; {(blog.published_at || blog.created_at) ? new Date(blog.published_at || blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </p>
                    <h2
                      className="font-serif text-xl font-semibold mb-2 line-clamp-2 group-hover:text-[#C38636] transition-colors"
                      style={{ color: '#2c2c2c' }}
                    >
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').slice(0, 120)}
                    </p>
                    <span className="cta-link text-[10px] mt-4 inline-block">Read More</span>
                  </div>
                </div>
              </Link>
            );
          })}
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
