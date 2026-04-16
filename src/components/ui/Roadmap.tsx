import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import type { RoadmapSection } from '@/entities/subject/types';
import { lectures } from '@/data';
import { useProgressStore } from '@/shared/lib/stores';
import { cn } from '@/shared/lib/utils';

interface RoadmapProps {
  sections: RoadmapSection[];
  subjectId: string;
  subjectColor: string;
  isExpanded?: boolean;
}

export function Roadmap({ sections, subjectId, subjectColor, isExpanded = true }: RoadmapProps) {
  const { lectureProgress } = useProgressStore();

  const getLectureStatus = (lectureTitle: string) => {
    const lecture = lectures.find(
      (l) =>
        l.subjectId === subjectId &&
        l.title.toLowerCase().includes(lectureTitle.toLowerCase())
    );

    if (!lecture) return 'not-started';
    if (lectureProgress[lecture.id] === 100) return 'completed';
    if (lectureProgress[lecture.id] > 0) return 'in-progress';
    return 'not-started';
  };

  const getSectionProgress = (items: string[]) => {
    const completed = items.filter((item) => getLectureStatus(item) === 'completed').length;
    return Math.round((completed / items.length) * 100);
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-8 w-1 rounded-full shrink-0"
          style={{ backgroundColor: subjectColor }}
        />
        <h3 className="text-lg font-semibold">Roadmap</h3>
      </div>

      <div className="relative overflow-x-hidden">
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"
          style={{ backgroundColor: subjectColor + '30' }}
        />

        <div className="space-y-8 overflow-x-hidden">
          {sections.map((section, sectionIndex) => {
            const progress = getSectionProgress(section.items);
            const sectionCompleted = progress === 100;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="relative pl-10"
              >
                <div
                  className="absolute left-2 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-background"
                  style={{
                    borderColor: sectionCompleted ? subjectColor : subjectColor + '50',
                    backgroundColor: sectionCompleted ? subjectColor : 'transparent',
                  }}
                >
                  {sectionCompleted && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>

                <div className="mb-3">
                  <h4
                    className={cn(
                      'font-medium',
                      sectionCompleted && 'text-muted-foreground line-through'
                    )}
                  >
                    {section.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => {
                    const status = getLectureStatus(item);

                    return (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-lg transition-colors',
                          status !== 'not-started'
                            ? 'bg-primary/5'
                            : 'hover:bg-muted/50'
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center w-6 h-6 rounded-full text-xs',
                            status === 'completed' && 'bg-primary text-primary-foreground',
                            status === 'in-progress' && 'bg-primary/20 text-primary',
                            status === 'not-started' && 'bg-muted text-muted-foreground'
                          )}
                        >
                          {status === 'completed' ? (
                            <Check className="h-3 w-3" />
                          ) : status === 'in-progress' ? (
                            <Circle className="h-2 w-2 fill-current" />
                          ) : (
                            <Circle className="h-2 w-2" />
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-sm',
                            status === 'completed' && 'text-muted-foreground',
                            status === 'not-started' && 'text-foreground'
                          )}
                        >
                          {item}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: subjectColor,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {progress}% завершено
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
