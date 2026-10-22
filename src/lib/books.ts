import { notion } from './notion.ts';
import { cacheNotionImage } from './download.ts';

const rawActivitiesId = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.NOTION_ACTIVITIES_ID : undefined) || (typeof process !== 'undefined' ? process.env.NOTION_ACTIVITIES_ID : undefined) || '';

function formatDatabaseId(id: string): string {
  if (!id) return '';
  let cleaned = id.split('?')[0].split('/').pop() || id;
  cleaned = cleaned.replace(/-/g, '').trim();
  return cleaned;
}

export const NOTION_ACTIVITIES_ID = formatDatabaseId(rawActivitiesId);

export type ActivityStatus =
  | 'Watching'
  | 'Playing'
  | 'Reading'
  | 'Recently Watched'
  | 'Recently Played'
  | 'Recently Read';

export interface Activity {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  covers?: string[];
  coverWidth?: number;
  coverHeight?: number;
  status: ActivityStatus;
  homepage: boolean;
  published: boolean;
  coverFitsGrid: boolean;
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

const STATUS_RANK: Record<string, number> = {
  watching: 0,
  playing: 0,
  reading: 0,
  'recently watched': 1,
  'recently played': 1,
  'recently read': 1,
};

const STATUS_CATEGORY: Record<string, 'in-progress' | 'complete'> = {
  watching: 'in-progress',
  playing: 'in-progress',
  reading: 'in-progress',
  'recently watched': 'complete',
  'recently played': 'complete',
  'recently read': 'complete',
};

function getTitle(props: Record<string, any>): string {
  const named = getProp(props, ['Title', 'Name', 'Activity', 'Task'])?.title;
  const richText =
    named || Object.values(props).find((p: any) => p && p.type === 'title')?.title || [];
  return (richText as any[]).map((t: any) => t.plain_text).join('');
}

function readStatus(props: Record<string, any>): ActivityStatus {
  const prop = getProp(props, ['Status', 'Activity Status']);
  if (!prop) return 'Reading';
  if (prop.status?.name) return prop.status.name as ActivityStatus;
  if (prop.select?.name) return prop.select.name as ActivityStatus;
  if (prop.rich_text) return prop.rich_text.map((t: any) => t.plain_text).join('') as ActivityStatus;
  if (prop.checkbox) return prop.checkbox ? 'Recently Read' : 'Reading';
  return 'Reading';
}

async function findDataSourceByTitle(): Promise<string | null> {
  try {
    const res = await (notion as any).search({ query: 'Activities', page_size: 25 });
    const match = (res.results || []).find(
      (item: any) =>
        (item.object === 'data_source' || item.object === 'database') &&
        (item.title || []).some((t: any) => {
          const title = (t.plain_text || '').trim().toLowerCase();
          return title === 'activities' || title === 'books';
        })
    );
    return match?.id || null;
  } catch {
    return null;
  }
}

async function queryDataSource(dataSourceId: string): Promise<any[]> {
  const all: any[] = [];
  let cursor: string | undefined = undefined;

  for (let guard = 0; guard < 20; guard++) {
    const body: Record<string, unknown> = { data_source_id: dataSourceId, page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const res = await (notion as any).dataSources.query(body);
    all.push(...(res.results || []));
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }

  return all;
}

let cachedActivitiesDataSourceId: string | null = null;

async function queryDatabase(): Promise<any[]> {
  if (!notion) {
    return [];
  }

  const idToTry = cachedActivitiesDataSourceId || NOTION_ACTIVITIES_ID;
  if (idToTry) {
    try {
      const rows = await queryDataSource(idToTry);
      cachedActivitiesDataSourceId = idToTry;
      return rows;
    } catch {
      // If initial ID failed, fall through to discovery search
    }
  }

  const resolvedId = await findDataSourceByTitle();
  if (!resolvedId) {
    console.warn('Notion Activities: could not resolve a data source id.');
    return [];
  }

  try {
    const rows = await queryDataSource(resolvedId);
    cachedActivitiesDataSourceId = resolvedId;
    return rows;
  } catch (e) {
    console.warn('Notion Activities query failed:', e);
    return [];
  }
}

function readHomepageFlag(props: Record<string, any>): boolean {
  const prop = getProp(props, ['Homepage']);
  if (typeof prop?.checkbox === 'boolean') return prop.checkbox;
  const legacy = prop?.select?.name;
  return typeof legacy === 'string' && legacy.trim() !== '';
}

const GRID_ASPECT_RATIO = 2 / 3;
const ASPECT_TOLERANCE = 0.15;

function checkCoverFitsGrid(width?: number, height?: number): boolean {
  if (!width || !height) return false; // unknown dims → use fallback (preserves aspect ratio)
  const aspect = width / height;
  return Math.abs(aspect - GRID_ASPECT_RATIO) / GRID_ASPECT_RATIO <= ASPECT_TOLERANCE;
}

function parseActivity(page: any, props: Record<string, any>): Activity & { rawCovers?: string[] } {
  const title = getTitle(props);

  const authorProp = getProp(props, ['Author', 'Creator', 'Artist', 'Developer'])?.rich_text || [];
  const author = authorProp.map((t: any) => t.plain_text).join('');

  const status = readStatus(props);

  const publishedProp = getProp(props, ['Published']);
  const published = publishedProp?.checkbox ?? true;

  const homepageProp = getProp(props, ['Homepage']);
  const homepage = homepageProp?.checkbox ?? false;

  const coverProp = getProp(props, ['Cover', 'Cover Image', 'Image', 'Thumbnail']);
  const coverFiles = coverProp?.files || [];
  const rawCovers = coverFiles
    .map((f: any) => f.file?.url || f.external?.url)
    .filter(Boolean) as string[];

  return {
    id: page.id,
    title,
    author,
    coverImage: undefined,
    covers: [],
    coverWidth: undefined,
    coverHeight: undefined,
    status,
    homepage,
    published,
    rawCovers,
    coverFitsGrid: true,
  };
}

export async function getHomepageActivities(isCacheScript = false): Promise<Activity[]> {
  if (!notion || !NOTION_ACTIVITIES_ID) {
    return [];
  }

  try {
    const pages = await queryDatabase();
    const withCovers = await Promise.all(
      pages
        .map((page: any) => parseActivity(page, page.properties || {}))
        .filter((activity) => activity.published && activity.homepage && activity.rawCovers?.length)
        .map(async (activity) => {
          const cached = await Promise.all(
            activity.rawCovers!.map((url, idx) =>
              cacheNotionImage(url, idx === 0 ? activity.id : `${activity.id}-${idx}`, { isCacheScript })
            )
          );
          const primary = cached[0];
          const fitsGrid = checkCoverFitsGrid(primary.width, primary.height);
          return {
            ...activity,
            coverImage: primary.url,
            covers: cached.map((c) => c.url).filter(Boolean),
            coverWidth: primary.width,
            coverHeight: primary.height,
            coverFitsGrid: fitsGrid,
          };
        })
    );

    return withCovers.sort(
      (a, b) => (STATUS_RANK[a.status.toLowerCase()] ?? 2) - (STATUS_RANK[b.status.toLowerCase()] ?? 2)
    );
  } catch (error) {
    console.warn('Notion Activities query notice:', error);
    return [];
  }
}

export function getStatusCategory(status: ActivityStatus): 'in-progress' | 'complete' {
  return STATUS_CATEGORY[status.toLowerCase()] || 'in-progress';
}