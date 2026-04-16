import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadPresentationContent } from '@/shared/lib/loaders';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';
import { subjects, presentations } from '@/data';

type ErrorType = 'not_found' | 'load_error' | null;

export function PresentationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const presentation = useMemo(() => 
    presentations.find((p) => p.id === id),
    [id]
  );
  
  const subject = useMemo(() => 
    subjects.find((s) => s.id === presentation?.subjectId),
    [presentation]
  );

  const slidesCount = slides.length;

  const loadPresentation = useCallback(async () => {
    if (!id || !presentation) {
      navigate('/presentations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contentData = await loadPresentationContent(presentation.file);
      
      if (!contentData || !contentData.trim()) {
        setError('load_error');
        setLoading(false);
        return;
      }

      const parsedSlides = contentData
        .split(/\n?---\n?/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      if (parsedSlides.length === 0) {
        setError('load_error');
        setLoading(false);
        return;
      }

      setSlides(parsedSlides);
      setCurrentSlide(0);
    } catch (err) {
      console.error('Failed to load presentation:', err);
      setError('load_error');
    } finally {
      setLoading(false);
    }
  }, [id, presentation, navigate]);

  useEffect(() => {
    loadPresentation();
  }, [loadPresentation]);

  useEffect(() => {
    if (!isFullscreen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentSlide, isFullscreen]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slidesCount) {
      setCurrentSlide(index);
    }
  }, [slidesCount]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, slidesCount - 1));
  }, [slidesCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'Backspace':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            navigate('/presentations');
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Home':
          setCurrentSlide(0);
          break;
        case 'End':
          setCurrentSlide(slidesCount - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, navigate, isFullscreen, toggleFullscreen, slidesCount]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm">Загрузка презентации...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground mb-2">
            {error === 'not_found' ? 'Презентация не найдена' : 'Ошибка загрузки'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error === 'not_found' 
              ? 'Запрашиваемая презентация не существует или была удалена.'
              : 'Не удалось загрузить содержимое презентации. Проверьте подключение к интернету.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={loadPresentation}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Попробовать снова
            </Button>
            <Link to="/presentations">
              <Button variant="ghost">
                Все презентации
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!presentation || slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-card-foreground mb-2">Пустая презентация</h2>
          <p className="text-muted-foreground mb-6">В этой презентации нет слайдов.</p>
          <Link to="/presentations">
            <Button>Все презентации</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = slidesCount > 0 ? Math.round(((currentSlide + 1) / slidesCount) * 100) : 0;

  const handleSlideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) {
      prevSlide();
    } else if (x > (rect.width * 2) / 3) {
      nextSlide();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      <header className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/presentations"
              className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline text-sm">Закрыть</span>
            </Link>

            <div className="h-4 sm:h-5 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-1 sm:gap-2">
              {subject && (
                <span
                  className="hidden sm:inline text-xs px-1.5 sm:px-2 py-0.5 rounded text-primary-foreground font-medium"
                  style={{ backgroundColor: subject.color }}
                >
                  {subject.name}
                </span>
              )}
              <span className="text-foreground font-medium text-xs sm:text-sm sm:text-base truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[200px]">
                {presentation.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm font-mono">
            <span>{String(currentSlide + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(slidesCount).padStart(2, '0')}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-8 w-8 sm:h-9 sm:w-9"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>

        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <div className="h-0.5 sm:h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: subject?.color || 'hsl(var(--primary))' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      <div
        ref={contentRef}
        className="flex-1 flex items-center justify-center cursor-pointer overflow-hidden pt-[52px] sm:pt-[60px] pb-14 sm:pb-16"
        onClick={handleSlideClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full flex items-center justify-center p-2 sm:p-4 sm:p-8"
          >
            <div className="w-full max-w-6xl bg-card rounded-lg sm:rounded-xl sm:rounded-2xl shadow-lg border border-border p-3 sm:p-5 sm:p-8 md:p-10 overflow-auto max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)]">
              <MarkdownRenderer content={slides[currentSlide]} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        disabled={currentSlide === 0}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-card hover:bg-accent text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all items-center justify-center shadow-md border border-border"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        disabled={currentSlide === slidesCount - 1}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-card hover:bg-accent text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all items-center justify-center shadow-md border border-border"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-2.5 h-2.5 sm:w-3 sm:h-3'
                    : 'w-1.5 h-1.5 sm:w-2 sm:h-2'
                }`}
                style={{ 
                  backgroundColor: index === currentSlide 
                    ? (subject?.color || 'hsl(var(--primary))')
                    : index < currentSlide
                    ? (subject?.color || 'hsl(var(--primary))') + '60'
                    : 'hsl(var(--muted))'
                }}
              />
            ))}
          </div>

          <div className="hidden sm:flex items-center justify-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">→</kbd>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">пробел</kbd>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-border">|</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">Esc</kbd>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-border">|</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">F</kbd>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
