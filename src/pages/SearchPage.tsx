import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { subjects, lectures } from '@/data';
import { useFavoritesStore } from '@/shared/lib/stores';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import {
  SearchInput,
  SearchEmptyState,
  SubjectResultCard,
  LectureResultCard,
  SearchNoResults,
} from '@/widgets/search';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    lectures: typeof lectures;
    subjects: typeof subjects;
  }>({ lectures: [], subjects: [] });
  const { favorites } = useFavoritesStore();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ lectures: [], subjects: [] });
      return;
    }

    const searchLower = debouncedQuery.toLowerCase();

    const matchedLectures = lectures.filter(
      (l) =>
        l.title.toLowerCase().includes(searchLower) ||
        l.description.toLowerCase().includes(searchLower) ||
        (l.content?.toLowerCase().includes(searchLower) ?? false)
    );

    const matchedSubjects = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
    );

    setResults({ lectures: matchedLectures, subjects: matchedSubjects });
  }, [debouncedQuery]);

  const getSubject = (subjectId: string) =>
    subjects.find((s) => s.id === subjectId);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Поиск</h1>

      <SearchInput value={query} onChange={setQuery} />

      {!query.trim() ? (
        <SearchEmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {results.subjects.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Предметы
                <Badge variant="secondary">{results.subjects.length}</Badge>
              </h2>
              <div className="space-y-2">
                {results.subjects.map((subject) => (
                  <SubjectResultCard key={subject.id} subject={subject} />
                ))}
              </div>
            </section>
          )}

          {results.lectures.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Лекции
                <Badge variant="secondary">{results.lectures.length}</Badge>
              </h2>
              <div className="space-y-2">
                {results.lectures.map((lecture) => (
                  <LectureResultCard
                    key={lecture.id}
                    lecture={lecture}
                    subject={getSubject(lecture.subjectId)}
                    isFavorite={favorites.includes(lecture.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {results.subjects.length === 0 && results.lectures.length === 0 && (
            <SearchNoResults query={query} />
          )}
        </motion.div>
      )}
    </div>
  );
}
