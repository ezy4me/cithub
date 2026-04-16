import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { ScrollbarStyles } from '@/widgets/common';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const SubjectsPage = lazy(() => import('@/pages/SubjectsPage').then((m) => ({ default: m.SubjectsPage })));
const SubjectPage = lazy(() => import('@/pages/SubjectPage').then((m) => ({ default: m.SubjectPage })));
const LecturePage = lazy(() => import('@/pages/LecturePage').then((m) => ({ default: m.LecturePage })));
const PresentationPage = lazy(() => import('@/pages/PresentationPage').then((m) => ({ default: m.PresentationPage })));
const PresentationsPage = lazy(() => import('@/pages/PresentationsPage').then((m) => ({ default: m.PresentationsPage })));
const QuizPage = lazy(() => import('@/pages/QuizPage').then((m) => ({ default: m.QuizPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100vh-4rem)]">
      <div className="animate-pulse text-muted-foreground">Загрузка...</div>
    </div>
  );
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <HomePage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="subjects"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <SubjectsPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="subject/:id"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <SubjectPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="lecture/:id"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <LecturePage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="presentations"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <PresentationsPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="presentation/:id"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <PresentationPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="quiz/:id"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <QuizPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="search"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <SearchPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="favorites"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <FavoritesPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedPage>
                <SettingsPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollbarStyles />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
