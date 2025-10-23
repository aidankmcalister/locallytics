// src/server/createIngestHandler.ts
import { z } from 'zod';
import type { StorageAdapter, AnyEvent } from '../types';

export function createIngestHandler(adapter: StorageAdapter) {
  // Validate payloads to keep the server safe
  const schema = z.object({
    events: z
      .array(
        z.object({
          id: z.string(),
          ts: z.number().int(),
          sessionId: z.string(),
          anonId: z.string().optional(),
          url: z.string(),
          path: z.string(),
          referrer: z.string().optional(),
          screen: z.object({ w: z.number(), h: z.number() }).optional(),
          type: z.enum(['pageview', 'event']),
          title: z.string().optional(),
          name: z.string().optional(),
          props: z.any().optional(),
        }),
      )
      .max(500),
  });

  // Compatible with Next.js Route Handlers (App Router) or Fetch handlers
  return async function POST(req: Request) {
    try {
      const body = await req.json();
      const parsed = schema.parse(body);

      // Clean the events by removing undefined values to match the AnyEvent type
      const cleaned: AnyEvent[] = parsed.events.map((event) => {
        const cleanedEvent: Record<string, any> = { ...event };
        for (const key in cleanedEvent) {
          if (cleanedEvent[key] === undefined) {
            delete cleanedEvent[key];
          }
        }
        return cleanedEvent as AnyEvent;
      });

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
