import { Separator } from '@/components/ui/separator';

interface DividerBlockProps {
  children?: React.ReactNode;
}

export function DividerBlock({ children }: DividerBlockProps) {
  return (
    <div className="not-prose my-12 relative">
      <Separator className="my-8" />
      {children && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
          <span className="text-sm text-muted-foreground">{children}</span>
        </div>
      )}
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="not-prose my-12">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </div>
  );
}
