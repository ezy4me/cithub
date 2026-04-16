import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type AccentColor = 'default' | 'purple' | 'green' | 'orange' | 'pink' | 'red';
export type FontFamily = 'sans' | 'mono' | 'serif';
export type CodeBlockStyle = 'default' | 'minimal' | 'bordered';
export type CodeTheme = 'github' | 'dracula' | 'monokai' | 'nord';

interface SettingsState {
  theme: Theme;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  animationsEnabled: boolean;
  focusMode: boolean;
  codeBlockStyle: CodeBlockStyle;
  codeTheme: CodeTheme;
  showLineNumbers: boolean;
  autoNextLecture: boolean;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontFamily: (font: FontFamily) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setFocusMode: (enabled: boolean) => void;
  setCodeBlockStyle: (style: CodeBlockStyle) => void;
  setCodeTheme: (theme: CodeTheme) => void;
  setShowLineNumbers: (show: boolean) => void;
  setAutoNextLecture: (auto: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  theme: 'system' as Theme,
  accentColor: 'default' as AccentColor,
  fontFamily: 'sans' as FontFamily,
  animationsEnabled: true,
  focusMode: false,
  codeBlockStyle: 'default' as CodeBlockStyle,
  codeTheme: 'dracula' as CodeTheme,
  showLineNumbers: false,
  autoNextLecture: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setFocusMode: (focusMode) => set({ focusMode }),
      setCodeBlockStyle: (codeBlockStyle) => set({ codeBlockStyle }),
      setCodeTheme: (codeTheme) => set({ codeTheme }),
      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
      setAutoNextLecture: (autoNextLecture) => set({ autoNextLecture }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'cithub-settings',
    }
  )
);
