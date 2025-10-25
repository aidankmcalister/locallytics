import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import Database from 'better-sqlite3';
import { detectDialect, validateDatabaseUrl } from '../utils/db-utils.js';

const { Pool } = pg;

interface MigrateOptions {
  databaseUrl: string;
}

export async function migrate(options: MigrateOptions) {
  try {
    console.log('🔄 Running migration...');

    const databaseUrl = validateDatabaseUrl(options.databaseUrl);
    const dialect = detectDialect(databaseUrl);
    console.log(`🗄️  Detected dialect: ${dialect}`);

    // Get schema path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schemaPath = join(__dirname, '../../locallytics/schemas', `${dialect}.sql`);

    // Read schema
    const schema = await readFile(schemaPath, 'utf-8');

    // Run migration based on dialect
    if (dialect === 'postgres') {
      await migratePostgres(databaseUrl, schema);
    } else {
      await migrateSqlite(databaseUrl, schema);
    }

    console.log('✅ Migration completed successfully!');
    console.log('📊 Table "loc_events" is ready.');
  } catch (error) {
    throw new Error(`Failed to migrate: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function migratePostgres(databaseUrl: string, schema: string): Promise<void> {
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    await pool.query(schema);
  } finally {
    await pool.end();
  }
}

async function migrateSqlite(databaseUrl: string, schema: string): Promise<void> {
  const db = new Database(databaseUrl);
  try {
    db.exec(schema);
  } finally {
    db.close();
  }
}
