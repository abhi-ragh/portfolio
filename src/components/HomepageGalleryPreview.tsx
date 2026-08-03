import React from 'react';
import type { ArchiveImage } from '../lib/types';
import { fallbackImages } from '../lib/archive';

interface HomepageGalleryPreviewProps {
  items?: ArchiveImage[];
}

export const HomepageGalleryPreview: React.FC<HomepageGalleryPreviewProps> = ({ items }) => {
  // Use ALL images in the Notion database (or fallbackImages), ignoring homepage checkmark
  const displayItems = (items && items.length > 0) ? items : fallbackImages;

  if (!displayItems || displayItems.length === 0) return null;

  // Build a multi-repeat pool to ensure seamless infinite looping on all screen sizes
  const repeatCount = Math.max(3, Math.ceil(12 / displayItems.length));
  const setA = Array.from({ length: repeatCount }, () => displayItems).flat();
  const ribbonList = [...setA, ...setA]; // Set A + Set B (exact 50/50 split for smooth -50% to 0% marquee)

  return (
    <div className="w-full py-4 md:py-6 bg-[var(--bg)] overflow-hidden select-none">
      <div className="w-full overflow-hidden">
        {/* Continuous Moving Archive Ribbon (Left to Right, Faster Pace, Uniform Spacing) */}
        <div className="animate-archive-ribbon flex items-center gap-4 sm:gap-5 md:gap-6">
          {ribbonList.map((item, index) => (
            <a
              key={`${item.id || 'item'}-${index}`}
              href="/archive"
              aria-label={item.caption || `View archive item ${index + 1}`}
              className="group shrink-0 block border border-[var(--rule)] p-[2px] transition-all duration-300 hover:border-[var(--accent)]/60"
            >
              <div className="relative h-[75px] sm:h-[85px] md:h-[95px] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Archive frame"}
                  className="h-full w-auto object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageGalleryPreview;







