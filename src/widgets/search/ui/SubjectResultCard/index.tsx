import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SubjectResultCardProps {
  subject: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
}

export const SubjectResultCard = memo(function SubjectResultCard({ subject }: SubjectResultCardProps) {
  return (
    <Link to={`/subject/${subject.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer mb-2">
        <CardContent className="p-4 flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: subject.color + '20',
              color: subject.color,
            }}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{subject.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {subject.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
