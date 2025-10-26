export interface GeneratorOptions {
  outputPath?: string;
  dialect?: 'postgres' | 'sqlite';
}

export abstract class SchemaGenerator {
  protected options: GeneratorOptions;

  constructor(options: GeneratorOptions = {}) {
    this.options = {
      dialect: 'postgres',
      ...options,
    };
  }

  /**
   * Generate the schema and write it to the specified location
   * @returns The path where the schema was written
   */
  abstract generate(): Promise<string>;

  /**
   * Get the default output path for this generator
   */
  abstract getOutputPath(): string;

  /**
   * Validate the generator configuration
   */
  abstract validate(): void;
}
