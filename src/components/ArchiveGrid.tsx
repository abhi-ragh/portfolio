import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';
import type { ArchiveImage } from '../lib/types';

interface ArchiveGridProps {
  items?: ArchiveImage[];
}

export const ArchiveGrid: React.FC<ArchiveGridProps> = ({ items = [] }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const displayItems: GalleryItem[] = (items || []).map(item => ({
    id: item.id,
    src: item.imageUrl,
    title: item.caption,
    type: item.type
  }));

  if (displayItems.length === 0) {
    return (
      <div className="font-serif italic text-[16px] text-[var(--ink-secondary)]">
        No images were loaded ~
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Masonry of rounded tiles */}
      <div className="columns-2 lg:columns-3 gap-4 sm:gap-5 md:gap-6 space-y-4 sm:space-y-5 md:space-y-6">
        {displayItems.map((item, index) => (
          <div
            key={item.id || index}
            className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-[12px] bg-[var(--surface)] transition-all duration-300 hover:bg-[var(--surface-hover)]"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.src}
              alt={item.title || 'Archive item'}
              loading="lazy"
              className="w-full h-auto block object-contain transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {item.title && (
              <div className="pointer-events-none absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="max-w-full truncate rounded-md bg-black/60 px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-wide text-white/90 backdrop-blur-md">
                  {item.title}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default ArchiveGrid;
