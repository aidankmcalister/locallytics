'use client';
import { useEffect, useRef } from 'react';
import type { AnyEvent, EventBase, PageviewEvent } from '../types';

export type GrabberProps = {
  /** API endpoint to send events to (default: '/api/locallytics') */
  endpoint?: string;
  /** Respect Do Not Track browser setting (default: true) */
  dntRespect?: boolean;
};

/**
 * Client-side analytics collector that tracks pageviews and custom events.
 *
 * Automatically queues and sends events to your backend, with periodic and
 * visibility-triggered flushing. Exposes `window.locallytics` API for custom tracking.
 *
 * @example
 * ```tsx
 * // In your root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AnalyticsGrabber />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 *
 * // Track custom events
 * window.locallytics.track('button_click', { button: 'signup' });
 * ```
 */
export function AnalyticsGrabber({
  endpoint = '/api/locallytics',
  dntRespect = true,
}: GrabberProps) {
  const queue = useRef<AnyEvent[]>([]);
  const flushing = useRef(false);

  function anon() {
    const k = 'locallytics_anon';
    let v = localStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem(k, v);
    }
    return v;
  }

  function base(): EventBase {
    return {
      id: crypto.randomUUID(),
      ts: Date.now(),
      sessionId:
        sessionStorage.getItem('locallytics_session') ??
        (() => {
          const s = crypto.randomUUID();
          sessionStorage.setItem('locallytics_session', s);
          return s;
        })(),
      anonId: anon(),
      url: location.href,
      path: location.pathname,
      screen: { w: window.innerWidth, h: window.innerHeight },
      ...(document.referrer && { referrer: document.referrer }),
    };
  }

  function enqueue(e: AnyEvent) {
    queue.current.push(e);
    if (queue.current.length >= 10) flush();
  }

  function flush() {
    if (flushing.current || queue.current.length === 0) return;
    flushing.current = true;
    const payload = queue.current.splice(0, queue.current.length);
    const body = JSON.stringify({ events: payload });

    const ok = navigator.sendBeacon?.(endpoint, new Blob([body], { type: 'application/json' }));
    if (!ok) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      })
        .catch(() => {})
        .finally(() => {
          flushing.current = false;
        });
    } else {
      flushing.current = false;
    }
  }

  useEffect(() => {
    if (dntRespect && (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1')) return;

    enqueue({ type: 'pageview', title: document.title, ...base() });

    const iv = setInterval(() => flush(), 3000);
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVis);

    (window as any).locallytics = {
      track: (name: string, props?: Record<string, unknown>) => {
        const event: AnyEvent = {
          type: 'event',
          name,
          ...base(),
        };
        if (props !== undefined) {
          event.props = props;
        }
        enqueue(event);
      },
      trackPageview: (extra?: Partial<PageviewEvent>) =>
        enqueue({ type: 'pageview', ...base(), ...extra }),
      flush,
    };

    return () => {
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVis);
      flush();
    };
  }, [dntRespect, endpoint]);

  return null;
}
