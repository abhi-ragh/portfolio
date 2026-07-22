import { Client } from '@notionhq/client';

const rawToken = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.NOTION_TOKEN : undefined) || (typeof process !== 'undefined' ? process.env.NOTION_TOKEN : undefined);
const rawDatabaseId = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.NOTION_DATABASE_ID : undefined) || (typeof process !== 'undefined' ? process.env.NOTION_DATABASE_ID : undefined) || '';
const rawBlogsId = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.NOTION_BLOGS_ID : undefined) || (typeof process !== 'undefined' ? process.env.NOTION_BLOGS_ID : undefined) || '';

export const notion = rawToken
  ? new Client({ auth: rawToken.trim() })
  : null;

function formatDatabaseId(id: string): string {
  if (!id) return '';
  let cleaned = id.split('?')[0].split('/').pop() || id;
  cleaned = cleaned.replace(/-/g, '').trim();
  return cleaned;
}

export const NOTION_DATABASE_ID = formatDatabaseId(rawDatabaseId);
export const NOTION_BLOGS_ID = formatDatabaseId(rawBlogsId);
