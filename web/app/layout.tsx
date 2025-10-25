import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Analytics />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
