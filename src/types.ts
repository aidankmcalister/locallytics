// src/types.ts
export type EventBase = {
  id: string;
  ts: number;
  sessionId: string;
  anonId?: string;
  url: string;
  path: string;
  referrer?: string;
  screen?: { w: number; h: number };
};

export type PageviewEvent = EventBase & { type: 'pageview'; title?: string };
export type CustomEvent<T extends string = string, P = Record<string, unknown>> = EventBase & {
  type: 'event';
  name: T;
  props?: P;
};

export type AnyEvent = PageviewEvent | CustomEvent;

export interface StorageAdapter {
  insertEvents(events: AnyEvent[]): Promise<void>;
  metrics(opts: { from: Date; to: Date; path?: string }): Promise<{
    pageviews: number;
    visitors: number;
    byPath: { path: string; pv: number }[];
    timeseries: { t: string; pv: number; uv: number }[];
    topReferrers: { referrer: string; count: number }[];
    topEvents: { name: string; count: number }[];
  }>;
}
