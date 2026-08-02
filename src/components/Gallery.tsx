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
    <section id="gallery" className="w-full px-6 md:px-10 py-16 md:py-24 border-b border-[var(--ink-faint)]/40">
      {/* Section Header */}
      <div className="flex flex-col gap-2 mb-12">
        <div>
          <span className="accent-hover-bracket inline-block font-mono text-[11px] text-[var(--ink)] tracking-[0.1em] border border-[var(--ink-faint)] px-2.5 py-1 select-none bg-[#EDE8DF]/80">
            <span class="bracket">[</span> 02 / GALLERY <span class="bracket">]</span>
          </span>
        </div>
        <p className="font-serif italic text-[14px] text-[var(--ink-muted)] max-w-lg mt-2 leading-relaxed">
          A mixed collection of 35mm film photography and pencil contour sketches. Given space to breathe.
        </p>
      </div>

      {/* Broadsheet Editorial Grid Layout matching Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex flex-col border border-[var(--ink-faint)]/50 bg-[#EDE8DF]/80 p-4 gap-3 group cursor-pointer hover:border-[var(--accent)]/60 transition-colors"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image Frame */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#E4DFD5] flex items-center justify-center">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover block group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Hairline Divider */}
            <div className="w-full h-[0.5px] bg-[var(--ink-faint)]/40 my-1" />

            {/* Card Metadata Footer matching Mockup */}
            <div className="flex justify-between items-baseline px-0.5">
              <span className="font-serif italic text-[13px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate max-w-[65%]">
                {item.title}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)] font-medium">
                {item.type === 'SKETCHBOOK DRAFT' ? 'sketch' : 'film / 35mm'}
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
