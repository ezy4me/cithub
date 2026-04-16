import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Frown, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QuizResultProps {
  isPassed: boolean;
  scorePercent: number;
  correctAnswers: number;
  totalQuestions: number;
  onRetry: () => void;
}

export function QuizResult({
  isPassed,
  scorePercent,
  correctAnswers,
  totalQuestions,
  onRetry,
}: QuizResultProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4 overflow-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-lg w-full mx-4 my-8"
      >
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <AnimatePresence mode="wait">
              {isPassed ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.4, stiffness: 200 }}
                    >
                      <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-1 sm:mb-2">Отлично!</h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">Вы прошли тест!</p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="fail"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <motion.div
                      initial={{ rotate: -10 }}
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Frown className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500" />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1 sm:mb-2">Неудача</h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">Попробуйте ещё раз!</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-4 sm:mb-6"
            >
              <div className="text-4xl sm:text-5xl font-bold mb-1 sm:mb-2" style={{ color: isPassed ? '#22c55e' : '#f97316' }}>
                {scorePercent}%
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                Правильных ответов: {correctAnswers} из {totalQuestions}
              </p>
            </motion.div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-center">
              <Button onClick={onRetry} variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <RotateCcw className="h-4 w-4" />
                Пройти заново
              </Button>
              <Link to="/subjects" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="gap-2 w-full">
                  <Home className="h-4 w-4" />
                  На главную
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
