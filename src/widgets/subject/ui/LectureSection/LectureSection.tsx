import { motion } from 'framer-motion';
import { BookOpen, Code, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LectureCard } from '../LectureCard';
import type { Lecture } from '@/entities/subject';

type LectureType = 'lecture' | 'practice' | 'lab';

interface LectureSectionProps {
  type: LectureType;
  lectures: Lecture[];
  lectureProgress: Record<string, number>;
  favorites: string[];
  onToggleFavorite: (lectureId: string) => void;
}

const typeConfig = {
  lecture: { icon: BookOpen, label: 'Лекции' },
  practice: { icon: Code, label: 'Практика' },
  lab: { icon: FlaskConical, label: 'Лабораторные' },
} as const;

const typeColors = {
  lecture: '#3b82f6',
  practice: '#10b981',
  lab: '#8b5cf6',
} as const;

export function LectureSection({
  type,
  lectures,
  lectureProgress,
  favorites,
  onToggleFavorite,
}: LectureSectionProps) {
  if (lectures.length === 0) {
    return null;
  }

  const config = typeConfig[type];
  const color = typeColors[type];

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <config.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color }} />
        <h2 className="text-base sm:text-lg font-semibold">{config.label}</h2>
        <Badge variant="secondary" className="ml-auto text-[10px] sm:text-xs">
          {lectures.length}
        </Badge>
      </div>

      <motion.div 
        className="space-y-2"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {lectures.map((lecture, index) => (
          <LectureCard
            key={lecture.id}
            lecture={lecture}
            index={index}
            isViewed={lectureProgress[lecture.id] === 100}
            isFavorite={favorites.includes(lecture.id)}
            onToggleFavorite={() => onToggleFavorite(lecture.id)}
            showBadge={type !== 'lecture'}
          />
        ))}
      </motion.div>
    </section>
  );
}
