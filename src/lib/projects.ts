import { notion, NOTION_PROJECTS_ID } from './notion.ts';
import type { Project } from './types.ts';
import { cacheNotionImage } from './download.ts';

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

export async function getArchiveProjects(): Promise<Project[]> {
  if (!notion || !NOTION_PROJECTS_ID) {
    return [];
  }

  try {
    let pages: any[] = [];

    if (typeof (notion as any).dataSources?.query === 'function') {
      const res = await (notion as any).dataSources.query({ data_source_id: NOTION_PROJECTS_ID });
      pages = res.results || [];
    } else if (typeof (notion as any).databases?.query === 'function') {
      const res = await (notion as any).databases.query({ database_id: NOTION_PROJECTS_ID });
      pages = res.results || [];
    } else {
      const res = await (notion as any).search({});
      pages = (res.results || []).filter((item: any) => item.object === 'page');
    }

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

      // Cover Image (Case-insensitive check for 'Cover image', 'Cover Image', etc.)
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

    // Cache project cover images and screenshots locally for permanent CDN hosting
    const cachedProjects = await Promise.all(
      projects.map(async (project) => {
        let coverImage = project.coverImage;
        if (coverImage) {
          coverImage = await cacheNotionImage(coverImage, `project-cover-${project.id}`);
        }

        let screenshots = project.screenshots || [];
        if (screenshots.length > 0) {
          screenshots = await Promise.all(
            screenshots.map((shot: string, idx: number) =>
              cacheNotionImage(shot, `project-shot-${project.id}-${idx}`)
            )
          );
        }

        return {
          ...project,
          coverImage,
          screenshots
        };
      })
    );

    return cachedProjects;
  } catch (error) {
    console.warn('Notion Projects query notice:', error);
    return [];
  }
}

export async function getHomepageProjects(): Promise<Project[]> {
  const allProjects = await getArchiveProjects();
  const homepageItems = allProjects.filter(p => p.homepage);
  return homepageItems.length > 0 ? homepageItems : allProjects;
}
