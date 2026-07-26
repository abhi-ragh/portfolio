import { notion, NOTION_DATABASE_ID } from './notion.ts';
import type { ArchiveImage } from './types.ts';

// Fallback local media when Notion credentials are unconfigured or offline
export const fallbackImages: ArchiveImage[] = [
  {
    id: 'local-1',
    caption: 'Kochi Port & Monsoon Waves',
    imageUrl: '/kochi_port_monsoon.jpg',
    homepage: true,
    published: true,
    type: 'FILM PHOTOGRAPHY'
  },
  {
    id: 'local-2',
    caption: 'Western Ghats Contour Study',
    imageUrl: '/mountain_sketch.jpg',
    homepage: true,
    published: true,
    type: 'SKETCHBOOK DRAFT'
  },
  {
    id: 'local-3',
    caption: 'MG Road at Twilight',
    imageUrl: '/street_rain.jpg',
    homepage: true,
    published: true,
    type: 'FILM PHOTOGRAPHY'
  },
  {
    id: 'local-4',
    caption: 'Structural Elevation Study',
    imageUrl: '/brutalist_sketch.jpg',
    homepage: true,
    published: true,
    type: 'SKETCHBOOK DRAFT'
  },
  {
    id: 'local-5',
    caption: 'Monsoon Dew & Palms',
    imageUrl: '/palm_photo.jpg',
    homepage: false,
    published: true,
    type: 'FILM PHOTOGRAPHY'
  }
];

export async function getArchiveImages(): Promise<ArchiveImage[]> {
  if (!notion || !NOTION_DATABASE_ID) {
    return fallbackImages.filter(img => img.published);
  }

  try {
    let pages: any[] = [];

    // Support both notion.dataSources.query and notion.databases.query API versions
    if (typeof (notion as any).dataSources?.query === 'function') {
      const res = await (notion as any).dataSources.query({
        data_source_id: NOTION_DATABASE_ID
      });
      pages = res.results || [];
    } else if (typeof (notion as any).databases?.query === 'function') {
      const res = await (notion as any).databases.query({
        database_id: NOTION_DATABASE_ID
      });
      pages = res.results || [];
    } else {
      const res = await (notion as any).search({});
      pages = (res.results || []).filter((item: any) => item.object === 'page');
    }

    const parsed: ArchiveImage[] = pages.map((page: any) => {
      const props = page.properties || {};

      // Extract Caption (Title property: Caption, Title, or Name)
      const captionObj = props.Caption?.title || props.Title?.title || props.Name?.title || [];
      const caption = captionObj.map((t: any) => t.plain_text).join('') || 'Untitled Frame';

      // Extract Image URL (Files property: Images or Image or Files)
      const filesObj = props.Images?.files || props.Image?.files || props.Files?.files || [];
      let imageUrl = '';
      if (filesObj.length > 0) {
        const fileItem = filesObj[0];
        imageUrl = fileItem.file?.url || fileItem.external?.url || '';
      }

      // Checkboxes (support Homepage, homepage, Featured, featured; default true if property unconfigured)
      const homepage = props.Homepage?.checkbox ??
                      props.homepage?.checkbox ??
                      props.Featured?.checkbox ??
                      props.featured?.checkbox ??
                      true;

      const published = props.Published?.checkbox ??
                        props.published?.checkbox ??
                        true;

      // Determine type hint based on caption keywords
      const isSketch = caption.toLowerCase().includes('sketch') ||
                      caption.toLowerCase().includes('contour') ||
                      caption.toLowerCase().includes('elevation') ||
                      caption.toLowerCase().includes('drawing') ||
                      caption.toLowerCase().includes('pencil');

      return {
        id: page.id,
        caption,
        imageUrl: imageUrl || '/kochi_port_monsoon.jpg',
        homepage,
        published,
        type: isSketch ? 'SKETCHBOOK DRAFT' : 'FILM PHOTOGRAPHY'
      };
    });

    // Filter only published entries with valid image URLs
    const valid = parsed.filter(item => item.published && item.imageUrl);
    return valid.length > 0 ? valid : fallbackImages.filter(img => img.published);
  } catch (error) {
    console.warn('Notion API query notice: returning fallback images', error);
    return fallbackImages.filter(img => img.published);
  }
}

export async function getHomepageImages(): Promise<ArchiveImage[]> {
  const allImages = await getArchiveImages();
  // Filter Published == true AND Homepage == true
  const homepageItems = allImages.filter(item => item.homepage);
  // Return first six images (per spec v1.0)
  return homepageItems.length >= 6 ? homepageItems.slice(0, 6) : allImages.slice(0, 6);
}

export async function getAboutImage(): Promise<string | null> {
  // 1. Notion Database query for page tagged with About checkbox
  if (notion && NOTION_DATABASE_ID) {
    try {
      let pages: any[] = [];
      if (typeof (notion as any).dataSources?.query === 'function') {
        const res = await (notion as any).dataSources.query({ data_source_id: NOTION_DATABASE_ID });
        pages = res.results || [];
      } else if (typeof (notion as any).databases?.query === 'function') {
        const res = await (notion as any).databases.query({ database_id: NOTION_DATABASE_ID });
        pages = res.results || [];
      } else {
        const res = await (notion as any).search({});
        pages = (res.results || []).filter((item: any) => item.object === 'page');
      }

      for (const page of pages) {
        const props = page.properties || {};
        const about = props.About?.checkbox ?? props.about?.checkbox ?? props['About Photo']?.checkbox ?? props.About_Photo?.checkbox ?? false;
        const published = props.Published?.checkbox ?? props.published?.checkbox ?? true;

        if (about && published) {
          const filesObj = props.Images?.files || props.Image?.files || props.Files?.files || [];
          if (filesObj.length > 0) {
            const fileItem = filesObj[0];
            const imageUrl = fileItem.file?.url || fileItem.external?.url || '';
            if (imageUrl) return imageUrl;
          }
        }
      }
    } catch (error) {
      console.warn('Notion About image query notice:', error);
    }
  }

  // 2. Supabase query fallback for gallery_items with about_photo == true
  const supabaseUrl = typeof process !== 'undefined' && process.env ? process.env.SUPABASE_URL : undefined;
  const supabaseKey = typeof process !== 'undefined' && process.env ? process.env.SUPABASE_ANON_KEY : undefined;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from('gallery_items')
        .select('filename')
        .eq('about_photo', true)
        .single();

      if (data?.filename) {
        const { data: publicData } = supabase
          .storage
          .from('gallery')
          .getPublicUrl(data.filename);
        if (publicData?.publicUrl) return publicData.publicUrl;
      }
    } catch (error) {
      console.warn('Supabase About image query notice:', error);
    }
  }

  return null;
}

