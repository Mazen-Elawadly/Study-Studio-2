import React, { useState, useEffect, useRef } from 'react';
import { LapItem } from '../types';
import { Play, Pause, RotateCcw, Flag, Trophy, Clock } from 'lucide-react';

export const StopwatchTab: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [baseTime, setBaseTime] = useState(0);
  const [laps, setLaps] = useState<LapItem[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const getElapsed = () => {
    return baseTime + (running ? performance.now() - startTimeRef.current : 0);
  };

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatStopwatch = (ms: number) => {
    const cs = Math.floor(ms / 10) % 100;
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    const main = `${h > 0 ? `${h}:${pad(m)}` : pad(m)}:${pad(sec)}`;
    return { main, cs: pad(cs) };
  };

  const updateLoop = () => {
    setDisplayTime(getElapsed());
    if (running) {
      rafRef.current = requestAnimationFrame(updateLoop);
    }
  };

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(updateLoop);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const handleStart = () => {
    startTimeRef.current = performance.now();
    setRunning(true);
  };

  const handleStop = () => {
    const elapsed = baseTime + (performance.now() - startTimeRef.current);
    setBaseTime(elapsed);
    setDisplayTime(elapsed);
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setBaseTime(0);
    setDisplayTime(0);
    setLaps([]);
    setLastLapTime(0);
  };

  const handleLap = () => {
    const now = getElapsed();
    const split = now - lastLapTime;
    const newLap: LapItem = {
      id: Math.random().toString(36).slice(2, 9),
      split,
      total: now,
    };
    setLaps((prev) => [newLap, ...prev]);
    setLastLapTime(now);
  };

  // Find fastest & slowest lap when >= 3 laps
  let bestIdx = -1;
  let worstIdx = -1;
  if (laps.length >= 3) {
    let minSplit = Infinity;
    let maxSplit = -1;
    laps.forEach((l, i) => {
      if (l.split < minSplit) {
        minSplit = l.split;
        bestIdx = i;
      }
      if (l.split > maxSplit) {
        maxSplit = l.split;
        worstIdx = i;
      }
    });
  }

  const { main, cs } = formatStopwatch(displayTime);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* STOPWATCH DIAL / READOUT */}
      <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6 shadow-xs">
        <div className="w-full flex justify-between items-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Precision Stopwatch
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)]">
            {running ? 'Running' : baseTime > 0 ? 'Paused' : 'Ready'}
          </span>
        </div>

        <div className="py-6 select-none flex items-baseline justify-center">
          <span className="font-mono font-medium text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-none tabular-nums text-[var(--ink)]">
            {main}
          </span>
          <span className="font-mono text-3xl sm:text-4xl text-[var(--muted)] font-normal ml-1">
            .{cs}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-center w-full">
          <button
            type="button"
            onClick={running ? handleStop : handleStart}
            className="h-11 px-7 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-105 active:scale-95 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all min-w-[140px]"
          >
            {running ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{running ? 'Stop' : baseTime > 0 ? 'Resume' : 'Start'}</span>
          </button>
          <button
            type="button"
            onClick={handleLap}
            disabled={!running}
            className="h-11 px-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)] active:scale-95 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
          >
            <Flag className="w-4 h-4" />
            <span>Lap</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!running && baseTime === 0 && laps.length === 0}
            className="h-11 px-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-2)] active:scale-95 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <p className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Ideal for timing individual exam questions, essays, and multiple-choice drills</span>
        </p>
      </div>

      {/* LAPS SPLIT LOG */}
      <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
          <h2 className="font-display font-bold text-lg text-[var(--ink)] flex items-center gap-2">
            <span>Recorded Laps</span>
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            {laps.length} {laps.length === 1 ? 'lap' : 'laps'}
          </span>
        </div>

        {laps.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
            <Flag className="w-6 h-6 text-[var(--muted)]/50 stroke-1" />
            <p>Press <strong>Lap</strong> while timing to log question or section splits.</p>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[var(--line)] pr-1">
            {laps.map((lap, index) => {
              const lapNumber = laps.length - index;
              const isBest = index === bestIdx;
              const isWorst = index === worstIdx;

              const splitFmt = formatStopwatch(lap.split);
              const totalFmt = formatStopwatch(lap.total);

              return (
                <div
                  key={lap.id}
                  className="py-2.5 flex items-center justify-between text-xs transition-colors hover:bg-[var(--surface-2)]/30 rounded px-1"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[var(--muted)] w-8">#{lapNumber}</span>
                    <span className="font-mono font-bold text-[var(--ink)]">
                      +{splitFmt.main}.{splitFmt.cs}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[var(--muted)]">
                      {totalFmt.main}.{totalFmt.cs}
                    </span>
                    {isBest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>Fastest</span>
                      </span>
                    )}
                    {isWorst && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        Slowest
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
