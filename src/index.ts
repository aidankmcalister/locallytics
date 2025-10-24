// src/index.ts
export { AnalyticsGrabber } from './client/AnalyticsGrabber';
export { AnalyticsDisplay } from './ui/AnalyticsDisplay';

// Main API (recommended)
export { locallytics } from './server/locallytics';

// Unified handler API
export {
  createLocallyticsHandler,
  createLocallyticsClient,
} from './server/createLocallyticsHandler';

// Legacy separate handlers (backwards compatibility)
export { createIngestHandler } from './server/createIngestHandler';
export { createMetricsHandler } from './server/createMetricsHandler';

export { memoryAdapter } from './server/adapters/memory';
export * from './types';
