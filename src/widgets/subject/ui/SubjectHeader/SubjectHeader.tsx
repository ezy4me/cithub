import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import type { Subject } from '@/entities/subject';

interface SubjectHeaderProps {
  subject: Subject;
  progress: number;
}

export function SubjectHeader({ subject, progress }: SubjectHeaderProps) {
  const totalMaterials = subject.lectureIds.length + subject.practiceIds.length + subject.labIds.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link
        to="/subjects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Все предметы
      </Link>

      <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
        <div
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: subject.color + '20' }}
        >
          <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" style={{ color: subject.color }} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{subject.name}</h1>
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">{subject.description}</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 sm:w-32 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
              <span className="text-sm font-medium" style={{ color: subject.color }}>
                {progress}%
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {totalMaterials} материалов
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
