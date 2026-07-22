import React, { useEffect, useRef } from 'react';

const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

const INK = { r: 232, g: 228, b: 220 }; // #E8E4DC (Warm Off-White)

export default function AmbientGrainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId;
    let time = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth / 4));
      canvas.height = Math.max(1, Math.floor(window.innerHeight / 4));
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) return;

      // Exact same 60 FPS animation speed as Hero
      time += prefersReducedMotion ? 0 : 0.015;

      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;

          // Exact same organic wave equation as Hero Section
          const d1 = Math.sin(x * 0.05 + time) * Math.cos(y * 0.05 + time * 0.8);
          const d2 = Math.cos((x + y) * 0.03 - time * 0.5);
          const wave = (d1 + d2 + 2) / 4;

          const intensity = wave * 0.70; // Full hero wave density
          const threshold = BAYER_4X4[y % 4][x % 4] / 16;
          const lit = intensity > threshold;

          // Transparent background with high-contrast off-white dots
          data[idx]     = INK.r;
          data[idx + 1] = INK.g;
          data[idx + 2] = INK.b;
          data[idx + 3] = lit ? 255 : 0; // Lit dots are solid off-white, unlit pixels transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-5">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated', opacity: 0.05 }}
      />
    </div>
  );
}
