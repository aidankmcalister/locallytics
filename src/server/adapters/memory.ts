// src/server/adapters/memory.ts
import type { AnyEvent, StorageAdapter } from '../../types';

const store: AnyEvent[] = [];

export const memoryAdapter: StorageAdapter = {
  async insertEvents(events) {
    store.push(...events);
  },

  async metrics({ from, to, path }) {
    const f = +from,
      t = +to;
    const rows = store.filter((e) => e.ts >= f && e.ts <= t && (!path || e.path === path));

    const pageviews = rows.filter((r) => r.type === 'pageview').length;
    const visitors = new Set(rows.map((r) => r.anonId).filter(Boolean)).size;

    const byPathMap = new Map<string, number>();
    const refMap = new Map<string, number>();
    const eventMap = new Map<string, number>();
    const dayMap = new Map<string, { pv: number; uvSet: Set<string> }>();

    for (const r of rows) {
      const day = new Date(r.ts).toISOString().slice(0, 10);
      if (!dayMap.has(day)) dayMap.set(day, { pv: 0, uvSet: new Set() });
      const d = dayMap.get(day)!;
      if (r.type === 'pageview') {
        d.pv++;
        if (r.anonId) d.uvSet.add(r.anonId);
      }

      byPathMap.set(r.path, (byPathMap.get(r.path) ?? 0) + 1);
      if (r.referrer) refMap.set(r.referrer, (refMap.get(r.referrer) ?? 0) + 1);
      if (r.type === 'event' && (r as any).name) {
        eventMap.set((r as any).name, (eventMap.get((r as any).name) ?? 0) + 1);
      }
    }

    const topPages = [...byPathMap]
      .map(([path, pageviews]) => ({ path, pageviews }))
      .sort((a, b) => b.pageviews - a.pageviews)
      .slice(0, 20);
    const topReferrers = [...refMap]
      .map(([referrer, visits]) => ({ referrer, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 20);
    const topEvents = [...eventMap]
      .map(([eventName, count]) => ({ eventName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    const dailyStats = [...dayMap]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, pageviews: v.pv, uniqueVisitors: v.uvSet.size }));

    return { pageviews, uniqueVisitors: visitors, topPages, dailyStats, topReferrers, topEvents };
  },
};
