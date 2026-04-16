import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SettingsFooter() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg">Сделано с любовью для студентов</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Cithub — образовательная платформа от MRS. Создано для упрощения доступа к учебным материалам и сделать обучение современным и удобным.
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 sm:pt-4 border-t border-primary/20">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
            © 2026 MRS Education • Все права защищены
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
