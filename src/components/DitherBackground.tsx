import React, { useEffect, useRef } from 'react';

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
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

    const syncThemeColors = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      if (theme === 'dark') {
        // Off-white dither dots over dark paper
        dotR = 237;
        dotG = 232;
        dotB = 222;
      } else {
        // Near-black dither dots over light paper
        dotR = 20;
        dotG = 20;
        dotB = 20;
      }
    };

    syncThemeColors();
    window.addEventListener('themechange', syncThemeColors);

    const observer = new MutationObserver(() => syncThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 0.5x scaling for performant blocky paper dither grain
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
      if (prefersReducedMotion) return;
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
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
      }

      const data = imageData.data;
      let ptr = 0;
      const waveScaleX = 0.025;
      const waveScaleY = 0.022;

      for (let y = 0; y < height; y++) {
        const bayerRow = BAYER_4X4[y & 3];
        const yNoise = y * waveScaleY;

        for (let x = 0; x < width; x++) {
          const xNoise = x * waveScaleX;
          
          // Smooth 2D wave equation
          let wave = Math.sin(xNoise + time * 0.35) * Math.cos(yNoise + time * 0.25)
                   + Math.sin((xNoise + yNoise) * 0.7 + time * 0.2) * 0.5;

          // Local mouse reactivity (radial wave ripple near cursor)
          if (mouseActive) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;
            const radius = 140; // Influence radius in canvas pixels
            if (distSq < radius * radius) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / radius;
              wave += Math.sin(dist * 0.12 - time * 1.2) * factor * 0.6;
            }
          }

          // Normalize wave to 0..1
          const intensity = Math.max(0, Math.min(1, (wave + 1.5) / 3.0));
          const bayerThreshold = bayerRow[x & 3] / 16.0;

          if (intensity > bayerThreshold) {
            data[ptr] = dotR;
            data[ptr + 1] = dotG;
            data[ptr + 2] = dotB;
            data[ptr + 3] = 28;  // A: ~11% opacity (visible paper dither grain)
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
        time += 0.03;
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
