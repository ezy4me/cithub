import { useState } from 'react';
import { motion } from 'framer-motion';
import { subjects } from '@/data';
import { useProgressStore } from '@/shared/lib/stores';
import {
  SubjectsHeader,
  SubjectsSearchInput,
  SubjectCard,
  SubjectsEmptyState,
} from '@/widgets/subjects';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function SubjectsPage() {
  const [search, setSearch] = useState('');
  const { lectureProgress } = useProgressStore();

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      subject.description.toLowerCase().includes(search.toLowerCase())
  );

  const getProgress = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return 0;
    const allIds = [...subject.lectureIds, ...subject.practiceIds, ...subject.labIds];
    const viewed = allIds.filter((id) => lectureProgress[id] === 100).length;
    return allIds.length > 0 ? Math.round((viewed / allIds.length) * 100) : 0;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SubjectsHeader />

      <SubjectsSearchInput value={search} onChange={setSearch} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredSubjects.map((subject) => (
          <motion.div key={subject.id} variants={item}>
            <SubjectCard
              subject={subject}
              progress={getProgress(subject.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredSubjects.length === 0 && <SubjectsEmptyState />}
    </div>
  );
}
