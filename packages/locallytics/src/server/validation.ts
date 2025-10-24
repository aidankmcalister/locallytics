import { z } from 'zod';
import type { AnyEvent } from '../types';

export const ingestSchema = z.object({
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

export function cleanEvents(events: z.infer<typeof ingestSchema>['events']): AnyEvent[] {
  return events.map((event) => {
    const cleanedEvent: Record<string, any> = { ...event };
    for (const key in cleanedEvent) {
      if (cleanedEvent[key] === undefined) {
        delete cleanedEvent[key];
      }
    }
    return cleanedEvent as AnyEvent;
  });
}
