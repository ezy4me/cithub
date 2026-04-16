import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface LectureResultCardProps {
  lecture: {
    id: string;
    title: string;
    type: 'lecture' | 'practice' | 'lab';
    duration?: string;
  };
  subject: {
    name: string;
    color: string;
  } | undefined;
  isFavorite: boolean;
}

export const LectureResultCard = memo(function LectureResultCard({
  lecture,
  subject,
  isFavorite,
}: LectureResultCardProps) {
  return (
    <Link to={`/lecture/${lecture.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer mb-2">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{lecture.title}</h3>
              {isFavorite && <span className="text-yellow-500">★</span>}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {subject && (
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: subject.color + '20',
                    color: subject.color,
                  }}
                >
                  {subject.name}
                </span>
              )}
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-xs',
                  lecture.type === 'lecture'
                    ? 'bg-blue-500/10 text-blue-500'
                    : lecture.type === 'practice'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-purple-500/10 text-purple-500'
                )}
              >
                {lecture.type === 'lecture'
                  ? 'Лекция'
                  : lecture.type === 'practice'
                  ? 'Практика'
                  : 'Лабораторная'}
              </span>
            </div>
          </div>

          {lecture.duration && (
            <span className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lecture.duration}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});
