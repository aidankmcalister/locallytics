# Locallytics

[![npm version](https://img.shields.io/npm/v/locallytics.svg)](https://www.npmjs.com/package/locallytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/locallytics)](https://bundlephobia.com/package/locallytics)

**Tagline:** "Analytics that live with your app."

Self-contained analytics SDK that runs entirely on your infrastructure – no external servers, no tracking scripts, no cost.

## Project Structure

This is a monorepo containing the Locallytics packages:

- `packages/` - Contains all the packages
  - `locallytics/` - The main Locallytics package
  - `cli/` - The Locallytics CLI
- `docs/` - Documentation and guides for the project

## Overview

Locallytics is a privacy-first analytics solution where developers drop in an `<AnalyticsGrabber />` component to collect data and use `AnalyticsJSON()` to fetch metrics, all powered by their own database and hosting.

## Why Locallytics?

- **Lightweight**: No external dependencies
- **Simple**: Easy to set up and use
- **Fast**: Event batching with reliable delivery
- **Secure**: Do Not Track (DNT) support
- **Flexible**: Supports PostgreSQL and SQLite
- **Private**: No cookies, runs on your infrastructure
- **Type Safe**: Full TypeScript support

## Quick Start

1. **Install the package**:

```bash
npm install locallytics
# or
yarn add locallytics
# or
pnpm add locallytics
```

2. **Set up the client**

```ts
import { locallytics } from "locallytics";

export const analytics = await locallytics({
  database: process.env.DATABASE_URL!,
});

export const { GET, POST } = analytics;
```

3.  **Run migrations**

```bash
# Generate schema (creates ./locallytics/schema.sql)
npx locallytics generate

# Run migrations
npx locallytics migrate
```

4. **Add AnalyticsGrabber to your layout**:

```tsx
// app/layout.tsx
import { AnalyticsGrabber } from "locallytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <AnalyticsGrabber />
      </body>
    </html>
  );
}
```

5. **Fetch analytics data**:

```tsx
// app/analytics/page.tsx
import { AnalyticsJSON } from "locallytics";
import { headers } from "next/headers";

export default async function AnalyticsPage() {
  const data = await AnalyticsJSON({ headersReader: headers });

  return (
    <div>
      <h1>Pageviews: {data.pageviews}</h1>
      <h2>Unique Visitors: {data.uniqueVisitors}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## Available Metrics

- `pageviews` - Total page views
- `uniqueVisitors` - Unique visitor count
- `topPages` - Most visited pages with counts
- `dailyStats` - Daily pageviews and unique visitors
- `topReferrers` - Top referrer sources
- `topEvents` - Custom event counts

## License

MIT
