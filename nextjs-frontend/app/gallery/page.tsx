'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import API, { getImageUrl } from '@/lib/api';
import type { GalleryItem as ApiGalleryItem, Transformation } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function BeforeAfterSlider({ beforeUrl, afterUrl }: { beforeUrl: string, afterUrl: string }) {
  const [position, setPosition] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden select-none group bg-[#0a0804]"
      style={{ height: 'clamp(350px, 45vw, 600px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={afterUrl}
        alt="After result"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      <div
        className="absolute top-6 right-6 px-4 py-2 backdrop-blur-md rounded-sm border transition-opacity duration-300 z-10 shadow-lg"
        style={{
          background: 'rgba(10, 8, 4, 0.65)',
          borderColor: 'rgba(195, 134, 54, 0.3)',
          opacity: isHovered ? 1 : 0.7
        }}
      >
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#DCB264]">
          After
        </span>
      </div>

      <div
        className="absolute inset-0 z-20"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <Image
          src={beforeUrl}
          alt="Before result"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        <div
          className="absolute top-6 left-6 px-4 py-2 backdrop-blur-md rounded-sm border transition-opacity duration-300 shadow-lg"
          style={{
            background: 'rgba(10, 8, 4, 0.65)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            opacity: isHovered ? 1 : 0.7
          }}
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/90">
            Before
          </span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)' }} />

      <div
        className="absolute inset-y-0 z-30 flex flex-col items-center justify-center pointer-events-none transition-transform duration-75"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-[1.5px] h-full shadow-lg" style={{ background: 'linear-gradient(to bottom, rgba(195,134,54,0), rgba(195,134,54,0.8) 20%, rgba(195,134,54,0.8) 80%, rgba(195,134,54,0))' }} />
        <div
          className="absolute w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-lg shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
          style={{ border: '1px solid rgba(195,134,54,0.8)', background: 'rgba(10,8,4,0.65)', color: '#DCB264' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 8L5 12l4 4M15 8l4 4-4 4" />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
      />
    </div>
  );
}

interface LightboxItem {
  type: 'image' | 'video';
  url: string;
  title: string;
}

function formatEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/') + '?autoplay=1';
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return url;
}

function getYoutubeThumbnail(url: string): string {
  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
  else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

const SPAN_PATTERN = ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-2 row-span-1', 'col-span-1 row-span-1'];

export default function GalleryPage() {
  const [imageItems, setImageItems] = useState<ApiGalleryItem[]>([]);
  const [videoItems, setVideoItems] = useState<ApiGalleryItem[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);

  useEffect(() => {
    Promise.all([API.getGallery(), API.getTransformations()]).then(
      ([galleryRes, transformRes]) => {
        if (galleryRes.success && Array.isArray(galleryRes.data)) {
          setImageItems(galleryRes.data.filter((i) => i.type === 'image'));
          setVideoItems(galleryRes.data.filter((i) => i.type === 'video'));
        }
        if (transformRes.success && Array.isArray(transformRes.data)) {
          setTransformations(transformRes.data);
        }
        setLoading(false);
      }
    );
  }, []);

  const openImage = (item: ApiGalleryItem) =>
    setLightbox({ type: 'image', url: getImageUrl(item.media_url), title: item.title });

  const openVideo = (item: ApiGalleryItem) =>
    setLightbox({ type: 'video', url: formatEmbedUrl(item.media_url), title: item.title });

  const hasContent = imageItems.length > 0 || videoItems.length > 0;

  return (
    <div>
      {/* Hero */}
      <section
        className="py-28 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full opacity-10" style={{ border: '1px solid #C38636' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-15" style={{ border: '1px solid #DCB264' }} />
        </div>
        <ScrollReveal className="relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#DCB264' }}>
            Visual Stories
          </p>
          <h1 className="section-title text-5xl sm:text-7xl mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Gallery
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            A curated look at YuvaGlow — our products, results, and the people who trust us.
          </p>
        </ScrollReveal>
      </section>

      {/* Loading skeletons */}
      {loading && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[180px] gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-xl"
                style={{ gridColumn: i % 5 === 0 ? 'span 2' : 'span 1', gridRow: i % 5 === 0 ? 'span 2' : 'span 1' }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bento grid — images + videos mixed */}
      {!loading && hasContent && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <ScrollReveal className="mb-10">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#C38636' }}>
              Our Work
            </p>
            <h2 className="section-title text-3xl sm:text-4xl">Photo &amp; Video Gallery</h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[180px] gap-3">
            {/* Images */}
            {imageItems.map((item, index) => (
              <motion.div
                key={`img-${item.id}`}
                className={`relative overflow-hidden rounded-xl cursor-pointer group bg-[#f0e8da] ${SPAN_PATTERN[index % SPAN_PATTERN.length]}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                onClick={() => openImage(item)}
              >
                <Image
                  src={getImageUrl(item.media_url)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/placeholder.png'; }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {item.title && (
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Videos in bento grid */}
            {videoItems.map((item, index) => {
              const thumb = getYoutubeThumbnail(item.media_url);
              const spanIndex = (imageItems.length + index) % SPAN_PATTERN.length;
              return (
                <motion.div
                  key={`vid-${item.id}`}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group ${SPAN_PATTERN[spanIndex]}`}
                  style={{ background: '#1a1000' }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => openVideo(item)}
                >
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={item.title}
                      fill
                      className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(195,134,54,0.9)' }}
                    >
                      <Play size={22} className="text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white text-[11px] font-semibold tracking-wide px-3 text-center line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Before & After Transformations */}
      {!loading && transformations.length > 0 && (
        <section
          className="py-24 px-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #0d0600 0%, #1a0c00 55%, #0a0400 100%)' }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(195,134,54,0.3), transparent 70%)' }} />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, rgba(220,178,100,0.2), transparent 70%)' }} />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <ScrollReveal className="text-center mb-14">
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#DCB264' }}>
                Real Results
              </p>
              <h2 className="section-title text-3xl sm:text-4xl" style={{ color: 'rgba(255,255,255,0.93)' }}>
                Before &amp; After
              </h2>
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
                <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-10">
              {transformations.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.12}>
                  <div
                    className="rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      border: '1px solid rgba(195,134,54,0.15)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(195,134,54,0.05) inset'
                    }}
                  >
                    <BeforeAfterSlider
                      beforeUrl={getImageUrl(item.before_image)}
                      afterUrl={getImageUrl(item.after_image)}
                    />

                    {/* Caption bar */}
                    {(item.title || item.description) && (
                      <div
                        className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative z-10"
                        style={{ background: '#0a0804', borderTop: '1px solid rgba(195,134,54,0.1)' }}
                      >
                        <div className="w-px h-8 hidden sm:block flex-shrink-0" style={{ background: '#C38636' }} />
                        <div className="flex-1">
                          {item.title && (
                            <h4 className="font-serif text-lg sm:text-xl font-medium mb-1" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '0.02em' }}>
                              {item.title}
                            </h4>
                          )}
                          {item.description && (
                            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && !hasContent && transformations.length === 0 && (
        <div className="text-center py-28">
          <p className="text-gray-400 text-sm">Our gallery is being updated. Check back soon!</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                <X size={26} />
              </button>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                {lightbox.type === 'video' ? (
                  <iframe
                    src={lightbox.url}
                    title={lightbox.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="autoplay"
                  />
                ) : (
                  <Image
                    src={lightbox.url}
                    alt={lightbox.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                )}
              </div>
              {lightbox.title && (
                <p className="text-white/60 text-sm text-center mt-4">{lightbox.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
