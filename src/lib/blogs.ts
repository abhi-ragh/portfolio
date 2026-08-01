import { notion, NOTION_BLOGS_ID } from './notion.ts';
import type { Blog } from './types.ts';

// In-memory server cache for Medium metadata (12 hours)
const metadataCache = new Map<string, { title: string; description: string; image: string; timestamp: number }>();
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 Hours

async function fetchMediumMetadata(url: string) {
  const cached = metadataCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { title: cached.title, description: cached.description, image: cached.image };
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const getMeta = (prop: string) => {
      const match = html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*name=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i'));
      return match ? match[1] : '';
    };

    const title = getMeta('og:title') || getMeta('twitter:title') || 'Medium Article';
    const description = getMeta('og:description') || getMeta('description') || getMeta('twitter:description') || '';
    const image = getMeta('og:image') || getMeta('twitter:image') || '/kochi_port_monsoon.jpg';

    const result = { title, description, image, timestamp: Date.now() };
    metadataCache.set(url, result);
    return { title, description, image };
  } catch (err) {
    console.warn(`Medium metadata fetch notice for ${url}:`, err);
    return {
      title: 'Medium Article',
      description: '',
      image: '/kochi_port_monsoon.jpg'
    };
  }
}

export async function getArchiveBlogs(): Promise<Blog[]> {
  if (!notion || !NOTION_BLOGS_ID) {
    return [];
  }

  try {
    let pages: any[] = [];

    if (typeof (notion as any).dataSources?.query === 'function') {
      const res = await (notion as any).dataSources.query({ data_source_id: NOTION_BLOGS_ID });
      pages = res.results || [];
    } else if (typeof (notion as any).databases?.query === 'function') {
      const res = await (notion as any).databases.query({ database_id: NOTION_BLOGS_ID });
      pages = res.results || [];
    } else {
      const res = await (notion as any).search({});
      pages = (res.results || []).filter((item: any) => item.object === 'page');
    }

    const blogs: any[] = [];

    for (const page of pages) {
      const props = page.properties || {};

      // Extract Medium URL (Check URL property OR Title property)
      let url = props.URL?.url || props.Url?.url || props.Link?.url || props.Medium?.url || props.url?.url || '';

      if (!url) {
        const titleProp = props.url?.title || props.URL?.title || props.Title?.title || props.Name?.title || [];
        url = titleProp.map((t: any) => t.plain_text).join('').trim();
      }

      const published = props.Published?.checkbox ?? true;
      const homepage = props.Homepage?.checkbox ?? false;
      const homepageOrder = props.homepage_order?.number ?? props.Homepage_Order?.number ?? props.Order?.number ?? 999;

      if (!url || !url.startsWith('http') || !published) continue;

      const meta = await fetchMediumMetadata(url);

      blogs.push({
        id: page.id,
        url,
        title: meta.title,
        description: meta.description,
        image: meta.image,
        homepage,
        published,
        homepageOrder
      });
    }

    blogs.sort((a, b) => (a.homepageOrder || 999) - (b.homepageOrder || 999));
    return blogs;
  } catch (error) {
    console.warn('Notion Blogs query notice:', error);
    return [];
  }
}

export async function getHomepageBlogs(): Promise<Blog[]> {
  const allBlogs = await getArchiveBlogs();
  const homepageItems = allBlogs.filter(b => b.homepage);
  return homepageItems.length > 0 ? homepageItems : allBlogs;
}
