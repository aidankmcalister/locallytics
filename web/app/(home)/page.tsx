import { CodeSnippet } from "@/components/CodeSnippet";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1 mx-auto max-w-2xl gap-4 items-center">
      <h1 className="text-4xl font-bold">Analytics that live with your app.</h1>
      <p className="text-lg font-extralight">
        Stop paying someone else to manage your analytics.
      </p>
      <CodeSnippet>npm i locallytics</CodeSnippet>
    </div>
  );
}
