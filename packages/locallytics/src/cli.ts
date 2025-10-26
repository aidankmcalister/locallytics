#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { generate } from './cli/commands/generate.js';
import { migrate } from './cli/commands/migrate.js';

// Load .env file if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(process.cwd(), '.env') });

const program = new Command();

program
  .name('locallytics')
  .description('CLI tools for Locallytics schema generation and migration')
  .version('0.0.1');

program
  .command('generate')
  .description('Generate database schema from Locallytics configuration')
  .option('-d, --dialect <type>', 'Database dialect (postgres or sqlite)', 'postgres')
  .option('-o, --output <path>', 'Output path for schema file', './locallytics/schema.sql')
  .action(async (options) => {
    try {
      await generate({
        dialect: options.dialect,
        outputPath: options.output,
      });
    } catch (error) {
      console.error('Error generating schema:', error);
      process.exit(1);
    }
  });

program
  .command('migrate')
  .description('Run database migrations')
  .option('-u, --database-url <url>', 'Database connection URL')
  .action(async (options) => {
    try {
      // Check for database URL from CLI option or environment variable
      const databaseUrl = options.databaseUrl || process.env.DATABASE_URL;

      if (!databaseUrl) {
        console.error('❌ Database URL is required. Provide it via --database-url flag or DATABASE_URL environment variable.');
        process.exit(1);
      }

      await migrate({ databaseUrl });
    } catch (error) {
      console.error('Error running migrations:', error);
      process.exit(1);
    }
  });

program.parse();
