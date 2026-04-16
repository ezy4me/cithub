import type { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';

interface QuoteBlockProps {
  children: ReactNode;
  isDefinition?: boolean;
  term?: string;
}

function cleanCalloutContent(children: ReactNode): ReactNode {
  if (typeof children === 'string') {
    return children.replace(/^\[!(TIP|WARNING|INFO|SUCCESS|ERROR|NOTE)\]\s*/i, '');
  }
  if (Array.isArray(children)) {
    return children.map((child) => {
      if (typeof child === 'string') {
        return child.replace(/^\[!(TIP|WARNING|INFO|SUCCESS|ERROR|NOTE)\]\s*/i, '');
      }
      return child;
    });
  }
  return children;
}

export function QuoteBlock({ children, isDefinition = false, term }: QuoteBlockProps) {
  if (isDefinition && term) {
    return (
      <div className="not-prose my-6 p-5 rounded-lg border-l-4 bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground mb-1">
              <strong>{term}</strong>
            </div>
            <div className="text-foreground/90 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <blockquote className="not-prose my-6 pl-5 py-3 border-l-4 border-primary/30 italic text-foreground/80 bg-primary/5 rounded-r-lg">
      {cleanCalloutContent(children)}
    </blockquote>
  );
}
