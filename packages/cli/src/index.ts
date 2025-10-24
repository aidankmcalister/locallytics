import { Command } from 'commander';
import { generate } from './commands/generate.js';
import { migrate } from './commands/migrate.js';

const program = new Command();

program
  .name('locallytics')
  .description('CLI tools for Locallytics schema generation and migration')
  .version('0.0.1');

program
  .command('generate')
  .description('Generate database schema from Locallytics configuration')
  .action(async () => {
    try {
      await generate();
    } catch (error) {
      console.error('Error generating schema:', error);
      process.exit(1);
    }
  });

program
  .command('migrate')
  .description('Run database migrations')
  .action(async () => {
    try {
      await migrate();
    } catch (error) {
      console.error('Error running migrations:', error);
      process.exit(1);
    }
  });

program.parse();
