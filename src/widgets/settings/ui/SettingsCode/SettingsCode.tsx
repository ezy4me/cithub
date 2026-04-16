import { Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { CodeTheme, CodeBlockStyle } from '@/shared/lib/stores/settingsStore';

interface SettingsCodeProps {
  showLineNumbers: boolean;
  codeBlockStyle: CodeBlockStyle;
  codeTheme: CodeTheme;
  onLineNumbersChange: (show: boolean) => void;
  onCodeBlockStyleChange: (style: CodeBlockStyle) => void;
  onCodeThemeChange: (theme: CodeTheme) => void;
}

const codeThemeOptions: { value: CodeTheme; label: string; preview: string }[] = [
  { value: 'dracula', label: 'Dracula', preview: 'fn()' },
  { value: 'github', label: 'Atom', preview: 'fn()' },
  { value: 'monokai', label: 'Monokai', preview: 'fn()' },
  { value: 'nord', label: 'Nord', preview: 'fn()' },
];

const codeThemeColors: Record<CodeTheme, { bg: string; text: string }> = {
  dracula: { bg: '#282a36', text: '#f8f8f2' },
  github: { bg: '#212122', text: '#e8e8e8' },
  monokai: { bg: '#272822', text: '#f8f8f2' },
  nord: { bg: '#2e3440', text: '#eceff4' },
};

const blockStyles: { value: CodeBlockStyle; label: string }[] = [
  { value: 'default', label: 'Обычный' },
  { value: 'minimal', label: 'Минимальный' },
  { value: 'bordered', label: 'С рамкой' },
];

export function SettingsCode({
  showLineNumbers,
  codeBlockStyle,
  codeTheme,
  onLineNumbersChange,
  onCodeBlockStyleChange,
  onCodeThemeChange,
}: SettingsCodeProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Code className="h-5 w-5" />
          Код
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Стиль отображения блоков кода
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Label className="text-sm sm:text-base">Номера строк</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Показывать номера строк в коде
            </p>
          </div>
          <Switch
            checked={showLineNumbers}
            onCheckedChange={onLineNumbersChange}
          />
        </div>

        <Separator />

        <div>
          <Label className="mb-2 block text-sm sm:text-base">Стиль блоков кода</Label>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
            {blockStyles.map((option) => (
              <button
                key={option.value}
                onClick={() => onCodeBlockStyleChange(option.value)}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                  codeBlockStyle === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="mb-2 block text-sm sm:text-base">Тема подсветки кода</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {codeThemeOptions.map((option) => {
              const colors = codeThemeColors[option.value];
              return (
                <button
                  key={option.value}
                  onClick={() => onCodeThemeChange(option.value)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                    codeTheme === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className="h-6 sm:h-8 rounded flex items-center justify-center mb-1 sm:mb-2"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <span
                      className="text-[10px] sm:text-xs font-mono"
                      style={{ color: colors.text }}
                    >
                      {option.preview}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
