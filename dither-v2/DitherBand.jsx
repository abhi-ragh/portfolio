/**
 * DitherBand.jsx
 *
 * A thin horizontal band using the SAME canvas wave dither as the hero —
 * so the visual language is consistent across the whole page.
 *
 * Unlike the hero, this is always static (frozen frame). It renders once
 * at mount using a fixed time offset so each band looks different.
 *
 * The band fades in from the dark background at its top edge and
 * fades back out at the bottom — so it reads as a textural separator
 * that belongs to both sections above and below it.
 *
 * Props:
 *   height:     number (px, default 36)
 *   density:    'sparse' | 'mid' | 'dense' (default 'mid')
 *               Controls wave amplitude — how much of the band is lit.
 *   timeOffset: number (default random) — varies the wave phase so
 *               bands don't all look identical
 *
 * Usage in Astro:
 *   import DitherBand from '../components/DitherBand.jsx';
 *   <DitherBand client:load height={32} density="mid" />
 */

import { useEffect, useRef } from 'react';

const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

const INK = { r: 232, g: 228, b: 220 };
const BG  = { r: 14,  g: 13,  b: 11  };

// Density maps to wave amplitude — higher amplitude = more lit pixels
const AMPLITUDE = { sparse: 0.55, mid: 0.72, dense: 0.88 };

export default function DitherBand({
  height     = 36,
  density    = 'mid',
  timeOffset = Math.random() * Math.PI * 2,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const w = canvas.width  = Math.floor(window.innerWidth / 4);
      const h = canvas.height = Math.max(2, Math.floor(height / 4));

      const imgData = ctx.createImageData(w, h);
      const data    = imgData.data;
      const amp     = AMPLITUDE[density] ?? AMPLITUDE.mid;
      const t       = timeOffset;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;

          const d1 = Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t * 0.8);
          const d2 = Math.cos((x + y) * 0.03 - t * 0.5);

          // Shift intensity up or down via amplitude to control density
          const intensity = ((d1 + d2) * amp + 2) / 4;

          const threshold = BAYER_4X4[y % 4][x % 4] / 16;
          const lit = intensity > threshold;

          data[idx]     = lit ? INK.r : BG.r;
          data[idx + 1] = lit ? INK.g : BG.g;
          data[idx + 2] = lit ? INK.b : BG.b;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [density, height, timeOffset]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width:    '100%',
        height:   `${height}px`,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '100%',
          display:        'block',
          imageRendering: 'pixelated',
        }}
      />
      {/* Fade edges so band dissolves into sections above and below */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(
            to bottom,
            #0E0D0B             0%,
            transparent         20%,
            transparent         80%,
            #0E0D0B             100%
          )`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
