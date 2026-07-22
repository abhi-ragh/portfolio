import React, { useEffect, useRef, useState } from 'react';

const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

const INK = { r: 232, g: 228, b: 220 }; // #E8E4DC (Warm Off-White)

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId;
    let time = 0;
    let isPaused = false;

    // Mouse tracking (10-15% max influence)
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth / 4));
      canvas.height = Math.max(1, Math.floor(window.innerHeight / 4));
    };

    window.addEventListener('resize', resize);
    resize();

    // Scroll listener: fixed overlay dissolve
    const onScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Unmount/pause hero canvas when scrolled past 0.85vh
      if (scrollY > vh * 0.85) {
        if (!isPaused) {
          isPaused = true;
          setVisible(false);
          if (rafId) cancelAnimationFrame(rafId);
        }
      } else {
        if (isPaused) {
          isPaused = false;
          setVisible(true);
          render();
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const render = () => {
      if (isPaused) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w <= 0 || h <= 0) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Scroll progress from 0% scroll to 55% scroll (early dissolve)
      const transitionStart = 0;
      const transitionEnd = vh * 0.55;
      const rawProgress = Math.min(1.0, Math.max(0.0, (scrollY - transitionStart) / (transitionEnd - transitionStart)));

      // Smoothstep easing curve: t * t * (3 - 2 * t)
      const smoothProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseInfluence = (1.0 - smoothProgress) * 0.12;
      const mouseNormX = (mouse.x / window.innerWidth) * mouseInfluence;
      const mouseNormY = (mouse.y / window.innerHeight) * mouseInfluence;

      time += prefersReducedMotion ? 0 : 0.015;

      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      // Scroll opacity dissolve from 1.0 down to 0.0
      const scrollOpacity = (1.0 - smoothProgress);

      for (let y = 0; y < h; y++) {
        const normY = y / h; // 0 to 1 down screen

        // Spatial dissolve mask: top 0-30% full density, 30%-75% fades down smoothly to 0
        const spatialFade = Math.max(0, Math.min(1, (0.75 - normY) / 0.45));

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;

          // Organic wave equation
          const d1 = Math.sin(x * 0.05 + time + mouseNormX) * Math.cos(y * 0.05 + time * 0.8 + mouseNormY);
          const d2 = Math.cos((x + y) * 0.03 - time * 0.5);
          const wave = (d1 + d2 + 2) / 4;

          const intensity = wave * 0.70;
          const threshold = BAYER_4X4[y % 4][x % 4] / 16;
          const lit = intensity > threshold;

          // Per-pixel alpha calculation (combines vertical spatial fade + scroll dissolve)
          const pixelAlpha = lit ? Math.floor(255 * spatialFade * scrollOpacity) : 0;

          data[idx]     = INK.r;
          data[idx + 1] = INK.g;
          data[idx + 2] = INK.b;
          data[idx + 3] = pixelAlpha;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      if (!prefersReducedMotion && !isPaused) {
        rafId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
