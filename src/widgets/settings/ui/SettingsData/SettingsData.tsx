import { Trash2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SettingsDataProps {
  onClearProgress: () => void;
  onClearFavorites: () => void;
  onResetSettings: () => void;
}

export function SettingsData({
  onClearProgress,
  onClearFavorites,
  onResetSettings,
}: SettingsDataProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Trash2 className="h-5 w-5" />
          Данные обучения
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Сброс прогресса и избранного
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex-1">
            <Label className="text-sm sm:text-base">Сбросить прогресс</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Все лекции будут отмечены как не просмотренные
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearProgress}
            className="whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Сбросить</span>
            <span className="sm:hidden">Сброс</span>
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex-1">
            <Label className="text-sm sm:text-base">Очистить избранное</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Удалить все сохранённые лекции
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFavorites}
            className="whitespace-nowrap"
          >
            <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
            Очистить
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex-1">
            <Label className="text-sm sm:text-base">Сбросить все настройки</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Вернуть настройки по умолчанию
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetSettings}
            className="whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Сбросить всё</span>
            <span className="sm:hidden">Сброс</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
