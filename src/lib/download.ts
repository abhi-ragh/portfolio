import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { imageSize } from './image-size.ts';

export interface CachedImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Downloads a temporary Notion AWS S3 image into public/notion-assets/
 * so it can be served statically and permanently by Vercel CDN without 1-hour expiration.
 * Filename includes a hash of the URL so updated images in Notion get new files automatically.
 * 
 * @param url - The Notion S3 signed URL
 * @param id - Unique identifier for the image (used in filename)
 * @param options - Fetch options
 * @param options.isCacheScript - If true, use long timeout + retries. If false (build), fail fast.
 */
export async function cacheNotionImage(
  url: string, 
  id: string, 
  options: { isCacheScript?: boolean } = {}
): Promise<CachedImage> {
  if (!url || typeof url !== 'string') {
    return { url: '' };
  }

  // If not a Notion S3 signed URL, return as-is (already permanent external URL)
  if (!url.includes('amazonaws.com') && !url.includes('notion.so')) {
    return { url };
  }

  const isCacheScript = options.isCacheScript === true;
  const maxRetries = isCacheScript ? 3 : 0;
  const timeoutMs = isCacheScript ? 60000 : 5000; // 60s for cache script, 5s for build

  try {
    const assetsDir = path.resolve(process.cwd(), 'public/notion-assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Determine extension safely
    const cleanUrl = url.split('?')[0];
    const rawExt = cleanUrl.split('.').pop()?.toLowerCase() || 'jpg';
    const ext = /^[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : 'jpg';

    // Clean id for safe filename
    const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
    // Hash cleanUrl (without ephemeral AWS query params) for persistent deterministic filenames
    const urlHash = crypto.createHash('md5').update(cleanUrl).digest('hex').slice(0, 8);
    const fileName = `${safeId}-${urlHash}.${ext}`;
    const filePath = path.join(assetsDir, fileName);
    const publicUrl = `/notion-assets/${fileName}`;

    // If already downloaded and non-empty, reuse the file and its dimensions
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        return { url: publicUrl, ...imageSize(fs.readFileSync(filePath)) };
      }
    }

    // Also check if any existing file for this safeId was downloaded previously
    try {
      if (fs.existsSync(assetsDir)) {
        const existingFiles = fs.readdirSync(assetsDir);
        const match = existingFiles.find((f) => f.startsWith(`${safeId}-`) && f.endsWith(`.${ext}`));
        if (match) {
          const matchPath = path.join(assetsDir, match);
          const stats = fs.statSync(matchPath);
          if (stats.size > 0) {
            try { fs.copyFileSync(matchPath, filePath); } catch {}
            return { url: publicUrl, ...imageSize(fs.readFileSync(matchPath)) };
          }
        }
      }
    } catch {}

    // Fetch with retries (for cache script) or single attempt (for build)
    const buffer = await fetchWithRetry(url, id, maxRetries, timeoutMs, isCacheScript);
    
    if (!buffer) {
      // Build mode: fail fast, return original URL
      if (!isCacheScript) {
        return { url };
      }
      // Cache script mode: this is an error
      throw new Error(`Failed to fetch image after ${maxRetries} retries`);
    }

    fs.writeFileSync(filePath, buffer);

    // Dimensions are read from the header so the layout can be balanced
    // without the browser having to load the image first.
    return { url: publicUrl, ...imageSize(buffer) };
  } catch (error) {
    if (!isCacheScript) {
      // Build mode: don't block, return original URL
      return { url };
    }
    // Cache script mode: throw to fail the script
    throw error;
  }
}

async function fetchWithRetry(
  url: string, 
  id: string, 
  maxRetries: number, 
  timeoutMs: number,
  isCacheScript: boolean
): Promise<Buffer | null> {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const msg = `HTTP ${res.status} when fetching ${id} from Notion S3`;
        if (isCacheScript) {
          console.warn(`[cacheNotionImage] ${msg} (attempt ${attempt}/${maxRetries + 1})`);
        } else {
          console.warn(`[cacheNotionImage] ${msg}`);
        }
        if (attempt > maxRetries) return null;
        await sleep(2000 * attempt);
        continue;
      }

      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      clearTimeout(timeoutId);
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      const msg = isTimeout ? `Timeout (${timeoutMs}ms)` : `Fetch error: ${error}`;
      
      if (isCacheScript) {
        console.warn(`[cacheNotionImage] ${msg} for ${id} (attempt ${attempt}/${maxRetries + 1})`);
      } else if (isTimeout) {
        console.warn(`[cacheNotionImage] Timeout fetching ${id}, using original URL`);
      } else {
        console.warn(`[cacheNotionImage] Fetch error for ${id}:`, error);
      }
      
      if (attempt > maxRetries) return null;
      await sleep(2000 * attempt);
    }
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}