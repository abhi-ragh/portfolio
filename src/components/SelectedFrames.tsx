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

  // Asymmetric mixed-span tile configurations for a broadsheet feel
  const layoutConfigs = [
    { gridSpan: 'col-span-1 md:col-span-2 row-span-2', aspect: 'aspect-[4/3]' },   // Hero wide
    { gridSpan: 'col-span-1 row-span-1', aspect: 'aspect-square' },                // Square
    { gridSpan: 'col-span-1 row-span-2', aspect: 'aspect-[3/4]' },                // Tall portrait
    { gridSpan: 'col-span-1 md:col-span-2 row-span-1', aspect: 'aspect-[16/9]' }, // Wide landscape
    { gridSpan: 'col-span-1 row-span-1', aspect: 'aspect-square' },                // Square
  ];

  return (
    <section id="archive" className="flex flex-col gap-5 py-2 scroll-mt-12">
      {/* Section Eyebrow Header */}
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-secondary)] border border-[var(--line)] px-2.5 py-1 select-none inline-block">
            [ 03 / COLLECTION ]
          </span>
        </div>
        {/* Handwritten Personal Aside (System A) */}
        <p className="font-hand text-[22px] sm:text-[24px] text-[var(--ink)] leading-snug max-w-xl mt-1">
          frames captured on 35mm film &amp; pencil contour sketches&mdash;things worth keeping from quiet moments.
        </p>
      </div>

      {/* Asymmetric Mixed-Span Masonry Grid (Open canvas over dither) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        {displayItems.map((item, index) => {
          const config = layoutConfigs[index % layoutConfigs.length];
          return (
            <div
              key={item.id || index}
              className={`${config.gridSpan} flex flex-col gap-2 group cursor-pointer`}
              onClick={() => setSelectedItem({
                id: item.id,
                src: item.imageUrl,
                title: item.caption,
                type: item.type
              })}
            >
              <div className={`w-full ${config.aspect} overflow-hidden border border-[var(--line)] group-hover:border-[var(--accent)]/60 transition-colors bg-[var(--surface)] relative`}>
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex justify-between items-baseline px-0.5 pt-1 font-mono text-[10px]">
                <span className="font-serif italic text-[13px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate max-w-[75%]">
                  {item.caption}
                </span>
                <span className="text-[var(--ink-tertiary)] font-semibold uppercase tracking-[0.08em]">
                  {item.type === 'SKETCHBOOK DRAFT' ? 'sketch' : '35mm'}
                </span>
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
