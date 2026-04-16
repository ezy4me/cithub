export interface SubjectConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  enabled: boolean;
}

export interface LectureConfig {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  type: 'lecture' | 'practice' | 'lab';
  order: number;
  duration?: string;
  enabled: boolean;
  file: string;
}

export interface BrandingConfig {
  name: string;
  tagline: string;
  author: string;
  year: number;
}

export interface AppConfig {
  branding: BrandingConfig;
  subjects: SubjectConfig[];
  settings: {
    defaultTheme: string;
    defaultAccentColor: string;
    defaultFontFamily: string;
    allowUserCustomization: boolean;
    enableProgressTracking: boolean;
    enableFavorites: boolean;
  };
}

class ConfigLoader {
  private config: AppConfig | null = null;
  private lectures: LectureConfig[] = [];
  private contentCache: Map<string, string> = new Map();

  async loadConfig(): Promise<AppConfig> {
    if (this.config) return this.config;

    try {
      const response = await fetch('/config/subjects.json');
      this.config = await response.json();
      return this.config!;
    } catch (error) {
      console.error('Failed to load config:', error);
      throw error;
    }
  }

  async loadLectures(): Promise<LectureConfig[]> {
    if (this.lectures.length > 0) return this.lectures;

    try {
      const response = await fetch('/config/lectures.json');
      const data = await response.json();
      this.lectures = data.lectures;
      return this.lectures;
    } catch (error) {
      console.error('Failed to load lectures:', error);
      throw error;
    }
  }

  async getLectureContent(lectureId: string): Promise<string> {
    if (this.contentCache.has(lectureId)) {
      return this.contentCache.get(lectureId)!;
    }

    const lecture = this.lectures.find(l => l.id === lectureId);
    if (!lecture) {
      throw new Error(`Lecture not found: ${lectureId}`);
    }

    try {
      const response = await fetch(`/materials/lectures/${lecture.file}`);
      const content = await response.text();
      this.contentCache.set(lectureId, content);
      return content;
    } catch (error) {
      console.error(`Failed to load lecture content: ${lectureId}`, error);
      throw error;
    }
  }

  getSubjects(): SubjectConfig[] {
    if (!this.config) return [];
    return this.config.subjects.filter(s => s.enabled).sort((a, b) => a.order - b.order);
  }

  getSubjectById(id: string): SubjectConfig | undefined {
    return this.getSubjects().find(s => s.id === id);
  }

  getLecturesBySubject(subjectId: string): LectureConfig[] {
    return this.lectures
      .filter(l => l.subjectId === subjectId && l.enabled)
      .sort((a, b) => a.order - b.order);
  }

  getLectureById(id: string): LectureConfig | undefined {
    return this.lectures.find(l => l.id === id);
  }

  getBranding(): BrandingConfig | null {
    return this.config?.branding || null;
  }
}

export const configLoader = new ConfigLoader();
