import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { Lecture, Subject } from '@/entities/subject';

interface LectureHeaderProps {
  lecture: Lecture;
  subject: Subject | undefined;
  isFavorite: boolean;
  hasPresentation: boolean;
  onToggleFavorite: () => void;
}

export function LectureHeader({
  lecture,
  subject,
  isFavorite,
  hasPresentation,
  onToggleFavorite,
}: LectureHeaderProps) {
  const typeLabel = lecture.type === 'lecture'
    ? 'Лекция'
    : lecture.type === 'practice'
    ? 'Практика'
    : 'Лабораторная';

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to={`/subject/${lecture.subjectId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Назад</span>
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            {subject && (
              <span
                className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 rounded hidden md:inline"
                style={{
                  backgroundColor: subject.color + '20',
                  color: subject.color,
                }}
              >
                {subject.name}
              </span>
            )}
            <Badge variant="secondary" className="hidden md:inline-flex text-xs">
              {typeLabel}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {lecture.duration && (
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lecture.duration}
            </span>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn(isFavorite && 'text-yellow-500')}
            onClick={onToggleFavorite}
          >
            <Star className={cn('h-5 w-5', isFavorite && 'fill-current')} />
          </Button>

          {hasPresentation && (
            <Link to={`/presentation/${lecture.id}`}>
              <Button variant="ghost" size="icon" title="Открыть презентацию">
                <Monitor className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
