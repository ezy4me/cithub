import { motion } from 'framer-motion';
import { subjects, lectures } from '@/data';
import { useFavoritesStore, useProgressStore } from '@/shared/lib/stores';
import { useToast } from '@/widgets/common';
import {
  FavoritesHeader,
  FavoritesEmptyState,
  FavoriteLectureCard,
} from '@/widgets/favorites';

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

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();
  const { lectureProgress } = useProgressStore();
  const { showToast } = useToast();

  const favoriteLectures = lectures.filter((l) => favorites.includes(l.id));

  const getSubject = (subjectId: string) =>
    subjects.find((s) => s.id === subjectId);

  const handleRemove = (lectureId: string, lectureTitle: string) => {
    removeFavorite(lectureId);
    showToast(`"${lectureTitle}" удалено из избранного`, 'info');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <FavoritesHeader />

      {favoriteLectures.length === 0 ? (
        <FavoritesEmptyState />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3 sm:space-y-4"
        >
          {favoriteLectures.map((lecture) => {
            const subject = getSubject(lecture.subjectId);
            const progress = lectureProgress[lecture.id] || 0;

            return (
              <motion.div key={lecture.id} variants={item}>
                <FavoriteLectureCard
                  lecture={lecture}
                  subject={subject}
                  progress={progress}
                  onRemove={() => handleRemove(lecture.id, lecture.title)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
