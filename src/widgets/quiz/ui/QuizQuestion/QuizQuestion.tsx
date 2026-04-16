import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { QuizQuestion as QuizQuestionType } from '@/entities/subject';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | string[];
  showExplanation: boolean;
  inputValue: string;
  onSelectAnswer: (answer: string | string[]) => void;
  onNext: () => void;
  onInputChange: (value: string) => void;
  onGoBack: () => void;
  isFirstQuestion: boolean;
}

export function QuizQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  inputValue,
  onSelectAnswer,
  onNext,
  onInputChange,
  onGoBack,
  isFirstQuestion,
}: QuizQuestionProps) {
  const checkAnswer = (q: QuizQuestionType, answer: string | string[]): boolean => {
    if (Array.isArray(q.correctAnswer)) {
      if (!Array.isArray(answer)) return false;
      const sortedCorrect = [...q.correctAnswer].sort();
      const sortedAnswer = [...answer].sort();
      return sortedCorrect.length === sortedAnswer.length && 
             sortedCorrect.every((v, i) => v === sortedAnswer[i]);
    }
    return answer === q.correctAnswer;
  };

  const handleSingleChoice = (option: string) => {
    onSelectAnswer(option);
  };

  const handleMultipleChoice = (option: string) => {
    if (Array.isArray(selectedAnswer)) {
      if (selectedAnswer.includes(option)) {
        onSelectAnswer(selectedAnswer.filter((o) => o !== option));
      } else {
        onSelectAnswer([...selectedAnswer, option]);
      }
    } else {
      onSelectAnswer([option]);
    }
  };

  const isCorrect = checkAnswer(question, selectedAnswer);
  const isAnswerSelected = selectedAnswer !== '' && 
    (!Array.isArray(selectedAnswer) || selectedAnswer.length > 0);

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 sm:p-8">
        <h2 className="text-base sm:text-xl font-semibold mb-4 sm:mb-6">
          {question.question}
        </h2>

        {question.type === 'input' ? (
          <div className="space-y-3 sm:space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Введите ваш ответ..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={showExplanation}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !showExplanation && isAnswerSelected) {
                  onNext();
                }
              }}
            />
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 sm:p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  )}
                  <span className="font-medium text-sm sm:text-base" style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>
                    {isCorrect ? 'Верно!' : 'Неверно'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Правильный ответ: <span className="font-medium text-foreground">{question.correctAnswer}</span>
                </p>
                {question.explanation && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">{question.explanation}</p>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(selectedAnswer) 
                ? selectedAnswer.includes(option)
                : selectedAnswer === option;
              
              let optionClass = 'border-border hover:border-primary/50 hover:bg-muted/50';
              
              if (showExplanation) {
                const isCorrectOption = Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.includes(option)
                  : question.correctAnswer === option;
                
                if (isCorrectOption) {
                  optionClass = 'border-green-500 bg-green-500/10';
                } else if (isSelected && !isCorrectOption) {
                  optionClass = 'border-red-500 bg-red-500/10';
                }
              } else if (isSelected) {
                optionClass = 'border-primary bg-primary/10';
              }

              return (
                <button
                  key={option}
                  onClick={() => {
                    if (showExplanation) return;
                    if (question.type === 'single') {
                      handleSingleChoice(option);
                    } else {
                      handleMultipleChoice(option);
                    }
                  }}
                  disabled={showExplanation}
                  className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-foreground" />}
                    </div>
                    <span className="font-medium text-sm sm:text-base">{option}</span>
                  </div>
                </button>
              );
            })}

            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 rounded-lg bg-muted/50 mt-3 sm:mt-4"
              >
                <p className="text-xs sm:text-sm text-muted-foreground">{question.explanation}</p>
              </motion.div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            disabled={isFirstQuestion}
            className="gap-1 sm:gap-2 text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Назад</span>
          </Button>

          {!showExplanation && (
            <Button
              onClick={onNext}
              disabled={!isAnswerSelected}
              className="text-sm"
            >
              {questionNumber < totalQuestions - 1 ? 'Далее' : 'Завершить'}
              <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
