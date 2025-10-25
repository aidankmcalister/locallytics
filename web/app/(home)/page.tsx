import { CodeSnippet } from "@/components/CodeSnippet";
import { Origami } from "lucide-react";

const codeHighlight = "text-neutral-900 dark:text-white";

const gradientCircle =
  "absolute rounded-full blur-3xl bg-linear-to-br from-neutral-200/40 to-transparent dark:from-neutral-800/40";
const sectionContainer = "relative mx-auto max-w-6xl px-6 py-24";
const heading =
  "mb-20 text-center text-5xl font-bold text-neutral-900 dark:text-white";
const cardBase =
  "rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-black";
const stepNumber =
  "flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-lg font-bold text-white dark:bg-white dark:text-black";

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Gradient Background Circles */}
      <div
        className={`${gradientCircle} right-0 top-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3`}
      />
      <div
        className={`${gradientCircle} right-1/4 top-1/4 h-[600px] w-[600px] from-neutral-300/30 dark:from-neutral-700/30`}
      />
      <div
        className={`${gradientCircle} bottom-0 left-0 h-[700px] w-[700px] -translate-x-1/3 translate-y-1/2`}
      />

      {/* Hero Section */}
      <div className="relative mx-auto flex min-h-[75vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <Origami
          strokeWidth={1.5}
          className="mb-6 h-12 w-12 text-neutral-900 dark:text-white"
        />
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-7xl">
          Analytics that live with your app.
        </h1>
        <p className="mb-10 max-w-2xl text-xl font-light text-neutral-600 dark:text-neutral-400">
          Stop paying someone else to manage your analytics.
        </p>
        <CodeSnippet>npm i locallytics</CodeSnippet>
      </div>

      {/* Features Grid */}
      <div className={sectionContainer}>
        <h2 className={heading}>Built for developers.</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Feature
            title="Lightweight"
            description="No external dependencies. Keep your bundle small and your app fast."
          />
          <Feature
            title="Privacy-First"
            description="No cookies, no tracking. Uses localStorage and respects DNT headers."
          />
          <Feature
            title="Self-Hosted"
            description="Your data, your database, your infrastructure. Complete control."
          />
          <Feature
            title="Type Safe"
            description="Full TypeScript support throughout the SDK for a better developer experience."
          />
          <Feature
            title="Flexible"
            description="Custom adapter interface lets you bring your own database solution."
          />
          <Feature
            title="Fast"
            description="Event batching and sendBeacon() API for optimal performance."
          />
        </div>
      </div>

      {/* Code Example Section */}
      <div className={sectionContainer}>
        <h2 className={heading}>Simple setup.</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <CodeExample
            step={1}
            title="Add to your layout"
            code={
              <>
                import{" { "}
                <span className={codeHighlight}>AnalyticsGrabber</span>
                {" } from "}
                <span className={codeHighlight}>"locallytics"</span>
                {`;\n\n`}
                export default function <span>RootLayout</span>
                {`({ children }) {\n  return (\n    <html>\n      <body>\n        {children}\n        <`}
                <span className={codeHighlight}>AnalyticsGrabber</span>
                {` />\n      </body>\n    </html>\n  );\n}`}
              </>
            }
          />
          <CodeExample
            step={2}
            title="View your analytics"
            code={
              <>
                import{" { "}
                <span className={codeHighlight}>AnalyticsJSON</span>
                {" } from "}
                <span className={codeHighlight}>"locallytics"</span>
                {`;\n\n`}
                export default async function <span>AnalyticsPage</span>
                {`() {\n  const data = await `}
                <span className={codeHighlight}>AnalyticsJSON</span>
                {`({});\n\n  return (\n    <pre>\n      {JSON.stringify(data, null, 2)}\n    </pre>\n  );\n}`}
              </>
            }
          />
        </div>
      </div>

      {/* Metrics Section */}
      <div className="relative mx-auto mb-24 max-w-4xl px-6 py-24 text-center">
        <h2 className="mb-8 text-5xl font-bold text-neutral-900 dark:text-white">
          Everything you need.
        </h2>
        <p className="mb-12 text-xl text-neutral-600 dark:text-neutral-400">
          Track pageviews, unique visitors, top pages, daily stats, referrers,
          and custom events.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Pageviews",
            "Unique Visitors",
            "Top Pages",
            "Daily Stats",
            "Referrers",
            "Custom Events",
          ].map((metric) => (
            <span
              key={metric}
              className="rounded-full border border-neutral-300 bg-neutral-100 px-6 py-3 text-base font-medium text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {metric}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-600">
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}

function CodeExample({
  step,
  title,
  code,
}: {
  step: number;
  title: string;
  code: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center gap-4">
        <div className={stepNumber}>{step}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className={`${cardBase} flex-1 p-8`}>
        <pre className="overflow-x-auto text-sm  text-neutral-500 dark:text-neutral-500">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
