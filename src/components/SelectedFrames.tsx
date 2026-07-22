import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';

const curatedPreviewItems: GalleryItem[] = [
  {
    id: '1',
    src: '/kochi_port_monsoon.jpg',
    title: 'Kochi Port',
    type: 'FILM PHOTOGRAPHY'
  },
  {
    id: '2',
    src: '/mountain_sketch.jpg',
    title: 'Western Ghats',
    type: 'SKETCHBOOK DRAFT'
  },
  {
    id: '3',
    src: '/street_rain.jpg',
    title: 'MG Road',
    type: 'FILM PHOTOGRAPHY'
  },
  {
    id: '4',
    src: '/brutalist_sketch.jpg',
    title: 'Elevation Study',
    type: 'SKETCHBOOK DRAFT'
  }
];

export const SelectedFrames: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section id="selected-frames" className="w-full px-6 md:px-10 py-12 md:py-16 border-b border-[var(--ink-faint)]/40">
      {/* Section Header with Archive CTA in same row */}
      <div className="flex justify-between items-baseline mb-8">
        <div className="flex items-baseline gap-4">
          <span className="accent-hover-bracket inline-block font-mono text-[11px] text-[var(--ink)] tracking-[0.1em] border border-[var(--ink-faint)] px-2.5 py-1 select-none bg-[#12110E]/80">
            <span className="bracket">[</span> 02 / SELECTED FRAMES <span class="bracket">]</span>
          </span>
          <span className="font-serif italic text-[13px] text-[var(--ink-muted)] hidden sm:inline">
            A curated preview of 4 frames
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
        {curatedPreviewItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2.5 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Borderless Image Thumbnail */}
            <div className="w-full h-[140px] md:h-[160px] overflow-hidden bg-[#141310]">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover block saturate-[85%] contrast-[95%] group-hover:saturate-100 group-hover:contrast-100 transition-all duration-300"
              />
            </div>

            {/* Compact Caption Footer */}
            <div className="flex justify-between items-baseline px-0.5 pt-0.5">
              <span className="font-serif italic text-[13px] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate">
                {item.title}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--ink-faint)] shrink-0 font-medium">
                {item.type === 'SKETCHBOOK DRAFT' ? 'sketch' : 'film'}
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
