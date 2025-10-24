// src/server/locallytics.ts
import type { StorageAdapter } from '../types';
import { createLocallyticsHandler } from './createLocallyticsHandler';

export interface LocallyticsConfig {
  adapter?: StorageAdapter;
}

export function locallytics(config: LocallyticsConfig = {}) {
  if (!config.adapter) {
    throw new Error(
      'locallytics: adapter is required. Import and pass an adapter like memoryAdapter.',
    );
  }

  const handler = createLocallyticsHandler(config.adapter);

  return {
    // For Next.js route handlers
    handler,
    GET: handler.GET,
    POST: handler.POST,

    // For programmatic access
    adapter: config.adapter,
  };
}
