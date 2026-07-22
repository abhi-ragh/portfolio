import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';

interface SelectedFramesProps {
  items?: ArchiveImage[];
}

export const SelectedFrames: React.FC<SelectedFramesProps> = ({ items = fallbackImages.filter(i => i.homepage) }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const displayItems: GalleryItem[] = items.map(item => ({
    id: item.id,
    src: item.imageUrl,
    title: item.caption,
    type: item.type
  }));

  return (
    <section id="selected-frames" className="w-full px-6 md:px-10 py-12 md:py-16">
      {/* Section Header with Archive CTA in same row */}
      <div className="flex justify-between items-baseline mb-8">
        <div className="flex items-baseline gap-4">
          <span className="accent-hover-bracket inline-block font-mono text-[11px] text-[var(--ink)] tracking-[0.1em] border border-[var(--ink-faint)] px-2.5 py-1 select-none bg-[#12110E]/80">
            <span className="bracket">[</span> 02 / SELECTED FRAMES <span class="bracket">]</span>
          </span>
          <span className="font-serif italic text-[13px] text-[var(--ink-muted)] hidden sm:inline">
            A curated preview of {displayItems.length} frames
          </span>
        </div>

        {/* Compact Editorial Link */}
        <a
          href="/archive"
          className="font-serif italic text-[14px] text-[var(--ink)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 group"
        >
          <span>View Archive</span>
          <span className="font-mono text-[12px] group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      {/* Borderless Compact Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2.5 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image Container */}
            <div className="w-full h-[140px] md:h-[160px] overflow-hidden bg-[#141310]">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover block saturate-[85%] contrast-[95%] group-hover:saturate-100 group-hover:contrast-100 transition-all duration-300"
              />
            </div>

            {/* Compact Caption Footer (Title only) */}
            <div className="flex justify-between items-baseline px-0.5 pt-0.5">
              <span className="font-serif italic text-[13px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate">
                {item.title}
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

export default SelectedFrames;
