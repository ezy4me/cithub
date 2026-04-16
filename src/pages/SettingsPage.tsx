import { motion } from 'framer-motion';
import { useSettingsStore, useProgressStore, useFavoritesStore } from '@/shared/lib/stores';
import type { Theme, AccentColor } from '@/shared/lib/stores/settingsStore';
import {
  SettingsAppearance,
  SettingsBehavior,
  SettingsCode,
  SettingsData,
  SettingsFooter,
} from '@/widgets/settings';

export function SettingsPage() {
  const {
    theme,
    accentColor,
    fontFamily,
    animationsEnabled,
    focusMode,
    codeBlockStyle,
    codeTheme,
    showLineNumbers,
    setTheme,
    setAccentColor,
    setFontFamily,
    setAnimationsEnabled,
    setFocusMode,
    setCodeBlockStyle,
    setCodeTheme,
    setShowLineNumbers,
    resetSettings,
  } = useSettingsStore();

  const { clearProgress } = useProgressStore();
  const { clearFavorites } = useFavoritesStore();

  const applyAccentColor = (color: AccentColor) => {
    const root = document.documentElement;
    root.classList.remove('theme-purple', 'theme-green', 'theme-orange', 'theme-pink', 'theme-red');
    if (color !== 'default') {
      root.classList.add(`theme-${color}`);
    }
  };

  const handleAccentColorChange = (color: AccentColor) => {
    setAccentColor(color);
    applyAccentColor(color);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const root = document.documentElement;
    root.classList.remove('dark');
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }
  };

  const handleClearProgress = () => {
    if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
      clearProgress();
    }
  };

  const handleClearFavorites = () => {
    if (confirm('Вы уверены, что хотите очистить избранное?')) {
      clearFavorites();
    }
  };

  const handleResetSettings = () => {
    if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
      resetSettings();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Настройки</h1>
        <p className="text-muted-foreground mb-6 sm:mb-8">
          Настройте внешний вид и поведение приложения
        </p>
      </motion.div>

      <div className="space-y-4 sm:space-y-6">
        <SettingsAppearance
          theme={theme}
          accentColor={accentColor}
          fontFamily={fontFamily}
          onThemeChange={handleThemeChange}
          onAccentColorChange={handleAccentColorChange}
          onFontFamilyChange={setFontFamily}
        />

        <SettingsBehavior
          animationsEnabled={animationsEnabled}
          focusMode={focusMode}
          onAnimationsChange={setAnimationsEnabled}
          onFocusModeChange={setFocusMode}
        />

        <SettingsCode
          showLineNumbers={showLineNumbers}
          codeBlockStyle={codeBlockStyle}
          codeTheme={codeTheme}
          onLineNumbersChange={setShowLineNumbers}
          onCodeBlockStyleChange={setCodeBlockStyle}
          onCodeThemeChange={setCodeTheme}
        />

        <SettingsData
          onClearProgress={handleClearProgress}
          onClearFavorites={handleClearFavorites}
          onResetSettings={handleResetSettings}
        />

        <SettingsFooter />
      </div>
    </div>
  );
}
