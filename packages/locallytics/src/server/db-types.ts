// src/server/db-types.ts
export interface LocEvent {
  id: string;
  ts: number;
  session_id: string;
  anon_id: string | null;
  type: 'pageview' | 'event';
  name: string | null;
  url: string;
  path: string;
  referrer: string | null;
  title: string | null;
  props: string | null;
  screen_w: number | null;
  screen_h: number | null;
  ip_hash: string | null;
}

export interface DB {
  loc_events: LocEvent;
}
