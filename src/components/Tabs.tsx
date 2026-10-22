import React from 'react';
import { Timer, TimerReset, Calendar, Award, BookOpen, Palette, Rocket } from 'lucide-react';

export type TabId = 'timer' | 'stopwatch' | 'exams' | 'grades' | 'subjects' | 'colours' | 'deploy';

interface TabsProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const Tabs: React.FC<TabsProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'timer', label: 'Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'stopwatch', label: 'Stopwatch', icon: <TimerReset className="w-4 h-4" /> },
    { id: 'exams', label: 'Exam countdown', icon: <Calendar className="w-4 h-4" /> },
    { id: 'grades', label: 'Grade boundaries', icon: <Award className="w-4 h-4" />, badge: 'June 2026' },
    { id: 'subjects', label: 'My subjects', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'colours', label: 'Colours', icon: <Palette className="w-4 h-4" /> },
    { id: 'deploy', label: 'Deploy & GitHub', icon: <Rocket className="w-4 h-4 text-emerald-500" />, badge: 'Public' },
  ];

  return (
    <div className="overflow-x-auto border-b border-[var(--line)] scrollbar-none">
      <div className="flex gap-1 min-w-max pb-px" role="tablist">
        {tabs.map((tab) => {
          const isSelected = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                isSelected
                  ? 'border-[var(--accent)] text-[var(--ink)] bg-[var(--accent-soft)]/20 rounded-t-lg'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]/40 rounded-t-lg'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[var(--accent)] text-[var(--on-accent)]'
                      : 'bg-[var(--surface-2)] text-[var(--muted)]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
