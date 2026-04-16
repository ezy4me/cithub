import type { AccentColor } from '@/shared/lib/stores/settingsStore';

export const accentColorMap: Record<AccentColor, string> = {
  default: '#1a1a1a',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f97316',
  pink: '#ec4899',
  red: '#ef4444',
};

export function getAccentColor(color: AccentColor): string {
  return accentColorMap[color] || accentColorMap.default;
}
