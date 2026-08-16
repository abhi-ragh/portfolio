import React, { useState } from 'react';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';
import Lightbox, { GalleryItem } from './Lightbox';

interface SelectedFramesProps {
  items?: ArchiveImage[];
}

export const SelectedFrames: React.FC<SelectedFramesProps> = ({ items }) => {
  const fallbackHomepage = fallbackImages.filter(img => img.homepage && img.published);
  const displayItems = (items && items.length > 0) ? items : fallbackHomepage;
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Varied natural aspect ratio rhythms capped by max-h-[390px]
  const aspectPatterns = ['aspect-[4/3]', 'aspect-square', 'aspect-[3/4]', 'aspect-[16/10]'];

  return (
    <section id="collection" className="flex flex-col gap-6 py-2 scroll-mt-20">
      {/* Handwritten Personal Aside (System A) */}
      <p className="font-hand text-[24px] sm:text-[27px] text-[var(--ink)] leading-snug max-w-xl">
        sketches and clicks that usually happen outside work life :)
      </p>

      {/* Multi-Column Masonry Grid (2 columns on mobile, 3 columns on desktop) */}
      <div className="columns-2 lg:columns-3 gap-3.5 sm:gap-6 lg:gap-8 space-y-3.5 sm:space-y-6 lg:space-y-8">
        {displayItems.map((item, index) => {
          const aspect = aspectPatterns[index % aspectPatterns.length];
          return (
            <div
              key={item.id || index}
              className="break-inside-avoid flex flex-col gap-2 group cursor-pointer"
              onClick={() => setSelectedItem({
                id: item.id,
                src: item.imageUrl,
                title: item.caption,
                type: item.type
              })}
            >
              <div className={`w-full ${aspect} max-h-[390px] overflow-hidden border border-[var(--line)] group-hover:border-[var(--accent)]/60 transition-colors bg-[var(--surface)] relative`}>
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Collection item"}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* End Section Link: View the archive -> */}
      <div className="pt-2">
        <a
          href="/archive"
          className="font-mono text-[11px] font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 uppercase tracking-[0.08em]"
        >
          View the archive &rarr;
        </a>
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default SelectedFrames;
