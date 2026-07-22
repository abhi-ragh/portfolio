import { notion, NOTION_PROJECTS_ID } from './notion.ts';
import type { Project } from './types.ts';

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

    const projects: Project[] = [];

    for (const page of pages) {
      const props = page.properties || {};

      // Title
      const titleProp = props.Title?.title || props.Name?.title || props.title?.title || props.Project?.title || [];
      const title = titleProp.map((t: any) => t.plain_text).join('') || 'Untitled Project';

      // Description
      const descProp = props.Description?.rich_text || props.description?.rich_text || props.Summary?.rich_text || [];
      const description = descProp.map((t: any) => t.plain_text).join('') || '';

      // Github URL
      const github = props.Github?.url || props.GitHub?.url || props.github?.url || props.Repository?.url || undefined;

      // Cover Image
      const coverFiles = props['Cover Image']?.files || props.Cover?.files || props.CoverImage?.files || props.Image?.files || [];
      const coverImage = coverFiles.length > 0 ? (coverFiles[0].file?.url || coverFiles[0].external?.url || undefined) : undefined;

      // Screenshots
      const shotFiles = props.Screenshots?.files || props.screenshots?.files || [];
      const screenshots: string[] = shotFiles.map((f: any) => f.file?.url || f.external?.url).filter(Boolean);

      // Checkboxes
      const published = props.Published?.checkbox ?? true;
      const homepage = props.Homepage?.checkbox ?? false;

      if (!published) continue;

      projects.push({
        id: page.id,
        title,
        description,
        github,
        coverImage,
        screenshots,
        homepage,
        published
      });
    }

    return projects;
  } catch (error) {
    console.warn('Notion Projects query notice:', error);
    return [];
  }
}

export async function getHomepageProjects(): Promise<Project[]> {
  const allProjects = await getArchiveProjects();
  const homepageItems = allProjects.filter(p => p.homepage);
  return homepageItems.length > 0 ? homepageItems.slice(0, 4) : allProjects.slice(0, 4);
}
