import React, { useState, useEffect, useRef } from 'react';
import { CustomMode, NoiseSettings, NoiseType, Subject } from '../types';
import { BUILTIN_MODES, NOISE_NAMES, TimerModeItem } from '../constants/modes';
import { startNoise, stopNoise, updateNoiseVolume, playBeep } from '../utils/audio';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

interface TimerTabProps {
  subjects: Subject[];
  activeSubjectId: string;
  onSelectSubject: (id: string) => void;
  customs: CustomMode[];
  onAddCustom: (c: CustomMode) => void;
  onDeleteCustom: (id: string) => void;
  noise: NoiseSettings;
  onUpdateNoise: (n: Partial<NoiseSettings>) => void;
  initialModeId?: string;
}

const CIRCUMFERENCE = 2 * Math.PI * 88; // ~552.92

export const TimerTab: React.FC<TimerTabProps> = ({
  subjects,
  activeSubjectId,
  onSelectSubject,
  customs,
  onAddCustom,
  onDeleteCustom,
  noise,
  onUpdateNoise,
  initialModeId,
}) => {
  // Combine builtin modes + custom modes
  const allModes: TimerModeItem[] = [
    ...BUILTIN_MODES,
    ...customs.map((c) => ({
      id: c.id,
      g: 'custom' as const,
      name: c.name,
      min: c.min,
      marks: c.marks,
      detail: c.marks ? `${c.marks} marks` : undefined,
    })),
  ];

  const [currentMode, setCurrentMode] = useState<TimerModeItem>(() => {
    return allModes.find((m) => m.id === initialModeId) || allModes.find((m) => m.id === 'phys-p4') || allModes[0];
  });

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [done, setDone] = useState(false);
  const [warned, setWarned] = useState(false);
  const [noisePlaying, setNoisePlaying] = useState(false);

  // Custom mode input state
  const [cName, setCName] = useState('');
  const [cMin, setCMin] = useState(45);
  const [cMarks, setCMarks] = useState<number | ''>('');
  const [lockHint, setLockHint] = useState('');

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const durationMs = currentMode.min * 60 * 1000;
  const isLocked = running || elapsed > 0;

  // Remaining time in milliseconds
  const currentElapsed = elapsed + (running ? Date.now() - startedAt : 0);
  const remainingMs = Math.max(0, durationMs - currentElapsed);
  const remainingSec = Math.ceil(remainingMs / 1000);

  // Format helpers
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatClock = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };
  const formatMin = (min: number) => {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`;
  };

  // Wake lock management
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      }
    } catch {
      // ignore
    }
  };

  const releaseWakeLock = () => {
    try {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // ignore
    }
  };

  // Start / Pause / Reset handlers
  const handleStart = () => {
    if (done) {
      handleReset();
    }
    setRunning(true);
    setStartedAt(Date.now());
    requestWakeLock();
    if (noise.link) {
      startNoise(noise.type, noise.vol);
      setNoisePlaying(true);
    }
  };

  const handlePause = () => {
    setElapsed((prev) => prev + (Date.now() - startedAt));
    setRunning(false);
    releaseWakeLock();
    if (noise.link) {
      stopNoise();
      setNoisePlaying(false);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setDone(false);
    setWarned(false);
    setLockHint('');
    releaseWakeLock();
    if (noise.link) {
      stopNoise();
      setNoisePlaying(false);
    }
  };

  // Switch timer mode
  const handleSelectMode = (m: TimerModeItem) => {
    if (isLocked) {
      setLockHint('Reset the timer first to switch modes.');
      return;
    }
    setLockHint('');
    setCurrentMode(m);
    setElapsed(0);
    setRunning(false);
    setDone(false);
    setWarned(false);

    // If mode has an associated subject, switch active subject too
    if (m.subj) {
      const match = subjects.find((s) => s.name.toLowerCase() === m.subj?.toLowerCase());
      if (match) {
        onSelectSubject(match.id);
      }
    }
  };

  // Sound toggle
  const handleToggleNoise = () => {
    if (noisePlaying) {
      stopNoise();
      setNoisePlaying(false);
    } else {
      const ok = startNoise(noise.type, noise.vol);
      if (ok) setNoisePlaying(true);
    }
  };

  // Timer loop
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const current = elapsed + (now - startedAt);
      const rem = durationMs - current;

      // 10 min warning for exams
      if (currentMode.g === 'exam' && !warned && rem <= 600000 && durationMs > 600000) {
        setWarned(true);
        playBeep(1, 660);
      }

      // Finish condition
      if (rem <= 0) {
        setRunning(false);
        setElapsed(durationMs);
        setDone(true);
        releaseWakeLock();
        stopNoise();
        setNoisePlaying(false);
        playBeep(4, 880);
      } else {
        // Trigger re-render
        setElapsed((prev) => prev);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [running, elapsed, startedAt, durationMs, currentMode.g, warned]);

  // Volume slider sync
  const handleVolumeChange = (v: number) => {
    onUpdateNoise({ vol: v });
    updateNoiseVolume(v);
  };

  // Keyboard shortcut listener: Spacebar toggles start/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
          return;
        }
        e.preventDefault();
        if (running) {
          handlePause();
        } else {
          handleStart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [running, startedAt, elapsed, done]);

  // Update browser document title
  useEffect(() => {
    if (running) {
      document.title = `${formatClock(remainingSec)} · Study Studio`;
    } else {
      document.title = 'Study Studio — Exam Timer, Pacing & Grade Boundaries';
    }
  }, [running, remainingSec]);

  // SVG dash offset calculation
  const progressRatio = durationMs > 0 ? remainingMs / durationMs : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progressRatio);

  // Status Badge text and styling
  let statusText = 'Ready';
  let statusPillClass = 'bg-[var(--surface-2)] text-[var(--muted)]';
  if (done) {
    statusText = "Time's up";
    statusPillClass = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold';
  } else if (running) {
    if (currentMode.g === 'exam' && remainingMs <= 600000) {
      statusText = 'Last 10 min';
      statusPillClass = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold animate-pulse';
    } else {
      statusText = 'Running';
      statusPillClass = 'bg-[var(--accent-soft)] text-[var(--accent)] font-bold';
    }
  } else if (elapsed > 0) {
    statusText = 'Paused';
    statusPillClass = 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 font-bold';
  }

  // Pacing calculation if mode has marks
  const hasPacing = Boolean(currentMode.marks && currentMode.marks > 0);
  const pacePerMark = hasPacing ? currentMode.min / currentMode.marks! : 0;
  const paceProgress = durationMs > 0 ? (durationMs - remainingMs) / durationMs : 0;
  const activeCheckpoint = Math.min(4, Math.max(1, Math.ceil(paceProgress * 4)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* DIAL CARD */}
      <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col items-center gap-5 shadow-xs">
        <div className="w-full flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-[var(--muted)]">
              {currentMode.g === 'exam'
                ? 'Exam paper'
                : currentMode.g === 'focus'
                ? 'Focus session'
                : 'Custom session'}
            </div>
            <h2 className="font-display font-bold text-2xl text-[var(--ink)] tracking-tight">
              {currentMode.name}
            </h2>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider ${statusPillClass}`}>
            {statusText}
          </span>
        </div>

        {/* Circular SVG Dial */}
        <div className={`relative w-full max-w-[340px] aspect-square ${done ? 'dial-done-pulse' : ''}`}>
          <svg className="w-full h-full block transform -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="var(--line)"
              strokeWidth="8"
            />
            {/* Progress Arc */}
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-250 ease-linear"
            />
            {/* Subtle Quarter Ticks */}
            <g stroke="var(--muted)" strokeWidth="2" opacity="0.6">
              <line x1="100" y1="2" x2="100" y2="12" />
              <line x1="188" y1="100" x2="198" y2="100" />
              <line x1="100" y1="188" x2="100" y2="198" />
              <line x1="2" y1="100" x2="12" y2="100" />
            </g>
          </svg>

          {/* Dial Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <div
              className={`font-mono font-medium text-5xl sm:text-6xl tracking-tight leading-none tabular-nums ${
                done ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--ink)]'
              }`}
            >
              {formatClock(remainingSec)}
            </div>
            <div className="text-[var(--muted)] font-medium text-xs sm:text-sm mt-1">
              {done ? 'Session completed' : `of ${formatMin(currentMode.min)}`}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 flex-wrap justify-center w-full">
          <button
            type="button"
            onClick={running ? handlePause : handleStart}
            className="h-11 px-7 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-105 active:scale-95 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all min-w-[140px]"
          >
            {running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{done ? 'Restart' : running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!running && elapsed === 0 && !done}
            className="h-11 px-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)] active:scale-95 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <p className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 font-medium">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[10px]">
            Space
          </kbd>
          <span>to start or pause timer</span>
        </p>

        {/* Pacing Breakdown Table (when mode has marks) */}
        {hasPacing && currentMode.marks && (
          <div className="w-full border-t border-[var(--line)] pt-4 flex flex-col gap-3">
            <div className="flex justify-between items-baseline gap-2 flex-wrap">
              <h3 className="font-display font-bold text-sm text-[var(--ink)]">
                Pacing Guide · {currentMode.marks} marks total
              </h3>
              <span className="font-mono text-xs text-[var(--muted)]">
                {pacePerMark.toFixed(2)} min / mark
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--line)]">
                    <th className="py-1.5">Checkpoint</th>
                    <th className="py-1.5 text-right">Elapsed</th>
                    <th className="py-1.5 text-right">Target Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {[1, 2, 3, 4].map((q) => {
                    const em = (currentMode.min * q) / 4;
                    const mk = Math.round((currentMode.marks! * q) / 4);
                    const isNow = (running || elapsed > 0) && !done && activeCheckpoint === q;
                    return (
                      <tr
                        key={q}
                        className={`transition-colors ${
                          isNow
                            ? 'text-[var(--accent)] font-bold bg-[var(--accent-soft)]/20 rounded'
                            : 'text-[var(--ink)]'
                        }`}
                      >
                        <td className="py-2">
                          <span className="flex items-center gap-1.5">
                            {isNow && <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />}
                            {q === 4 ? 'Finish Exam' : `${q}/4 of the time`}
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono tabular-nums">
                          {formatClock(Math.round(em * 60))}
                        </td>
                        <td className="py-2 text-right font-mono tabular-nums">{mk} marks</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {currentMode.min >= 45 && (
              <p className="text-xs text-[var(--muted)] bg-[var(--surface-2)]/50 p-2.5 rounded-lg border border-[var(--line)]/50">
                💡 Aim to complete writing questions by{' '}
                <strong className="text-[var(--ink)] font-mono">
                  {formatClock((currentMode.min - 10) * 60)}
                </strong>{' '}
                elapsed to reserve the final 10 minutes for checking.
              </p>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: MODES & AMBIENT NOISE */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Mode Selector Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex justify-between items-center gap-2">
            <h2 className="font-display font-bold text-lg text-[var(--ink)]">Select Mode</h2>
            {lockHint && <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{lockHint}</span>}
          </div>

          {/* Focus Sessions */}
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Focus & Breaks</div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {allModes
                .filter((m) => m.g === 'focus')
                .map((m) => {
                  const selected = currentMode.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMode(m)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                          : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)]'
                      } ${isLocked ? 'opacity-70' : ''}`}
                    >
                      <b className="block font-display text-sm text-[var(--ink)]">{m.name}</b>
                      <small className="text-xs text-[var(--muted)] font-mono">{formatMin(m.min)}</small>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Exam Papers by Subject */}
          {['Physics', 'Chemistry', 'Biology', 'Mathematics'].map((subjectName) => {
            const papers = allModes.filter((m) => m.subj === subjectName);
            if (!papers.length) return null;
            return (
              <div key={subjectName} className="flex flex-col gap-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {subjectName} Papers
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {papers.map((m) => {
                    const selected = currentMode.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMode(m)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selected
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                            : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)]'
                        } ${isLocked ? 'opacity-70' : ''}`}
                      >
                        <b className="block font-display text-xs text-[var(--ink)] truncate">{m.name}</b>
                        <small className="text-[11px] text-[var(--muted)] font-mono block">
                          {formatMin(m.min)} {m.marks ? `· ${m.marks}m` : ''}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Custom Modes Section */}
          <div className="flex flex-col gap-2.5 border-t border-[var(--line)] pt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Custom Mode</div>
            {customs.length > 0 && (
              <div className="grid grid-cols-1 gap-2 mb-2">
                {customs.map((c) => {
                  const selected = currentMode.id === c.id;
                  return (
                    <div key={c.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectMode({ id: c.id, g: 'custom', name: c.name, min: c.min, marks: c.marks })}
                        className={`flex-1 text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selected
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                            : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)]'
                        } ${isLocked ? 'opacity-70' : ''}`}
                      >
                        <b className="font-display text-sm text-[var(--ink)]">{c.name}</b>
                        <span className="text-xs text-[var(--muted)] font-mono ml-2">
                          {c.min} min {c.marks ? `(${c.marks} marks)` : ''}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCustom(c.id)}
                        disabled={isLocked}
                        className="w-9 h-9 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                        title="Delete custom mode"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Custom Mode Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  placeholder="e.g. History essay"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  maxLength={30}
                  className="w-full h-9 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="number"
                  min="1"
                  max="600"
                  placeholder="Min"
                  value={cMin}
                  onChange={(e) => setCMin(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-9 px-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-mono text-center focus:outline-none focus:border-[var(--accent)]"
                  title="Minutes"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="Marks"
                  value={cMarks}
                  onChange={(e) => setCMarks(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full h-9 px-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-mono text-center focus:outline-none focus:border-[var(--accent)]"
                  title="Total marks (optional)"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  const m = cMin || 45;
                  const name = cName.trim() || `${m} min session`;
                  handleSelectMode({
                    id: 'tmp',
                    g: 'custom',
                    name,
                    min: m,
                    marks: typeof cMarks === 'number' && cMarks > 0 ? cMarks : undefined,
                  });
                }}
                className="flex-1 h-8 rounded-lg border border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--surface-2)] text-[var(--ink)] text-xs font-semibold cursor-pointer disabled:opacity-40"
              >
                Use once
              </button>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  const m = cMin || 45;
                  const name = cName.trim() || `${m} min session`;
                  const newCustom: CustomMode = {
                    id: `c-${Math.random().toString(36).slice(2, 8)}`,
                    name,
                    min: m,
                    marks: typeof cMarks === 'number' && cMarks > 0 ? cMarks : 0,
                  };
                  onAddCustom(newCustom);
                  setCName('');
                  handleSelectMode({
                    id: newCustom.id,
                    g: 'custom',
                    name: newCustom.name,
                    min: newCustom.min,
                    marks: newCustom.marks || undefined,
                  });
                }}
                className="flex-1 h-8 rounded-lg bg-[var(--ink)] text-[var(--surface)] hover:opacity-90 text-xs font-semibold cursor-pointer disabled:opacity-40"
              >
                Save mode
              </button>
            </div>
          </div>
        </div>

        {/* Ambient Noise / Sound Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex justify-between items-center gap-2">
            <h2 className="font-display font-bold text-lg text-[var(--ink)] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[var(--accent)]" />
              <span>Ambient Sound</span>
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                noisePlaying
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'bg-[var(--surface-2)] text-[var(--muted)]'
              }`}
            >
              {noisePlaying ? `${NOISE_NAMES[noise.type]} on` : 'Off'}
            </span>
          </div>

          {/* Sound Type Chips */}
          <div className="flex gap-1.5 flex-wrap">
            {(['white', 'pink', 'brown', 'rain'] as NoiseType[]).map((type) => {
              const active = noise.type === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onUpdateNoise({ type });
                    if (noisePlaying) {
                      startNoise(type, noise.vol);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-xs'
                      : 'border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--muted)]'
                  }`}
                >
                  {NOISE_NAMES[type]}
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-[var(--muted)] font-medium">
              <span>Volume</span>
              <span className="font-mono">{Math.round(noise.vol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={noise.vol}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none bg-[var(--line)] accent-[var(--accent)] cursor-pointer"
            />
          </div>

          {/* Play/Stop & Auto-Link */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <button
              type="button"
              onClick={handleToggleNoise}
              className={`h-9 px-4 rounded-xl font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                noisePlaying
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {noisePlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{noisePlaying ? 'Stop sound' : 'Play sound'}</span>
            </button>

            <label className="flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={noise.link}
                onChange={(e) => onUpdateNoise({ link: e.target.checked })}
                className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
              />
              <span>Auto start/stop with timer</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
