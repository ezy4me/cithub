import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContinueLearningCardProps {
  lecture: {
    id: string;
    title: string;
    description: string;
    type: 'lecture' | 'practice' | 'lab';
    subjectId: string;
  };
  subject: {
    name: string;
    color: string;
  } | undefined;
  progress: number;
}

export const ContinueLearningCard = memo(function ContinueLearningCard({
  lecture,
  subject,
  progress,
}: ContinueLearningCardProps) {
  return (
    <Link to={`/lecture/${lecture.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {lecture.type === 'lecture'
                ? 'Лекция'
                : lecture.type === 'practice'
                ? 'Практика'
                : 'Лабораторная'}
            </Badge>
            {subject && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: subject.color + '20', color: subject.color }}
              >
                {subject.name}
              </span>
            )}
          </div>
          <h3 className="font-medium mb-1">{lecture.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {lecture.description}
          </p>
          <div className="mt-3">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {progress}% завершено
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
