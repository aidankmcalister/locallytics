import { CodeSnippet } from "@/components/CodeSnippet";

const redCode = "text-primary";
const grayCode = "text-neutral-600 dark:text-neutral-400";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 mx-auto max-w-5xl px-6 py-16">
      {/* Hero Section */}
      <div className="flex flex-col justify-center text-center mx-auto max-w-2xl gap-6 items-center mb-32">
        <h1 className="text-4xl font-bold">
          Analytics that live with your app.
        </h1>
        <p className="text-lg font-extralight text-neutral-600 dark:text-neutral-400">
          Stop paying someone else to manage your analytics.
        </p>
        <CodeSnippet>npm i locallytics</CodeSnippet>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
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

      {/* Code Example Section */}
      <div className="mb-32">
        <h2 className="text-2xl font-semibold text-center mb-12">
          Simple setup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium">
                1
              </div>
              <h3 className="text-base font-medium">Add to your layout</h3>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex-1">
              <pre className="text-sm overflow-x-auto text-neutral-800 dark:text-neutral-200">
                <code>
                  <span className={grayCode}>import</span>
                  {" { "}
                  <span className={redCode}>AnalyticsGrabber</span>
                  {" } "}
                  <span className={grayCode}>from</span>{" "}
                  <span className={redCode}>"locallytics"</span>
                  {`;\n\n`}
                  <span className={grayCode}>export default function</span>{" "}
                  <span>RootLayout</span>
                  {`({ children }) {\n  `}
                  <span className={grayCode}>return</span>
                  {` (\n    <html>\n      <body>\n        {children}\n        <`}
                  <span className={redCode}>AnalyticsGrabber</span>
                  {` />\n      </body>\n    </html>\n  );\n}`}
                </code>
              </pre>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium">
                2
              </div>
              <h3 className="text-base font-medium">View your analytics</h3>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex-1">
              <pre className="text-sm overflow-x-auto text-neutral-800 dark:text-neutral-200">
                <code>
                  <span className={grayCode}>import</span>
                  {" { "}
                  <span className={redCode}>AnalyticsJSON</span>
                  {" } "}
                  <span className={grayCode}>from</span>{" "}
                  <span className={redCode}>"locallytics"</span>
                  {`;\n\n`}
                  <span className={grayCode}>
                    export default async function
                  </span>{" "}
                  <span>AnalyticsPage</span>
                  {`() {\n  `}
                  <span className={grayCode}>const</span>
                  {" data = "}
                  <span className={grayCode}>await</span>{" "}
                  <span className={redCode}>AnalyticsJSON</span>
                  {`({});\n\n  `}
                  <span className={grayCode}>return</span>
                  {` (\n    <pre>\n      {`}
                  <span className={grayCode}>JSON</span>
                  {`.stringify(data, null, 2)}\n    </pre>\n  );\n}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Everything you need</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Track pageviews, unique visitors, top pages, daily stats, referrers,
          and custom events.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
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
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300"
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
    <div className="flex flex-col gap-2 p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary/20 transition-colors">
      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
