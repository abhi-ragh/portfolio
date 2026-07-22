import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Lightbox, { GalleryItem } from './Lightbox';

const fullArchiveItems: GalleryItem[] = [
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

export const ArchiveGrid: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(fullArchiveItems);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadArchiveData() {
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

    loadArchiveData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Borderless Broadsheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex flex-col gap-3 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Borderless Image Container */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#141310] flex items-center justify-center">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Minimal Broadsheet Metadata Footer */}
            <div className="flex justify-between items-baseline px-0.5 pt-1">
              <div className="flex flex-col gap-0.5 max-w-[70%]">
                <span className="font-serif italic text-[14px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {item.title}
                </span>
                <span className="font-mono text-[10px] text-[var(--ink-faint)]">
                  Kochi, Kerala &bull; 2026
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)] font-medium">
                {item.type === 'SKETCHBOOK DRAFT' ? 'sketch' : 'film / 35mm'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default ArchiveGrid;
