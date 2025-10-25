# Locallytics

**Analytics that live with your app.**

## Why Locallytics?

- **Lightweight**: No external dependencies
- **Simple**: Easy to set up and use
- **Fast**: Fast performance
- **Secure**: Secure by default
- **Flexible**: Flexible configuration

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
