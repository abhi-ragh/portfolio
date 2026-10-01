import { notion } from './notion.ts';
import { cacheNotionImage } from './download.ts';

const rawBooksId = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.NOTION_BOOKS_ID : undefined) || (typeof process !== 'undefined' ? process.env.NOTION_BOOKS_ID : undefined) || '';

function formatDatabaseId(id: string): string {
  if (!id) return '';
  let cleaned = id.split('?')[0].split('/').pop() || id;
  cleaned = cleaned.replace(/-/g, '').trim();
  return cleaned;
}

export const NOTION_BOOKS_ID = formatDatabaseId(rawBooksId);

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  coverWidth?: number;
  coverHeight?: number;
  status: string;
  homepage: boolean;
  published: boolean;
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

/** Preferred ordering when several books are ticked at once. */
const STATUS_RANK: Record<string, number> = {
  reading: 0,
  'in progress': 0,
  read: 1,
  finished: 1,
};

/** The title column can be named anything (e.g. "Task"), so match on its type. */
function getTitle(props: Record<string, any>): string {
  const named = getProp(props, ['Title', 'Name', 'Book', 'Task'])?.title;
  const richText =
    named || Object.values(props).find((p: any) => p && p.type === 'title')?.title || [];
  return (richText as any[]).map((t: any) => t.plain_text).join('');
}

/** Status may be a Notion `status`, `select`, or plain text column. */
function readStatus(props: Record<string, any>): string {
  const prop = getProp(props, ['Status', 'Reading Status']);
  if (!prop) return '';
  if (prop.status?.name) return prop.status.name;
  if (prop.select?.name) return prop.select.name;
  if (prop.rich_text) return prop.rich_text.map((t: any) => t.plain_text).join('');
  if (prop.checkbox) return prop.checkbox ? 'Complete' : '';
  return '';
}

/**
 * Notion's API addresses *data sources*, whose ID is often not the same as the
 * database (or parent page) ID copied from the browser URL. If the configured
 * ID does not resolve, look the data source up by title instead.
 */
async function findDataSourceByTitle(): Promise<string | null> {
  try {
    const res = await (notion as any).search({ query: 'Books', page_size: 25 });
    const match = (res.results || []).find(
      (item: any) =>
        (item.object === 'data_source' || item.object === 'database') &&
        (item.title || []).some((t: any) => (t.plain_text || '').trim().toLowerCase() === 'books')
    );
    return match?.id || null;
  } catch {
    return null;
  }
}

/** Notion caps a single query at 100 rows, so follow the cursor. */
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

async function queryDatabase(): Promise<any[]> {
  if (!notion || !NOTION_BOOKS_ID) {
    return [];
  }

  // Preferred path: the configured ID is already the data source.
  try {
    return await queryDataSource(NOTION_BOOKS_ID);
  } catch {
    /* the configured ID may be a database or parent page ID - look it up */
  }

  const resolvedId = await findDataSourceByTitle();
  if (!resolvedId) {
    console.warn('Notion Books: could not resolve a data source id.');
    return [];
  }

  try {
    return await queryDataSource(resolvedId);
  } catch (e) {
    console.warn('Notion Books query failed:', e);
    return [];
  }
}

function readHomepageFlag(props: Record<string, any>): boolean {
  const prop = getProp(props, ['Homepage']);
  if (typeof prop?.checkbox === 'boolean') return prop.checkbox;
  // Tolerate the old select shape while the column is being migrated.
  const legacy = prop?.select?.name;
  return typeof legacy === 'string' && legacy.trim() !== '';
}

function parseBook(page: any, props: Record<string, any>): Book & { rawCover?: string } {
  const title = getTitle(props) || 'Untitled';

  const authorProp = getProp(props, ['Author', 'Authors'])?.rich_text || [];
  const author = authorProp.map((t: any) => t.plain_text).join('');

  const status = readStatus(props) || 'Reading';

  const publishedProp = getProp(props, ['Published']);
  const published = publishedProp?.checkbox ?? true;

  const homepageProp = getProp(props, ['Homepage']);
  const homepage = homepageProp?.checkbox ?? false;

  const coverProp = getProp(props, ['Cover', 'Cover Image', 'Image', 'Thumbnail']);
  const coverFiles = coverProp?.files || [];
  const rawCover =
    coverFiles.length > 0 ? coverFiles[0].file?.url || coverFiles[0].external?.url : undefined;

  return {
    id: page.id,
    title,
    author,
    coverImage: undefined,
    coverWidth: undefined,
    coverHeight: undefined,
    status,
    homepage,
    published,
    rawCover
  };
}

/**
 * Every book ticked for the homepage, with its Status (Reading / Read).
 * Ticking three books means three reading cards.
 */
export async function getHomepageBooks(): Promise<Book[]> {
  if (!notion || !NOTION_BOOKS_ID) {
    return [];
  }

  try {
    const pages = await queryDatabase();
    // Covers are downloaded after filtering, so unticked books cost nothing.
    const withCovers = await Promise.all(
      pages
        .map((page: any) => parseBook(page, page.properties || {}))
        .filter((book) => book.published && book.homepage && book.rawCover)
        .map(async (book) => {
          const cached = await cacheNotionImage(book.rawCover!, book.id);
          return {
            ...book,
            coverImage: cached.url,
            coverWidth: cached.width,
            coverHeight: cached.height
          };
        })
    );

    // Books being read float above ones already finished.
    return withCovers.sort(
      (a, b) => (STATUS_RANK[a.status.toLowerCase()] ?? 2) - (STATUS_RANK[b.status.toLowerCase()] ?? 2)
    );
  } catch (error) {
    console.warn('Notion Books query notice:', error);
    return [];
  }
}
