import fs from 'node:fs';
import path from 'node:path';

/**
 * Downloads a temporary Notion AWS S3 image into public/notion-assets/
 * so it can be served statically and permanently by Vercel CDN without 1-hour expiration.
 */
export async function cacheNotionImage(url: string, id: string): Promise<string> {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // If not a Notion S3 signed URL, return as-is (already permanent external URL)
  if (!url.includes('amazonaws.com') && !url.includes('notion.so')) {
    return url;
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

    // If already downloaded and non-empty, use existing file
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        return publicUrl;
      }
    }

    // Fetch and save image buffer
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[cacheNotionImage] HTTP ${res.status} when fetching ${id} from Notion S3`);
      return url; // fallback to original signed URL
    }

    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    return publicUrl;
  } catch (error) {
    console.warn(`[cacheNotionImage] Failed to cache image for ${id}:`, error);
    return url; // fallback to original signed URL
  }
}
