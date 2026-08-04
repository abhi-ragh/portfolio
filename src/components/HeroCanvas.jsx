/**
 * HeroCanvas.jsx
 *
 * A drawing canvas layered in the hero section.
 * Users can draw with brush/eraser. Strokes persist 24hrs via Supabase.
 * Floating toolbar on the right with brush sizes, colors, eraser, and real-time sync.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

const STROKE_LIMIT = 100;
const COLORS = [
  '#1C1A17',  // ink — dark
  '#8B5E3C',  // accent — warm brown
  '#B46428',  // amber
  '#6B6560',  // muted grey
  '#E8E4DC',  // paper — light accent
];
const SIZES = [2, 4, 8, 14];

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef([]);
  const ctx = useRef(null);

  const [color, setColor] = useState('#1C1A17');
  const [size, setSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const replayStroke = useCallback((c, points, strokeColor, strokeSize) => {
    if (!c || !points || points.length < 2) return;
    c.beginPath();
    c.strokeStyle = strokeColor;
    c.lineWidth = strokeSize;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      c.lineTo(points[i].x, points[i].y);
    }
    c.stroke();
  }, []);

  // Load existing strokes from Supabase
  const loadStrokes = useCallback(async () => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('canvas_strokes')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Load error:', error);
      setLoading(false);
      return;
    }

    setStrokeCount(data.length);

    const canvas = canvasRef.current;
    const c = ctx.current;
    if (canvas && c && data.length > 0) {
      data.forEach(stroke => {
        replayStroke(c, stroke.points, stroke.color, stroke.size);
      });
    }

    setLoading(false);
  }, [replayStroke]);

  // Save completed stroke to Supabase
  const saveStroke = async (points, strokeColor, strokeSize) => {
    if (strokeCount >= STROKE_LIMIT) return;
    const { error } = await supabase
      .from('canvas_strokes')
      .insert({
        points,
        color: strokeColor,
        size: strokeSize,
      });
    if (!error) {
      setStrokeCount(prev => prev + 1);
    }
  };

  // Realtime Supabase Subscription
  useEffect(() => {
    const channel = supabase
      .channel('canvas_strokes_realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'canvas_strokes',
      }, (payload) => {
        const stroke = payload.new;
        if (stroke && stroke.points && ctx.current) {
          replayStroke(ctx.current, stroke.points, stroke.color, stroke.size);
          setStrokeCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [replayStroke]);

  // Canvas setup & resize listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const c = canvas.getContext('2d');
      let imageData = null;
      if (ctx.current && canvas.width > 0 && canvas.height > 0) {
        imageData = ctx.current.getImageData(0, 0, canvas.width, canvas.height);
      }
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.current = c;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      if (imageData) {
        c.putImageData(imageData, 0, 0);
      }
    };

    ctx.current = canvas.getContext('2d');
    resize();
    loadStrokes();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [loadStrokes]);

  // Drawing handlers
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e) => {
    if (strokeCount >= STROKE_LIMIT) return;
    if (e.target !== canvasRef.current) return;
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e, canvasRef.current);
    currentStroke.current = [pos];

    const c = ctx.current;
    c.beginPath();
    c.moveTo(pos.x, pos.y);
    c.strokeStyle = isEraser ? '#F5F0E8' : color;
    c.lineWidth = isEraser ? size * 3 : size;
    c.lineCap = 'round';
    c.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos = getPos(e, canvasRef.current);
    currentStroke.current.push(pos);

    const c = ctx.current;
    c.lineTo(pos.x, pos.y);
    c.stroke();
    c.beginPath();
    c.moveTo(pos.x, pos.y);
  };

  const endDraw = async (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const points = currentStroke.current;
    if (points && points.length >= 2) {
      if (!isEraser) {
        // Only persist non-eraser strokes
        await saveStroke(points, color, size);
      }
    }
    currentStroke.current = [];
  };

  const atLimit = strokeCount >= STROKE_LIMIT;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          cursor: isEraser ? 'cell' : 'crosshair',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s',
          touchAction: 'none',
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />

      {/* Floating toolbar — right side */}
      <div style={{
        position: 'absolute',
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'rgba(245,240,232,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '0.5px solid #D8D2C6',
        borderRadius: '24px',
        padding: '1rem 0.75rem',
        zIndex: 10,
        boxShadow: '0 2px 16px rgba(28,26,23,0.08)',
        pointerEvents: 'auto',
      }}>

        {/* Color swatches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              aria-label={`Select color ${c}`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: c,
                border: color === c && !isEraser
                  ? '2px solid #8B5E3C'
                  : '1.5px solid #D8D2C6',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: '#D8D2C6', margin: '0 -0.25rem' }} />

        {/* Brush sizes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => { setSize(s); setIsEraser(false); }}
              aria-label={`Select brush size ${s}px`}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'transparent',
                border: size === s && !isEraser
                  ? '1.5px solid #8B5E3C'
                  : '1.5px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <div style={{
                width: `${Math.min(s * 2, 20)}px`,
                height: `${Math.min(s * 2, 20)}px`,
                borderRadius: '50%',
                background: '#1C1A17',
              }} />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: '#D8D2C6', margin: '0 -0.25rem' }} />

        {/* Eraser */}
        <button
          onClick={() => setIsEraser(true)}
          title="Eraser"
          aria-label="Eraser tool"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isEraser ? '#EDE8DF' : 'transparent',
            border: isEraser ? '1.5px solid #8B5E3C' : '1.5px solid #D8D2C6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            padding: 0,
          }}
        >
          ◻
        </button>

        {/* Stroke counter */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '8px',
          color: atLimit ? '#8B5E3C' : '#B8B2A8',
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {strokeCount}<br/>/100
        </div>

      </div>

      {/* At limit message */}
      {atLimit && (
        <div style={{
          position: 'absolute',
          bottom: '3.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#8B5E3C',
          background: 'rgba(245,240,232,0.9)',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '0.5px solid #D8D2C6',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          canvas full — clears in 24h
        </div>
      )}
    </div>
  );
}
