/**
 * HeroTicker.jsx
 *
 * Fetches HN top 10 story titles and runs them as a seamless
 * infinite marquee at the bottom of the hero, interleaved with
 * the live IST time stamp.
 */

import { useEffect, useRef, useState } from 'react';

const SEPARATOR = '·';
const HN_CACHE_KEY = 'hn_ticker_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getFormattedISTTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
  return `IST — ${timeString}`;
}

async function fetchHNTitles() {
  // Check cache first
  try {
    const cached = sessionStorage.getItem(HN_CACHE_KEY);
    if (cached) {
      const { titles, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS) return titles;
    }
  } catch (_) {}

  // Fetch top story IDs
  const idsRes = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json'
  );
  const ids = await idsRes.json();
  const top10 = ids.slice(0, 10);

  // Fetch titles in parallel
  const stories = await Promise.all(
    top10.map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(r => r.json())
    )
  );

  const titles = stories
    .filter(s => s && s.title)
    .map(s => s.title.toUpperCase());

  // Cache result
  try {
    sessionStorage.setItem(
      HN_CACHE_KEY,
      JSON.stringify({ titles, timestamp: Date.now() })
    );
  } catch (_) {}

  return titles;
}

function buildTickerItems(hnTitles, currentTimeStr) {
  const items = [];
  if (!hnTitles || hnTitles.length === 0) {
    return [{ text: currentTimeStr, type: 'time' }];
  }

  for (let i = 0; i < hnTitles.length; i++) {
    items.push({ text: hnTitles[i], type: 'hn' });
    // Insert live time stamp after every 2 news stories
    if ((i + 1) % 2 === 0) {
      items.push({ text: currentTimeStr, type: 'time' });
    }
  }
  return items;
}

export default function HeroTicker() {
  const [currentTime, setCurrentTime] = useState(getFormattedISTTime());
  const [hnTitles, setHnTitles] = useState([]);
  const trackRef = useRef(null);

  // Keep live time updated every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedISTTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchHNTitles()
      .then(titles => {
        setHnTitles(titles);
      })
      .catch(() => {
        setHnTitles([]);
      });
  }, []);

  const items = buildTickerItems(hnTitles, currentTime);

  // Build the ticker string: items joined by separator
  // Duplicate the list so the marquee loops seamlessly
  const tickerContent = [...items, ...items]
    .map(item => item.text)
    .join(`  ${SEPARATOR}  `);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: 0,
        right: 0,
        height: '52px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        // Subtle top border to ground the ticker
        borderTop: '0.5px solid rgba(255,255,255,0.15)',
        // Fade edges so text dissolves at left and right
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        zIndex: 3,
      }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          // CSS animation — no JS scroll loop needed
          animation: 'ticker-scroll 120s linear infinite',
          // Pause on hover so user can read a headline
          cursor: 'default',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '16px',
          letterSpacing: '0.09em',
          color: 'rgba(232, 228, 220, 0.80)', // --ink at 80% opacity for bold readability
          willChange: 'transform',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {tickerContent}
        {/* Extra copy for seamless loop */}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {tickerContent}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
