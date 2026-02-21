'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

export interface GalleryItem {
  id: number;
  title: string;
  url: string;
  type?: 'image' | 'video';
  span?: 'small' | 'medium' | 'large';
}

interface InteractiveBentoGalleryProps {
  items: GalleryItem[];
  title?: string;
}

export default function InteractiveBentoGallery({ items, title }: InteractiveBentoGalleryProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-sm">Gallery is being updated. Check back soon!</p>
      </div>
    );
  }

  const getSpanClass = (item: GalleryItem, index: number) => {
    if (item.span === 'large') return 'col-span-2 row-span-2';
    if (item.span === 'medium') return 'col-span-2 row-span-1';
    // Auto pattern: first every 5 items is large
    if (index % 5 === 0) return 'col-span-2 row-span-2';
    if (index % 5 === 3) return 'col-span-2 row-span-1';
    return 'col-span-1 row-span-1';
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[160px] gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`${getSpanClass(item, index)} relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(item)}
            drag={false}
          >
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/testv9/assets/images/placeholder.png';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn
                size={28}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs font-medium truncate">{item.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white"
              >
                <X size={28} />
              </button>

              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                {selected.type === 'video' ? (
                  <iframe
                    src={selected.url}
                    title={selected.title}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <Image
                    src={selected.url}
                    alt={selected.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                )}
              </div>
              <p className="text-white/70 text-sm text-center mt-3">{selected.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
