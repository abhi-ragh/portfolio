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
 * Falls back to old filename format (without hash) for backward compatibility.
 */
export async function cacheNotionImage(url: string, id: string): Promise<CachedImage> {
  if (!url || typeof url !== 'string') {
    return { url: '' };
  }

  // If not a Notion S3 signed URL, return as-is (already permanent external URL)
  if (!url.includes('amazonaws.com') && !url.includes('notion.so')) {
    return { url };
  }

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
    // Include hash of URL so updated images produce new filenames
    const urlHash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
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

    // Fallback: check for old filename format (without hash) for backward compatibility
    const oldFileName = `${safeId}.${ext}`;
    const oldFilePath = path.join(assetsDir, oldFileName);
    if (fs.existsSync(oldFilePath)) {
      const stats = fs.statSync(oldFilePath);
      if (stats.size > 0) {
        return { url: `/notion-assets/${oldFileName}`, ...imageSize(fs.readFileSync(oldFilePath)) };
      }
    }

    // Fetch and save image buffer
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[cacheNotionImage] HTTP ${res.status} when fetching ${id} from Notion S3`);
      return { url }; // fallback to original signed URL
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Dimensions are read from the header so the layout can be balanced
    // without the browser having to load the image first.
    return { url: publicUrl, ...imageSize(buffer) };
  } catch (error) {
    console.warn(`[cacheNotionImage] Failed to cache image for ${id}:`, error);
    return { url }; // fallback to original signed URL
  }
}
