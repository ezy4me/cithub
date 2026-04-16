import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Binary, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
    lectureIds: string[];
    practiceIds: string[];
    labIds: string[];
  };
  progress: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Globe: BookOpen,
  Binary: Binary,
  Database: Database,
};

export const SubjectCard = memo(function SubjectCard({ subject, progress }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || BookOpen;
  const totalMaterials =
    subject.lectureIds.length + subject.practiceIds.length + subject.labIds.length;

  return (
    <Link to={`/subject/${subject.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full group">
        <CardContent className="p-6">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: subject.color + '20' }}
          >
            <Icon className="h-6 w-6" style={{ color: subject.color }} />
          </div>

          <h2 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {subject.name}
          </h2>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {subject.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {totalMaterials} материалов
            </span>
            <span
              className="font-medium"
              style={{ color: progress > 0 ? subject.color : undefined }}
            >
              {progress > 0 ? `${progress}%` : 'Не начато'}
            </span>
          </div>

          {progress > 0 && (
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: subject.color,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});
