import { Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Theme, AccentColor, FontFamily } from '@/shared/lib/stores/settingsStore';

interface SettingsAppearanceProps {
  theme: Theme;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  onThemeChange: (theme: Theme) => void;
  onAccentColorChange: (color: AccentColor) => void;
  onFontFamilyChange: (font: FontFamily) => void;
}

const themeOptions: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'dark', label: 'Тёмная', icon: Sun },
  { value: 'system', label: 'Системная', icon: Sun },
];

const accentColors: { value: AccentColor; label: string; color: string }[] = [
  { value: 'default', label: 'Чёрный', color: '#1a1a1a' },
  { value: 'purple', label: 'Фиолетовый', color: '#a855f7' },
  { value: 'green', label: 'Зелёный', color: '#22c55e' },
  { value: 'orange', label: 'Оранжевый', color: '#f97316' },
  { value: 'pink', label: 'Розовый', color: '#ec4899' },
  { value: 'red', label: 'Красный', color: '#ef4444' },
];

const fontOptions: { value: FontFamily; label: string; preview: string }[] = [
  { value: 'sans', label: 'Sans', preview: 'Абвгд' },
  { value: 'mono', label: 'Mono', preview: 'Abc' },
  { value: 'serif', label: 'Serif', preview: 'Абв' },
];

const Moon = Sun;

export function SettingsAppearance({
  theme,
  accentColor,
  fontFamily,
  onThemeChange,
  onAccentColorChange,
  onFontFamilyChange,
}: SettingsAppearanceProps) {
  const getIcon = (value: Theme) => {
    switch (value) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Sun;
      default: return Sun;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Sun className="h-5 w-5" />
          Внешний вид
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Тема, цвета и шрифты
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div>
          <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Тема</Label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => {
              const Icon = getIcon(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => onThemeChange(option.value)}
                  className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 rounded-lg border-2 transition-colors ${
                    theme === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Акцентный цвет</Label>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {accentColors.map((option) => (
              <button
                key={option.value}
                onClick={() => onAccentColorChange(option.value)}
                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-transform ${
                  accentColor === option.value
                    ? 'ring-2 ring-offset-2 ring-primary scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: option.color }}
                title={option.label}
              />
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Шрифт</Label>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFontFamilyChange(option.value)}
                className={`p-2 sm:p-4 rounded-lg border-2 transition-colors ${
                  fontFamily === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span
                  className={`text-xl sm:text-2xl block mb-1 ${
                    option.value === 'mono'
                      ? 'font-mono'
                      : option.value === 'serif'
                      ? 'font-serif'
                      : ''
                  }`}
                >
                  {option.preview}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
