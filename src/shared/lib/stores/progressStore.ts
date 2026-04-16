import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  viewedLectures: string[];
  lectureProgress: Record<string, number>;
  markAsViewed: (id: string) => void;
  setLectureProgress: (id: string, progress: number) => void;
  isViewed: (id: string) => boolean;
  getLectureProgress: (id: string) => number;
  getSubjectProgress: (subjectId: string, lectureIds: string[]) => number;
  clearProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      viewedLectures: [],
      lectureProgress: {},
      markAsViewed: (id) =>
        set((state) => ({
          viewedLectures: state.viewedLectures.includes(id)
            ? state.viewedLectures
            : [...state.viewedLectures, id],
        })),
      setLectureProgress: (id, progress) =>
        set((state) => ({
          lectureProgress: {
            ...state.lectureProgress,
            [id]: Math.max(state.lectureProgress[id] || 0, progress),
          },
        })),
      isViewed: (id) => get().viewedLectures.includes(id),
      getLectureProgress: (id) => get().lectureProgress[id] || 0,
      getSubjectProgress: (_subjectId, lectureIds) => {
        const { lectureProgress } = get();
        const viewed = lectureIds.filter((id) => lectureProgress[id] === 100);
        return lectureIds.length > 0
          ? Math.round((viewed.length / lectureIds.length) * 100)
          : 0;
      },
      clearProgress: () => set({ viewedLectures: [], lectureProgress: {} }),
    }),
    {
      name: 'cithub-progress',
    }
  )
);
