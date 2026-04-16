import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { Lecture } from '@/entities/subject';

interface LectureCardProps {
  lecture: Lecture;
  index: number;
  isViewed: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  showBadge?: boolean;
}

const typeConfig = {
  lecture: { label: 'Лекция', color: '#3b82f6' },
  practice: { label: 'Практика', color: '#10b981' },
  lab: { label: 'Лаба', color: '#8b5cf6' },
} as const;

export const LectureCard = memo(function LectureCard({
  lecture,
  index,
  isViewed,
  isFavorite,
  onToggleFavorite,
  showBadge = false,
}: LectureCardProps) {
  const config = typeConfig[lecture.type] || typeConfig.lecture;

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
          <div 
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium shrink-0"
            style={{ backgroundColor: config.color + '20', color: config.color }}
          >
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to={`/lecture/${lecture.id}`}
                className="font-medium hover:text-primary transition-colors truncate text-sm sm:text-base"
              >
                {lecture.title}
              </Link>
              {isViewed && (
                <span className="text-primary shrink-0">
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 hidden xs:block">
              {lecture.description}
            </p>
          </div>

          {showBadge && (
            <Badge 
              variant="secondary" 
              className="hidden sm:inline-flex text-[10px] sm:text-xs shrink-0"
              style={{ color: config.color, backgroundColor: config.color + '15' }}
            >
              {config.label}
            </Badge>
          )}

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {lecture.duration && (
              <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {lecture.duration}
              </span>
            )}

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                isFavorite && 'text-yellow-500'
              )}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite();
              }}
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  isFavorite && 'fill-current'
                )}
              />
            </Button>

            <Link to={`/lecture/${lecture.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
