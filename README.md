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
- `docs/` - Documentation and guides for the project

## Overview

Locallytics is a privacy-first analytics solution where developers drop in an `<AnalyticsGrabber />` component to collect data and use `AnalyticsJSON()` to fetch metrics, all powered by their own database and hosting.

### Key Features

- **Zero external dependencies** – data stays local on your infrastructure
- **One-line setup** using React components
- **Pageview + custom event tracking**
- **Works with any backend** (Vercel, Cloudflare, Supabase, Postgres, SQLite, etc.)
- **Privacy-compliant** and free forever
- **TypeScript-first** with full type safety
- **Kysely-based** database adapter with support for Postgres and SQLite

## Documentation

For detailed documentation, guides, and API references, please see the [docs](/docs) directory. The documentation includes:

- Getting Started Guide
- API Reference
- Configuration Options
- Advanced Usage
- Deployment Guides
- Migration Guides

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run in development mode
npm run dev
```

## Installation

```bash
npm install locallytics
```

**Peer Dependencies:**

- `react` >= 18
- `kysely` (if using database adapter)
- `pg` (if using Postgres)
npm run dev
```
