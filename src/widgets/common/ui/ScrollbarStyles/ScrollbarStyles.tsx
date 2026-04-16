import { useEffect } from 'react';
import { useSettingsStore } from '@/shared/lib/stores/settingsStore';

const colorMap: Record<string, string> = {
  default: '#1a1a1a',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f97316',
  pink: '#ec4899',
  red: '#ef4444',
};

export function ScrollbarStyles() {
  const accentColor = useSettingsStore((state) => state.accentColor);

  useEffect(() => {
    const color = colorMap[accentColor] || colorMap.default;
    document.documentElement.style.setProperty('--accent', color);
  }, [accentColor]);

  return null;
}
