import React, { useEffect } from 'react';

export interface GalleryItem {
  id?: string;
  src: string;
  title: string;
  type?: 'FILM PHOTOGRAPHY' | 'SKETCHBOOK DRAFT';
}

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0E0D0B]/95 backdrop-blur-md flex flex-col justify-between p-6 md:p-10 cursor-zoom-out select-none"
      onClick={onClose}
    >
      {/* Top Bar with Close Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={onClose}
          className="font-mono text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] tracking-[0.1em] border border-[var(--ink-faint)] px-3 py-1.5 transition-colors cursor-pointer"
        >
          [ CLOSE &times; ]
        </button>
      </div>

      {/* Center Image Container */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-6" onClick={(e) => e.stopPropagation()}>
        <img
          src={item.src}
          alt={item.title}
          className="max-h-[75vh] max-w-[90vw] object-contain shadow-2xl"
        />
      </div>

      {/* Bottom Metadata: Title in Bottom-Left Corner */}
      <div className="w-full flex flex-col items-start gap-1 pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="font-serif italic text-[15px] text-[var(--ink)]">
          {item.title}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
