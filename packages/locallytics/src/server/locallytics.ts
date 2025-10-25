import type { Kysely } from 'kysely';
import type { DB } from './db-types';
import type { StorageAdapter } from '../types';
import { makeKyselyAdapter } from './adapters/kysely';
import { createLocallyticsHandler } from './createLocallyticsHandler';

export interface LocallyticsConfig {
  /** Postgres connection string or Kysely instance */
  database: string | Kysely<DB>;
  dialect?: 'postgres' | 'sqlite';
}

export interface LocallyticsInstance {
  /** Storage adapter for custom usage */
  adapter: StorageAdapter;
  /** Kysely database instance */
  db: Kysely<DB>;
  /** Unified handler supporting GET and POST */
  handler: (req: Request) => Promise<Response>;
  /** GET handler for metrics */
  GET: (req: Request) => Promise<Response>;
  /** POST handler for event ingestion */
  POST: (req: Request) => Promise<Response>;
  /** Alias for POST */
  ingest: (req: Request) => Promise<Response>;
  /** Alias for GET */
  metrics: (req: Request) => Promise<Response>;
}

async function createKyselyFromConnectionString(
  connectionString: string,
  dialect: 'postgres' | 'sqlite' = 'postgres',
): Promise<Kysely<DB>> {
  const { Kysely } = await import('kysely');

  if (dialect === 'postgres') {
    const { PostgresDialect } = await import('kysely');
    const { Pool } = await import('pg');
    
    return new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({ connectionString }),
      }),
    });
  } else {
    const { SqliteDialect } = await import('kysely');
    const Database = (await import('better-sqlite3')).default;
    
    return new Kysely<DB>({
      dialect: new SqliteDialect({
        database: new Database(connectionString.replace('file:', '')),
      }),
    });
  }
}

/**
 * Create a Locallytics instance with database-backed analytics.
 *
 * @param config - Configuration with database connection string or Kysely instance
 * @returns Analytics handlers for ingesting events and querying metrics
 *
 * @example
 * ```ts
 * const analytics = await locallytics({
 *   database: process.env.DATABASE_URL
 * });
 *
 * export const { GET, POST } = analytics;
 * ```
 */
export async function createLocallytics(config: LocallyticsConfig): Promise<LocallyticsInstance> {
  let db: Kysely<DB>;

  if (typeof config.database !== 'string') {
    db = config.database;
  } else {
    const dialect = config.dialect || (config.database.startsWith('postgres') ? 'postgres' : 'sqlite');
    db = await createKyselyFromConnectionString(config.database, dialect);
  }

  const adapter = makeKyselyAdapter(db);
  const handler = createLocallyticsHandler(adapter);

  return {
    adapter,
    db,
    handler,
    GET: handler.GET,
    POST: handler.POST,
    ingest: handler.POST,
    metrics: handler.GET,
  };
}

/**
 * Synchronous version of createLocallytics for pre-configured Kysely instances.
 *
 * @param config - Configuration with Kysely instance
 * @returns Analytics handlers for ingesting events and querying metrics
 */
export function locallyticsSync(config: { db: Kysely<DB> }): LocallyticsInstance {
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

/**
 * Alias for createLocallytics.
 * @see {@link createLocallytics}
 */
export const locallytics = createLocallytics;
