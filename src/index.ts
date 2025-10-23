// src/index.ts
export { AnalyticsGrabber } from './client/AnalyticsGrabber';
export { AnalyticsDisplay } from './ui/AnalyticsDisplay';

// Unified API (recommended)
export {
  createLocallyticsHandler,
  createLocallyticsClient,
} from './server/createLocallyticsHandler';

// Legacy separate handlers (backwards compatibility)
export { createIngestHandler } from './server/createIngestHandler';
export { createMetricsHandler } from './server/createMetricsHandler';

export { memoryAdapter } from './server/adapters/memory';
export * from './types';
