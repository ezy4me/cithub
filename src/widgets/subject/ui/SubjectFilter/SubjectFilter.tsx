import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import type { Subject } from '@/entities/subject';

type FilterType = 'all' | 'lecture' | 'practice' | 'lab';

interface SubjectFilterProps {
  subject: Subject;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'lecture', label: 'Лекции' },
  { value: 'practice', label: 'Практики' },
  { value: 'lab', label: 'Лабы' },
];

export function SubjectFilter({ subject, activeFilter, onFilterChange }: SubjectFilterProps) {
  const totalCount = subject.lectureIds.length + subject.practiceIds.length + subject.labIds.length;

  const getCount = (filter: FilterType): number => {
    switch (filter) {
      case 'lecture': return subject.lectureIds.length;
      case 'practice': return subject.practiceIds.length;
      case 'lab': return subject.labIds.length;
      default: return totalCount;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 w-fit overflow-x-auto">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.value;
          const count = getCount(option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={cn(
                'px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
              <span className="ml-1 text-[10px] sm:text-xs opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
