import React from 'react';
import { AnalyticsJSON } from './AnalyticsJSON';

type HeaderReader = () => Headers | Map<string, string> | null;

/**
 * Server-side component that fetches and displays analytics with a default styled UI.
 *
 * Renders a clean, minimal dashboard showing pageviews, unique visitors,
 * top pages, referrers, events, and daily stats in a card-based layout.
 *
 * @example
 * ```tsx
 * import { AnalyticsDisplay } from 'locallytics';
 * import { headers } from 'next/headers';
 *
 * export default function AnalyticsPage() {
 *   return <AnalyticsDisplay headersReader={headers} />;
 * }
 * ```
 */
export async function AnalyticsDisplay({
  endpoint = '/api/locallytics',
  from,
  to,
  path,
  headersReader,
}: {
  /** API endpoint to fetch metrics from (default: '/api/locallytics') */
  endpoint?: string;
  /** Start date (ISO string, default: 30 days ago) */
  from?: string;
  /** End date (ISO string, default: now) */
  to?: string;
  /** Filter by specific path */
  path?: string;
  /** Function to read request headers (for server-side rendering) */
  headersReader?: HeaderReader;
}) {
  const data = await AnalyticsJSON({
    ...(endpoint && { endpoint }),
    ...(from && { from }),
    ...(to && { to }),
    ...(path && { path }),
    ...(headersReader && { headersReader }),
  });

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Analytics</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Total Pageviews
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>
            {data.pageviews.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Unique Visitors
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>
            {data.uniqueVisitors.toLocaleString()}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Top Pages
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.topPages.slice(0, 10).map((page) => (
              <div
                key={page.path}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {page.path}
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginLeft: '1rem',
                  }}
                >
                  {page.pageviews.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Top Referrers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.topReferrers.slice(0, 10).map((ref) => (
              <div
                key={ref.referrer}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ref.referrer}
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginLeft: '1rem',
                  }}
                >
                  {ref.visits.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {data.topEvents.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Top Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.topEvents.slice(0, 10).map((event) => (
                <div
                  key={event.eventName}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.eventName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginLeft: '1rem',
                    }}
                  >
                    {event.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.dailyStats.length > 0 && (
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            marginTop: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Daily Stats
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      color: '#6b7280',
                      fontWeight: '600',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: '0.75rem',
                      color: '#6b7280',
                      fontWeight: '600',
                    }}
                  >
                    Pageviews
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: '0.75rem',
                      color: '#6b7280',
                      fontWeight: '600',
                    }}
                  >
                    Visitors
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.dailyStats.map((day) => (
                  <tr key={day.date} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem', color: '#374151' }}>{day.date}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem', color: '#374151' }}>
                      {day.pageviews.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.75rem', color: '#374151' }}>
                      {day.uniqueVisitors.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
