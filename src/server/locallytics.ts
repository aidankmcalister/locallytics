import type { Kysely } from 'kysely';
import type { DB } from './db-types';
import { makeKyselyAdapter } from './adapters/kysely';
import { createLocallyticsHandler } from './createLocallyticsHandler';

export interface LocallyticsConfig {
  database: string | Kysely<DB>;
}

async function createKyselyFromConnectionString(connectionString: string): Promise<Kysely<DB>> {
  const { Kysely, PostgresDialect } = await import('kysely');
  const { Pool } = await import('pg');

  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString }),
    }),
  });
}

export async function createLocallytics(config: LocallyticsConfig) {
  let db: Kysely<DB>;

  if (typeof config.database !== 'string') {
    db = config.database;
  } else {
    db = await createKyselyFromConnectionString(config.database);
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

export const locallytics = createLocallytics;
