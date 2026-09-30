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
  status: string;
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

const CURRENT_STATUS = 'in progress';

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

async function queryDataSource(dataSourceId: string): Promise<any[]> {
  const res = await (notion as any).dataSources.query({
    data_source_id: dataSourceId,
    page_size: 100,
  });
  return res.results || [];
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

export async function getCurrentReading(): Promise<Book | null> {
  if (!notion || !NOTION_BOOKS_ID) {
    return null;
  }

  try {
    const pages = await queryDatabase();

    if (!pages.length) return null;

    const page =
      pages.find((p: any) => readStatus(p.properties || {}).toLowerCase() === CURRENT_STATUS) ??
      pages[0];
    const props = page.properties || {};

    const title = getTitle(props) || 'Untitled';

    const authorProp = getProp(props, ['Author', 'Authors'])?.rich_text || [];
    const author = authorProp.map((t: any) => t.plain_text).join('');

    const status = readStatus(props) || 'In Progress';

    const coverProp = getProp(props, ['Cover', 'Cover Image', 'Image', 'Thumbnail']);
    const coverFiles = coverProp?.files || [];
    const rawCover = coverFiles.length > 0 ? coverFiles[0].file?.url || coverFiles[0].external?.url : undefined;
    const coverImage = rawCover ? await cacheNotionImage(rawCover, page.id) : undefined;

    const publishedProp = getProp(props, ['Published']);
    const published = publishedProp?.checkbox ?? true;

    if (!published) return null;

    return {
      id: page.id,
      title,
      author,
      coverImage,
      status,
      published
    };
  } catch (error) {
    console.warn('Notion Books query notice:', error);
    return null;
  }
}