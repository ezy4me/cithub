import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FavoriteLectureCardProps {
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
  progress: number;
  onRemove: (id: string) => void;
}

const typeConfig = {
  lecture: { label: 'Лекция', color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-500' },
  practice: { label: 'Практика', color: '#10b981', bg: 'bg-green-500/10', text: 'text-green-500' },
  lab: { label: 'Лаба', color: '#8b5cf6', bg: 'bg-purple-500/10', text: 'text-purple-500' },
} as const;

export function FavoriteLectureCard({
  lecture,
  subject,
  progress,
  onRemove,
}: FavoriteLectureCardProps) {
  const config = typeConfig[lecture.type] || typeConfig.lecture;

  return (
    <Link to={`/lecture/${lecture.id}`} className="block">
      <Card className="hover:border-primary/50 transition-all duration-200 group">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: config.color + '15' }}
            >
              <span className={`font-semibold text-sm ${config.text}`}>
                {config.label.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate text-sm sm:text-base group-hover:text-primary transition-colors">
                  {lecture.title}
                </h3>
                {progress === 100 && (
                  <span className="shrink-0">
                    <svg className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {subject && (
                  <span style={{ color: subject.color }}>
                    {subject.name}
                  </span>
                )}
                <span className={`px-1.5 py-0.5 rounded ${config.bg} ${config.text}`}>
                  {config.label}
                </span>
                {lecture.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lecture.duration}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-yellow-500"
                onClick={(e) => {
                  e.preventDefault();
                  onRemove(lecture.id);
                }}
              >
                <Star className="h-4 w-4 fill-current" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors hidden sm:block" />
            </div>
          </div>

          {progress > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? '#10b981' : config.color
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {progress}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
