import type { StorageAdapter } from '../types';
import { ingestSchema, cleanEvents } from './validation';

export function createIngestHandler(adapter: StorageAdapter) {
  return async function POST(req: Request) {
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
  };
}
