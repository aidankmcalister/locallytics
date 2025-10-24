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

/**
 * Server-side component that fetches and displays analytics metrics.
 *
 * Renders a JSON preview of your analytics data including pageviews, unique visitors,
 * top pages, referrers, and daily stats.
 *
 * @example
 * ```tsx
 * // In Next.js App Router
 * import { AnalyticsDisplay } from 'locallytics';
 * import { headers } from 'next/headers';
 *
 * export default function AnalyticsPage() {
 *   return <AnalyticsDisplay headersReader={headers} />;
 * }
 * ```
 */
export async function AnalyticsDisplay({
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
}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  if (path) qs.set('path', path);
  const query = qs.toString();

  const base = resolveBaseOrigin(headersReader);
  const url = buildAbsoluteUrl(base, endpoint, query);

  const data = await fetcher(url);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
