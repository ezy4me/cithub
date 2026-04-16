import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizProgress({ currentQuestion, totalQuestions }: QuizProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <header className="bg-card border-b border-border px-3 sm:px-4 py-2 sm:py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link to="/subjects" className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{currentQuestion + 1}</span>
          <span className="text-muted-foreground">/</span>
          <span>{totalQuestions}</span>
        </div>
        <div className="w-7" />
      </div>
      <div className="max-w-2xl mx-auto mt-2 sm:mt-3">
        <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </header>
  );
}
