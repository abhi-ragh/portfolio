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
      {/* Borderless Broadsheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {displayItems.map((item) => (
          <div
            key={item.id}
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
