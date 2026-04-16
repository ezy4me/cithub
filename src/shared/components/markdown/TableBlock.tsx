import type { ReactNode } from 'react';

interface TableBlockProps {
  caption?: string;
  children: ReactNode;
}

export function TableBlock({ caption, children }: TableBlockProps) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border">
      {caption && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border text-sm font-medium text-foreground">
          {caption}
        </div>
      )}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="bg-muted/70">
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  isHeader?: boolean;
}

export function TableRow({ children }: TableRowProps) {
  return <tr className="hover:bg-muted/30 transition-colors">{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
}

export function TableCell({ children, isHeader = false }: TableCellProps) {
  if (isHeader) {
    return (
      <th className="px-4 py-2.5 text-left font-semibold text-foreground whitespace-nowrap">
        {children}
      </th>
    );
  }
  return (
    <td className="px-4 py-2.5 text-foreground/90 whitespace-nowrap">
      {children}
    </td>
  );
}
