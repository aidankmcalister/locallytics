import React from 'react';

/** Function that returns request headers from your framework (Next.js, Remix, etc.) */
type HeaderReader = () => Headers | Map<string, string> | null;

function isAbsoluteUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function resolveBaseOrigin(headersReader?: HeaderReader): string {
  // @ts-ignore - process may not exist in some runtimes; guarded by typeof
  const envBase: string | undefined =
    // @ts-ignore
    typeof process !== 'undefined'
      ? // @ts-ignore
        (process.env?.LOCALLYTICS_URL as string | undefined)
      : undefined;
  if (envBase) return envBase;

  if (headersReader) {
    const h = headersReader();
    if (h) {
      const get = (k: string) =>
        h instanceof Headers ? h.get(k) : (h as Map<string, string>).get(k) || null;
      const proto = get('x-forwarded-proto') || 'http';
      const host = get('x-forwarded-host') || get('host') || 'localhost:3000';
      return `${proto}://${host}`;
    }
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}

function buildAbsoluteUrl(base: string, endpoint: string, query: string) {
  const absolute = isAbsoluteUrl(endpoint) ? endpoint : `${base}${endpoint}`;
  return query ? `${absolute}?${query}` : absolute;
}

async function fetcher(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Metrics request failed: ${res.status}`);
  return res.json();
}

export interface AnalyticsData {
  pageviews: number;
  uniqueVisitors: number;
  topPages: { path: string; pageviews: number }[];
  dailyStats: { date: string; pageviews: number; uniqueVisitors: number }[];
  topReferrers: { referrer: string; visits: number }[];
  topEvents: { eventName: string; count: number }[];
}

/**
 * Server-side component that fetches analytics data and returns it as JSON.
 *
 * Use this when you want to build your own custom UI. Returns raw analytics data
 * that you can destructure and display however you like.
 *
 * @example
 * ```tsx
 * import { AnalyticsJSON } from 'locallytics';
 * import { headers } from 'next/headers';
 *
 * export default async function AnalyticsPage() {
 *   const data = await AnalyticsJSON({ headersReader: headers });
 *
 *   return (
 *     <div>
 *       <h1>Total Pageviews: {data.pageviews}</h1>
 *       <h2>Unique Visitors: {data.uniqueVisitors}</h2>
 *     </div>
 *   );
 * }
 * ```
 */
export async function AnalyticsJSON({
  endpoint = '/api/locallytics',
  from,
  to,
  path,
  headersReader,
}: {
  /** API endpoint to fetch metrics from (default: '/api/locallytics') */
  endpoint?: string;
  /** Start date (ISO string, default: 30 days ago) */
  from?: string;
  /** End date (ISO string, default: now) */
  to?: string;
  /** Filter by specific path */
  path?: string;
  /** Function to read request headers (for server-side rendering) */
  headersReader?: HeaderReader;
}): Promise<AnalyticsData> {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  if (path) qs.set('path', path);
  const query = qs.toString();

  const base = resolveBaseOrigin(headersReader);
  const url = buildAbsoluteUrl(base, endpoint, query);

  return fetcher(url);
}
