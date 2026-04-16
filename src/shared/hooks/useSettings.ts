import { useEffect } from 'react';
import { useSettingsStore } from '@/shared/lib/stores';

export function useSettings() {
  const settings = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    // Theme
    root.classList.remove('dark');
    if (settings.theme === 'dark' || 
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }

    // Accent color
    root.classList.remove('theme-purple', 'theme-green', 'theme-orange', 'theme-pink', 'theme-red');
    if (settings.accentColor !== 'default') {
      root.classList.add(`theme-${settings.accentColor}`);
    }

    // Font family
    root.style.setProperty('--font-sans', 
      settings.fontFamily === 'mono' ? "'Fira Code', monospace" :
      settings.fontFamily === 'serif' ? "'Georgia', serif" :
      "'Inter', system-ui, sans-serif"
    );

  }, [settings.theme, settings.accentColor, settings.fontFamily]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('dark');
      if (settings.theme === 'system' && mediaQuery.matches) {
        root.classList.add('dark');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  return settings;
}
