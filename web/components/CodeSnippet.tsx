"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeSnippet({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between font-mono text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-6 py-4 gap-6 w-fit cursor-default">
      <span className="text-neutral-800 dark:text-neutral-200">{children}</span>
      <button
        className="flex items-center justify-center cursor-pointer w-5 h-5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
