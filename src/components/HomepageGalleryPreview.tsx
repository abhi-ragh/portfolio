import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';

interface HomepageGalleryPreviewProps {
  items?: ArchiveImage[];
}

export const HomepageGalleryPreview: React.FC<HomepageGalleryPreviewProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Take at least 6 items (falling back to fallbackImages if missing)
  const rawList = (items && items.length > 0) ? items : fallbackImages;

  // Guarantee 6 slots for the composition grid
  const sixSlots: ArchiveImage[] = Array.from({ length: 6 }, (_, index) => {
    return rawList[index] || fallbackImages[index % fallbackImages.length];
  });

  return (
    <section id="gallery" className="relative w-full px-6 md:px-10 pt-[2.5rem] pb-[3rem] border-b border-[var(--rule)] overflow-hidden">
      {/* Oversized Background Number 05 */}
      <span className="section-bg-number" aria-hidden="true">05</span>

      <div className="relative z-10 w-full flex flex-col mb-[1.5rem]">
        {/* Section Header */}
        <div className="flex justify-between items-baseline">
          <div>
            <span className="accent-hover-bracket inline-block font-mono text-[10px] text-[var(--ink-faint)] tracking-[0.1em] border border-[var(--ink-faint)] px-2 py-0.5 select-none bg-[#12110E]/80 uppercase">
              <span className="bracket">[</span> 05 / SELECTED FRAMES <span class="bracket">]</span>
            </span>
            <div className="font-serif italic text-[13px] text-[var(--ink-muted)] mt-[0.4rem]">
              A few things worth noticing.
            </div>
          </div>
        </div>
      </div>

      {/* Edge-to-Edge Bleed 6-Slot Gallery Grid (55fr 43fr, 340px 280px 320px) */}
      <div className="w-[calc(100%+3rem)] md:w-[calc(100%+5rem)] -mx-6 md:-mx-10 grid grid-cols-1 md:grid-cols-[55fr_43fr] md:grid-rows-[340px_280px_320px] gap-[1px] bg-[var(--rule)]">
        {/* Slot 1: Row 1 / Col 1 (Hanging Title) */}
        <div
          className="bg-[#0E0D0B] overflow-visible relative pb-[1.8em] cursor-pointer group h-[300px] md:h-auto"
          style={{ gridRow: '1', gridColumn: '1' }}
          onClick={() => setSelectedItem({
            id: sixSlots[0].id,
            src: sixSlots[0].imageUrl,
            title: sixSlots[0].caption,
            type: sixSlots[0].type
          })}
        >
          <img
            src={sixSlots[0].imageUrl}
            alt={sixSlots[0].caption || "sketch"}
            className="w-full h-full object-cover object-top block opacity-[0.88] group-hover:opacity-100 transition-opacity"
          />
          <span className="hanging-title">
            {sixSlots[0].caption || "Sometimes all thats left is the music"}
          </span>
        </div>

        {/* Slot 2: Row 1 / Col 2 (Offset Caption) */}
        <div
          className="bg-[#0E0D0B] overflow-hidden flex flex-col cursor-pointer group h-[300px] md:h-auto"
          style={{ gridRow: '1', gridColumn: '2' }}
          onClick={() => setSelectedItem({
            id: sixSlots[1].id,
            src: sixSlots[1].imageUrl,
            title: sixSlots[1].caption,
            type: sixSlots[1].type
          })}
        >
          <div className="flex-1 overflow-hidden">
            <img
              src={sixSlots[1].imageUrl}
              alt={sixSlots[1].caption || "sunset"}
              className="w-full h-full object-cover block opacity-[0.88] group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="offset-caption">
            <span className="font-serif italic text-[11px] text-[var(--ink-muted)]">
              {sixSlots[1].caption || "The Orange Sunset"}
            </span>
            <span className="font-mono text-[9px] text-[var(--ink-faint)] uppercase tracking-[0.1em]">
              {sixSlots[1].type === 'SKETCHBOOK DRAFT' ? 'Sketch' : 'Film'}
            </span>
          </div>
        </div>

        {/* Slot 3: Row 2 / Col 1 (Offset Caption) */}
        <div
          className="bg-[#0E0D0B] overflow-hidden flex flex-col cursor-pointer group h-[300px] md:h-auto"
          style={{ gridRow: '2', gridColumn: '1' }}
          onClick={() => setSelectedItem({
            id: sixSlots[2].id,
            src: sixSlots[2].imageUrl,
            title: sixSlots[2].caption,
            type: sixSlots[2].type
          })}
        >
          <div className="flex-1 overflow-hidden">
            <img
              src={sixSlots[2].imageUrl}
              alt={sixSlots[2].caption || "astronaut"}
              className="w-full h-full object-cover block opacity-[0.88] group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="offset-caption">
            <span className="font-serif italic text-[11px] text-[var(--ink-muted)]">
              {sixSlots[2].caption || "Off to space or memories"}
            </span>
            <span className="font-mono text-[9px] text-[var(--ink-faint)] uppercase tracking-[0.1em]">
              {sixSlots[2].type === 'SKETCHBOOK DRAFT' ? 'Sketch' : 'Film'}
            </span>
          </div>
        </div>

        {/* Slot 4: Row 2 / Col 2 (Hanging Title) */}
        <div
          className="bg-[#0E0D0B] overflow-visible relative pb-[1.8em] cursor-pointer group h-[300px] md:h-auto"
          style={{ gridRow: '2', gridColumn: '2' }}
          onClick={() => setSelectedItem({
            id: sixSlots[3].id,
            src: sixSlots[3].imageUrl,
            title: sixSlots[3].caption,
            type: sixSlots[3].type
          })}
        >
          <img
            src={sixSlots[3].imageUrl}
            alt={sixSlots[3].caption || "red sky"}
            className="w-full h-full object-cover object-top block opacity-[0.88] group-hover:opacity-100 transition-opacity"
          />
          <span className="hanging-title">
            {sixSlots[3].caption || "The Sky, The Ground and The Wanderer"}
          </span>
        </div>

        {/* Slot 5: Row 3 / Col 1 (Hanging Title) */}
        <div
          className="bg-[#0E0D0B] overflow-visible relative pb-[1.8em] cursor-pointer group h-[300px] md:h-auto"
          style={{ gridRow: '3', gridColumn: '1' }}
          onClick={() => setSelectedItem({
            id: sixSlots[4].id,
            src: sixSlots[4].imageUrl,
            title: sixSlots[4].caption,
            type: sixSlots[4].type
          })}
        >
          <img
            src={sixSlots[4].imageUrl}
            alt={sixSlots[4].caption || "palm photo"}
            className="w-full h-full object-cover object-top block opacity-[0.88] group-hover:opacity-100 transition-opacity"
          />
          <span className="hanging-title">
            {sixSlots[4].caption || "Monsoon Dew & Palms"}
          </span>
        </div>

        {/* Slot 6: Row 3 / Col 2 (Offset Caption) */}
        <div
          className="bg-[#0E0D0B] overflow-hidden flex flex-col cursor-pointer group h-[300px] md:h-auto"
          style={{ gridRow: '3', gridColumn: '2' }}
          onClick={() => setSelectedItem({
            id: sixSlots[5].id,
            src: sixSlots[5].imageUrl,
            title: sixSlots[5].caption,
            type: sixSlots[5].type
          })}
        >
          <div className="flex-1 overflow-hidden">
            <img
              src={sixSlots[5].imageUrl}
              alt={sixSlots[5].caption || "brutalist sketch"}
              className="w-full h-full object-cover block opacity-[0.88] group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="offset-caption">
            <span className="font-serif italic text-[11px] text-[var(--ink-muted)]">
              {sixSlots[5].caption || "Structural Elevation Study"}
            </span>
            <span className="font-mono text-[9px] text-[var(--ink-faint)] uppercase tracking-[0.1em]">
              {sixSlots[5].type === 'SKETCHBOOK DRAFT' ? 'Sketch' : 'Film'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="relative z-10 text-right pt-[2.5rem]">
        <a
          href="/archive"
          className="font-mono text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors tracking-[0.06em]"
        >
          View Collection &rarr;
        </a>
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
};

export default HomepageGalleryPreview;
