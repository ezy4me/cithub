export interface RoadmapSection {
  title: string;
  description: string;
  items: string[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lectureIds: string[];
  practiceIds: string[];
  labIds: string[];
  presentationIds: string[];
  testIds: string[];
  order?: number;
  enabled?: boolean;
  roadmap?: RoadmapSection[];
}

export interface Lecture {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  type: 'lecture' | 'practice' | 'lab';
  order: number;
  content?: string;
  duration?: string;
  enabled?: boolean;
  file?: string;
}

export interface Quiz {
  id: string;
  lectureId: string;
  title: string;
  questions: QuizQuestion[];
}

export type QuizQuestionType = 'single' | 'multiple' | 'input';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Branding {
  name: string;
  tagline: string;
  author: string;
  year: number;
}
