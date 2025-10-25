import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { Origami } from "lucide-react";
import Image from "next/image";
import npmLogo from "@/public/npm.svg";
import xLogo from "@/public/x.svg";
import githubLogo from "@/public/github.svg";

export const links: LinkItemType[] = [
  {
    text: "Docs",
    url: "/docs",
    active: "nested-url",
  },
  {
    text: "NPM",
    icon: <Image src={npmLogo} alt="npm" className="size-5 dark:invert" />,
    label: "NPM",
    type: "icon",
    url: "https://www.npmjs.com/package/locallytics",
    external: true,
    secondary: true,
  },
  {
    text: "X",
    icon: <Image src={xLogo} alt="x" className="size-5 dark:invert" />,
    label: "X",
    type: "icon",
    url: "https://x.com/aidankmcalister",
    external: true,
    secondary: true,
  },
  {
    text: "GitHub",
    icon: (
      <Image src={githubLogo} alt="github" className="size-5 dark:invert" />
    ),
    label: "GitHub",
    type: "icon",
    url: "https://github.com/aidankmcalister/locallytics",
    external: true,
    secondary: true,
  },
];

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
    links: links,
  };
}
