import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tabMode="navbar" tree={source.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
