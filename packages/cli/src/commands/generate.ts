import { SqlGenerator } from '../generators/sql-generator.js';
import { GeneratorOptions } from '../generators/base.js';

export async function generate(options: GeneratorOptions = {}) {
  try {
    console.log('🔄 Generating schema...');

    const generator = new SqlGenerator(options);
    const outputPath = await generator.generate();

    console.log(`✅ Schema generated successfully!`);
    console.log(`📄 File: ${outputPath}`);
    console.log(`🗄️  Dialect: ${options.dialect || 'postgres'}`);
  } catch (error) {
    throw new Error(`Failed to generate schema: ${error instanceof Error ? error.message : String(error)}`);
  }
}
