import type { ReactNode } from 'react';

interface ListBlockProps {
  children: ReactNode;
  ordered?: boolean;
}

export function ListBlock({ children, ordered = false }: ListBlockProps) {
  return (
    <div className="not-prose my-4">
      {ordered ? (
        <ol className="list-decimal pl-6 space-y-2 marker:text-primary marker:font-semibold [&>li]:leading-relaxed [&>li]:text-foreground/90">
          {children}
        </ol>
      ) : (
        <ul className="list-disc pl-6 space-y-2 marker:text-primary [&>li]:leading-relaxed [&>li]:text-foreground/90">
          {children}
        </ul>
      )}
    </div>
  );
}

interface ListItemProps {
  children: ReactNode;
}

export function ListItem({ children }: ListItemProps) {
  return <li>{children}</li>;
}

interface ChecklistItemProps {
  children: ReactNode;
  checked?: boolean;
}

export function ChecklistItem({ children, checked = false }: ChecklistItemProps) {
  return (
    <li className="flex items-start gap-3">
      <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
        checked ? 'bg-primary border-primary' : 'border-muted-foreground/30'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={checked ? 'text-muted-foreground line-through' : ''}>{children}</span>
    </li>
  );
}
