import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const CanvasWrapper = styled.div`
  width: 100%;
  height: 380px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background-color: #0A0A0A;
  
  @media (min-width: 768px) {
    height: 480px;
  }
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
`;

const DitherCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = Math.floor(window.innerWidth / 4));
    let height = (canvas.height = Math.floor(380 / 4));

    const handleResize = () => {
      width = canvas.width = Math.floor(window.innerWidth / 4);
      height = canvas.height = Math.floor((window.innerWidth >= 768 ? 480 : 380) / 4);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Bayer matrix for 4x4 ordered dithering
    const bayer4x4 = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;

          // Organic wave motion
          const dist1 = Math.sin(x * 0.05 + time) * Math.cos(y * 0.05 + time * 0.8);
          const dist2 = Math.cos((x + y) * 0.03 - time * 0.5);
          const intensity = (dist1 + dist2 + 2) / 4; // Normalize to 0..1

          // Apply Bayer matrix threshold
          const threshold = bayer4x4[y % 4][x % 4] / 16;
          const pixelVal = intensity > threshold ? 220 : 15;

          // Muted warm dark tones
          data[idx] = pixelVal > 50 ? Math.floor(pixelVal * 0.88) : 13;      // Red
          data[idx + 1] = pixelVal > 50 ? Math.floor(pixelVal * 0.85) : 13;  // Green
          data[idx + 2] = pixelVal > 50 ? Math.floor(pixelVal * 0.80) : 13;  // Blue
          data[idx + 3] = 255;                                                // Alpha
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <CanvasWrapper>
      <StyledCanvas ref={canvasRef} />
    </CanvasWrapper>
  );
};

export default DitherCanvas;
