'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, Play } from 'lucide-react';
import API, { getImageUrl } from '@/lib/api';
import type { GalleryItem as ApiGalleryItem, Transformation } from '@/lib/types';
import ScrollReveal from '@/components/shared/ScrollReveal';

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
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
              Real Results
            </p>
            <h2 className="section-title text-3xl sm:text-4xl">Before &amp; After</h2>
            <p className="text-sm text-gray-400 mt-3 max-w-sm mx-auto">
              Witness the transformative power of YuvaGlow professional care.
            </p>
          </ScrollReveal>

          <div className="flex flex-col gap-16">
            {transformations.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.1}>
                <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-6">
                  {/* Before */}
                  <div className="relative">
                    <div className="relative h-72 rounded-2xl overflow-hidden bg-[#f0e8da]">
                      <Image src={getImageUrl(item.before_image)} alt="Before" fill className="object-cover" sizes="(max-width: 640px) 90vw, 40vw" />
                    </div>
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(44,44,44,0.8)', color: '#fff' }}>
                      Before
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2 text-[#C38636]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <p className="font-serif text-sm font-semibold hidden sm:block" style={{ color: '#C38636' }}>
                      {item.title}
                    </p>
                  </div>

                  {/* After */}
                  <div className="relative">
                    <div className="relative h-72 rounded-2xl overflow-hidden bg-[#f0e8da]">
                      <Image src={getImageUrl(item.after_image)} alt="After" fill className="object-cover" sizes="(max-width: 640px) 90vw, 40vw" />
                    </div>
                    <span className="absolute top-3 right-3 text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(195,134,54,0.9)', color: '#fff' }}>
                      After
                    </span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-center text-sm mt-3" style={{ color: '#888' }}>{item.description}</p>
                )}
              </ScrollReveal>
            ))}
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
