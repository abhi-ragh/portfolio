import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Lightbox, { GalleryItem } from './Lightbox';

const localItems: GalleryItem[] = [
  {
    id: '1',
    src: '/kochi_port_monsoon.jpg',
    title: 'Kochi Port & Monsoon Waves',
    type: 'FILM PHOTOGRAPHY'
  },
  {
    id: '2',
    src: '/mountain_sketch.jpg',
    title: 'Western Ghats Contour Study',
    type: 'SKETCHBOOK DRAFT'
  },
  {
    id: '3',
    src: '/street_rain.jpg',
    title: 'MG Road at Twilight',
    type: 'FILM PHOTOGRAPHY'
  },
  {
    id: '4',
    src: '/brutalist_sketch.jpg',
    title: 'Structural Elevation Study',
    type: 'SKETCHBOOK DRAFT'
  },
  {
    id: '5',
    src: '/palm_photo.jpg',
    title: 'Monsoon Dew & Palms',
    type: 'FILM PHOTOGRAPHY'
  }
];

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(localItems);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGalleryData() {
      if (!supabase) return;

      try {
        const { data: dbItems, error: dbError } = await supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (!dbError && dbItems && dbItems.length > 0) {
          const formatted: GalleryItem[] = dbItems.map((row: any) => {
            const { data } = supabase!.storage
              .from('gallery')
              .getPublicUrl(row.filename);

            return {
              id: row.id,
              src: data.publicUrl,
              title: row.title,
              type: row.type === 'sketch' ? 'SKETCHBOOK DRAFT' : 'FILM PHOTOGRAPHY'
            };
          });

          setItems(formatted);
        } else {
          const { data: files, error: storageError } = await supabase.storage
            .from('gallery')
            .list();

          if (!storageError && files && files.length > 0) {
            const validFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');
            if (validFiles.length > 0) {
              const formatted: GalleryItem[] = validFiles.map((file) => {
                const { data } = supabase!.storage
                  .from('gallery')
                  .getPublicUrl(file.name);

                const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
                const isSketch = file.name.toLowerCase().includes('sketch');

                return {
                  id: file.id || file.name,
                  src: data.publicUrl,
                  title: cleanTitle,
                  type: isSketch ? 'SKETCHBOOK DRAFT' : 'FILM PHOTOGRAPHY'
                };
              });

              setItems(formatted);
            }
          }
        }
      } catch (err) {
        console.warn('Supabase fetch notice: using local fallback media', err);
      }
    }

    loadGalleryData();
  }, []);

  return (
    <section id="gallery" className="w-full px-6 md:px-10 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex flex-col gap-2 mb-12">
        <div>
          <span className="accent-hover-bracket inline-block font-mono text-[11px] text-[var(--ink-faint)] tracking-[0.1em] border border-[var(--ink-faint)] px-2 py-1 select-none">
            <span className="bracket">[</span> 02 / GALLERY <span className="bracket">]</span>
          </span>
        </div>
        <p className="font-serif italic text-[13px] text-[var(--ink-muted)] max-w-lg mt-2 leading-relaxed">
          A mixed collection of 35mm film photography and pencil contour sketches. Given space to breathe.
        </p>
      </div>

      {/* Masonry Layout: CSS Multi-Column */}
      <div className="columns-1 md:columns-2 gap-10 space-y-12">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="masonry-col break-inside-avoid flex flex-col gap-2.5 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image Card */}
            <div className="w-full overflow-hidden bg-[#141310]">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>

            {/* 0.5px rule separator */}
            <div className="w-full h-[0.5px] bg-[var(--ink-faint)] my-0.5" />

            {/* Caption Row */}
            <div className="flex justify-between items-baseline px-0.5">
              <span className="font-serif italic text-[11px] text-[var(--ink-muted)] group-hover:text-[var(--ink)] transition-colors">
                {item.title}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default Gallery;
