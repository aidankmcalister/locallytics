// src/server/adapters/kysely.ts
import type { Kysely } from 'kysely';
import { sql } from 'kysely';
import type { AnyEvent, StorageAdapter } from '../../types';
import type { DB } from '../db-types';

export function makeKyselyAdapter(db: Kysely<DB>): StorageAdapter {
  // Detect dialect for database-specific queries
  const dialectName = (db.getExecutor() as any).adapter?.dialect?.name || 'postgres';
  const isSqlite = dialectName === 'sqlite';

  return {
    async insertEvents(batch) {
      if (!batch?.length) return;
      const rows = batch.map((e) => ({
        id: e.id,
        ts: e.ts,
        session_id: e.sessionId,
        anon_id: e.anonId ?? null,
        type: e.type as 'pageview' | 'event',
        name: e.type === 'event' ? ((e as any).name ?? null) : null,
        url: e.url,
        path: e.path,
        referrer: e.referrer ?? null,
        title: e.type === 'pageview' ? ((e as any).title ?? null) : null,
        props: e.type === 'event' ? JSON.stringify((e as any).props ?? {}) : null,
        screen_w: e.screen?.w ?? null,
        screen_h: e.screen?.h ?? null,
        ip_hash: (e as any).ipHash ?? null,
      }));

      // Bulk insert with dedupe-on-id
      await db
        .insertInto('loc_events')
        .values(rows)
        .onConflict((oc) => oc.column('id').doNothing())
        .execute();
    },

    async metrics({ from, to, path }) {
      const base = db.selectFrom('loc_events').where('ts', '>=', +from).where('ts', '<=', +to);

      const filtered = path ? base.where('path', '=', path) : base;

      // Pageviews
      const [{ count: pv } = { count: 0 }] = await filtered
        .select(({ fn }) => [fn.countAll<number>().as('count')])
        .execute();

      // Visitors (distinct anon_id)
      const [{ count: uv } = { count: 0 }] = await filtered
        .select(({ fn }) => [fn.count('anon_id').distinct().as('count')])
        .execute();

      // Top paths
      const byPath = await filtered
        .select(['path'])
        .select(({ fn }) => [fn.countAll<number>().as('pv')])
        .groupBy('path')
        .orderBy('pv desc')
        .limit(20)
        .execute();

      // Referrers
      const topReferrers = await filtered
        .select(({ fn, eb }) => [
          eb.fn.coalesce('referrer', sql<string>`'(direct)'`).as('referrer'),
          fn.countAll<number>().as('count'),
        ])
        .groupBy('referrer')
        .orderBy('count desc')
        .limit(20)
        .execute();

      // Events
      const topEvents = await filtered
        .where('type', '=', 'event')
        .select(({ fn, eb }) => [
          eb.fn.coalesce('name', sql<string>`'(unknown)'`).as('name'),
          fn.countAll<number>().as('count'),
        ])
        .groupBy('name')
        .orderBy('count desc')
        .limit(20)
        .execute();

      // Timeseries (per-day) - dialect-specific
      const timeseriesDateExpr = isSqlite
        ? sql<string>`date(ts/1000, 'unixepoch')`
        : sql<string>`to_char(to_timestamp(ts/1000)::date, 'YYYY-MM-DD')`;

      const timeseries = await db
        .selectFrom('loc_events')
        .select([
          timeseriesDateExpr.as('t'),
          sql<number>`sum(case when type='pageview' then 1 else 0 end)`.as('pv'),
          sql<number>`count(distinct case when type='pageview' then anon_id end)`.as('uv'),
        ])
        .where('ts', '>=', +from)
        .where('ts', '<=', +to)
        .$if(!!path, (qb) => qb.where('path', '=', path!))
        .groupBy(timeseriesDateExpr)
        .orderBy(sql`1 asc`)
        .execute();

      return {
        pageviews: Number(pv ?? 0),
        uniqueVisitors: Number(uv ?? 0),
        topPages: byPath.map((r) => ({ path: r.path, pageviews: Number((r as any).pv) })),
        topReferrers: topReferrers.map((r) => ({
          referrer: (r as any).referrer,
          visits: Number((r as any).count),
        })),
        topEvents: topEvents.map((r) => ({
          eventName: (r as any).name,
          count: Number((r as any).count),
        })),
        dailyStats: timeseries.map((r) => ({
          date: (r as any).t,
          pageviews: Number((r as any).pv),
          uniqueVisitors: Number((r as any).uv),
        })),
      };
    },
  };
}
