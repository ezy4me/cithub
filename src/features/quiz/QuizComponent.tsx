import { useState } from 'react';
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { quizzes } from '@/data';
import type { Quiz, QuizQuestion } from '@/entities/subject';
import { cn } from '@/shared/lib/utils';

interface QuizComponentProps {
  lectureId: string;
}

export function QuizComponent({ lectureId }: QuizComponentProps) {
  const quiz = quizzes.find((q) => q.lectureId === lectureId);

  if (!quiz) {
    return null;
  }

  return <QuizView quiz={quiz} />;
}

interface QuizViewProps {
  quiz: Quiz;
}

function QuizView({ quiz }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;

  const handleSingleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleMultipleAnswer = (value: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[question.id] as string[]) || [];
      if (checked) {
        return { ...prev, [question.id]: [...current, value] };
      } else {
        return { ...prev, [question.id]: current.filter((v) => v !== value) };
      }
    });
  };

  const handleInputAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const checkAnswer = (q: QuizQuestion, userAnswer: string | string[] | undefined): boolean => {
    if (!userAnswer) return false;

    if (Array.isArray(q.correctAnswer)) {
      if (!Array.isArray(userAnswer)) return false;
      return (
        q.correctAnswer.length === userAnswer.length &&
        q.correctAnswer.every((a) => userAnswer.includes(a))
      );
    }

    if (Array.isArray(userAnswer)) {
      return userAnswer.length === 1 && userAnswer[0] === q.correctAnswer;
    }

    return userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
  };

  const getScore = () => {
    return quiz.questions.filter((q) => checkAnswer(q, answers[q.id])).length;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const isAnswerCorrect = (q: QuizQuestion) => checkAnswer(q, answers[q.id]);
  const hasAnswer = answers[question.id] !== undefined && 
    (Array.isArray(answers[question.id]) ? (answers[question.id] as string[]).length > 0 : answers[question.id] !== '');

  if (showResults) {
    const score = getScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Результаты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <div
              className={cn(
                'text-4xl font-bold mb-2',
                percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'
              )}
            >
              {percentage}%
            </div>
            <p className="text-muted-foreground">
              {score} из {totalQuestions} правильных ответов
            </p>
          </div>

          <div className="space-y-3">
            {quiz.questions.map((q, index) => (
              <div
                key={q.id}
                className={cn(
                  'p-4 rounded-lg border',
                  isAnswerCorrect(q) ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'
                )}
              >
                <div className="flex items-start gap-3">
                  {isAnswerCorrect(q) ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-1">
                      {index + 1}. {q.question}
                    </p>
                    {!isAnswerCorrect(q) && q.explanation && (
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleRetry} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Пройти ещё раз
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <Badge variant="secondary">
            {currentQuestion + 1} / {totalQuestions}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className={cn(
                question.type === 'single' && 'bg-blue-500/10 text-blue-500 border-blue-500',
                question.type === 'multiple' && 'bg-purple-500/10 text-purple-500 border-purple-500',
                question.type === 'input' && 'bg-green-500/10 text-green-500 border-green-500'
              )}
            >
              {question.type === 'single' && 'Один ответ'}
              {question.type === 'multiple' && 'Несколько ответов'}
              {question.type === 'input' && 'Ввод'}
            </Badge>
            <p className="font-medium">{question.question}</p>
          </div>

          {question.type === 'single' && question.options && (
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSingleAnswer(option)}
                  className={cn(
                    'w-full p-4 rounded-lg border text-left transition-colors',
                    answers[question.id] === option
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="space-y-2">
              {question.options.map((option) => {
                const selected = ((answers[question.id] as string[]) || []).includes(option);
                return (
                  <label
                    key={option}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                      selected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => handleMultipleAnswer(option, e.target.checked)}
                      className="h-5 w-5 rounded border-primary text-primary focus:ring-primary"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === 'input' && (
            <Input
              placeholder="Введите ответ..."
              value={(answers[question.id] as string) || ''}
              onChange={(e) => handleInputAnswer(e.target.value)}
              className="text-lg"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((c) => c - 1)}
            disabled={currentQuestion === 0}
          >
            Назад
          </Button>

          {currentQuestion < totalQuestions - 1 ? (
            <Button
              onClick={() => setCurrentQuestion((c) => c + 1)}
              disabled={!hasAnswer}
            >
              Далее
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!hasAnswer}>
              Завершить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
