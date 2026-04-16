import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProgressOverviewCardProps {
  subject: {
    id: string;
    name: string;
    color: string;
    lectureIds: string[];
    practiceIds: string[];
    labIds: string[];
  };
  progress: number;
}

export const ProgressOverviewCard = memo(function ProgressOverviewCard({ subject, progress }: ProgressOverviewCardProps) {
  const totalMaterials =
    subject.lectureIds.length + subject.practiceIds.length + subject.labIds.length;

  return (
    <Link to={`/subject/${subject.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: subject.color + '20' }}
            >
              <BookOpen className="h-5 w-5" style={{ color: subject.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{subject.name}</h3>
              <p className="text-xs text-muted-foreground">
                {totalMaterials} материалов
              </p>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all rounded-full"
              style={{ width: `${progress}%`, backgroundColor: subject.color }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
            <span>Прогресс</span>
            <span className="font-medium">{progress}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
