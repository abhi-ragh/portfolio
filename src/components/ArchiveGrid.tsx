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
      <div className="font-serif italic text-[17px] sm:text-[19px] text-[var(--ink-secondary)] py-8">
        Oops? No images were loaded &sim;
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-12">
      {/* True Aspect Multi-Column Masonry Layout (Uncropped & Full Resolution) */}
      <div className="columns-2 lg:columns-3 gap-4 sm:gap-6 md:gap-8 space-y-4 sm:space-y-6 md:space-y-8">
        {displayItems.map((item, index) => (
          <div
            key={item.id || index}
            className="break-inside-avoid flex flex-col gap-2 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Natural Uncropped Frame with Hairline Border */}
            <div className="w-full overflow-hidden border border-[var(--line)] bg-[var(--surface)] group-hover:border-[var(--accent)]/60 transition-colors">
              <img
                src={item.src}
                alt={item.title || "Archive item"}
                loading="lazy"
                className="w-full h-auto block object-contain group-hover:scale-[1.01] transition-transform duration-300"
              />
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
