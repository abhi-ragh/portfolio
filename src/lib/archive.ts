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
  return homepageItems.length > 0 ? homepageItems : fallbackImages.filter(img => img.homepage && img.published);
}

