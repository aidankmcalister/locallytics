-- PostgreSQL schema for Locallytics
CREATE TABLE IF NOT EXISTS loc_events (
  id         text PRIMARY KEY,
  ts         bigint NOT NULL,           -- epoch ms
  session_id text   NOT NULL,
  anon_id    text,
  type       text   NOT NULL,           -- 'pageview' | 'event'
  name       text,                      -- only for custom events
  url        text   NOT NULL,
  path       text   NOT NULL,
  referrer   text,
  title      text,
  props      text,                      -- JSON string
  screen_w   integer,
  screen_h   integer,
  ip_hash    text
);

CREATE INDEX IF NOT EXISTS loc_by_ts       ON loc_events (ts);
CREATE INDEX IF NOT EXISTS loc_by_path_ts  ON loc_events (path, ts);
CREATE INDEX IF NOT EXISTS loc_by_type_ts  ON loc_events (type, ts);
