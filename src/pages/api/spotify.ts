import type { APIRoute } from 'astro';

export const prerender = false;

const SPOTIFY_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = import.meta.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

let cachedAccessToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string | null> {
  if (cachedAccessToken && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    console.warn('Spotify credentials not configured');
    return null;
  }

  try {
    const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    });

    if (!res.ok) {
      console.error('Spotify token refresh failed:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    cachedAccessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return cachedAccessToken;
  } catch (error) {
    console.error('Spotify token error:', error);
    return null;
  }
}

export const GET: APIRoute = async () => {
  const jsonHeaders = { 'Content-Type': 'application/json' };

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return new Response(JSON.stringify({ track: null, artist: null, error: 'unavailable' }), {
        status: 503,
        headers: jsonHeaders,
      });
    }

    const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      if (res.status === 401) cachedAccessToken = null;
      console.error('Spotify recently-played failed:', res.status, await res.text());
      return new Response(JSON.stringify({ track: null, artist: null, error: 'upstream' }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    const data = await res.json();
    const items = data.items || [];

    if (!items.length) {
      return new Response(JSON.stringify({ track: null, artist: null }), {
        headers: { ...jsonHeaders, 'Cache-Control': 'public, max-age=60' },
      });
    }

    const track = items[0].track || {};
    return new Response(
      JSON.stringify({
        track: track.name || null,
        artist: (track.artists && track.artists[0] && track.artists[0].name) || null,
        albumArt: (track.album && track.album.images && track.album.images[0] && track.album.images[0].url) || null,
        url: (track.external_urls && track.external_urls.spotify) || null,
      }),
      { headers: { ...jsonHeaders, 'Cache-Control': 'public, max-age=60' } }
    );
  } catch (error) {
    console.error('Spotify API error:', error);
    return new Response(JSON.stringify({ track: null, artist: null, error: 'internal' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};
