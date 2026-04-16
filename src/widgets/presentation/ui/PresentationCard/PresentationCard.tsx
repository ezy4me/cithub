import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Presentation as PresentationIcon, Clock, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Subject } from '@/entities/subject';

interface Presentation {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  duration?: string;
}

interface PresentationCardProps {
  presentation: Presentation;
  subject: Subject | undefined;
  index: number;
}

export const PresentationCard = memo(function PresentationCard({ presentation, subject, index }: PresentationCardProps) {
  const subjectColor = subject?.color || '#6366f1';

  return (
    <motion.div 
      variants={{ 
        hidden: { opacity: 0, y: 20 }, 
        show: { opacity: 1, y: 0 } 
      }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:border-primary/50 transition-colors h-full">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: subjectColor + '20',
                color: subjectColor,
              }}
            >
              <PresentationIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1 line-clamp-1 text-sm sm:text-base">
                {presentation.title}
              </h3>
              {subject && (
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs"
                  style={{
                    color: subject.color,
                    backgroundColor: subject.color + '15',
                  }}
                >
                  {subject.name}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
            {presentation.description}
          </p>

          <div className="flex items-center justify-between">
            {presentation.duration && (
              <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {presentation.duration}
              </span>
            )}

            <Link to={`/presentation/${presentation.id}`}>
              <Button size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Открыть</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
