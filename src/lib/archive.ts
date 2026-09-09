import { notion, NOTION_DATABASE_ID } from './notion.ts';
import type { ArchiveImage } from './types.ts';
import { cacheNotionImage } from './download.ts';

export async function getArchiveImages(): Promise<ArchiveImage[]> {
  if (!notion || !NOTION_DATABASE_ID) {
    return [];
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
        imageUrl: imageUrl,
        homepage,
        published,
        type: isSketch ? 'SKETCHBOOK DRAFT' : 'FILM PHOTOGRAPHY'
      };
    });

    // Filter only published entries with valid image URLs
    const valid = parsed.filter(item => item.published && item.imageUrl);

    // Cache Notion S3 images locally for permanent CDN hosting without 1-hour expiration
    const cached = await Promise.all(
      valid.map(async (item) => {
        const localUrl = await cacheNotionImage(item.imageUrl, `archive-${item.id}`);
        return {
          ...item,
          imageUrl: localUrl
        };
      })
    );

    return cached;
  } catch (error) {
    console.warn('Notion API query notice:', error);
    return [];
  }
}

export async function getHomepageImages(): Promise<ArchiveImage[]> {
  const allImages = await getArchiveImages();
  // Filter Published == true AND Homepage == true
  const homepageItems = allImages.filter(item => item.homepage);
  return homepageItems.length > 0 ? homepageItems : allImages;
}

