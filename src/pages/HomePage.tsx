import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, Star, TrendingUp } from 'lucide-react';
import { subjects, lectures } from '@/data';
import { useProgressStore, useFavoritesStore } from '@/shared/lib/stores';
import {
  HomeHeader,
  ContinueLearningCard,
  ProgressOverviewCard,
  FavoriteCard,
  RecentLectureItem,
} from '@/widgets/home';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HomePage() {
  const { lectureProgress } = useProgressStore();
  const { favorites } = useFavoritesStore();

  const recentLectures = lectures
    .filter((l) => lectureProgress[l.id] > 0 && lectureProgress[l.id] < 100)
    .slice(0, 3);

  const favoriteLectures = lectures
    .filter((l) => favorites.includes(l.id))
    .slice(0, 3);

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const getProgress = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return 0;
    const allIds = [...subject.lectureIds, ...subject.practiceIds, ...subject.labIds];
    const viewed = allIds.filter((id) => lectureProgress[id] === 100).length;
    return allIds.length > 0 ? Math.round((viewed / allIds.length) * 100) : 0;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={item}>
          <HomeHeader />
        </motion.div>

        {recentLectures.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Продолжить обучение</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentLectures.map((lecture) => (
                <ContinueLearningCard
                  key={lecture.id}
                  lecture={lecture}
                  subject={getSubject(lecture.subjectId)}
                  progress={lectureProgress[lecture.id] || 0}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Ваш прогресс</h2>
            </div>
            <Link
              to="/subjects"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Все предметы <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {subjects.slice(0, 3).map((subject) => (
              <ProgressOverviewCard
                key={subject.id}
                subject={subject}
                progress={getProgress(subject.id)}
              />
            ))}
          </div>
        </section>

        {favoriteLectures.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Избранное</h2>
              </div>
              <Link
                to="/favorites"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Все <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoriteLectures.map((lecture) => (
                <FavoriteCard
                  key={lecture.id}
                  lecture={lecture}
                  subject={getSubject(lecture.subjectId)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Последние лекции</h2>
          </div>
          <div className="space-y-3">
            {lectures.slice(0, 5).map((lecture) => (
              <RecentLectureItem
                key={lecture.id}
                lecture={lecture}
                subject={getSubject(lecture.subjectId)}
                isCompleted={lectureProgress[lecture.id] === 100}
              />
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
