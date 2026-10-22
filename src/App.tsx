import React, { useState, useEffect } from 'react';
import { AppState, CustomMode, Exam, ExamBoard, LookConfig, NoiseSettings, Subject, ThemeMode } from './types';
import { PALETTES, applyBounds, defaultLook } from './constants/grades';
import { Header } from './components/Header';
import { TabId, Tabs } from './components/Tabs';
import { TimerTab } from './components/TimerTab';
import { StopwatchTab } from './components/StopwatchTab';
import { ExamsTab } from './components/ExamsTab';
import { GradesTab } from './components/GradesTab';
import { SubjectsTab } from './components/SubjectsTab';
import { ColoursTab } from './components/ColoursTab';
import { DeployModal } from './components/DeployModal';

const STORAGE_KEY = 'studystudio.v2';

function getInitialState(): AppState {
  const seedSubjects: Subject[] = [
    { id: 'phys', name: 'Physics', board: 'cambridge', hue: 215, bounds: { max: 200, marks: [] }, mark: 148 },
    { id: 'math', name: 'Mathematics', board: 'edexcel', hue: 28, bounds: { max: 200, marks: [] }, mark: 168 },
    { id: 'chem', name: 'Chemistry', board: 'cambridge', hue: 150, bounds: { max: 200, marks: [] }, mark: 132 },
  ];
  seedSubjects.forEach((s) => applyBounds(s));

  const seedExams: Exam[] = [
    { id: 'e1', sid: 'phys', subj: 'Physics', paper: 'Paper 4 (Extended Theory)', when: '2027-05-13T09:00', ex: true },
    { id: 'e2', sid: 'math', subj: 'Mathematics', paper: 'Paper 1 (Non-Calculator)', when: '2027-05-20T09:00', ex: true },
    { id: 'e3', sid: 'phys', subj: 'Physics', paper: 'Paper 6 (Alternative to Practical)', when: '2027-05-26T09:00', ex: true },
  ];

  const defaultState: AppState = {
    v: 2,
    theme: 'auto',
    active: 'phys',
    mode: 'phys-p4',
    subjects: seedSubjects,
    customs: [],
    exams: seedExams,
    noise: { type: 'brown', vol: 0.5, link: true },
    look: defaultLook(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
        return {
          ...defaultState,
          ...parsed,
          noise: { ...defaultState.noise, ...(parsed.noise || {}) },
          look: {
            ...defaultState.look,
            ...(parsed.look || {}),
            tools: { ...defaultState.look.tools, ...(parsed.look?.tools || {}) },
          },
        };
      }
    }
  } catch {
    // fallback to default
  }

  return defaultState;
}

