# Locallytics

[![npm version](https://img.shields.io/npm/v/locallytics.svg)](https://www.npmjs.com/package/locallytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/locallytics)](https://bundlephobia.com/package/locallytics)

**Tagline:** "Analytics that live with your app."

Self-contained analytics SDK that runs entirely on your infrastructure  no external servers, no tracking scripts, no cost.

## Overview

Locallytics is a privacy-first analytics solution where developers drop in an `<AnalyticsGrabber />` component to collect data and use `AnalyticsJSON()` to fetch metrics, all powered by their own database and hosting.

### Key Features

- **Zero external dependencies**  data stays local on your infrastructure
- **One-line setup** using React components
- **Pageview + custom event tracking**
- **Works with any backend** (Vercel, Cloudflare, Supabase, Postgres, SQLite, etc.)
- **Privacy-compliant** and free forever
- **TypeScript-first** with full type safety
- **Kysely-based** database adapter with support for Postgres and SQLite

### Differentiators

- Competes with Plausible, Fathom, and PostHog
- "Better Auth for analytics"  everything runs in your app
- Open-source SDK
- Developer-first DX with TypeScript and modern tooling

---

## Installation

```bash
npm install locallytics
```

**Peer Dependencies:**

- `react` >= 18
- `kysely` (if using database adapter)
- `pg` (if using Postgres)

---

## Quick Start

### 1. Set Up Database

Create the analytics table using the appropriate schema:

**Postgres:**

```bash
psql $DATABASE_URL -f node_modules/locallytics/schemas/postgres.sql
```

**SQLite:**

```bash
sqlite3 your-db.sqlite < node_modules/locallytics/schemas/sqlite.sql
```

Or find schemas in your `node_modules/locallytics/schemas/` directory:

- `postgres.sql` - PostgreSQL schema
- `sqlite.sql` - SQLite schema

### 2. Create API Route Handler

**Next.js App Router** (`app/api/locallytics/route.ts`):

```typescript
import { locallytics } from 'locallytics';

export const analytics = await locallytics({
  database: process.env.DATABASE_URL!,
});

export const { GET, POST } = analytics;
```

**Next.js Pages Router** (`pages/api/locallytics.ts`):

```typescript
import { locallytics } from 'locallytics';
import type { NextApiRequest, NextApiResponse } from 'next';

const analytics = await locallytics({
  database: process.env.DATABASE_URL!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await analytics.handler(
    new Request(`http://localhost${req.url}`, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    }),
  );

  res.status(response.status).json(await response.json());
}
```

### 3. Add Client-Side Tracking

Add `<AnalyticsGrabber />` to your root layout:

```tsx
import { AnalyticsGrabber } from 'locallytics';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AnalyticsGrabber />
        {children}
      </body>
    </html>
  );
}
```

### 4. Display Analytics

Use `AnalyticsJSON()` to fetch and display metrics:

```tsx
import { AnalyticsJSON } from 'locallytics';

export default async function AnalyticsPage() {
  const data = await AnalyticsJSON({});

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <p>Total Pageviews: {data.pageviews}</p>
      <p>Unique Visitors: {data.uniqueVisitors}</p>
      {/* Build your custom UI */}
    </div>
  );
}
```

---

## API Reference

### Server APIs

#### `locallytics(config)` / `createLocallytics(config)`

Creates a Locallytics instance with database-backed analytics.

**Parameters:**

- `config.database`: Postgres connection string or Kysely instance

**Returns:** `Promise<LocallyticsInstance>`

- `adapter` - Storage adapter for custom usage
- `db` - Kysely database instance
- `handler` - Unified handler supporting GET and POST
- `GET` - GET handler for metrics
- `POST` - POST handler for event ingestion
- `ingest` - Alias for POST
- `metrics` - Alias for GET

**Example with connection string:**

```typescript
const analytics = await locallytics({
  database: process.env.DATABASE_URL,
});

export const { GET, POST } = analytics;
```

**Example with custom Kysely instance:**

```typescript
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});

