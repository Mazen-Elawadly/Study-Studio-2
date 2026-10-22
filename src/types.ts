export type ExamBoard = 'cambridge' | 'edexcel' | 'oxford';

export interface Subject {
  id: string;
  name: string;
  board: ExamBoard;
  hue: number;
  bounds: {
    max: number;
    marks: (number | null)[];
  };
  mark: number | null;
  src?: {
    official: boolean;
    text?: string;
  };
}

export interface CustomMode {
  id: string;
  name: string;
  min: number;
  marks: number;
}

export interface Exam {
  id: string;
  sid: string;
  subj: string;
  paper: string;
  when: string; // ISO string or datetime-local
  ex?: boolean;
}

export type NoiseType = 'white' | 'pink' | 'brown' | 'rain';

export interface NoiseSettings {
  type: NoiseType;
  vol: number;
  link: boolean;
}

export type ThemeMode = 'auto' | 'light' | 'dark';
export type LookMode = 'subject' | 'fixed' | 'tool';
export type PaletteKey = 'slate' | 'ink' | 'forest' | 'plum' | 'paper' | 'mono';

export interface LookConfig {
  mode: LookMode;
  fixed: number;
  tools: Record<string, number>;
  bg: PaletteKey;
}

export interface AppState {
  v: number;
  theme: ThemeMode;
  active: string; // active subject id
  mode: string; // active timer mode id
  subjects: Subject[];
  customs: CustomMode[];
  exams: Exam[];
  noise: NoiseSettings;
  look: LookConfig;
}

export interface LapItem {
  id: string;
  split: number;
  total: number;
}
