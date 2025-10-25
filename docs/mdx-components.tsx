import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

// Import individual components
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    // Default components
    ...defaultMdxComponents,

    // Custom components
    Accordion,
    Accordions,
    Callout,
    Card,
    Cards,
    Tab,
    Tabs,
    Step,
    Steps,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre> {/* [!code highlight] */}
      </CodeBlock>
    ),

    // User-provided components
    ...components,
  };
}
