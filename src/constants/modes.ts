export interface TimerModeItem {
  id: string;
  g: 'focus' | 'exam' | 'custom';
  name: string;
  min: number;
  marks?: number;
  subj?: string;
  detail?: string;
}

export const BUILTIN_MODES: TimerModeItem[] = [
  { id: 'f25', g: 'focus', name: 'Focus', min: 25 },
  { id: 'f50', g: 'focus', name: 'Deep focus', min: 50 },
  { id: 'b5', g: 'focus', name: 'Short break', min: 5 },
  { id: 'b15', g: 'focus', name: 'Long break', min: 15 },
  { id: 'phys-p2', g: 'exam', subj: 'Physics', name: 'Physics P2', detail: 'Extended multiple choice', min: 45, marks: 40 },
  { id: 'phys-p4', g: 'exam', subj: 'Physics', name: 'Physics P4', detail: 'Extended theory', min: 75, marks: 80 },
  { id: 'phys-p6', g: 'exam', subj: 'Physics', name: 'Physics P6', detail: 'Alternative to practical', min: 60, marks: 40 },
  { id: 'chem-p2', g: 'exam', subj: 'Chemistry', name: 'Chemistry P2', detail: 'Extended multiple choice', min: 45, marks: 40 },
  { id: 'chem-p4', g: 'exam', subj: 'Chemistry', name: 'Chemistry P4', detail: 'Extended theory', min: 75, marks: 80 },
  { id: 'chem-p6', g: 'exam', subj: 'Chemistry', name: 'Chemistry P6', detail: 'Alternative to practical', min: 60, marks: 40 },
  { id: 'bio-p2', g: 'exam', subj: 'Biology', name: 'Biology P2', detail: 'Extended multiple choice', min: 45, marks: 40 },
  { id: 'bio-p4', g: 'exam', subj: 'Biology', name: 'Biology P4', detail: 'Extended theory', min: 75, marks: 80 },
  { id: 'bio-p6', g: 'exam', subj: 'Biology', name: 'Biology P6', detail: 'Alternative to practical', min: 60, marks: 40 },
  { id: 'math-p1', g: 'exam', subj: 'Mathematics', name: 'Maths Paper 1', detail: 'Edexcel 4MA1', min: 120, marks: 100 },
  { id: 'math-p2', g: 'exam', subj: 'Mathematics', name: 'Maths Paper 2', detail: 'Edexcel 4MA1', min: 120, marks: 100 },
];

export const NOISE_FACTORS: Record<string, number> = {
  white: 0.22,
  pink: 0.5,
  brown: 0.9,
  rain: 0.45,
};

export const NOISE_NAMES: Record<string, string> = {
  white: 'White',
  pink: 'Pink',
  brown: 'Brown',
  rain: 'Rain',
};
