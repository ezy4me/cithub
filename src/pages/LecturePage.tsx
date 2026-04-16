import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, FileQuestion } from 'lucide-react';
import { subjects, lectures, presentations } from '@/data';
import { useProgressStore, useFavoritesStore } from '@/shared/lib/stores';
import { MarkdownRendererAsync } from '@/shared/components/MarkdownRendererAsync';
import { loadLectureContent } from '@/shared/lib/loaders';
import { ErrorBoundary } from '@/widgets/common';
import {
  LectureHeader,
  LectureProgress,
  LectureNavigation,
  BackToTop,
} from '@/widgets/lecture';

export function LecturePage() {
  const { id } = useParams<{ id: string }>();
  const { lectureProgress, setLectureProgress, markAsViewed } = useProgressStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hasPresentation, setHasPresentation] = useState(false);
  const [prevLectureId, setPrevLectureId] = useState<string | null>(null);

  const lecture = lectures.find((l) => l.id === id);
  const subject = lecture ? subjects.find((s) => s.id === lecture.subjectId) : undefined;

  useEffect(() => {
    if (lecture) {
      const hasPres = presentations.some((p) => p.lectureId === lecture.id);
      setHasPresentation(hasPres);
    }
  }, [lecture]);

  useEffect(() => {
    if (!lecture || !subject) return;

    if (prevLectureId && prevLectureId !== lecture.id) {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPrevLectureId(lecture.id);

    setLoading(true);
    setError(null);

    loadLectureContent(lecture.file || `${subject.id}/lectures/${lecture.id.replace(`${subject.id}-`, '')}`)
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load lecture content:', err);
        setError('Не удалось загрузить материал');
        setContent(lecture.content || '');
        setLoading(false);
      });
  }, [id, lecture, subject, prevLectureId]);

  if (!lecture) {
    return <Navigate to="/subjects" replace />;
  }

  const allLectures = lectures.filter((l) => l.subjectId === lecture.subjectId);
  const currentIndex = allLectures.findIndex((l) => l.id === id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  const isFavorite = favorites.includes(lecture.id);
  const isViewed = lectureProgress[lecture.id] === 100;

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setReadingProgress(progress);
      setShowBackToTop(scrollTop > 400);
      setLectureProgress(lecture.id, Math.round(progress));

      if (progress >= 90) {
        markAsViewed(lecture.id);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [lecture.id, markAsViewed, setLectureProgress]);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-screen flex flex-col">
      <LectureHeader
        lecture={lecture}
        subject={subject}
        isFavorite={isFavorite}
        hasPresentation={hasPresentation}
        onToggleFavorite={() => toggleFavorite(lecture.id)}
      />
      <LectureProgress progress={readingProgress} />

      <div className="flex-1 overflow-hidden">
        <div
          ref={contentRef}
          className="h-full overflow-y-auto scrollbar-hide"
        >
          <article className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">{lecture.title}</h1>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">{lecture.description}</p>
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-16 sm:py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileQuestion className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Материал не найден</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  К сожалению, данный материал ещё не добавлен в систему.
                </p>
              </div>
            ) : null}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ delay: 0.2 }}
            >
              {content && (
              <ErrorBoundary>
                <MarkdownRendererAsync content={content} />
              </ErrorBoundary>
            )}
            </motion.div>

            <LectureNavigation
              prevLecture={prevLecture}
              nextLecture={nextLecture}
              subjectId={lecture.subjectId}
              isViewed={isViewed}
            />
          </article>
        </div>
      </div>

      <BackToTop visible={showBackToTop} onClick={scrollToTop} />
    </div>
  );
}
