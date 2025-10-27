import { describe, it, expect, vi } from 'vitest';
import { createLocallyticsHandler } from './server/createLocallyticsHandler';
import { createIngestHandler } from './server/createIngestHandler';
import { createMetricsHandler } from './server/createMetricsHandler';
import { makeKyselyAdapter } from './server/adapters/kysely';
import { ingestSchema, cleanEvents } from './server/validation';
import type { StorageAdapter, AnyEvent } from './types';

describe('Validation', () => {
  it('validates pageview events', () => {
    const result = ingestSchema.parse({
      events: [
        {
          id: 'e1',
          ts: Date.now(),
          sessionId: 's1',
          url: 'https://example.com',
          path: '/',
          type: 'pageview',
        },
      ],
    });
    expect(result.events).toHaveLength(1);
  });

  it('validates custom events', () => {
    const result = ingestSchema.parse({
      events: [
        {
          id: 'e1',
          ts: Date.now(),
          sessionId: 's1',
          url: 'https://example.com',
          path: '/',
          type: 'event',
          name: 'click',
        },
      ],
    });
    expect(result.events?.[0]?.type).toBe('event');
  });

  it('rejects invalid types', () => {
    expect(() =>
      ingestSchema.parse({
        events: [
          {
            id: 'e1',
            ts: Date.now(),
            sessionId: 's1',
            url: 'https://example.com',
            path: '/',
            type: 'invalid',
          },
        ],
      }),
    ).toThrow();
  });

  it('rejects batches over 500 events', () => {
    expect(() =>
      ingestSchema.parse({
        events: Array(501).fill({
          id: 'e1',
          ts: Date.now(),
          sessionId: 's1',
          url: 'https://example.com',
          path: '/',
          type: 'pageview',
        }),
      }),
    ).toThrow();
  });

  it('cleans undefined values', () => {
    const cleaned = cleanEvents([
      {
        id: 'e1',
        ts: Date.now(),
        sessionId: 's1',
        url: 'https://example.com',
        path: '/',
        type: 'pageview',
        anonId: undefined,
        title: 'Test',
      },
    ]);
    expect(cleaned[0]).not.toHaveProperty('anonId');
    expect(cleaned[0]).toHaveProperty('title');
  });
});

describe('Ingest Handler', () => {
  it('accepts valid POST', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn(),
    };
    const handler = createIngestHandler(mockAdapter);

    const req = new Request('http://localhost/api', {
      method: 'POST',
      body: JSON.stringify({
        events: [
          {
            id: 'e1',
            ts: Date.now(),
            sessionId: 's1',
            url: 'https://example.com',
            path: '/',
            type: 'pageview',
          },
        ],
      }),
    });

    const res = await handler(req);
    expect(res.status).toBe(200);
    expect(mockAdapter.insertEvents).toHaveBeenCalled();
  });

  it('rejects invalid POST', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn(),
    };
    const handler = createIngestHandler(mockAdapter);

    const req = new Request('http://localhost/api', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    });

    const res = await handler(req);
    expect(res.status).toBe(400);
  });
});

describe('Metrics Handler', () => {
  it('returns metrics for GET', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn().mockResolvedValue({
        pageviews: 100,
        uniqueVisitors: 50,
        topPages: [],
        dailyStats: [],
        topReferrers: [],
        topEvents: [],
      }),
    };
    const handler = createMetricsHandler(mockAdapter);

    const req = new Request('http://localhost/api?from=2025-01-01&to=2025-01-31');
    const res = await handler(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.pageviews).toBe(100);
  });

  it('filters by path', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn().mockResolvedValue({
        pageviews: 10,
        uniqueVisitors: 5,
        topPages: [],
        dailyStats: [],
        topReferrers: [],
        topEvents: [],
      }),
    };
    const handler = createMetricsHandler(mockAdapter);

    const req = new Request('http://localhost/api?path=/home');
    await handler(req);

    expect(mockAdapter.metrics).toHaveBeenCalledWith(expect.objectContaining({ path: '/home' }));
  });
});

describe('Unified Handler', () => {
  it('handles POST', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn(),
    };
    const handler = createLocallyticsHandler(mockAdapter);

    const req = new Request('http://localhost/api', {
      method: 'POST',
      body: JSON.stringify({
        events: [
          {
            id: 'e1',
            ts: Date.now(),
            sessionId: 's1',
            url: 'https://example.com',
            path: '/',
            type: 'pageview',
          },
        ],
      }),
    });

    const res = await handler(req);
    expect(res.status).toBe(200);
  });

  it('handles GET', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn().mockResolvedValue({
        pageviews: 0,
        uniqueVisitors: 0,
        topPages: [],
        dailyStats: [],
        topReferrers: [],
        topEvents: [],
      }),
    };
    const handler = createLocallyticsHandler(mockAdapter);

    const req = new Request('http://localhost/api');
    const res = await handler(req);

    expect(res.status).toBe(200);
  });

  it('rejects unsupported methods', async () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn(),
    };
    const handler = createLocallyticsHandler(mockAdapter);

    const req = new Request('http://localhost/api', { method: 'DELETE' });
    const res = await handler(req);

    expect(res.status).toBe(405);
  });

  it('exposes GET and POST', () => {
    const mockAdapter: StorageAdapter = {
      insertEvents: vi.fn(),
      metrics: vi.fn(),
    };
    const handler = createLocallyticsHandler(mockAdapter);

    expect(handler).toHaveProperty('GET');
    expect(handler).toHaveProperty('POST');
  });
});

describe('Kysely Adapter', () => {
  it('creates adapter', () => {
    const mockDb = {
      getExecutor: () => ({ adapter: { dialect: { name: 'postgres' } } }),
      insertInto: vi.fn(),
      selectFrom: vi.fn(),
    } as any;

    const adapter = makeKyselyAdapter(mockDb);
    expect(adapter).toHaveProperty('insertEvents');
    expect(adapter).toHaveProperty('metrics');
  });

  it('handles empty batches', async () => {
    const mockDb = {
      getExecutor: () => ({ adapter: { dialect: { name: 'postgres' } } }),
      insertInto: vi.fn(),
    } as any;

    const adapter = makeKyselyAdapter(mockDb);
    await adapter.insertEvents([]);

    expect(mockDb.insertInto).not.toHaveBeenCalled();
  });

  it('transforms events for DB', async () => {
    const executeMock = vi.fn();
    const mockDb = {
      getExecutor: () => ({ adapter: { dialect: { name: 'postgres' } } }),
      insertInto: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflict: vi.fn().mockReturnValue({
            execute: executeMock,
          }),
        }),
      }),
    } as any;

    const adapter = makeKyselyAdapter(mockDb);
    const events: AnyEvent[] = [
      {
        id: 'e1',
        ts: Date.now(),
        sessionId: 's1',
        url: 'https://example.com',
        path: '/',
        type: 'pageview',
      },
    ];

    await adapter.insertEvents(events);
    expect(executeMock).toHaveBeenCalled();
  });
});
