/**
 * HeroGlyph.jsx
 *
 * Inline ~ symbol and "uptime: not down yet" tag positioned at the bottom-left of the hero.
 * Placed below the ticker in the vertical stack:
 * Hero Tagline -> Ticker -> Glyph
 */

import React from 'react';

export default function HeroGlyph() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        bottom:        '1rem',
        left:          '1.5rem',
        zIndex:        2,
        display:       'flex',
        flexDirection: 'row',
        alignItems:    'center',
        gap:           '0.6rem',
        pointerEvents: 'none',
        userSelect:    'none',
      }}
      className="left-6 md:left-10"
    >
      {/* Symbol ~ and Tag on the same line */}
      <span
        style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      '15px',
          fontWeight:    500,
          color:         '#000000',
          animation:     'glyph-tag-pulse 5s ease-in-out infinite',
        }}
      >
        ~
      </span>

      <span
        style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         '#000000',
          animation:     'glyph-tag-pulse 5s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      >
        uptime: not down yet
      </span>

      <style>{`
        @keyframes glyph-tag-pulse {
          0%   { opacity: 0.35; }
          50%  { opacity: 0.75; }
          100% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
