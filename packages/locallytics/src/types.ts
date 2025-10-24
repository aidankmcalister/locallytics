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
    uniqueVisitors: number;
    topPages: { path: string; pageviews: number }[];
    dailyStats: { date: string; pageviews: number; uniqueVisitors: number }[];
    topReferrers: { referrer: string; visits: number }[];
    topEvents: { eventName: string; count: number }[];
  }>;
}
