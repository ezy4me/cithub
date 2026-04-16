import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, ChevronDown } from 'lucide-react';
import { Roadmap } from '@/components/ui/Roadmap';
import { cn } from '@/shared/lib/utils';
import type { Subject, RoadmapSection } from '@/entities/subject';

interface SubjectRoadmapProps {
  subject: Subject;
}

export function SubjectRoadmap({ subject }: SubjectRoadmapProps) {
  const [showRoadmap, setShowRoadmap] = useState(true);

  if (!subject.roadmap || subject.roadmap.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <button
        onClick={() => setShowRoadmap(!showRoadmap)}
        className="flex items-center gap-2 w-full p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
      >
        <Map className="h-5 w-5" style={{ color: subject.color }} />
        <span className="font-medium">Roadmap курса</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 ml-auto transition-transform',
            showRoadmap && 'rotate-180'
          )}
        />
      </button>

      {showRoadmap && (
        <div className="mt-4 p-4 sm:p-6 rounded-lg border border-border bg-card">
          <Roadmap
            sections={subject.roadmap as RoadmapSection[]}
            subjectId={subject.id}
            subjectColor={subject.color}
          />
        </div>
      )}
    </motion.div>
  );
}
