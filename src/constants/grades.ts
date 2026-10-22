import { ExamBoard, LookConfig, PaletteKey, Subject } from '../types';

export const HUES = [215, 175, 150, 45, 28, 8, 330, 290, 255];
export const HUE_NAMES = ['Blue', 'Teal', 'Green', 'Amber', 'Orange', 'Red', 'Pink', 'Purple', 'Indigo'];

export const NINE = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];

export const SCALE: Record<ExamBoard, string[]> = {
  cambridge: ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
  edexcel: NINE,
  oxford: NINE,
};

export const PCT: Record<ExamBoard, number[]> = {
  cambridge: [78, 66, 54, 42, 32, 22, 12, 6],
  edexcel: [80, 70, 60, 51, 42, 33, 24, 15, 6],
  oxford: [80, 70, 60, 51, 42, 33, 24, 15, 6],
};

export const BOARD_NAME: Record<ExamBoard, string> = {
  cambridge: 'Cambridge · A* to G',
  edexcel: 'Edexcel · 9 to 1',
  oxford: 'OxfordAQA · 9 to 1',
};

export const SRC_NAME: Record<ExamBoard, string> = {
  cambridge: 'Cambridge',
  edexcel: 'Pearson Edexcel',
  oxford: 'OxfordAQA',
};

export const PALETTES: Record<PaletteKey, { n: string; l?: string[]; d?: string[] }> = {
  slate: { n: 'Slate' },
  ink: { n: 'Ink', l: ['#E9EEF7', '#FFFFFF', '#DDE5F2', '#C3CEE2'], d: ['#0A1020', '#121B30', '#1A2640', '#27344F'] },
  forest: { n: 'Forest', l: ['#E8F0EA', '#FFFFFF', '#DAE6DD', '#BFD0C4'], d: ['#0C1511', '#131E19', '#1B2A23', '#2A3B32'] },
  plum: { n: 'Plum', l: ['#F1EAF2', '#FFFFFF', '#E6DAE8', '#D2C2D5'], d: ['#160E19', '#1F1524', '#2B1D31', '#3B2A43'] },
  paper: { n: 'Paper', l: ['#F1EEE8', '#FFFFFF', '#E7E2D8', '#D3CCBE'], d: ['#14120E', '#1D1A15', '#27231C', '#383228'] },
  mono: { n: 'Mono', l: ['#EFEFEF', '#FFFFFF', '#E2E2E2', '#CFCFCF'], d: ['#0B0B0B', '#151515', '#1F1F1F', '#2D2D2D'] },
};

export function defaultLook(): LookConfig {
  return {
    mode: 'subject',
    fixed: 215,
    tools: { timer: 215, stopwatch: 175, exams: 28, grades: 290, subjects: 150 },
    bg: 'slate',
  };
}

export interface CatalogItem {
  n: string;
  b: ExamBoard;
  m: number;
}

export const CATALOG: CatalogItem[] = [
  { n: 'Physics', b: 'cambridge', m: 160 },
  { n: 'Chemistry', b: 'cambridge', m: 160 },
  { n: 'Biology', b: 'cambridge', m: 160 },
  { n: 'Combined Science', b: 'edexcel', m: 240 },
  { n: 'Mathematics', b: 'edexcel', m: 200 },
  { n: 'Additional Mathematics', b: 'cambridge', m: 120 },
  { n: 'Further Pure Mathematics', b: 'edexcel', m: 200 },
  { n: 'English Language', b: 'cambridge', m: 100 },
  { n: 'English Literature', b: 'cambridge', m: 100 },
  { n: 'Computer Science', b: 'cambridge', m: 150 },
  { n: 'ICT', b: 'cambridge', m: 100 },
  { n: 'Business Studies', b: 'cambridge', m: 160 },
  { n: 'Economics', b: 'cambridge', m: 130 },
  { n: 'Accounting', b: 'cambridge', m: 100 },
  { n: 'Geography', b: 'cambridge', m: 120 },
  { n: 'History', b: 'cambridge', m: 100 },
  { n: 'Sociology', b: 'cambridge', m: 100 },
  { n: 'Arabic', b: 'cambridge', m: 100 },
  { n: 'French', b: 'cambridge', m: 100 },
  { n: 'Spanish', b: 'cambridge', m: 100 },
  { n: 'German', b: 'cambridge', m: 100 },
  { n: 'Islamic Studies', b: 'cambridge', m: 100 },
  { n: 'Art and Design', b: 'cambridge', m: 100 },
  { n: 'Physical Education', b: 'cambridge', m: 100 },
  { n: 'Psychology', b: 'oxford', m: 200 },
  { n: 'Media Studies', b: 'oxford', m: 200 },
  { n: 'Urdu', b: 'oxford', m: 140 },
  { n: 'Pakistan Studies', b: 'edexcel', m: 150 },
  { n: 'Commerce', b: 'edexcel', m: 160 },
  { n: 'Human Biology', b: 'edexcel', m: 180 },
  { n: 'Religious Studies', b: 'edexcel', m: 167 },
  { n: 'Chinese', b: 'edexcel', m: 160 },
  { n: 'Science (Single Award)', b: 'edexcel', m: 180 },
];

