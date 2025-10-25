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
    <div className="flex items-center justify-between font-mono border rounded-md p-4 gap-4 w-fit cursor-default">
      {children}
      <button
        className="flex items-center gap-2 cursor-pointer w-5 h-5"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="text-green-500" />
        ) : (
          <Copy className="hover:scale-105 hover:rotate-12 transition-all" />
        )}
      </button>
    </div>
  );
}
