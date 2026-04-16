import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SettingsBehaviorProps {
  animationsEnabled: boolean;
  focusMode: boolean;
  onAnimationsChange: (enabled: boolean) => void;
  onFocusModeChange: (enabled: boolean) => void;
}

export function SettingsBehavior({
  animationsEnabled,
  focusMode,
  onAnimationsChange,
  onFocusModeChange,
}: SettingsBehaviorProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Sparkles className="h-5 w-5" />
          Поведение
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Анимации и интерфейс
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Label className="text-sm sm:text-base">Анимации</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Плавные переходы и эффекты
            </p>
          </div>
          <Switch
            checked={animationsEnabled}
            onCheckedChange={onAnimationsChange}
          />
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Label className="text-sm sm:text-base">Режим фокуса</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Скрывает боковую панель
            </p>
          </div>
          <Switch
            checked={focusMode}
            onCheckedChange={onFocusModeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
