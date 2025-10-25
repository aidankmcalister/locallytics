import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Locallytics",
  description: "Analytics that live with your app.",
  openGraph: {
    title: "Locallytics",
    description: "Analytics that live with your app.",
    siteName: "Locallytics",
  },
};

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
