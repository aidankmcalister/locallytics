// src/server/locallytics.ts
import type { Kysely } from 'kysely';
import type { DB } from './db-types';
import { makeKyselyAdapter } from './adapters/kysely';
import { createLocallyticsHandler } from './createLocallyticsHandler';

export interface LocallyticsConfig {
  /**
   * Database connection string (Postgres) or Kysely instance.
   *
   * Connection string example:
   * - Postgres: `postgres://user:pass@host:5432/db` or `postgresql://...`
   */
  database: string | Kysely<DB>;
}

/**
 * Creates a Kysely instance from a Postgres connection string.
 */
async function createKyselyFromConnectionString(connectionString: string): Promise<Kysely<DB>> {
  const { Kysely, PostgresDialect } = await import('kysely');
  const { Pool } = await import('pg');

  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString }),
    }),
  });
}

/**
 * Creates a Locallytics instance.
 * Returns handlers that work with any framework using standard Fetch API.
 *
 * @example
 * Simple usage with Postgres connection string:
 * ```ts
 * export const analytics = locallytics({
 *   database: process.env.DATABASE_URL
 * });
 * ```
 *
 * @example
 * Advanced usage with custom Kysely instance:
 * ```ts
 * import { Kysely, PostgresDialect } from 'kysely';
 * import { Pool } from 'pg';
 *
 * const db = new Kysely<DB>({
 *   dialect: new PostgresDialect({
 *     pool: new Pool({ connectionString: process.env.DATABASE_URL }),
 *   }),
 * });
 *
 * export const analytics = locallytics({ database: db });
 * ```
 */
export async function createLocallytics(config: LocallyticsConfig) {
  let db: Kysely<DB>;

  // If a Kysely instance is passed, use it directly
  if (typeof config.database !== 'string') {
    db = config.database;
  } else {
    // Otherwise, create a Kysely instance from the Postgres connection string
    db = await createKyselyFromConnectionString(config.database);
  }

  const adapter = makeKyselyAdapter(db);
  const handler = createLocallyticsHandler(adapter);

  return {
    // Storage adapter (for custom usage)
    adapter,

    // Kysely instance (for custom queries)
    db,

    // Unified handler (supports both GET and POST)
    handler,

    // Convenience exports for Next.js App Router
    GET: handler.GET,
    POST: handler.POST,

    // Named handlers for separate routes
    ingest: handler.POST,
    metrics: handler.GET,
  };
}

/**
 * Synchronous version that requires a pre-configured Kysely instance.
 * Use this if you want to configure Kysely yourself.
 */
export function locallyticsSync(config: { db: Kysely<DB> }) {
  const adapter = makeKyselyAdapter(config.db);
  const handler = createLocallyticsHandler(adapter);

  return {
    adapter,
    db: config.db,
    handler,
    GET: handler.GET,
    POST: handler.POST,
    ingest: handler.POST,
    metrics: handler.GET,
  };
}

// Legacy export name for backward compatibility
export const locallytics = createLocallytics;