const analytics = await locallytics({ database: db });
```

#### `locallyticsSync(config)`

Synchronous version that requires a pre-configured Kysely instance.

**Parameters:**

- `config.db`: Kysely instance

**Returns:** `LocallyticsInstance`

**Example:**

```typescript
const analytics = locallyticsSync({ db: myKyselyInstance });
```

#### `AnalyticsJSON(options)`

Server-side function that fetches analytics data and returns it as JSON.

**Parameters:**

- `endpoint?` - API endpoint (default: `/api/locallytics`)
- `from?` - Start date ISO string (default: 30 days ago)
- `to?` - End date ISO string (default: now)
- `path?` - Filter by specific path
- `headersReader?` - Function to read request headers (for SSR)

**Returns:** `Promise<AnalyticsData>`

**AnalyticsData Type:**

```typescript
interface AnalyticsData {
  pageviews: number;
  uniqueVisitors: number;
  topPages: { path: string; pageviews: number }[];
  dailyStats: { date: string; pageviews: number; uniqueVisitors: number }[];
  topReferrers: { referrer: string; visits: number }[];
  topEvents: { eventName: string; count: number }[];
}
```

**Example:**

```typescript
// Basic usage
const data = await AnalyticsJSON({});

// With date range
const data = await AnalyticsJSON({
  from: '2024-01-01',
  to: '2024-01-31',
});

// With path filter
const data = await AnalyticsJSON({
  path: '/blog',
});

// With custom endpoint
const data = await AnalyticsJSON({
  endpoint: '/api/custom-analytics',
});
```

### Client Components

#### `<AnalyticsGrabber />`

Client-side analytics collector that tracks pageviews and custom events.

**Props:**

- `endpoint?` - API endpoint to send events to (default: `/api/locallytics`)
- `dntRespect?` - Respect Do Not Track browser setting (default: `true`)

**Features:**

- Automatically tracks pageviews on mount
- Queues events and sends in batches (max 10 events or every 3 seconds)
- Uses `navigator.sendBeacon()` when available, falls back to `fetch()`
- Flushes events on page visibility change
- Exposes `window.locallytics` API for custom tracking

**Example:**

```tsx
<AnalyticsGrabber endpoint='/api/locallytics' dntRespect={true} />
```

#### `window.locallytics` API

The grabber exposes a global API for custom event tracking:

**`track(eventName, properties?)`**

Track a custom event with optional properties.

```typescript
window.locallytics.track('button_click', {
  button: 'signup',
  location: 'header',
});

window.locallytics.track('purchase_completed', {
  amount: 99.99,
  currency: 'USD',
  items: 3,
});
```

**`trackPageview(extra?)`**

Manually track a pageview with optional extra data.

```typescript
window.locallytics.trackPageview({
  title: 'Custom Page Title',
});
```

**`flush()`**

Manually flush queued events immediately.

```typescript
window.locallytics.flush();
```

### Legacy/Compatibility APIs

#### `createLocallyticsHandler(adapter)`

Creates a unified handler supporting both POST (ingest) and GET (metrics).

**Parameters:**

- `adapter` - Storage adapter implementing `StorageAdapter` interface

**Returns:** Handler function with `.GET` and `.POST` properties

#### `createIngestHandler(adapter)`

Creates a POST handler for event ingestion only.

#### `createMetricsHandler(adapter)`

Creates a GET handler for fetching metrics only.

---

## Database Schema

### Table: `loc_events`

| Column       | Type    | Description                            |
| ------------ | ------- | -------------------------------------- |
| `id`         | TEXT    | Primary key (UUID)                     |
| `ts`         | BIGINT  | Timestamp (epoch milliseconds)         |
| `session_id` | TEXT    | Session identifier                     |
| `anon_id`    | TEXT    | Anonymous user ID (localStorage)       |
| `type`       | TEXT    | Event type: 'pageview' or 'event'      |
| `name`       | TEXT    | Custom event name (for type='event')   |
| `url`        | TEXT    | Full URL                               |
| `path`       | TEXT    | URL path                               |
| `referrer`   | TEXT    | HTTP referrer                          |
| `title`      | TEXT    | Page title (for pageviews)             |
| `props`      | TEXT    | JSON string of event properties        |
| `screen_w`   | INTEGER | Screen width                           |
| `screen_h`   | INTEGER | Screen height                          |
| `ip_hash`    | TEXT    | IP hash (optional, not currently used) |

**Indexes:**

- `loc_by_ts` on `(ts)`
- `loc_by_path_ts` on `(path, ts)`
- `loc_by_type_ts` on `(type, ts)`

---

## Storage Adapters

### Kysely Adapter

The built-in adapter supports Postgres and SQLite via Kysely.

**Import:**

```typescript
import { makeKyselyAdapter } from 'locallytics';
```

**Usage:**

```typescript
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { makeKyselyAdapter } from 'locallytics';

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
});