export const DB: Record<ExamBoard, Record<string, [string, number, (number | null)[], string?]>> = {
  cambridge: {
    'Physics': ['0625', 200, [162, 137, 112, 88, 77, 67, 57, 47], 'Extended, routes 21+41+51. Core and other routes differ'],
    'Chemistry': ['0620', 200, [173, 147, 119, 91, 78, 66, 53, 40], 'Extended, routes 21+41+51. Core and other routes differ'],
    'Mathematics': ['0580', 200, [162, 138, 114, 90, 73, 56, null, null], 'Extended, routes 21+41. No F or G on extended'],
    'English Language': ['0500', 160, [116, 103, 90, 78, 65, 53, 41, 29], 'First Language, routes 11+21'],
  },
  edexcel: {
    'Accounting': ['4AC1', 150, [133, 121, 109, 98, 87, 76, 57, 39, 21]],
    'Arabic': ['4AA1', 125, [87, 78, 69, 61, 53, 45, 35, 25, 16], 'First Language'],
    'Art and Design': ['4FA1', 144, [122, 112, 102, 90, 79, 68, 53, 38, 24], 'Fine Art, Graphic Communication, Photography, 3D, Textiles'],
    'Biology': ['4BI1', 180, [142, 127, 112, 97, 82, 67, 55, 43, 32]],
    'Business Studies': ['4BS1', 160, [133, 124, 115, 103, 92, 81, 70, 59, 48]],
    'Chemistry': ['4CH1', 180, [141, 122, 103, 90, 78, 66, 53, 41, 29]],
    'Chinese': ['4CN1', 160, [146, 133, 121, 113, 106, 99, 77, 55, 34]],
    'Commerce': ['4CM1', 160, [125, 118, 111, 104, 97, 91, 81, 71, 61]],
    'Computer Science': ['4CP0', 160, [140, 130, 121, 108, 95, 82, 60, 39, 18]],
    'Economics': ['4EC1', 160, [122, 112, 102, 93, 85, 77, 64, 51, 38]],
    'English Language': ['4EA1', 150, [113, 105, 98, 88, 78, 69, 51, 34, 17], 'Language A'],
    'English Literature': ['4ET1', 150, [121, 113, 106, 93, 81, 69, 52, 36, 20]],
    'French': ['4FR1', 160, [130, 116, 103, 93, 83, 74, 56, 38, 20]],
    'Further Pure Mathematics': ['4PM1', 200, [180, 166, 152, 122, 92, 62, 47, null, null]],
    'Geography': ['4GE1', 175, [138, 126, 114, 100, 87, 74, 59, 44, 29]],
    'German': ['4GN1', 160, [139, 123, 108, 92, 76, 61, 51, 41, 31]],
    'History': ['4HI1', 120, [99, 91, 83, 74, 66, 58, 43, 28, 14]],
    'Human Biology': ['4HB1', 180, [156, 143, 131, 117, 103, 89, 71, 53, 36]],
    'ICT': ['4IT1', 200, [153, 139, 125, 109, 93, 78, 60, 42, 24]],
    'Islamic Studies': ['4IS1', 90, [79, 76, 74, 69, 64, 59, 52, 45, 39]],
    'Mathematics': ['4MA1', 200, [165, 138, 111, 87, 64, 41, 29, null, null], 'Higher tier. Foundation tier: 5 = 148, 4 = 125, 3 = 90, 2 = 56, 1 = 22'],
    'Pakistan Studies': ['4PA1', 150, [129, 117, 106, 95, 85, 75, 59, 43, 27]],
    'Physics': ['4PH1', 180, [138, 121, 105, 94, 83, 72, 60, 49, 38]],
    'Religious Studies': ['4RS1', 167, [115, 106, 98, 89, 81, 73, 61, 49, 37]],
    'Science (Single Award)': ['4SS0', 180, [161, 145, 130, 115, 100, 86, 70, 54, 38]],
    'Spanish': ['4SP1', 160, [138, 119, 101, 88, 76, 64, 51, 38, 25]],
  },
  oxford: {
    'Accounting': ['9215', 150, [111, 98, 85, 72, 59, 46, 36, 27, 18]],
    'Biology': ['9201', 180, [126, 115, 105, 92, 80, 68, 51, 35, 19]],
    'Business Studies': ['9225', 180, [138, 128, 118, 104, 91, 78, 60, 42, 24]],
    'Chemistry': ['9202', 180, [148, 133, 118, 101, 84, 68, 51, 34, 18]],
    'Computer Science': ['9210', 160, [138, 124, 111, 94, 78, 62, 47, 33, 19]],
    'Economics': ['9214', 160, [126, 118, 111, 98, 86, 74, 56, 38, 20]],
    'English Language': ['9270W', 200, [164, 147, 130, 112, 95, 78, 58, 39, 20], 'Written route'],
    'English Literature': ['9275A', 150, [119, 106, 93, 81, 69, 58, 43, 29, 15], 'Route A'],
    'French': ['9265', 240, [186, 166, 147, 132, 117, 103, 76, 50, 24]],
    'Geography': ['9230', 220, [155, 141, 127, 113, 99, 85, 62, 39, 16]],
    'Islamic Studies': ['9237', 100, [81, 73, 65, 57, 49, 42, 31, 20, 10], 'Islamiat'],
    'Mathematics': ['9260E', 200, [166, 136, 106, 84, 63, 42, 31, null, null], 'Extension. Core (9260C, out of 160): 102, 82, 62, 42, 22 for grades 5 to 1'],
    'Media Studies': ['9257', 200, [156, 143, 131, 115, 99, 83, 62, 41, 20]],
    'Pakistan Studies': ['9236', 154, [116, 105, 94, 83, 72, 61, 45, 30, 15]],
    'Physics': ['9203', 180, [144, 132, 121, 110, 99, 88, 69, 50, 31]],
    'Psychology': ['9218', 200, [158, 144, 130, 111, 92, 74, 53, 32, 11]],
    'Spanish': ['9269', 240, [178, 163, 148, 133, 119, 105, 78, 51, 24]],
    'Urdu': ['9264', 140, [130, 121, 112, 101, 90, 80, 58, 36, 14]],
  },
};

export function lookupBounds(board: ExamBoard, name: string) {
  const t = DB[board];
  if (!t) return null;
  let n = name.trim().toLowerCase();
  if (n === 'maths') n = 'mathematics';
  if (n === 'business') n = 'business studies';

  for (const k in t) {
    if (k.toLowerCase() === n) {
      const d = t[k];
      return { code: d[0], max: d[1], m: d[2], note: d[3] || '' };
    }
  }
  return null;
}

export function defaultBounds(board: ExamBoard, max: number) {
  return {
    max: max,
    marks: PCT[board].map((p) => Math.round((max * p) / 100)),
  };
}

export function applyBounds(s: Subject, mx?: number) {
  const d = lookupBounds(s.board, s.name);
  const n = SCALE[s.board].length;
  const cat = CATALOG.find((c) => c.n.toLowerCase() === s.name.toLowerCase());

  if (d) {
    s.bounds = { max: d.max, marks: d.m.slice(0, n) };
    s.src = {
      official: true,
      text: `${SRC_NAME[s.board]} · June 2026 · ${d.code}${d.note ? ' · ' + d.note : ''}`,
    };
  } else {
    s.bounds = defaultBounds(s.board, mx || (cat ? cat.m : 100));
    s.src = { official: false };
  }
}
