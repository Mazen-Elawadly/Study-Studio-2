import React from 'react';
import { Subject, ThemeMode } from '../types';
import { Clock, Moon, Sun, Monitor, Github, Sparkles } from 'lucide-react';

interface HeaderProps {
  subjects: Subject[];
  activeSubjectId: string;
  onSelectSubject: (id: string) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenDeploy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  subjects,
  activeSubjectId,
  onSelectSubject,
  theme,
  onToggleTheme,
  onOpenDeploy,
}) => {
  const activeSubj = subjects.find((s) => s.id === activeSubjectId) || subjects[0];

  return (
    <header className="flex items-center justify-between gap-3 flex-wrap pb-2 border-b border-[var(--line)]">
      <div className="flex items-center gap-2.5 text-[var(--accent)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shadow-xs">
          <Clock className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-2xl tracking-tight text-[var(--ink)] leading-none">
            Study Studio
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Revision & Exam Suite
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Active Subject Selector */}
        <label
          className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--line)] rounded-lg px-2.5 h-10 shadow-2xs hover:border-[var(--muted)] transition-colors cursor-pointer"
          title="Active subject for styling and quick focus"
        >
          <span
            className="w-3 h-3 rounded-full flex-none transition-transform hover:scale-125"
            style={{ backgroundColor: `hsl(${activeSubj?.hue || 215} 75% 45%)` }}
          />
          <select
            value={activeSubjectId}
            onChange={(e) => onSelectSubject(e.target.value)}
            className="bg-transparent border-0 font-semibold text-sm focus:outline-none pr-1 max-w-[170px] truncate text-[var(--ink)] cursor-pointer"
            aria-label="Active subject"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-[var(--surface)] text-[var(--ink)]">
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="h-10 px-3.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--ink)] font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          title="Switch theme (Auto / Light / Dark)"
        >
          {theme === 'auto' && <Monitor className="w-4 h-4 text-[var(--muted)]" />}
          {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
          {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
          <span className="capitalize">Theme: {theme}</span>
        </button>

        {/* GitHub & Deploy to Public Button */}
        <button
          type="button"
          onClick={onOpenDeploy}
          className="h-10 px-3.5 rounded-lg bg-[var(--ink)] text-[var(--surface)] hover:opacity-90 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          title="Deploy to GitHub & make public"
        >
          <Github className="w-4 h-4" />
          <span>Deploy & Public</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </header>
  );
};
