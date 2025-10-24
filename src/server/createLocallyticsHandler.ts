import type { StorageAdapter } from '../types';
import { ingestSchema, cleanEvents } from './validation';

export function createLocallyticsHandler(adapter: StorageAdapter) {
  const handler = async function handler(req: Request) {
    const method = req.method;

    if (method === 'POST') {
      try {
        const body = await req.json();
        const parsed = ingestSchema.parse(body);
        const cleaned = cleanEvents(parsed.events);

        await adapter.insertEvents(cleaned);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'content-type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ ok: false }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }
    }

    if (method === 'GET') {
      const url = new URL(req.url);
      const from =
        url.searchParams.get('from') ||
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
      const to = url.searchParams.get('to') || new Date().toISOString();
      const path = url.searchParams.get('path');

      const metricsOpts = {
        from: new Date(from),
        to: new Date(to),
        ...(path ? { path } : {}),
      };

      const data = await adapter.metrics(metricsOpts);
      return new Response(JSON.stringify(data), {
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        allow: 'GET, POST',
      },
    });
  };

  return Object.assign(handler, {
    GET: handler,
    POST: handler,
  });
}

export const createLocallyticsClient = createLocallyticsHandler;
