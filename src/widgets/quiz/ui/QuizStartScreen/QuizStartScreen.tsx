import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import type { Quiz } from '@/entities/subject';

interface QuizStartScreenProps {
  quiz: Quiz;
  onStart: () => void;
  onBack: () => void;
}

export function QuizStartScreen({ quiz, onStart, onBack }: QuizStartScreenProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full mx-4">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
            Проверьте свои знания! {quiz.questions.length} вопросов.
            <br />
            Для прохождения нужно набрать минимум 70%.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-center">
            <Button onClick={onStart} size="lg" className="gap-2 w-full sm:w-auto">
              Начать тест
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onBack} className="gap-2 w-full sm:w-auto">
              Назад
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
