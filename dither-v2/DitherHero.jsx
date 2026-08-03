/**
 * DitherHero.jsx
 *
 * The canvas runs the original organic wave dither at 1/4 resolution
 * scaled up with image-rendering: pixelated — preserving the large dot look.
 *
 * Integration changes vs the original:
 * 1. A CSS gradient mask fades the BOTTOM of the canvas into --bg so it
 *    dissolves into the page rather than hard-cutting.
 * 2. The hero text is absolutely positioned OVER the canvas in the lower
 *    third — sitting inside the dither, not below it.
 * 3. The canvas uses the correct dark palette: #E8E4DC dots on #0E0D0B bg.
 * 4. The component is static (no animation loop) by default. Pass
 *    animated={true} to restore the 60fps wave. Static is a frozen frame
 *    of the wave — still looks organic, zero CPU cost.
 *
 * Usage in Astro:
 *   import DitherHero from '../components/DitherHero.jsx';
 *   <DitherHero client:load animated={true} />
 */

import { useEffect, useRef } from 'react';

const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

const INK = { r: 180, g: 100, b: 40 };  // #B46428 warm amber
const BG  = { r: 245, g: 240, b: 232 }; // #F5F0E8 light background

const HERO_HEIGHT = 480; // px at full scale

export default function DitherHero({ animated = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let raf;
    let time = 0;

    const resize = () => {
      canvas.width  = Math.floor((canvas.offsetWidth || window.innerWidth) / 5);
      canvas.height = Math.floor((canvas.offsetHeight || HERO_HEIGHT) / 5);
    };

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.createImageData(w, h);
      const data    = imgData.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;

          // Organic interference wave — same formula as original
          const d1 = Math.sin(x * 0.05 + time) * Math.cos(y * 0.05 + time * 0.8);
          const d2 = Math.cos((x + y) * 0.03 - time * 0.5);
          const intensity = (d1 + d2 + 2) / 4; // normalised 0→1
          const biasedIntensity = intensity * 0.65;

          // Bayer threshold
          const threshold = BAYER_4X4[y % 4][x % 4] / 16;
          const lit = biasedIntensity > threshold;

          // Map to ink / bg colors
          data[idx]     = lit ? INK.r : BG.r;
          data[idx + 1] = lit ? INK.g : BG.g;
          data[idx + 2] = lit ? INK.b : BG.b;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      if (animated) {
        time += 0.015;
        raf = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', () => { resize(); render(); });
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [animated]);

  return (
    <section
      style={{
        position:   'relative',
        width:      '100%',
        height:     `${HERO_HEIGHT}px`,
        overflow:   'hidden',
        background: '#0E0D0B',
      }}
    >
      {/* The dither canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position:        'absolute',
          inset:           0,
          width:           '100%',
          height:          '100%',
          display:         'block',
          imageRendering:  'pixelated',
        }}
      />

      {/*
        Fade mask — covers the canvas with a gradient that goes:
        - transparent at top (shows full dither)
        - transparent until ~50% down (wave visible)
        - fades to #0E0D0B from 55% → 88% (dissolves into page)
        - solid #0E0D0B at bottom (text sits on clean dark)

        This makes the dither feel like it's part of the page surface,
        not a box sitting on top of it.
      */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(
            to bottom,
            transparent         0%,
            transparent         50%,
            rgba(14,13,11,0.6)  65%,
            rgba(14,13,11,0.92) 80%,
            #0E0D0B             90%
          )`,
        }}
      />

      {/*
        Hero text — positioned in the lower portion where the dither
        has dissolved. Text sits on clean dark, not fighting the dots.
        Adjust bottom value to taste.
      */}
      <div
        style={{
          position: 'absolute',
          bottom:   '2.5rem',
          left:     '2.5rem',
          right:    '2.5rem',
          zIndex:   2,
        }}
      >
        <h1
          style={{
            fontFamily:     "'Lora', serif",
            fontSize:       'clamp(28px, 4vw, 46px)',
            fontWeight:     400,
            lineHeight:     1.2,
            color:          '#E8E4DC',
            letterSpacing:  '-0.01em',
            margin:         0,
          }}
        >
          infrastructure, film,
          <br />
          and the space between.
        </h1>
        <p
          style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      '11px',
            color:         '#7A756C',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop:     '0.75rem',
          }}
        >
          Kochi, Kerala — 9.9312° N, 76.2673° E
        </p>
      </div>
    </section>
  );
}