const adapter = makeKyselyAdapter(db);
```

### Custom Adapters

You can create custom adapters by implementing the `StorageAdapter` interface:

```typescript
interface StorageAdapter {
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
```

**Example custom adapter:**

```typescript
const customAdapter: StorageAdapter = {
  async insertEvents(events) {
    // Your custom logic to store events
    await myDatabase.insert(events);
  },

  async metrics({ from, to, path }) {
    // Your custom logic to compute metrics
    return {
      pageviews: await myDatabase.countPageviews(from, to, path),
      uniqueVisitors: await myDatabase.countUniqueVisitors(from, to, path),
      // ... other metrics
    };
  },
};

const handler = createLocallyticsHandler(customAdapter);
```

---

## TypeScript Types

### Core Event Types

```typescript
type EventBase = {
  id: string;
  ts: number;
  sessionId: string;
  anonId?: string;
  url: string;
  path: string;
  referrer?: string;
  screen?: { w: number; h: number };
};

type PageviewEvent = EventBase & {
  type: 'pageview';
  title?: string;
};

type CustomEvent<T extends string = string, P = Record<string, unknown>> = EventBase & {
  type: 'event';
  name: T;
  props?: P;
};

type AnyEvent = PageviewEvent | CustomEvent;
```

### Database Types

```typescript
interface LocEvent {
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

interface DB {
  loc_events: LocEvent;
}
```

---

## Testing Your Integration

The `/test` directory contains a complete Next.js example application demonstrating:

1. **API Route Setup** - How to configure the analytics endpoint
2. **Client-Side Tracking** - Using `<AnalyticsGrabber />` in layouts
3. **Analytics Dashboard** - Fetching and displaying metrics with `AnalyticsJSON()`

To run the test app:

```bash
cd test
npm install

# Set up your database URL
echo "DATABASE_URL=postgresql://..." > .env

# Run migrations
psql $DATABASE_URL -f ../schemas/postgres.sql

# Start the dev server
npm run dev
```

Visit:

- `http://localhost:3000` - Main page (tracking pageviews)
- `http://localhost:3000/analytics` - Analytics dashboard

---

## Advanced Usage

### Custom Event Tracking

Track user interactions, form submissions, purchases, etc:

```typescript
// Button clicks
window.locallytics.track('button_click', {
  button_id: 'cta-signup',
  page: '/home',
});

// Form submissions
window.locallytics.track('form_submit', {
  form_name: 'newsletter',
  success: true,
});

// E-commerce events
window.locallytics.track('purchase', {
  order_id: '12345',
  total: 149.99,
  items: 3,
});

// Feature usage
window.locallytics.track('feature_used', {
  feature: 'dark_mode',
  enabled: true,
});
```

### Filtering by Path

Get analytics for specific pages or sections:

```typescript
// Get analytics for a specific page
const blogStats = await AnalyticsJSON({ path: '/blog' });

// Get analytics for a section
const docsStats = await AnalyticsJSON({ path: '/docs' });
```

### Custom Date Ranges

```typescript
// Last 7 days
const lastWeek = await AnalyticsJSON({
  from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  to: new Date().toISOString(),
});

// Specific month
const january = await AnalyticsJSON({
  from: '2024-01-01T00:00:00Z',
  to: '2024-01-31T23:59:59Z',
});
```

### Using the Kysely Instance Directly

Access the database for custom queries:

```typescript
const analytics = await locallytics({
  database: process.env.DATABASE_URL!,
});

// Custom query using Kysely
const topEvents = await analytics.db
  .selectFrom('loc_events')
  .select(['name', analytics.db.fn.count('id').as('count')])
  .where('type', '=', 'event')
  .where('ts', '>=', Date.now() - 24 * 60 * 60 * 1000)
  .groupBy('name')
  .orderBy('count', 'desc')
  .limit(10)
  .execute();
```

### Building Custom Dashboards

Use the raw data to build custom visualizations:

```tsx
import { AnalyticsJSON } from 'locallytics';
import { Card } from '@/components/ui/card';
import { BarChart } from 'recharts';

export default async function CustomDashboard() {
  const data = await AnalyticsJSON({});

  return (
    <div>
      {/* Metric cards */}
      <Card>
        <h2>Pageviews</h2>
        <p>{data.pageviews.toLocaleString()}</p>
      </Card>

      {/* Custom chart */}
      <BarChart data={data.topPages}>{/* Your chart config */}</BarChart>

      {/* Top events */}
      <ul>
        {data.topEvents.map((event) => (
          <li key={event.eventName}>
            {event.eventName}: {event.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Privacy & Compliance

### Do Not Track Support

Locallytics respects the Do Not Track (DNT) browser setting by default:

```tsx
<AnalyticsGrabber dntRespect={true} />
```

### No Cookies

Locallytics uses localStorage and sessionStorage instead of cookies, avoiding cookie consent requirements in many jurisdictions.

### Data Ownership

All analytics data is stored in your own database. You have complete control and ownership of your data.

### GDPR/CCPA Compliance

- No data is sent to third-party servers
- Anonymous IDs are generated client-side
- No personal information is collected by default
- Easy to implement data deletion (just delete rows from your database)

---

## Performance

### Client-Side

- **Lightweight** - Minimal bundle size impact
- **Non-blocking** - Uses `sendBeacon()` for reliable, async delivery
- **Batched** - Events are queued and sent in batches to reduce requests
- **Automatic flushing** - Events flush on page hide to prevent data loss

### Server-Side

- **Fast queries** - Optimized indexes on `ts`, `path`, and `type`
- **Efficient aggregation** - Database-level aggregations via Kysely
- **Connection pooling** - Uses pg connection pools for Postgres

---

## Troubleshooting

### Events Not Being Tracked

1. Check that `<AnalyticsGrabber />` is rendered in your layout
2. Verify the API endpoint is correct (default: `/api/locallytics`)
3. Check browser console for errors
4. Ensure Do Not Track is not blocking (if `dntRespect={true}`)
5. Check network tab for POST requests to your endpoint

### Analytics Not Showing

1. Verify database table exists and is accessible
2. Check that the API route returns data: `GET /api/locallytics`
3. Ensure database connection string is correct
4. Check server logs for errors

### TypeScript Errors

1. Ensure peer dependencies are installed: `react`, `kysely`, `pg`
2. Make sure TypeScript version is >= 5.0
3. Check that types are being imported correctly from `locallytics`

---

## Roadmap

- [ ] Prisma adapter
- [ ] Real-time analytics with WebSockets
- [ ] Session replay (privacy-focused)
- [ ] Funnel analysis
- [ ] A/B testing utilities
- [ ] Pre-built dashboard components library
- [ ] Export functionality (CSV, JSON)
- [ ] Drizzle ORM adapter

---

## Contributing

Contributions are welcome! Please check the GitHub repository for:

- Issue reporting
- Feature requests
- Pull requests

---

## License

MIT

---

## Credits

Built with:

- TypeScript
- Kysely (SQL query builder)
- React
- Zod (validation)
