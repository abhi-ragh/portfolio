import { notion, NOTION_DATABASE_ID } from './notion.ts';
import type { ArchiveImage } from './types.ts';
import { cacheNotionImage } from './download.ts';

/** Collects every page of results — Notion caps a single query at 100 rows. */
async function queryAllRows(databaseId: string): Promise<any[]> {
  const all: any[] = [];
  let cursor: string | undefined = undefined;

  for (let guard = 0; guard < 20; guard++) {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    let res: any;
    if (typeof (notion as any).dataSources?.query === 'function') {
      res = await (notion as any).dataSources.query({ data_source_id: databaseId, ...body });
    } else if (typeof (notion as any).databases?.query === 'function') {
      res = await (notion as any).databases.query({ database_id: databaseId, ...body });
    } else {
      res = await (notion as any).search({});
      return (res.results || []).filter((item: any) => item.object === 'page');
    }

    all.push(...(res.results || []));
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }

  return all;
}

/** Best-effort photo/sketch guess from the caption. The site never needs an explicit type. */
function looksLikeSketch(caption: string): boolean {
  const c = caption.toLowerCase();
  return (
    c.includes('sketch') ||
    c.includes('contour') ||
    c.includes('elevation') ||
    c.includes('drawing') ||
    c.includes('pencil')
  );
}

/**
 * Homepage is a checkbox. Older rows may still carry the old
 * "Photograph" / "Sketch" select, so both shapes are accepted.
 */
function readHomepageFlag(props: Record<string, any>): boolean {
  const prop = props.Homepage ?? props.homepage;

  if (prop?.type === 'checkbox' || typeof prop?.checkbox === 'boolean') {
    return prop.checkbox === true;
  }

  // Legacy select: any non-empty value counts as opted in.
  const legacy = prop?.select?.name;
  if (typeof legacy === 'string' && legacy.trim() !== '') return true;

  return false;
}

export async function getArchiveImages(): Promise<ArchiveImage[]> {
  if (!notion || !NOTION_DATABASE_ID) {
    return [];
  }

  try {
    const pages = await queryAllRows(NOTION_DATABASE_ID);

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

      const published = props.Published?.checkbox ??
                        props.published?.checkbox ??
                        true;

      return {
        id: page.id,
        caption,
        imageUrl: imageUrl,
        homepage: readHomepageFlag(props),
        published,
        type: looksLikeSketch(caption) ? 'SKETCHBOOK DRAFT' : 'FILM PHOTOGRAPHY'
      };
    });

    const valid = parsed.filter(item => item.published && item.imageUrl);

    const cached = await Promise.all(
      valid.map(async (item) => {
        const cachedImage = await cacheNotionImage(item.imageUrl, `archive-${item.id}`);
        return {
          ...item,
          imageUrl: cachedImage.url,
          width: cachedImage.width,
          height: cachedImage.height
        };
      })
    );

    return cached;
  } catch (error) {
    console.warn('Notion API query notice:', error);
    return [];
  }
}

/**
 * Every row ticked on the homepage is returned. Which column it lands in
 * is decided by the caption guess above, not by the database.
 */
export async function getHomepageImages(): Promise<{
  photographs: ArchiveImage[];
  sketches: ArchiveImage[];
}> {
  const all = await getArchiveImages();
  const ticked = all.filter(item => item.homepage);

  return {
    photographs: ticked.filter(item => item.type === 'FILM PHOTOGRAPHY'),
    sketches: ticked.filter(item => item.type === 'SKETCHBOOK DRAFT')
  };
}