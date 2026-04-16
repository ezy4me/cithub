import type { ReactNode, ElementType } from 'react';
import { cn } from '@/shared/lib/utils';

interface ParagraphBlockProps {
  children: ReactNode;
}

export function ParagraphBlock({ children }: ParagraphBlockProps) {
  return (
    <p className="my-4 leading-relaxed text-foreground/90">
      {children}
    </p>
  );
}

interface HeadingProps {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  as?: ElementType;
}

const headingStyles = {
  1: 'text-3xl font-bold tracking-tight mb-6 mt-10 text-foreground relative',
  2: 'text-2xl font-semibold tracking-tight mb-4 mt-8 text-foreground group',
  3: 'text-xl font-semibold mb-3 mt-6 text-foreground group',
  4: 'text-lg font-medium mb-2 mt-4 text-foreground',
  5: 'text-base font-medium mb-2 mt-4 text-foreground',
  6: 'text-sm font-medium mb-2 mt-4 text-foreground',
};

const headingAccents = {
  1: 'before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-primary before:rounded-full',
  2: 'pl-4 border-l-2 border-primary/30 group-hover:border-primary transition-colors',
  3: 'pl-4 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors',
  4: '',
  5: '',
  6: '',
};

export function HeadingBlock({ children, level, id, as: Component = `h${level}` }: HeadingProps) {
  return (
    <Component id={id} className={cn(headingStyles[level], headingAccents[level])}>
      {children}
    </Component>
  );
}

interface TextSpanProps {
  children: ReactNode;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

export function TextSpan({ children, bold = false, italic = false, code = false }: TextSpanProps) {
  const className = [
    bold && 'font-semibold',
    italic && 'italic',
    code && 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
  ].filter(Boolean).join(' ');

  return <span className={className}>{children}</span>;
}
