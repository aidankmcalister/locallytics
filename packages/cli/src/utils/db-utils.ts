/**
 * Detect database dialect from connection string
 */
export function detectDialect(databaseUrl: string): 'postgres' | 'sqlite' {
  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
    return 'postgres';
  }
  if (databaseUrl.endsWith('.db') || databaseUrl.endsWith('.sqlite') || databaseUrl.endsWith('.sqlite3')) {
    return 'sqlite';
  }
  // Default to postgres for compatibility
  return 'postgres';
}

/**
 * Validate database URL format
 */
export function validateDatabaseUrl(databaseUrl: string): string {
  const url = databaseUrl || process.env.DATABASE_URL;
  if (!url || url.trim() === '') {
    throw new Error('Database URL is required. Provide it via --database-url flag or DATABASE_URL environment variable.');
  }
  return url;
}
