import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  Search,
  Star,
  Settings,
  ChevronDown,
  GitBranch,
  Binary,
  Database,
  Presentation,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { subjects } from '@/data';
import { useFavoritesStore, useProgressStore } from '@/shared/lib/stores';
import { Input } from '@/components/ui/input';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe: BookOpen,
  Binary: Binary,
  Database: Database,
};

export function Sidebar() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const location = useLocation();
  const { favorites } = useFavoritesStore();
  const { lectureProgress } = useProgressStore();

  const isActive = (path: string) => location.pathname === path;
  const isSubjectActive = (subjectId: string) =>
    location.pathname.startsWith(`/subject/${subjectId}`);

  const getProgress = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return 0;
    const allIds = [...subject.lectureIds, ...subject.practiceIds, ...subject.labIds];
    const viewed = allIds.filter((id) => lectureProgress[id] === 100).length;
    return allIds.length > 0 ? Math.round((viewed / allIds.length) * 100) : 0;
  };

  const navItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: BookOpen, label: 'Предметы', path: '/subjects' },
    { icon: Presentation, label: 'Презентации', path: '/presentations' },
    { icon: Search, label: 'Поиск', path: '/search' },
    { icon: Star, label: 'Избранное', path: '/favorites', count: favorites.length },
    { icon: Settings, label: 'Настройки', path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-[280px] border-r bg-background flex flex-col',
        'max-md:hidden'
      )}
    >
      <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <GitBranch className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Cithub</span>
          </Link>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-9 bg-muted/50"
              onClick={() => window.location.href = '/search'}
              readOnly
            />
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Предметы
            </p>
          </div>

          {subjects.map((subject) => {
            const Icon = iconMap[subject.icon] || BookOpen;
            const isExpanded = expandedSubject === subject.id;
            const progress = getProgress(subject.id);

            return (
              <div key={subject.id}>
                <Link
                  to={`/subject/${subject.id}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isSubjectActive(subject.id)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={(e) => {
                    if (isSubjectActive(subject.id)) {
                      e.preventDefault();
                      setExpandedSubject(isExpanded ? null : subject.id);
                    }
                  }}
                >
                  <div
                    className="h-5 w-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: subject.color + '20', color: subject.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="flex-1 truncate">{subject.name}</span>
                  {progress > 0 && (
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  )}
                  {isSubjectActive(subject.id) && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  )}
                </Link>

                {isExpanded && isSubjectActive(subject.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-6 mt-1 space-y-0.5"
                  >
                    <Link
                      to={`/subject/${subject.id}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors',
                        location.pathname === `/subject/${subject.id}`
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Обзор
                    </Link>
                    {subject.lectureIds.map((lectureId) => (
                      <Link
                        key={lectureId}
                        to={`/lecture/${lectureId}`}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors',
                          location.pathname === `/lecture/${lectureId}`
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        Лекция
                        {lectureProgress[lectureId] === 100 && (
                          <span className="text-primary">✓</span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
    </aside>
  );
}
