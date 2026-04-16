import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FavoriteCardProps {
  lecture: {
    id: string;
    title: string;
    type: 'lecture' | 'practice' | 'lab';
  };
  subject: {
    name: string;
  } | undefined;
}

export const FavoriteCard = memo(function FavoriteCard({ lecture, subject }: FavoriteCardProps) {
  return (
    <Link to={`/lecture/${lecture.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {lecture.type === 'lecture'
              ? 'Лекция'
              : lecture.type === 'practice'
              ? 'Практика'
              : 'Лабораторная'}
          </Badge>
          <h3 className="font-medium mb-1">{lecture.title}</h3>
          {subject && (
            <p className="text-xs text-muted-foreground">{subject.name}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});