export default function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [currentTab, setCurrentTab] = useState<TabId>('timer');
  const [isDeployOpen, setIsDeployOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage error handling
    }
  }, [state]);

  // Compute effective hue
  const activeSubject = state.subjects.find((s) => s.id === state.active) || state.subjects[0];
  let effectiveHue = activeSubject ? activeSubject.hue : 215;

  if (state.look.mode === 'fixed') {
    effectiveHue = state.look.fixed;
  } else if (state.look.mode === 'tool') {
    effectiveHue = state.look.tools[currentTab] ?? state.look.fixed ?? 215;
  }

  // Determine if dark mode is active
  const isDarkMode = () => {
    if (state.theme === 'dark') return true;
    if (state.theme === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Apply theme & colors to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--h', `${effectiveHue}`);

    if (state.theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', state.theme);
    }

    // Apply background palette
    const p = PALETTES[state.look.bg] || PALETTES.slate;
    const keys = ['--bg', '--surface', '--surface-2', '--line'];
    const dark = isDarkMode();

    if (p.l && p.d) {
      const vals = dark ? p.d : p.l;
      keys.forEach((k, idx) => {
        root.style.setProperty(k, vals[idx]);
      });
    } else {
      keys.forEach((k) => root.style.removeProperty(k));
    }
  }, [effectiveHue, state.theme, state.look.bg]);

  // Handlers for subject manipulation
  const handleSelectSubject = (id: string) => {
    setState((prev) => ({ ...prev, active: id }));
  };

  const handleAddSubject = (name: string, board: ExamBoard, max?: number) => {
    const newSubject: Subject = {
      id: `s-${Math.random().toString(36).slice(2, 8)}`,
      name,
      board,
      hue: [215, 175, 150, 45, 28, 8, 330, 290, 255][state.subjects.length % 9],
      bounds: { max: max || 100, marks: [] },
      mark: null,
    };
    applyBounds(newSubject, max);

    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
      active: newSubject.id,
    }));
  };

  const handleUpdateSubject = (updated: Subject) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const handleDeleteSubject = (id: string) => {
    if (state.subjects.length <= 1) return;
    setState((prev) => {
      const nextSubjects = prev.subjects.filter((s) => s.id !== id);
      const nextActive = prev.active === id ? nextSubjects[0].id : prev.active;
      return {
        ...prev,
        subjects: nextSubjects,
        active: nextActive,
      };
    });
  };

  // Handlers for exams
  const handleAddExam = (exam: Exam) => {
    setState((prev) => ({
      ...prev,
      exams: [...prev.exams, exam],
    }));
  };

  const handleDeleteExam = (id: string) => {
    setState((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== id),
    }));
  };

  // Handlers for customs
  const handleAddCustom = (custom: CustomMode) => {
    setState((prev) => ({
      ...prev,
      customs: [...prev.customs, custom],
    }));
  };

  const handleDeleteCustom = (id: string) => {
    setState((prev) => ({
      ...prev,
      customs: prev.customs.filter((c) => c.id !== id),
    }));
  };

  // Handlers for noise & look
  const handleUpdateNoise = (n: Partial<NoiseSettings>) => {
    setState((prev) => ({
      ...prev,
      noise: { ...prev.noise, ...n },
    }));
  };

  const handleUpdateLook = (look: LookConfig) => {
    setState((prev) => ({ ...prev, look }));
  };

  const handleUpdateTheme = (theme: ThemeMode) => {
    setState((prev) => ({ ...prev, theme }));
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode =
      state.theme === 'auto' ? 'light' : state.theme === 'light' ? 'dark' : 'auto';
    handleUpdateTheme(nextTheme);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-16 flex flex-col gap-6">
        {/* Navigation & Header */}
        <Header
          subjects={state.subjects}
          activeSubjectId={state.active}
          onSelectSubject={handleSelectSubject}
          theme={state.theme}
          onToggleTheme={handleToggleTheme}
          onOpenDeploy={() => setIsDeployOpen(true)}
        />

        {/* Tab Strip */}
        <Tabs
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'deploy') {
              setIsDeployOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
        />

        {/* Tab Content */}
        <main className="w-full">
          {currentTab === 'timer' && (
            <TimerTab
              subjects={state.subjects}
              activeSubjectId={state.active}
              onSelectSubject={handleSelectSubject}
              customs={state.customs}
              onAddCustom={handleAddCustom}
              onDeleteCustom={handleDeleteCustom}
              noise={state.noise}
              onUpdateNoise={handleUpdateNoise}
              initialModeId={state.mode}
            />
          )}

          {currentTab === 'stopwatch' && <StopwatchTab />}

          {currentTab === 'exams' && (
            <ExamsTab
              subjects={state.subjects}
              exams={state.exams}
              onAddExam={handleAddExam}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {currentTab === 'grades' && (
            <GradesTab
              subjects={state.subjects}
              onUpdateSubject={handleUpdateSubject}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectsTab
              subjects={state.subjects}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {currentTab === 'colours' && (
            <ColoursTab
              look={state.look}
              theme={state.theme}
              onUpdateLook={handleUpdateLook}
              onUpdateTheme={handleUpdateTheme}
            />
          )}
        </main>
      </div>

      {/* Deploy to GitHub & Make Public Guide Modal */}
      <DeployModal isOpen={isDeployOpen} onClose={() => setIsDeployOpen(false)} />
    </div>
  );
}
