import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';

interface ArchiveGridProps {
  items?: ArchiveImage[];
}

export const ArchiveGrid: React.FC<ArchiveGridProps> = ({ items = fallbackImages }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const displayItems: GalleryItem[] = items.map(item => ({
    id: item.id,
    src: item.imageUrl,
    title: item.caption,
    type: item.type
  }));

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Broadsheet Masonry Layout: Natural True Dimensions (Uncropped) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 md:gap-10 space-y-10">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid flex flex-col gap-2.5 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image Container preserving true natural aspect ratio with hairline frame */}
            <div className="w-full overflow-hidden border border-[var(--line)] bg-[var(--surface)] group-hover:border-[var(--accent)]/60 transition-colors flex items-center justify-center">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-auto block object-contain group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>

            {/* Minimal Caption Footer (Title & Type) */}
            <div className="flex justify-between items-baseline px-0.5 pt-0.5 font-mono text-[10px]">
              <span className="font-serif italic text-[14px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate max-w-[80%]">
                {item.title}
              </span>
              {item.type && (
                <span className="text-[var(--ink-tertiary)] font-semibold uppercase tracking-[0.08em]">
                  {item.type === 'SKETCHBOOK DRAFT' ? 'sketch' : '35mm'}
                </span>
              )}
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
