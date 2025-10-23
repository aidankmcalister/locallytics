// src/server/createMetricsHandler.ts
import type { StorageAdapter } from '../types';

export function createMetricsHandler(adapter: StorageAdapter) {
  return async function GET(req: Request) {
    const url = new URL(req.url);
    const from =
      url.searchParams.get('from') || new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
    const to = url.searchParams.get('to') || new Date().toISOString();
    const path = url.searchParams.get('path');

    const metricsOpts = {
      from: new Date(from),
      to: new Date(to),
      ...(path ? { path } : {}), // Only include path if it has a value
    };
    const data = await adapter.metrics(metricsOpts);
    return new Response(JSON.stringify(data), {
      headers: { 'content-type': 'application/json' },
    });
  };
}
