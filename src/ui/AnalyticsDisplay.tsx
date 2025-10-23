// src/ui/AnalyticsDisplay.tsx
import React from 'react';

/** Optional: supply a function that returns request headers (Next/SvelteKit/Remix/etc). */
type HeaderReader = () => Headers | Map<string, string> | null;

function isAbsoluteUrl(url: string) {
  try {
    // If this succeeds, it's absolute
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve the base origin to call your metrics endpoint:
 * 1) process.env.LOCALLYTICS_URL (server-side env)
 * 2) framework headers (x-forwarded-proto/host or host)
 * 3) window.location.origin (client-side)
 * 4) http://localhost:3000 (dev fallback)
 */
function resolveBaseOrigin(headersReader?: HeaderReader): string {
  // 1) Server env (Node/Deno/Edge). Host app should inject this.
  // @ts-ignore - process may not exist in some runtimes; guarded by typeof
  const envBase: string | undefined =
    // @ts-ignore
    typeof process !== 'undefined'
      ? // @ts-ignore
        (process.env?.LOCALLYTICS_URL as string | undefined)
      : undefined;
  if (envBase) return envBase;

  // 2) Framework-provided headers (on the server)
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

  // 3) Client-side (browser)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // 4) Dev fallback
  return 'http://localhost:3000';
}

/** Build a full URL from base + endpoint + query. If endpoint is already absolute, we use it. */
function buildAbsoluteUrl(base: string, endpoint: string, query: string) {
  const absolute = isAbsoluteUrl(endpoint) ? endpoint : `${base}${endpoint}`;
  return query ? `${absolute}?${query}` : absolute;
}

async function fetcher(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Metrics request failed: ${res.status}`);
  return res.json();
}

export async function AnalyticsDisplay({
  endpoint = '/api/locallytics/metrics',
  from,
  to,
  path,
  headersReader, // optional: pass your framework's headers accessor here
}: {
  endpoint?: string;
  from?: string;
  to?: string;
  path?: string;
  headersReader?: HeaderReader;
}) {
  // Build query string safely (no trailing '?')
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  if (path) qs.set('path', path);
  const query = qs.toString();

  // Find a good base, then build an absolute URL
  const base = resolveBaseOrigin(headersReader);
  const url = buildAbsoluteUrl(base, endpoint, query);

  const data = await fetcher(url);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
