import type { Subject, Lecture, Quiz } from '@/entities/subject';
import { subjects as mockSubjects, lectures as mockLectures, quizzes as mockQuizzes } from '@/data';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private useMock: boolean;

  constructor(baseUrl: string = '/api', useMock: boolean = true) {
    this.baseUrl = baseUrl;
    this.useMock = useMock;
  }

  async getSubjects(): Promise<ApiResponse<Subject[]>> {
    if (this.useMock) {
      return { data: mockSubjects };
    }

    try {
      const response = await fetch(`${this.baseUrl}/subjects`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: [], error: 'Failed to fetch subjects' };
    }
  }

  async getSubject(id: string): Promise<ApiResponse<Subject | null>> {
    if (this.useMock) {
      const subject = mockSubjects.find((s) => s.id === id) || null;
      return { data: subject };
    }

    try {
      const response = await fetch(`${this.baseUrl}/subjects/${id}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null, error: 'Failed to fetch subject' };
    }
  }

  async getLectures(): Promise<ApiResponse<Lecture[]>> {
    if (this.useMock) {
      return { data: mockLectures };
    }

    try {
      const response = await fetch(`${this.baseUrl}/lectures`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: [], error: 'Failed to fetch lectures' };
    }
  }

  async getLecture(id: string): Promise<ApiResponse<Lecture | null>> {
    if (this.useMock) {
      const lecture = mockLectures.find((l) => l.id === id) || null;
      return { data: lecture };
    }

    try {
      const response = await fetch(`${this.baseUrl}/lectures/${id}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null, error: 'Failed to fetch lecture' };
    }
  }

  async getQuiz(lectureId: string): Promise<ApiResponse<Quiz | null>> {
    if (this.useMock) {
      const quiz = mockQuizzes.find((q) => q.lectureId === lectureId) || null;
      return { data: quiz };
    }

    try {
      const response = await fetch(`${this.baseUrl}/quizzes/${lectureId}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null, error: 'Failed to fetch quiz' };
    }
  }
}

export const api = new ApiClient();

export type { Subject, Lecture, Quiz };
