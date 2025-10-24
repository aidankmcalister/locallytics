// src/index.ts

// Main API (Kysely-first)
export { createLocallytics, locallytics, locallyticsSync } from './server/locallytics';

// React components
export { AnalyticsGrabber } from './client/AnalyticsGrabber';
export { AnalyticsDisplay } from './ui/AnalyticsDisplay';

// Adapters
export { makeKyselyAdapter } from './server/adapters/kysely';
export { memoryAdapter } from './server/adapters/memory';

// Event types
export * from './types';

// Legacy handler APIs (backward compatibility)
export {
  createLocallyticsHandler,
  createLocallyticsClient,
} from './server/createLocallyticsHandler';
export { createIngestHandler } from './server/createIngestHandler';
export { createMetricsHandler } from './server/createMetricsHandler';

// Re-export DB types for convenience
export type { DB, LocEvent } from './server/db-types';
