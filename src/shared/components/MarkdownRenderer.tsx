import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { useSettingsStore } from "@/shared/lib/stores";
import {
  CodeBlock,
  ImageBlock,
  QuoteBlock,
  TableBlock,
  SectionDivider,
  ListBlock,
  ListItem,
  ParagraphBlock,
  HeadingBlock,
} from "./markdown";
import { CalloutBlock } from "./markdown/CalloutBlock";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function isDefinitionBlock(children: React.ReactNode): boolean {
  if (typeof children !== "string") return false;
  return /^\*\*[^*]+\*\*\s*[—–-]\s*/.test(children);
}

function isCalloutBlock(
  children: React.ReactNode,
): { type: string; title?: string } | null {
  if (typeof children !== "string") return null;
  const match = children.match(
    /^\[!(TIP|WARNING|INFO|SUCCESS|ERROR|NOTE)\]\s*(.*)$/i,
  );
  if (match) {
    return {
      type: match[1].toLowerCase(),
      title: match[2] || undefined,
    };
  }
  return null;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const { showLineNumbers, codeBlockStyle } = useSettingsStore();

  const components: Components = {
    h1: ({ children }) => <HeadingBlock level={1}>{children}</HeadingBlock>,
    h2: ({ children }) => <HeadingBlock level={2}>{children}</HeadingBlock>,
    h3: ({ children }) => <HeadingBlock level={3}>{children}</HeadingBlock>,
    h4: ({ children }) => <HeadingBlock level={4}>{children}</HeadingBlock>,
    h5: ({ children }) => <HeadingBlock level={5}>{children}</HeadingBlock>,
    h6: ({ children }) => <HeadingBlock level={6}>{children}</HeadingBlock>,

    p: ({ children, node }) => {
      if (isDefinitionBlock(children)) {
        return <QuoteBlock isDefinition>{children}</QuoteBlock>;
      }

      const hasOnlyImage =
        node?.children?.length === 1 &&
        node.children[0]?.type === "element" && 
        node.children[0]?.tagName === "img";

      if (hasOnlyImage) {
        return <>{children}</>;
      }

      return <ParagraphBlock>{children}</ParagraphBlock>;
    },

    blockquote: ({ children }) => {
      const calloutInfo = isCalloutBlock(children as React.ReactNode);
      if (calloutInfo) {
        const typeMap: Record<
          string,
          "tip" | "warning" | "info" | "success" | "error"
        > = {
          tip: "tip",
          note: "info",
          info: "info",
          warning: "warning",
          success: "success",
          error: "error",
        };
        return (
          <CalloutBlock
            type={typeMap[calloutInfo.type] || "info"}
            title={calloutInfo.title}>
            {children}
          </CalloutBlock>
        );
      }
      return <QuoteBlock>{children}</QuoteBlock>;
    },

    code: ({ className: codeClass, children }) => {
      const isInline =
        !codeClass &&
        typeof children === "string" &&
        !String(children).includes("\n");

      if (isInline) {
        return (
          <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
            {children}
          </code>
        );
      }

      const match = /language-(\w+)/.exec(codeClass || "");
      const lang = match ? match[1] : "";

      const codeString =
        typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children.join("")
            : String(children);

      return (
        <CodeBlock
          language={lang}
          showLineNumbers={showLineNumbers}
          style={codeBlockStyle}>
          {codeString}
        </CodeBlock>
      );
    },

    pre: ({ children }) => <>{children}</>,

    img: ({ src, alt, title }) => (
      <ImageBlock src={src || ""} alt={alt || ""} title={title} />
    ),

    table: ({ children }) => <TableBlock>{children}</TableBlock>,

    thead: ({ children }) => (
      <thead className="bg-muted/70 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:whitespace-nowrap">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border [&_tr]:hover:bg-muted/30 [&_td]:px-4 [&_td]:py-2.5 [&_td]:whitespace-nowrap">
        {children}
      </tbody>
    ),
    tr: ({ children }) => <tr className="transition-colors">{children}</tr>,
    th: ({ children }) => <th>{children}</th>,
    td: ({ children }) => <td className="text-foreground/90">{children}</td>,

    ul: ({ children }) => <ListBlock>{children}</ListBlock>,
    ol: ({ children }) => <ListBlock ordered>{children}</ListBlock>,
    li: ({ children }) => <ListItem>{children}</ListItem>,

    hr: () => <SectionDivider />,

    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    ),

    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
