import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subjects, lectures, quizzes } from '@/data';
import { useProgressStore, useFavoritesStore } from '@/shared/lib/stores';
import { useToast } from '@/widgets/common';
import {
  SubjectHeader,
  SubjectRoadmap,
  SubjectQuizzes,
  SubjectFilter,
  LectureSection,
  LectureCard,
} from '@/widgets/subject';

type FilterType = 'all' | 'lecture' | 'practice' | 'lab';

export function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const { lectureProgress } = useProgressStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const subject = useMemo(() => subjects.find((s) => s.id === id), [id]);

  if (!subject) {
    return <Navigate to="/subjects" replace />;
  }

  const allItems = {
    lecture: lectures.filter((l) => subject.lectureIds.includes(l.id)),
    practice: lectures.filter((l) => subject.practiceIds.includes(l.id)),
    lab: lectures.filter((l) => subject.labIds.includes(l.id)),
  };

  const filteredItems = activeFilter === 'all' 
    ? [...allItems.lecture, ...allItems.practice, ...allItems.lab]
    : allItems[activeFilter];

  const subjectQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const lecture = lectures.find((l) => l.id === q.lectureId);
      return lecture && subject.lectureIds.includes(lecture.id);
    });
  }, [subject]);

  const progress = useMemo(() => {
    const allIds = [...subject.lectureIds, ...subject.practiceIds, ...subject.labIds];
    const viewed = allIds.filter((lid) => lectureProgress[lid] === 100).length;
    return allIds.length > 0 ? Math.round((viewed / allIds.length) * 100) : 0;
  }, [subject, lectureProgress]);

  const handleToggleFavorite = (lectureId: string, lectureTitle: string) => {
    const wasFavorite = favorites.includes(lectureId);
    toggleFavorite(lectureId);
    if (wasFavorite) {
      showToast(`"${lectureTitle}" удалено из избранного`, 'info');
    } else {
      showToast(`"${lectureTitle}" добавлено в избранное`, 'success');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto overflow-hidden">
      <SubjectHeader subject={subject} progress={progress} />
      <SubjectRoadmap subject={subject} />
      <SubjectQuizzes subject={subject} quizzes={subjectQuizzes} />
      <SubjectFilter
        subject={subject}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {activeFilter === 'all' ? (
        <>
          <LectureSection
            type="lecture"
            lectures={allItems.lecture}
            lectureProgress={lectureProgress}
            favorites={favorites}
            onToggleFavorite={(lectureId) => {
              const lecture = lectures.find(l => l.id === lectureId);
              handleToggleFavorite(lectureId, lecture?.title || '');
            }}
          />
          <LectureSection
            type="practice"
            lectures={allItems.practice}
            lectureProgress={lectureProgress}
            favorites={favorites}
            onToggleFavorite={(lectureId) => {
              const lecture = lectures.find(l => l.id === lectureId);
              handleToggleFavorite(lectureId, lecture?.title || '');
            }}
          />
          <LectureSection
            type="lab"
            lectures={allItems.lab}
            lectureProgress={lectureProgress}
            favorites={favorites}
            onToggleFavorite={(lectureId) => {
              const lecture = lectures.find(l => l.id === lectureId);
              handleToggleFavorite(lectureId, lecture?.title || '');
            }}
          />
        </>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Материалы не найдены
        </div>
      ) : (
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
          {filteredItems.map((lecture, index) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              index={index}
              isViewed={lectureProgress[lecture.id] === 100}
              isFavorite={favorites.includes(lecture.id)}
              onToggleFavorite={() => handleToggleFavorite(lecture.id, lecture.title)}
              showBadge
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
