/**
 * HeroCanvas.jsx
 *
 * Floating hero drawing canvas with unified Pen/Eraser tool, size slider,
 * Photoshop-style 2D Color Picker & Eyedropper tool,
 * Supabase 24h persistence, and real-time multi-user synchronization.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

const STROKE_LIMIT = 100;

function hsvToHex(h, s, v) {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return { h: 0, s: 0, v: 0 };
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((d / max) * 100);
  const v = Math.round(max * 100);
  return { h, s, v };
}

const PRESET_SWATCHES = [
  '#1C1A17', '#8B5E3C', '#B46428', '#6B6560',
  '#C85A32', '#2D5A4C', '#3A506B', '#8C3A5C'
];

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const colorFieldRef = useRef(null);
  const isDrawing = useRef(false);
  const isPickingColor = useRef(false);
  const currentStroke = useRef([]);
  const ctx = useRef(null);

  const [brushSize, setBrushSize] = useState(4);
  const [brushColor, setBrushColor] = useState('#1C1A17');
  const [isEraser, setIsEraser] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Photoshop Color Picker State (HSV)
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 10 });
  const [hexInput, setHexInput] = useState('#1C1A17');

  const replayStroke = useCallback((c, points, strokeColor, strokeSize) => {
    if (!c || !points || points.length < 2) return;
    c.save();
    c.beginPath();
    c.globalAlpha = 1.0;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = strokeSize;
    c.strokeStyle = strokeColor;
    c.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      c.lineTo(points[i].x, points[i].y);
    }
    c.stroke();
    c.restore();
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

  // Update Color & HSV Sync
  const updateColorFromHsv = (h, s, v) => {
    const newHsv = { h, s, v };
    setHsv(newHsv);
    const hex = hsvToHex(h, s, v);
    setBrushColor(hex);
    setHexInput(hex);
    setIsEraser(false);
  };

  const selectColorHex = (hex) => {
    setBrushColor(hex);
    setHexInput(hex);
    setHsv(hexToHsv(hex));
    setIsEraser(false);
  };

  // Native Eyedropper API
  const openEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          selectColorHex(result.sRGBHex.toUpperCase());
        }
      } catch (e) {
        // User cancelled eyedropper
      }
    } else {
      alert('Native Eyedropper API is supported in Chrome, Edge, and modern Chromium browsers.');
    }
  };

  // 2D Photoshop Saturation/Value Field Drag Handlers
  const handleColorFieldPick = (e) => {
    const rect = colorFieldRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    
    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);
    updateColorFromHsv(hsv.h, s, v);
  };

  const startColorFieldPick = (e) => {
    isPickingColor.current = true;
    handleColorFieldPick(e);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (isPickingColor.current) handleColorFieldPick(e);
    };
    const onUp = () => {
      isPickingColor.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [hsv]);

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
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos = getPos(e, canvasRef.current);
    currentStroke.current.push(pos);

    const c = ctx.current;
    c.globalAlpha = 1.0;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = isEraser ? '#F5F0E8' : brushColor;
    c.lineWidth = isEraser ? brushSize * 2 : brushSize;
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
      const strokeColor = isEraser ? '#F5F0E8' : brushColor;
      const strokeSize = isEraser ? brushSize * 2 : brushSize;
      await saveStroke(points, strokeColor, strokeSize);
    }
    currentStroke.current = [];
  };

  const atLimit = strokeCount >= STROKE_LIMIT;
  const currentHueHex = hsvToHex(hsv.h, 100, 100);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
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

      {/* Photoshop-style Color Picker Popover Modal */}
      {showColorPicker && (
        <div style={{
          position: 'absolute',
          right: '5.2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '240px',
          background: 'rgba(245,240,232,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '0.5px solid #C8C2B8',
          borderRadius: '16px',
          padding: '1rem',
          zIndex: 30,
          boxShadow: '0 8px 32px rgba(28,26,23,0.16)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          pointerEvents: 'auto',
        }}>
          {/* Header & Eyedropper */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#1C1A17', letterSpacing: '0.1em', fontWeight: 600 }}>
              COLOR PICKER
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={openEyeDropper}
                title="Eyedropper — Sample screen color"
                style={{
                  background: '#EDE8DF',
                  border: '0.5px solid #C8C2B8',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                🧪 <span style={{ fontSize: '9px' }}>DROPPER</span>
              </button>
              <button
                onClick={() => setShowColorPicker(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#6B6560',
                  padding: '2px',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 2D Photoshop Saturation/Value Box + Rainbow Hue Slider */}
          <div style={{ display: 'flex', gap: '0.75rem', height: '140px' }}>
            {/* 2D Saturation / Value Canvas */}
            <div
              ref={colorFieldRef}
              onMouseDown={startColorFieldPick}
              onTouchStart={startColorFieldPick}
              style={{
                flex: 1,
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'crosshair',
                background: currentHueHex,
                border: '0.5px solid #C8C2B8',
              }}
            >
              {/* White Saturation Gradient (Left -> Right) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, #fff, transparent)',
              }} />
              {/* Black Value Gradient (Bottom -> Top) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, #000, transparent)',
              }} />
              {/* Picker Circle Handle */}
              <div style={{
                position: 'absolute',
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Vertical Rainbow Hue Slider */}
            <input
              type="range"
              min="0"
              max="360"
              value={hsv.h}
              onChange={e => updateColorFromHsv(Number(e.target.value), hsv.s, hsv.v)}
              style={{
                writingMode: 'vertical-lr',
                direction: 'rtl',
                appearance: 'slider-vertical',
                WebkitAppearance: 'slider-vertical',
                width: '16px',
                height: '140px',
                background: `linear-gradient(to bottom,
                  #ff0000 0%, #ffff00 17%, #00ff00 33%,
                  #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`,
                borderRadius: '8px',
                border: '0.5px solid #C8C2B8',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          </div>

          {/* Preset Palette Swatches */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {PRESET_SWATCHES.map(hex => (
              <button
                key={hex}
                onClick={() => selectColorHex(hex)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: hex,
                  border: brushColor === hex ? '2px solid #8B5E3C' : '0.5px solid #C8C2B8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Hex Input & Color Preview */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: brushColor,
              border: '0.5px solid #C8C2B8',
              flexShrink: 0,
            }} />
            <input
              type="text"
              value={hexInput}
              onChange={e => {
                const val = e.target.value;
                setHexInput(val);
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  selectColorHex(val);
                }
              }}
              style={{
                flex: 1,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '0.5px solid #C8C2B8',
                background: '#EDE8DF',
                color: '#1C1A17',
              }}
            />
          </div>
        </div>
      )}

      {/* Floating toolbar — right side */}
      <div style={{
        position: 'absolute',
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: 'rgba(245,240,232,0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '0.5px solid #D8D2C6',
        borderRadius: '24px',
        padding: '1.1rem 0.75rem',
        zIndex: 20,
        boxShadow: '0 2px 16px rgba(28,26,23,0.08)',
        alignItems: 'center',
        pointerEvents: 'auto',
      }}>

        {/* Photoshop-style Color Picker Button */}
        <button
          onClick={() => setShowColorPicker(prev => !prev)}
          title="Color Picker & Dropper"
          aria-label="Color Picker"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'transparent',
            border: showColorPicker ? '1.5px solid #8B5E3C' : '1.5px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            position: 'relative',
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: brushColor,
            border: '1.5px solid #D8D2C6',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }} />
        </button>

        {/* Divider */}
        <div style={{ height: '0.5px', background: '#D8D2C6', width: '100%' }} />

        {/* Tool Mode: Pen / Draw */}
        <button
          onClick={() => { setIsEraser(false); }}
          title="Pen Brush"
          aria-label="Pen tool"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: !isEraser ? '#EDE8DF' : 'transparent',
            border: !isEraser ? '1.5px solid #8B5E3C' : '1.5px solid transparent',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ✒
        </button>

        {/* Tool Mode: Eraser */}
        <button
          onClick={() => setIsEraser(true)}
          title="Eraser"
          aria-label="Eraser tool"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isEraser ? '#EDE8DF' : 'transparent',
            border: isEraser ? '1.5px solid #8B5E3C' : '1.5px solid transparent',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ◻
        </button>

        {/* Divider */}
        <div style={{ height: '0.5px', background: '#D8D2C6', width: '100%' }} />

        {/* Single Size Slider (controls both Pen brush & Eraser) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <input
            type="range"
            min="1"
            max="24"
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            aria-label="Brush and Eraser size"
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
              appearance: 'slider-vertical',
              WebkitAppearance: 'slider-vertical',
              width: '20px',
              height: '100px',
              cursor: 'pointer',
              padding: 0,
            }}
          />
          {/* Size preview dot */}
          <div style={{
            width: `${Math.min(brushSize * 1.5, 24)}px`,
            height: `${Math.min(brushSize * 1.5, 24)}px`,
            borderRadius: '50%',
            background: isEraser ? '#EDE8DF' : brushColor,
            border: isEraser ? '1.5px solid #8B5E3C' : '1px solid #1C1A17',
            flexShrink: 0,
            transition: 'all 0.1s',
          }} />
        </div>

        {/* Divider */}
        <div style={{ height: '0.5px', background: '#D8D2C6', width: '100%' }} />

        {/* Stroke counter */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '8px',
          color: atLimit ? '#8B5E3C' : '#B8B2A8',
          textAlign: 'center',
          lineHeight: 1.3,
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
          zIndex: 20,
        }}>
          canvas full — clears in 24h
        </div>
      )}
    </div>
  );
}
