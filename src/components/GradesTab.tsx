import React from 'react';
import { Subject } from '../types';
import { BOARD_NAME, SCALE, applyBounds } from '../constants/grades';
import { Award, ExternalLink, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

interface GradesTabProps {
  subjects: Subject[];
  onUpdateSubject: (updated: Subject) => void;
}

export const GradesTab: React.FC<GradesTabProps> = ({ subjects, onUpdateSubject }) => {
  // Compute calculated grade for a given subject and mark
  const calculateGrade = (s: Subject) => {
    const m = s.mark;
    if (m === null || m === undefined || isNaN(m) || m === ('' as unknown as number)) return null;
    const sc = SCALE[s.board];
    const mk = s.bounds.marks;

    for (let i = 0; i < sc.length; i++) {
      if (mk[i] == null) continue;
      if (m >= mk[i]!) {
        let j = i - 1;
        while (j >= 0 && mk[j] == null) j--;
        return {
          grade: sc[i],
          idx: i,
          next: j >= 0 ? mk[j]! - m : null,
          nextName: j >= 0 ? sc[j] : null,
        };
      }
    }

    for (let i = sc.length - 1; i >= 0; i--) {
      if (mk[i] != null) {
        return {
          grade: 'U',
          idx: sc.length,
          next: mk[i]! - m,
          nextName: sc[i],
        };
      }
    }
    return { grade: 'U', idx: sc.length, next: null, nextName: null };
  };

  const handleReset = (s: Subject) => {
    const updated = { ...s };
    applyBounds(updated, s.bounds.max);
    onUpdateSubject(updated);
  };

  const handleMaxChange = (s: Subject, newMax: number) => {
    if (newMax > 0) {
      onUpdateSubject({
        ...s,
        bounds: { ...s.bounds, max: newMax },
      });
    }
  };

  const handleMarkChange = (s: Subject, val: string) => {
    const num = val === '' ? null : parseFloat(val);
    onUpdateSubject({
      ...s,
      mark: num,
    });
  };

  const handleThresholdChange = (s: Subject, index: number, val: string) => {
    const num = val === '' ? null : parseFloat(val);
    const updatedMarks = [...s.bounds.marks];
    updatedMarks[index] = num;
    onUpdateSubject({
      ...s,
      bounds: {
        ...s.bounds,
        marks: updatedMarks,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Notice Card */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Award className="w-5 h-5 stroke-[2.5]" />
          <h2 className="font-display font-bold text-xl text-[var(--ink)] tracking-tight">
            Grade Boundaries & Component Thresholds
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-4xl leading-relaxed">
          Subjects marked <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Official</strong> use
          the June 2026 threshold tables from Cambridge International, Pearson Edexcel, and OxfordAQA.
          Boundaries change with each examination series; you can calibrate any threshold to your school's mock
          grade boundaries or paper route, then enter your raw score to see your exact grade and marks to the next band.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-xs">
          <a
            href="https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/grade-threshold-tables/june-2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>Cambridge International 2026 Tables</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-GCSE/grade-boundaries-june-2026-international-gcse.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>Pearson Edexcel Boundaries</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.oxfordaqa.com/exams-admin/results/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>OxfordAQA Grade Results</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Grade Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((s) => {
          const sc = SCALE[s.board];
          const mk = s.bounds.marks;
          const max = Math.max(1, s.bounds.max);
          const res = calculateGrade(s);

          // Prepare segments for the visual bar
          const validIndices: number[] = [];
          for (let i = sc.length - 1; i >= 0; i--) {
            if (mk[i] != null) validIndices.push(i);
          }

          const segments: { l: string; lo: number; hi: number; i: number }[] = [];
          if (validIndices.length > 0) {
            segments.push({ l: 'U', lo: 0, hi: mk[validIndices[0]]!, i: sc.length });
            validIndices.forEach((g, k) => {
              segments.push({
                l: sc[g],
                lo: mk[g]!,
                hi: k + 1 < validIndices.length ? mk[validIndices[k + 1]]! : max,
                i: g,
              });
            });
          }

          const needlePosition =
            s.mark !== null && s.mark !== undefined && !isNaN(s.mark)
              ? Math.min(100, Math.max(0, (s.mark / max) * 100))
              : null;

          return (
            <div
              key={s.id}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-5 shadow-xs"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: `hsl(${s.hue} 75% 45%)`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-none"
                    style={{ backgroundColor: `hsl(${s.hue} 75% 45%)` }}
                  />
                  <h3 className="font-display font-bold text-lg text-[var(--ink)] tracking-tight">
                    {s.name}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[var(--surface-2)] text-[var(--muted)]">
                  {BOARD_NAME[s.board]}
                </span>
              </div>

              {/* Source Tag */}
              {s.src?.official ? (
                <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Official
                  </span>
                  <span className="truncate">{s.src.text}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Estimate
                  </span>
                  <span>Standard statistical boundaries applied. Edit thresholds below.</span>
                </div>
              )}

              {/* Marks & Grade Result */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--muted)]">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={s.bounds.max}
                    onChange={(e) => handleMaxChange(s, parseFloat(e.target.value))}
                    className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-mono font-bold focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="sm:col-span-4 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--muted)]">My Mark</label>
                  <input
                    type="number"
                    min="0"
                    max={s.bounds.max}
                    value={s.mark === null || s.mark === undefined ? '' : s.mark}
                    onChange={(e) => handleMarkChange(s, e.target.value)}
                    placeholder="Enter mark"
                    className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-mono font-bold focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="sm:col-span-4 text-right flex flex-col items-end justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Grade Awarded
                  </span>
                  {res ? (
                    <div className="flex flex-col items-end">
                      <b
                        className="font-display font-extrabold text-3xl leading-none"
                        style={{ color: `hsl(${s.hue} 75% 45%)` }}
                      >
                        {res.grade}
                      </b>
                      <small className="text-[11px] text-[var(--muted)] font-medium mt-0.5">
                        {res.next === null
                          ? 'Top grade!'
                          : res.next > 0
                          ? `${res.next} ${res.next === 1 ? 'mark' : 'marks'} to ${res.nextName}`
                          : ''}
                      </small>
                    </div>
                  ) : (
                    <span className="font-display font-extrabold text-2xl text-[var(--muted)]">–</span>
                  )}
                </div>
              </div>

              {/* Segmented Color Threshold Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="relative flex h-8 rounded-xl overflow-hidden border border-[var(--line)]">
                  {segments.map((g, idx) => {
                    const widthPct = Math.max(
                      0,
                      ((Math.min(g.hi, max) - Math.min(g.lo, max)) / max) * 100
                    );
                    const alpha = g.i >= sc.length ? 0.05 : 0.15 + 0.6 * (1 - g.i / sc.length);

                    return (
                      <span
                        key={idx}
                        style={{
                          flex: `${widthPct} 1 0`,
                          backgroundColor: `hsl(${s.hue} 70% 45% / ${alpha.toFixed(2)})`,
                        }}
                        className="flex items-center justify-center font-mono text-[11px] font-bold text-[var(--ink)] overflow-hidden min-w-0"
                      >
                        {widthPct > 5 ? g.l : ''}
                      </span>
                    );
                  })}

                  {/* Needle Marker */}
                  {needlePosition !== null && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-[var(--ink)] -translate-x-1/2 z-10 shadow-sm"
                      style={{ left: `${needlePosition}%` }}
                      title={`Your mark: ${s.mark}`}
                    />
                  )}
                </div>
                {needlePosition !== null && (
                  <div className="flex justify-between text-[10px] font-mono text-[var(--muted)]">
                    <span>0</span>
                    <span className="font-bold text-[var(--ink)]">Score: {s.mark} / {max} ({Math.round(needlePosition)}%)</span>
                    <span>{max}</span>
                  </div>
                )}
              </div>

              {/* Marks needed for each grade inputs */}
              <div className="flex flex-col gap-2 border-t border-[var(--line)] pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Threshold Cut-offs
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {sc.map((grade, idx) => {
                    const val = s.bounds.marks[idx];
                    return (
                      <label key={grade} className="flex flex-col gap-1 text-center">
                        <span className="font-mono text-xs font-bold text-[var(--muted)]">{grade}</span>
                        <input
                          type="number"
                          min="0"
                          value={val === null || val === undefined ? '' : val}
                          onChange={(e) => handleThresholdChange(s, idx, e.target.value)}
                          className="h-8 px-1 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-mono text-center focus:outline-none focus:border-[var(--accent)]"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Reset Action */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleReset(s)}
                  className="h-8 px-3 rounded-lg border border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{s.src?.official ? 'Reset to June 2026 tables' : 'Reset to baseline estimates'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
