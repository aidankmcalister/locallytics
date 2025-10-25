import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SchemaGenerator, GeneratorOptions } from './base.js';
import { writeFileSafe, resolvePath } from '../utils/file-utils.js';

export class SqlGenerator extends SchemaGenerator {
  constructor(options: GeneratorOptions = {}) {
    super(options);
  }

  getOutputPath(): string {
    return this.options.outputPath || './locallytics/schema.sql';
  }

  validate(): void {
    if (this.options.dialect && !['postgres', 'sqlite'].includes(this.options.dialect)) {
      throw new Error(`Invalid dialect: ${this.options.dialect}. Must be 'postgres' or 'sqlite'`);
    }
  }

  async generate(): Promise<string> {
    this.validate();

    const dialect = this.options.dialect || 'postgres';
    const outputPath = resolvePath(this.getOutputPath());

    // Get the path to the schema templates in the locallytics package
    // The schemas are in packages/locallytics/schemas/
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Navigate from packages/cli/dist/ to packages/locallytics/schemas/
    // When built, structure is: packages/cli/dist/index.js (bundled)
    const schemaTemplatePath = join(__dirname, '../../locallytics/schemas', `${dialect}.sql`);

    // Read the schema template
    const schemaContent = await readFile(schemaTemplatePath, 'utf-8');

    // Write to output path
    await writeFileSafe(outputPath, schemaContent);

    return outputPath;
  }
}
