import React from 'react';
import { LookConfig, LookMode, PaletteKey, ThemeMode } from '../types';
import { HUES, HUE_NAMES, PALETTES, defaultLook } from '../constants/grades';
import { Palette, Sun, Moon, Monitor, RotateCcw } from 'lucide-react';

interface ColoursTabProps {
  look: LookConfig;
  theme: ThemeMode;
  onUpdateLook: (l: LookConfig) => void;
  onUpdateTheme: (t: ThemeMode) => void;
}

export const ColoursTab: React.FC<ColoursTabProps> = ({
  look,
  theme,
  onUpdateLook,
  onUpdateTheme,
}) => {
  const handleModeChange = (m: LookMode) => {
    onUpdateLook({ ...look, mode: m });
  };

  const handleFixedHueChange = (hue: number) => {
    onUpdateLook({ ...look, fixed: hue });
  };

  const handleToolHueChange = (tool: string, hue: number) => {
    onUpdateLook({
      ...look,
      tools: { ...look.tools, [tool]: hue },
    });
  };

  const handleBgPaletteChange = (bg: PaletteKey) => {
    onUpdateLook({ ...look, bg });
  };

  const handleReset = () => {
    onUpdateLook(defaultLook());
    onUpdateTheme('auto');
  };

  const toolsList: { id: string; label: string }[] = [
    { id: 'timer', label: 'Timer' },
    { id: 'stopwatch', label: 'Stopwatch' },
    { id: 'exams', label: 'Exam countdown' },
    { id: 'grades', label: 'Grade boundaries' },
    { id: 'subjects', label: 'My subjects' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: ACCENT COLOURS & THEME */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Accent Strategy Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
            <h2 className="font-display font-bold text-lg text-[var(--ink)] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[var(--accent)]" />
              <span>Accent Colour Dynamics</span>
            </h2>
          </div>

          <div className="flex gap-2 flex-wrap" role="group" aria-label="Accent colour source">
            {[
              { id: 'subject' as LookMode, label: 'Follow active subject' },
              { id: 'fixed' as LookMode, label: 'Single universal colour' },
              { id: 'tool' as LookMode, label: 'Distinct colour per tool' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeChange(m.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  look.mode === m.id
                    ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-xs'
                    : 'border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--muted)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {look.mode === 'subject' && (
            <div className="p-3.5 rounded-xl bg-[var(--surface-2)]/60 text-xs text-[var(--muted)] leading-relaxed border border-[var(--line)]/50">
              The interface accent dynamically matches whichever subject you pick in the top header.
              You can customize each subject's hue individually under <strong>My subjects</strong>.
            </div>
          )}

          {look.mode === 'fixed' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium text-[var(--muted)]">
                  <span>Accent Hue Slider</span>
                  <span className="font-mono text-[var(--ink)]">{look.fixed}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={look.fixed}
                  onChange={(e) => handleFixedHueChange(parseInt(e.target.value, 10))}
                  className="hue-slider w-full"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {HUES.map((h, i) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleFixedHueChange(h)}
                    title={HUE_NAMES[i]}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer shadow-xs ${
                      look.fixed === h ? 'ring-2 ring-[var(--ink)] scale-110' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: `hsl(${h} 75% 45%)` }}
                  />
                ))}
              </div>
            </div>
          )}

          {look.mode === 'tool' && (
            <div className="flex flex-col gap-3.5">
              {toolsList.map((t) => {
                const currentVal = look.tools[t.id] ?? 215;
                return (
                  <div key={t.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-medium text-[var(--muted)]">
                      <span>{t.label}</span>
                      <span className="font-mono text-[var(--ink)]">{currentVal}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={currentVal}
                      onChange={(e) => handleToolHueChange(t.id, parseInt(e.target.value, 10))}
                      className="hue-slider w-full"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme (Light / Dark / Auto) */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
          <h2 className="font-display font-bold text-lg text-[var(--ink)]">Lighting Mode</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'auto' as ThemeMode, label: 'System Auto', icon: <Monitor className="w-4 h-4" /> },
              { id: 'light' as ThemeMode, label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
              { id: 'dark' as ThemeMode, label: 'Dark', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onUpdateTheme(t.id)}
                className={`py-3 px-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === t.id
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)] shadow-xs'
                    : 'border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--muted)]'
                }`}
              >
                {t.icon}
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: BACKGROUND PALETTES */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
          <h2 className="font-display font-bold text-lg text-[var(--ink)]">Surface & Neutral Palettes</h2>
          <p className="text-xs text-[var(--muted)]">
            Choose subtle background undertones tailored for extended study sessions with low eye strain.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(PALETTES) as PaletteKey[]).map((k) => {
              const p = PALETTES[k];
              const lightSamples = p.l || ['#ECEFF3', '#FFFFFF'];
              const darkSamples = p.d || ['#0E1217', '#161B22'];
              const isSelected = look.bg === k;

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleBgPaletteChange(k)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                      : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)]'
                  }`}
                >
                  <b className="font-display text-sm text-[var(--ink)]">{p.n}</b>
                  <div className="flex gap-1.5">
                    <span
                      className="w-4 h-4 rounded border border-black/10 shadow-2xs"
                      style={{ backgroundColor: lightSamples[0] }}
                      title="Light bg"
                    />
                    <span
                      className="w-4 h-4 rounded border border-black/10 shadow-2xs"
                      style={{ backgroundColor: lightSamples[1] }}
                      title="Light surface"
                    />
                    <span
                      className="w-4 h-4 rounded border border-white/10 shadow-2xs"
                      style={{ backgroundColor: darkSamples[0] }}
                      title="Dark bg"
                    />
                    <span
                      className="w-4 h-4 rounded border border-white/10 shadow-2xs"
                      style={{ backgroundColor: darkSamples[1] }}
                      title="Dark surface"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="h-11 px-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-rose-600 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset all colours to default</span>
        </button>
      </div>
    </div>
  );
};
