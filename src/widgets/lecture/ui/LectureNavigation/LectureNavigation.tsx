import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lecture } from '@/entities/subject';

interface LectureNavigationProps {
  prevLecture: Lecture | null;
  nextLecture: Lecture | null;
  subjectId: string;
  isViewed: boolean;
}

export function LectureNavigation({
  prevLecture,
  nextLecture,
  subjectId,
  isViewed,
}: LectureNavigationProps) {
  return (
    <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t">
      {isViewed && (
        <div className="flex items-center gap-2 text-primary mb-4 sm:mb-6">
          <Check className="h-5 w-5" />
          <span className="text-sm sm:text-base">Лекция завершена</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {prevLecture ? (
          <Link to={`/lecture/${prevLecture.id}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="truncate text-xs sm:text-sm">{prevLecture.title}</span>
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextLecture ? (
          <Link to={`/lecture/${nextLecture.id}`}>
            <Button className="gap-2 justify-end">
              <span className="truncate text-xs sm:text-sm">{nextLecture.title}</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          </Link>
        ) : (
          <Link to={`/subject/${subjectId}`} className="flex-1">
            <Button className="w-full text-xs sm:text-sm">Завершить предмет</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
