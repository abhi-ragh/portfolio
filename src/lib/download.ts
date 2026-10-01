import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from './image-size.ts';

export interface CachedImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Downloads a temporary Notion AWS S3 image into public/notion-assets/
 * so it can be served statically and permanently by Vercel CDN without 1-hour expiration.
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
    const fileName = `${safeId}.${ext}`;
    const filePath = path.join(assetsDir, fileName);
    const publicUrl = `/notion-assets/${fileName}`;

    // If already downloaded and non-empty, reuse the file and its dimensions
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        return { url: publicUrl, ...imageSize(fs.readFileSync(filePath)) };
      }
    }

    // Fetch and save image buffer
    const res = await fetch(url);
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
