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
- **Fast**: Fast performance with event batching and `sendBeacon()`
- **Secure**: Secure by default with Do Not Track (DNT) support
- **Flexible**: Custom adapter interface for bring-your-own-database
- **Private**: No cookies, uses localStorage, runs entirely on your infrastructure
- **Type Safe**: Full TypeScript support throughout the SDK

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

3.  **Install and use the CLI**

```bash
# Install the CLI
npm install -g @locallytics/cli

# Generate migrations
npx @locallytics/cli generate

# Run migrations
npx @locallytics/cli migrate
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

5. **Add to your Next.js app** (app router):

```tsx
// app/analytics/page.tsx
import { AnalyticsJSON } from "locallytics";

export default async function AnalyticsPage() {
  const data = await AnalyticsJSON({});

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

AnalyticsJSON response structure:

## Available Metrics

- Pageviews
- Unique visitors
- Top pages
- Daily stats
- Referrers
- Custom events

## License

MIT
