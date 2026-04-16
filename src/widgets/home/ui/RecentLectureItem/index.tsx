import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RecentLectureItemProps {
  lecture: {
    id: string;
    title: string;
    duration?: string;
  };
  subject: {
    name: string;
    color: string;
  } | undefined;
  isCompleted: boolean;
}

export const RecentLectureItem = memo(function RecentLectureItem({
  lecture,
  subject,
  isCompleted,
}: RecentLectureItemProps) {
  return (
    <Link to={`/lecture/${lecture.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer mb-2">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{lecture.title}</h3>
              {isCompleted && (
                <span className="text-primary text-sm">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {subject && (
                <span style={{ color: subject.color }}>{subject.name}</span>
              )}
              <span>•</span>
              <span>{lecture.duration || '30 мин'}</span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
});
