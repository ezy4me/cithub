import { useState, useMemo, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizzes } from '@/data';
import type { QuizQuestion } from '@/entities/subject';
import { QuizProgress } from '@/widgets/quiz/ui/QuizProgress';
import { QuizStartScreen } from '@/widgets/quiz/ui/QuizStartScreen';
import { QuizQuestionCard } from '@/widgets/quiz/ui/QuizQuestion';
import { QuizResult } from '@/widgets/quiz/ui/QuizResult';

type QuizState = 'not_started' | 'in_progress' | 'completed';

interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
}

export function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const quiz = useMemo(() => quizzes.find((q) => q.id === id), [id]);

  const [state, setState] = useState<QuizState>('not_started');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [inputValue, setInputValue] = useState('');

  if (!quiz) {
    return <Navigate to="/subjects" replace />;
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassed = scorePercent >= 70;

  const checkAnswer = useCallback((q: QuizQuestion, answer: string | string[]): boolean => {
    if (Array.isArray(q.correctAnswer)) {
      if (!Array.isArray(answer)) return false;
      const sortedCorrect = [...q.correctAnswer].sort();
      const sortedAnswer = [...answer].sort();
      return sortedCorrect.length === sortedAnswer.length && 
             sortedCorrect.every((v, i) => v === sortedAnswer[i]);
    }
    return answer === q.correctAnswer;
  }, []);

  const handleStart = useCallback(() => {
    setState('in_progress');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowExplanation(false);
    setInputValue('');
  }, []);

  const handleNext = useCallback(() => {
    const isCorrect = checkAnswer(question, selectedAnswer);
    const newAnswers = [...answers, { questionId: question.id, answer: selectedAnswer, isCorrect }];
    setAnswers(newAnswers);
    setShowExplanation(true);

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
        setShowExplanation(false);
        setInputValue('');
      }, 1500);
    } else {
      setTimeout(() => {
        setState('completed');
      }, 1500);
    }
  }, [question, selectedAnswer, answers, currentQuestion, totalQuestions, checkAnswer]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setSelectedAnswer(value.toLowerCase().trim());
  }, []);

  if (state === 'not_started') {
    return (
      <QuizStartScreen
        quiz={quiz}
        onStart={handleStart}
        onBack={() => navigate(-1)}
      />
    );
  }

  if (state === 'completed') {
    return (
      <QuizResult
        isPassed={isPassed}
        scorePercent={scorePercent}
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
        onRetry={handleStart}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-auto">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
            >
              <QuizQuestionCard
                question={question}
                questionNumber={currentQuestion}
                totalQuestions={totalQuestions}
                selectedAnswer={selectedAnswer}
                showExplanation={showExplanation}
                inputValue={inputValue}
                onSelectAnswer={setSelectedAnswer}
                onNext={handleNext}
                onInputChange={handleInputChange}
                onGoBack={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                isFirstQuestion={currentQuestion === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
