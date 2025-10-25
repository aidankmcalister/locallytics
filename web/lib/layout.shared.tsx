import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Origami } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Origami strokeWidth={1.5} />
          <span className="font-medium font-mono text-lg tracking-tighter">
            Locallytics
          </span>
        </>
      ),
    },
  };
}
