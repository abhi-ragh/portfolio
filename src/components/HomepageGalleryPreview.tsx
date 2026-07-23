import React, { useState } from 'react';
import Lightbox, { GalleryItem } from './Lightbox';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';

interface HomepageGalleryPreviewProps {
  items?: ArchiveImage[];
}

export const HomepageGalleryPreview: React.FC<HomepageGalleryPreviewProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Take exactly 6 images (falling back to fallbackImages if missing)
  const rawList = (items && items.length > 0) ? items : fallbackImages;

  // Duplicate or slice to guarantee exactly 6 slots
  const sixSlots: ArchiveImage[] = Array.from({ length: 6 }, (_, index) => {
    return rawList[index] || fallbackImages[index % fallbackImages.length];
  });

  // Explicit configuration for the 6 fixed slots
  const slotConfigs = [
    { area: 'slot1', desktopHeight: 'h-[520px]', tabletHeight: 'h-[360px]', mobileHeight: 'h-[280px]', eager: true, colSpan: 'col-span-12' },
    { area: 'slot2', desktopHeight: 'h-[300px]', tabletHeight: 'h-[240px]', mobileHeight: 'h-[220px]', eager: false, colSpan: 'col-span-12 md:col-span-6 lg:col-span-6' },
    { area: 'slot3', desktopHeight: 'h-[300px]', tabletHeight: 'h-[240px]', mobileHeight: 'h-[220px]', eager: false, colSpan: 'col-span-12 md:col-span-6 lg:col-span-6' },
    { area: 'slot4', desktopHeight: 'h-[260px]', tabletHeight: 'h-[220px]', mobileHeight: 'h-[200px]', eager: false, colSpan: 'col-span-12 md:col-span-6 lg:col-span-4' },
    { area: 'slot5', desktopHeight: 'h-[260px]', tabletHeight: 'h-[220px]', mobileHeight: 'h-[200px]', eager: false, colSpan: 'col-span-12 md:col-span-6 lg:col-span-8' },
    { area: 'slot6', desktopHeight: 'h-[420px]', tabletHeight: 'h-[320px]', mobileHeight: 'h-[260px]', eager: false, colSpan: 'col-span-12' },
  ];

  return (
    <section id="gallery" className="sec-relative w-full px-6 md:px-10 pt-[3rem] pb-[4rem] border-b border-[var(--rule)] overflow-hidden">
      {/* Oversized Background Number 05 */}
      <span className="section-bg-number" aria-hidden="true">05</span>

      <div className="relative z-10 w-full flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div>
              <span className="accent-hover-bracket inline-block font-mono text-[10px] text-[var(--ink-faint)] tracking-[0.1em] border border-[var(--ink-faint)] px-2 py-0.5 select-none bg-[#12110E]/80 uppercase">
                <span className="bracket">[</span> 05 / SELECTED FRAMES <span class="bracket">]</span>
              </span>
            </div>
            <p className="font-serif italic text-[15px] md:text-[17px] text-[var(--ink-muted)]">
              A few things worth noticing.
            </p>
          </div>
        </div>

        {/* Fixed Editorial Composition Grid */}
        <div
          className="w-full grid grid-cols-12 gap-4 md:gap-6 lg:gap-8"
          style={{
            gridTemplateAreas: `
              "slot1 slot1 slot1 slot1 slot1 slot1 slot1 slot1 slot1 slot1 slot1 slot1"
              "slot2 slot2 slot2 slot2 slot2 slot2 slot3 slot3 slot3 slot3 slot3 slot3"
              "slot4 slot4 slot4 slot4 slot5 slot5 slot5 slot5 slot5 slot5 slot5 slot5"
              "slot6 slot6 slot6 slot6 slot6 slot6 slot6 slot6 slot6 slot6 slot6 slot6"
            `
          }}
        >
          {sixSlots.map((img, index) => {
            const config = slotConfigs[index];

            return (
              <div
                key={`${img.id}-${index}`}
                style={{ gridArea: config.area }}
                className={`flex flex-col gap-2.5 group cursor-pointer ${config.colSpan}`}
                onClick={() => setSelectedItem({
                  id: img.id,
                  src: img.imageUrl,
                  title: img.caption,
                  type: img.type
                })}
              >
                {/* Image Slot Container */}
                <div
                  className={`w-full overflow-hidden bg-[#161512] ${config.mobileHeight} ${config.tabletHeight} ${config.desktopHeight}`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Gallery image"}
                    loading={config.eager ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover block saturate-[85%] contrast-[95%] group-hover:saturate-100 group-hover:contrast-100 transition-all duration-200"
                  />
                </div>

                {/* Left-Aligned Single/Double Line Ellipsis Caption */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-serif italic text-[13px] md:text-[14px] text-[var(--ink)] line-clamp-2 max-w-[80%]">
                    {img.caption || "Untitled Frame"}
                  </span>
                  <span className="font-mono text-[9px] text-[var(--ink-faint)] uppercase tracking-[0.1em] shrink-0">
                    {img.type === 'SKETCHBOOK DRAFT' ? 'SKETCH' : 'FILM'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Publication Reference Archive Link */}
        <div className="text-right pt-6 font-mono text-[11px] text-[var(--ink-muted)] tracking-[0.08em]">
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

export default HomepageGalleryPreview;
