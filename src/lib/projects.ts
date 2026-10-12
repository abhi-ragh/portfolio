import { notion, NOTION_PROJECTS_ID } from './notion.ts';
import type { Project } from './types.ts';
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
      const res = await (notion as any).search({});
      return (res.results || []).filter((item: any) => item.object === 'page');
    }

    all.push(...(res.results || []));
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }

  return all;
}

function getProp(props: Record<string, any>, keyNames: string[]) {
  const keys = Object.keys(props);
  for (const name of keyNames) {
    const foundKey = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (foundKey && props[foundKey]) {
      return props[foundKey];
    }
  }
  return undefined;
}

async function parseAndCacheProjects(pages: any[], isCacheScript: boolean): Promise<Project[]> {
  const projects: any[] = [];

  for (const page of pages) {
    const props = page.properties || {};

    // Title
    const titleProp = getProp(props, ['Title', 'Name', 'Project'])?.title || [];
    const title = titleProp.map((t: any) => t.plain_text).join('') || 'Untitled Project';

    // Description
    const descProp = getProp(props, ['Description', 'Summary'])?.rich_text || [];
    const description = descProp.map((t: any) => t.plain_text).join('') || '';

    // Github URL
    const github = getProp(props, ['Github', 'GitHub', 'Repository'])?.url || undefined;

    // Cover Image
    const coverProp = getProp(props, ['Cover image', 'Cover Image', 'Cover', 'Image', 'Thumbnail', 'Thumb']);
    const coverFiles = coverProp?.files || [];
    let coverImage: string | undefined = coverFiles.length > 0 ? (coverFiles[0].file?.url || coverFiles[0].external?.url) : undefined;
    if (!coverImage) {
      coverImage = page.cover?.external?.url || page.cover?.file?.url;
    }

    // Screenshots
    const shotProp = getProp(props, ['Screenshots', 'Screenshot']);
    const shotFiles = shotProp?.files || [];
    const screenshots: string[] = shotFiles.map((f: any) => f.file?.url || f.external?.url).filter(Boolean);

    // Tags / Stack
    const tagsProp = getProp(props, ['Tags', 'Tech', 'Stack', 'Technologies']);
    let tags = '';
    if (tagsProp?.multi_select && Array.isArray(tagsProp.multi_select)) {
      tags = tagsProp.multi_select.map((t: any) => t.name).join(' · ').toUpperCase();
    } else if (tagsProp?.rich_text && Array.isArray(tagsProp.rich_text)) {
      tags = tagsProp.rich_text.map((t: any) => t.plain_text).join(' · ').toUpperCase();
    }

    // Checkboxes & Order
    const publishedProp = getProp(props, ['Published']);
    const published = publishedProp?.checkbox ?? true;

    const homepageProp = getProp(props, ['Homepage']);
    const homepage = homepageProp?.checkbox ?? false;

    const orderProp = getProp(props, ['homepage_order', 'Homepage_Order', 'Order']);
    const homepageOrder = orderProp?.number ?? 999;

    if (!published) continue;

    projects.push({
      id: page.id,
      title,
      description,
      github,
      coverImage,
      screenshots,
      tags,
      homepage,
      published,
      homepageOrder
    });
  }

  projects.sort((a, b) => (a.homepageOrder || 999) - (b.homepageOrder || 999));

  const cachedProjects = await Promise.all(
    projects.map(async (project) => {
      let coverImage = project.coverImage;
      let coverWidth: number | undefined;
      let coverHeight: number | undefined;
      if (coverImage) {
        const cachedCover = await cacheNotionImage(coverImage, `project-cover-${project.id}`, { isCacheScript });
        coverImage = cachedCover.url || coverImage;
        coverWidth = cachedCover.width;
        coverHeight = cachedCover.height;
      }

      let screenshots = project.screenshots || [];
      if (screenshots.length > 0) {
        screenshots = await Promise.all(
          screenshots.map(async (shot: string, idx: number) => {
            const cached = await cacheNotionImage(shot, `project-shot-${project.id}-${idx}`, { isCacheScript });
            return cached.url || shot;
          })
        );
      }

      return {
        ...project,
        coverImage,
        coverWidth,
        coverHeight,
        screenshots
      };
    })
  );
  return cachedProjects;
}

export async function getArchiveProjects(isCacheScript = false): Promise<Project[]> {
  if (!notion || !NOTION_PROJECTS_ID) {
    return [];
  }

  try {
    const pages: any[] = await queryAllRows(NOTION_PROJECTS_ID);
    return await parseAndCacheProjects(pages, isCacheScript);
  } catch (error) {
    console.warn('Notion Projects query notice:', error);
    return [];
  }
}

/**
 * Every project ticked for the homepage, in Homepage Order. Ticking two
 * projects means two project cards — not one.
 */
export async function getHomepageProjects(isCacheScript = false): Promise<Project[]> {
  const allProjects = await getArchiveProjects(isCacheScript);
  return allProjects.filter(p => p.homepage);
}