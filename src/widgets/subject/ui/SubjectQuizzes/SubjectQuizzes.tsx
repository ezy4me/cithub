import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Subject, Quiz } from '@/entities/subject';

interface SubjectQuizzesProps {
  subject: Subject;
  quizzes: Quiz[];
}

export function SubjectQuizzes({ subject, quizzes }: SubjectQuizzesProps) {
  if (quizzes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="h-5 w-5" style={{ color: subject.color }} />
        <h2 className="text-lg font-semibold">Тесты</h2>
        <Badge variant="secondary" className="ml-auto">
          {quizzes.length}
        </Badge>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div 
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: subject.color + '20' }}
                >
                  <BrainCircuit className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: subject.color }} />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium text-sm sm:text-base truncate">{quiz.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {quiz.questions.length} вопросов
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
