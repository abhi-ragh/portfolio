import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';

interface SelectedFramesProps {
  items?: ArchiveImage[];
}

export const SelectedFrames: React.FC<SelectedFramesProps> = ({ items = fallbackImages.filter(i => i.homepage) }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Take exactly 4 items for the homepage asymmetric grid
  const gridItems: GalleryItem[] = items.slice(0, 4).map(item => ({
    id: item.id,
    src: item.imageUrl,
    title: item.caption,
    type: item.type
  }));

  const item1 = gridItems[0] || { id: '1', src: '/kochi_port_monsoon.jpg', title: 'Monsoon, Western Ghats', type: 'FILM PHOTOGRAPHY' };
  const item2 = gridItems[1] || { id: '2', src: '/mountain_sketch.jpg', title: 'Brutalist Study', type: 'SKETCHBOOK DRAFT' };
  const item3 = gridItems[2] || { id: '3', src: '/street_rain.jpg', title: 'Kochi Port, Dusk', type: 'FILM PHOTOGRAPHY' };
  const item4 = gridItems[3] || { id: '4', src: '/brutalist_sketch.jpg', title: 'Contour Study No. 7', type: 'SKETCHBOOK DRAFT' };

  return (
    <section id="gallery" className="sec-relative w-full px-6 md:px-10 pt-[2.5rem] pb-[3rem] border-b border-[var(--rule)]">
      {/* Oversized Background Number 02 */}
      <span className="section-bg-number" aria-hidden="true">02</span>

      <div className="relative z-10 w-full">
        {/* Section Label */}
        <div className="mb-6">
          <span className="accent-hover-bracket inline-block font-mono text-[10px] text-[var(--ink-faint)] tracking-[0.1em] border border-[var(--ink-faint)] px-2 py-0.5 select-none bg-[#12110E]/80 uppercase">
            <span className="bracket">[</span> 02 / GALLERY <span class="bracket">]</span>
          </span>
        </div>

        {/* Asymmetric Editorial Grid (55fr 43fr layout with 1px rule gap) */}
        <div className="grid grid-cols-1 md:grid-cols-[55fr_43fr] gap-[1px] bg-[var(--rule)] -mx-6 md:-mx-10">
          {/* Item 1: Large top-left with hanging title */}
          <div
            className="gitem relative cursor-pointer pb-[1.8em]"
            onClick={() => setSelectedItem(item1)}
          >
            <div className="w-full h-[260px] md:h-[320px] overflow-hidden bg-[#161512]">
              <img src={item1.src} alt={item1.title} className="w-full h-full object-cover block hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <span className="hanging-title font-serif italic text-[12px] text-[var(--ink)] absolute -bottom-[1.3em] left-0 leading-none z-10 px-6 md:px-10">
              {item1.title}
            </span>
          </div>

          {/* Item 2: Small top-right with offset caption */}
          <div
            className="gitem relative cursor-pointer"
            onClick={() => setSelectedItem(item2)}
          >
            <div className="w-full h-[180px] md:h-[220px] overflow-hidden bg-[#161512]">
              <img src={item2.src} alt={item2.title} className="w-full h-full object-cover block hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div className="offset-caption pt-2 pl-6 pr-4 flex justify-between items-baseline">
              <span className="font-serif italic text-[11px] text-[var(--ink-muted)] truncate max-w-[65%]">{item2.title}</span>
              <span className="font-mono text-[9px] text-[var(--ink-faint)] uppercase tracking-[0.1em]">{item2.type === 'SKETCHBOOK DRAFT' ? 'SKETCH' : 'FILM'}</span>
            </div>
          </div>

          {/* Item 3: Small bottom-left with offset caption */}
          <div
            className="gitem relative cursor-pointer"
            onClick={() => setSelectedItem(item3)}
          >
            <div className="w-full h-[180px] md:h-[220px] overflow-hidden bg-[#161512]">
              <img src={item3.src} alt={item3.title} className="w-full h-full object-cover block hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <div className="offset-caption pt-2 pl-6 pr-4 flex justify-between items-baseline">
              <span className="font-serif italic text-[11px] text-[var(--ink-muted)] truncate max-w-[65%]">{item3.title}</span>
              <span className="font-mono text-[9px] text-[var(--ink-faint)] uppercase tracking-[0.1em]">{item3.type === 'SKETCHBOOK DRAFT' ? 'SKETCH' : 'FILM'}</span>
            </div>
          </div>

          {/* Item 4: Large bottom-right with hanging title */}
          <div
            className="gitem relative cursor-pointer pb-[1.8em]"
            onClick={() => setSelectedItem(item4)}
          >
            <div className="w-full h-[260px] md:h-[320px] overflow-hidden bg-[#161512]">
              <img src={item4.src} alt={item4.title} className="w-full h-full object-cover block hover:scale-[1.02] transition-transform duration-300" />
            </div>
            <span className="hanging-title font-serif italic text-[12px] text-[var(--ink)] absolute -bottom-[1.3em] left-0 leading-none z-10 px-6 md:px-10">
              {item4.title}
            </span>
          </div>
        </div>

        {/* Footer Link: View Collection → */}
        <div className="text-right pt-10 font-mono text-[11px] text-[var(--ink-muted)]">
          <a href="/archive" className="hover:text-[var(--ink)] transition-colors">
            View Collection &rarr;
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default SelectedFrames;
