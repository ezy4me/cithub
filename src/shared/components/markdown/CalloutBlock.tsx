import type { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type CalloutType = 'tip' | 'warning' | 'info' | 'success' | 'error';

interface CalloutBlockProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<CalloutType, { icon: React.ComponentType<{ className?: string }>; bg: string; border: string; iconColor: string; titleColor: string }> = {
  tip: {
    icon: Lightbulb,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    iconColor: 'text-orange-500',
    titleColor: 'text-orange-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-500',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    iconColor: 'text-green-500',
    titleColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    iconColor: 'text-red-500',
    titleColor: 'text-red-500',
  },
};

const defaultTitles: Record<CalloutType, string> = {
  tip: 'Совет',
  warning: 'Внимание',
  info: 'Информация',
  success: 'Успех',
  error: 'Ошибка',
};

export function CalloutBlock({ type = 'info', title, children }: CalloutBlockProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'not-prose my-6 rounded-lg border p-4',
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconColor)} />
        <div className="flex-1 min-w-0">
          {(title || defaultTitles[type]) && (
            <p className={cn('font-semibold mb-2', config.titleColor)}>
              {title || defaultTitles[type]}
            </p>
          )}
          <div className="text-foreground/90 text-sm leading-relaxed [&>p]:my-2 [&>p:last-child]:mb-0 [&>p:first-child]:mt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
