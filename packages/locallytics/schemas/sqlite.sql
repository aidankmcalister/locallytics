-- SQLite schema for Locallytics
CREATE TABLE IF NOT EXISTS loc_events (
  id         TEXT PRIMARY KEY,
  ts         INTEGER NOT NULL,          -- epoch ms
  session_id TEXT    NOT NULL,
  anon_id    TEXT,
  type       TEXT    NOT NULL,          -- 'pageview' | 'event'
  name       TEXT,                      -- only for custom events
  url        TEXT    NOT NULL,
  path       TEXT    NOT NULL,
  referrer   TEXT,
  title      TEXT,
  props      TEXT,                      -- JSON string
  screen_w   INTEGER,
  screen_h   INTEGER,
  ip_hash    TEXT
);

CREATE INDEX IF NOT EXISTS loc_by_ts       ON loc_events (ts);
CREATE INDEX IF NOT EXISTS loc_by_path_ts  ON loc_events (path, ts);
CREATE INDEX IF NOT EXISTS loc_by_type_ts  ON loc_events (type, ts);
