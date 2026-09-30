import { notion, NOTION_DATABASE_ID } from './notion.ts';
import type { ArchiveImage } from './types.ts';
import { cacheNotionImage } from './download.ts';

export async function getArchiveImages(): Promise<ArchiveImage[]> {
  if (!notion || !NOTION_DATABASE_ID) {
    return [];
  }

  try {
    let pages: any[] = [];

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

      const captionObj = props.Caption?.title || props.Title?.title || props.Name?.title || [];
      const caption = captionObj.map((t: any) => t.plain_text).join('') || 'Untitled Frame';

      const filesObj = props.Images?.files || props.Image?.files || props.Files?.files || [];
      let imageUrl = '';
      if (filesObj.length > 0) {
        const fileItem = filesObj[0];
        imageUrl = fileItem.file?.url || fileItem.external?.url || '';
      }

      // Homepage field is a Select with values: "Photograph", "Sketch"
      const homepageSelect = props.Homepage?.select?.name || props.homepage?.select?.name || '';
      const homepageValue = homepageSelect.toLowerCase();

      const published = props.Published?.checkbox ??
                        props.published?.checkbox ??
                        true;

      const isSketch = caption.toLowerCase().includes('sketch') ||
                       caption.toLowerCase().includes('contour') ||
                       caption.toLowerCase().includes('elevation') ||
                       caption.toLowerCase().includes('drawing') ||
                       caption.toLowerCase().includes('pencil');

      return {
        id: page.id,
        caption,
        imageUrl: imageUrl,
        homepage: homepageValue,
        published,
        type: isSketch ? 'SKETCHBOOK DRAFT' : 'FILM PHOTOGRAPHY'
      };
    });

    const valid = parsed.filter(item => item.published && item.imageUrl);

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

export async function getHomepagePhotograph(): Promise<ArchiveImage | null> {
  const allImages = await getArchiveImages();
  const photographs = allImages.filter(item => item.homepage === 'photograph');
  return photographs.length > 0 ? photographs[0] : null;
}

export async function getHomepageSketch(): Promise<ArchiveImage | null> {
  const allImages = await getArchiveImages();
  const sketches = allImages.filter(item => item.homepage === 'sketch');
  return sketches.length > 0 ? sketches[0] : null;
}