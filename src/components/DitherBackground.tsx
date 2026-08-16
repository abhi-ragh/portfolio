import React, { useEffect, useRef } from 'react';

// 8x8 Bayer Matrix for smooth, tactile ordered dither gradients
const BAYER_8X8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

export const DitherBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseActive = false;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    // Theme color tracking (dynamically adapts dither dot color on light/dark toggle)
    let dotR = 237;
    let dotG = 232;
    let dotB = 222;
    let dotAlpha = 60; // Visible paper dither grain (~24% opacity)

    const syncThemeColors = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      if (theme === 'dark') {
        // Off-white dither dots over dark paper
        dotR = 237;
        dotG = 232;
        dotB = 222;
        dotAlpha = 60;
      } else {
        // Near-black charcoal dither dots over light paper
        dotR = 30;
        dotG = 28;
        dotB = 24;
        dotAlpha = 45;
      }
    };

    syncThemeColors();
    window.addEventListener('themechange', syncThemeColors);

    const observer = new MutationObserver(() => syncThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 0.5x scaling for blocky paper dither grain
    const SCALE = 0.5;

    let width = 0;
    let height = 0;
    let imageData: ImageData | null = null;

    const handleResize = () => {
      width = Math.max(1, Math.floor(window.innerWidth * SCALE));
      height = Math.max(1, Math.floor(window.innerHeight * SCALE));
      canvas.width = width;
      canvas.height = height;
      imageData = ctx.createImageData(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse coordinates scaled to canvas size
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX * SCALE;
      targetMouseY = e.clientY * SCALE;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Render Loop
    const render = () => {
      if (!ctx || !imageData) return;

      if (mouseActive) {
        mouseX += (targetMouseX - mouseX) * 0.12;
        mouseY += (targetMouseY - mouseY) * 0.12;
      }

      const data = imageData.data;
      let ptr = 0;
      const waveScaleX = 0.022;
      const waveScaleY = 0.020;

      for (let y = 0; y < height; y++) {
        const bayerRow = BAYER_8X8[y & 7];
        const yNoise = y * waveScaleY;

        for (let x = 0; x < width; x++) {
          const xNoise = x * waveScaleX;
          
          // Organic 2D wave equation
          let wave = Math.sin(xNoise + time * 0.35) * Math.cos(yNoise + time * 0.28)
                   + Math.sin((xNoise + yNoise) * 0.75 + time * 0.22) * 0.5;

          // Local mouse reactivity (radial wave ripple near cursor)
          if (mouseActive) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;
            const radius = 150; // Influence radius in canvas pixels
            if (distSq < radius * radius) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / radius;
              wave += Math.sin(dist * 0.14 - time * 1.4) * factor * 0.7;
            }
          }

          // Normalize wave to 0..1
          const intensity = Math.max(0, Math.min(1, (wave + 1.55) / 3.1));
          const bayerThreshold = bayerRow[x & 7] / 64.0;

          if (intensity > bayerThreshold) {
            data[ptr] = dotR;
            data[ptr + 1] = dotG;
            data[ptr + 2] = dotB;
            data[ptr + 3] = dotAlpha;
          } else {
            data[ptr] = 0;
            data[ptr + 1] = 0;
            data[ptr + 2] = 0;
            data[ptr + 3] = 0;
          }
          ptr += 4;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      if (!prefersReducedMotion) {
        time += 0.032;
        animFrameId = requestAnimationFrame(render);
      }
    };

    render();

    // Pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(animFrameId);
      } else if (!prefersReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('themechange', syncThemeColors);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default DitherBackground;
