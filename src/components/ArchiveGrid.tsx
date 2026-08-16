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

  const aspectPatterns = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[16/10]'];

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Multi-Column Masonry Layout (2 columns on mobile, 3 columns on desktop) */}
      <div className="columns-2 lg:columns-3 gap-3.5 sm:gap-6 md:gap-8 space-y-3.5 sm:space-y-6 md:space-y-8">
        {displayItems.map((item, index) => {
          const aspect = aspectPatterns[index % aspectPatterns.length];
          return (
            <div
              key={item.id || index}
              className="break-inside-avoid flex flex-col gap-2 group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image Container with Height Cap & Object-Cover Crop */}
              <div className={`w-full ${aspect} max-h-[390px] overflow-hidden border border-[var(--line)] bg-[var(--surface)] group-hover:border-[var(--accent)]/60 transition-colors flex items-center justify-center`}>
                <img
                  src={item.src}
                  alt={item.title || "Archive item"}
                  loading="lazy"
                  className="w-full h-full object-cover block group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default ArchiveGrid;
