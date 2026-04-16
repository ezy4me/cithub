import { useState, useEffect } from 'react';
import { api } from '@/api/client';
import type { Subject, Lecture, Quiz } from '@/entities/subject';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSubjects() {
  const [state, setState] = useState<UseApiState<Subject[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getSubjects();
      setState({
        data: result.data,
        loading: false,
        error: result.error || null,
      });
    };

    fetchData();
  }, []);

  return state;
}

export function useSubject(id: string) {
  const [state, setState] = useState<UseApiState<Subject | null>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getSubject(id);
      setState({
        data: result.data,
        loading: false,
        error: result.error || null,
      });
    };

    fetchData();
  }, [id]);

  return state;
}

export function useLecture(id: string) {
  const [state, setState] = useState<UseApiState<Lecture | null>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getLecture(id);
      setState({
        data: result.data,
        loading: false,
        error: result.error || null,
      });
    };

    fetchData();
  }, [id]);

  return state;
}

export function useQuiz(lectureId: string) {
  const [state, setState] = useState<UseApiState<Quiz | null>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getQuiz(lectureId);
      setState({
        data: result.data,
        loading: false,
        error: result.error || null,
      });
    };

    fetchData();
  }, [lectureId]);

  return state;
}
