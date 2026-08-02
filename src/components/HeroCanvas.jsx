import React, { useEffect, useRef, useState } from 'react';

const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

const INK = { r: 28, g: 26, b: 23 }; // #1C1A17 — dark dots

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId;
    let time = 0;
    let isPaused = false;
    startTimeRef.current = performance.now();

    // Mouse tracking (10-15% max influence)
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const onMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
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

      // Pause hero canvas when scrolled past 0.75vh
      if (scrollY > vh * 0.75) {
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

      const now = performance.now();
      const elapsed = now - (startTimeRef.current || now);

      // Instant Frame 1 start for Hero Canvas dither sweep (0ms start, 900ms duration)
      const printProgress = prefersReducedMotion
        ? 1.0
        : Math.min(1.0, Math.max(0.0, elapsed / 900));

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Scroll progress from 0% scroll to 75% scroll
      const transitionStart = 0;
      const transitionEnd = vh * 0.75;
      const rawProgress = Math.min(1.0, Math.max(0.0, (scrollY - transitionStart) / (transitionEnd - transitionStart)));

      // Smoothstep easing curve: t * t * (3 - 2 * t)
      const smoothProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      const mNormX = mouse.x / window.innerWidth;
      const mNormY = mouse.y / window.innerHeight;
      const hasMouse = mouse.x > -500;
      const mouseRadius = 0.28;

      time += prefersReducedMotion ? 0 : 0.014;

      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      const scrollOpacity = 1.0 - smoothProgress;
      const maxVisibility = 0.40; // 40% visibility max

      for (let y = 0; y < h; y++) {
        const normY = y / h; // 0 to 1 down screen

        // Mechanical print press boundary: row y is only printed if normY <= printProgress
        if (normY > printProgress) continue;

        // Spatial dissolve mask: 40% visibility cap until 45% (normY <= 0.45), fading gradually to 0 at 90% (normY = 0.90)
        const spatialFade = Math.max(0, Math.min(1, (0.90 - normY) / 0.45));

        for (let x = 0; x < w; x++) {
          const normX = x / w;
          const idx = (y * w + x) * 4;

          let sampleX = normX;
          let sampleY = normY;
          let push = 0;

          // Interactive radial distortion field around mouse pointer
          if (hasMouse) {
            const dx = normX - mNormX;
            const dy = normY - mNormY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius) {
              const proximity = 1.0 - dist / mouseRadius;
              const smoothProx = proximity * proximity * (3 - 2 * proximity);

              // Fluid ripple displacement propagating outward from mouse cursor
              const displacement = Math.sin(dist * 30 - time * 8) * smoothProx * 0.22;
              sampleX += (dx / (dist + 0.0001)) * displacement;
              sampleY += (dy / (dist + 0.0001)) * displacement;

              // Density boost under mouse pointer
              push = smoothProx * 0.18;
            }
          }

          // Pure organic wave equation with mouse distortion
          const d1 = Math.sin(sampleX * 5 + time) * Math.cos(sampleY * 5 + time * 0.8);
          const d2 = Math.cos((sampleX + sampleY) * 3 - time * 0.5);
          const wave = Math.min(1.0, Math.max(0.0, (d1 + d2 + 2) / 4 + push));

          const intensity = wave;
          const threshold = BAYER_4X4[y % 4][x % 4] / 16;
          const lit = intensity > threshold;

          // Per-pixel alpha calculation with 40% visibility cap
          const pixelAlpha = lit ? Math.floor(255 * maxVisibility * spatialFade * scrollOpacity) : 0;

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
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchMove);
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
