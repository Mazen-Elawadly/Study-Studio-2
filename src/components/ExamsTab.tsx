import React, { useState, useEffect } from 'react';
import { Exam, Subject } from '../types';
import { Calendar, Plus, Trash2, Clock, CheckCircle } from 'lucide-react';

interface ExamsTabProps {
  subjects: Subject[];
  exams: Exam[];
  onAddExam: (e: Exam) => void;
  onDeleteExam: (id: string) => void;
}

export const ExamsTab: React.FC<ExamsTabProps> = ({
  subjects,
  exams,
  onAddExam,
  onDeleteExam,
}) => {
  const [sid, setSid] = useState(subjects[0]?.id || '');
  const [paper, setPaper] = useState('');
  const [when, setWhen] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [now, setNow] = useState(Date.now());

  // Update time every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.when).getTime() - new Date(b.when).getTime()
  );

  const upcomingExams = sortedExams.filter((e) => new Date(e.when).getTime() > now);
  const nextExam = upcomingExams[0];

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatWhen = (isoStr: string) => {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    return (
      d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) + ` · ${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  };

  const formatLeft = (ms: number) => {
    if (ms <= 0) return 'Finished';
    const d = Math.floor(ms / 864e5);
    const h = Math.floor((ms % 864e5) / 36e5);
    const m = Math.floor((ms % 36e5) / 6e4);
    const s = Math.floor((ms % 6e4) / 1e3);
    if (d > 0) return `${d} d ${h} h`;
    if (h > 0) return `${h} h ${m} m`;
    return `${m} m ${s} s`;
  };

  const getNextCountdown = () => {
    if (!nextExam) return null;
    const ms = Math.max(0, new Date(nextExam.when).getTime() - now);
    const days = Math.floor(ms / 864e5);
    const hours = Math.floor((ms % 864e5) / 36e5);
    const mins = Math.floor((ms % 36e5) / 6e4);
    const secs = Math.floor((ms % 6e4) / 1e3);
    return { days, hours, mins, secs };
  };

  const nextCd = getNextCountdown();
  const nextSubj = nextExam ? subjects.find((s) => s.id === nextExam.sid) : null;

  const handleAdd = () => {
    if (!when || isNaN(new Date(when).getTime())) {
      setErrorMsg('Please select a valid date and start time.');
      return;
    }
    const currentSubj = subjects.find((s) => s.id === sid) || subjects[0];
    if (!currentSubj) {
      setErrorMsg('Please add a subject first.');
      return;
    }

    const newExam: Exam = {
      id: `e-${Math.random().toString(36).slice(2, 8)}`,
      sid: currentSubj.id,
      subj: currentSubj.name,
      paper: paper.trim() || 'Paper',
      when,
    };

    onAddExam(newExam);
    setPaper('');
    setWhen('');
    setErrorMsg('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: HERO COUNTDOWN + ADD EXAM */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Next Exam Hero Card */}
        <div
          className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-xs transition-colors"
          style={{
            borderColor: nextSubj ? `hsl(${nextSubj.hue} 70% 45% / 0.4)` : undefined,
          }}
        >
          {nextExam ? (
            <>
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: `hsl(${nextSubj?.hue || 215} 75% 45%)` }}
                    />
                    <span>Next Exam Scheduled</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight mt-1">
                    {nextExam.subj} · {nextExam.paper || 'Paper'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--muted)] font-medium mt-1">
                    {formatWhen(nextExam.when)} {nextExam.ex ? '· (Sample schedule)' : ''}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-[var(--accent-soft)] text-[var(--accent)] uppercase tracking-wider">
                  Upcoming
                </span>
              </div>

              {/* 4-Box Countdown */}
              {nextCd && (
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                  {[
                    { label: 'Days', val: nextCd.days },
                    { label: 'Hours', val: pad(nextCd.hours) },
                    { label: 'Mins', val: pad(nextCd.mins) },
                    { label: 'Secs', val: pad(nextCd.secs) },
                  ].map((box) => (
                    <div
                      key={box.label}
                      className="bg-[var(--bg)] border border-[var(--line)] rounded-xl py-3 px-1 text-center shadow-2xs"
                    >
                      <b
                        className="block font-mono font-bold text-2xl sm:text-4xl text-[var(--ink)] leading-none tabular-nums"
                        style={{ color: nextSubj ? `hsl(${nextSubj.hue} 75% 45%)` : undefined }}
                      >
                        {box.val}
                      </b>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mt-1 block">
                        {box.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-6 text-center flex flex-col items-center gap-2 text-[var(--muted)]">
              <Calendar className="w-10 h-10 text-[var(--muted)]/50 stroke-1" />
              <h2 className="font-display font-bold text-xl text-[var(--ink)]">No Upcoming Exams</h2>
              <p className="text-xs">Add your exam dates below to start the countdown clock.</p>
            </div>
          )}
        </div>

        {/* Add Exam Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h2 className="font-display font-bold text-lg text-[var(--ink)] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--accent)]" />
              <span>Schedule New Exam</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--muted)]">Subject</label>
              <select
                value={sid || subjects[0]?.id || ''}
                onChange={(e) => setSid(e.target.value)}
                className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-semibold focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.board})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--muted)]">Paper / Component</label>
              <input
                type="text"
                placeholder="e.g. Paper 4 (Extended)"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                maxLength={40}
                className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-8 flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--muted)]">Date & Start Time</label>
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full h-10 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-105 active:scale-95 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Exam</span>
              </button>
            </div>
          </div>

          {errorMsg && <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>}
        </div>
      </div>

      {/* RIGHT COLUMN: ALL EXAMS LIST */}
      <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
          <h2 className="font-display font-bold text-lg text-[var(--ink)]">Exam Timetable</h2>
          <span className="text-xs text-[var(--muted)] font-mono">
            {exams.length} {exams.length === 1 ? 'exam' : 'exams'}
          </span>
        </div>

        {sortedExams.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--muted)]">
            No exams scheduled yet.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line)] flex flex-col">
            {sortedExams.map((e) => {
              const examTime = new Date(e.when).getTime();
              const isPast = examTime <= now;
              const sub = subjects.find((s) => s.id === e.sid);
              const hue = sub ? sub.hue : 215;

              return (
                <li
                  key={e.id}
                  className={`py-3 flex items-center justify-between gap-3 ${
                    isPast ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-none"
                      style={{ backgroundColor: `hsl(${hue} 75% 45%)` }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-[var(--ink)] truncate flex items-center gap-1.5">
                        <span>{e.subj} · {e.paper || 'Paper'}</span>
                        {e.ex && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--surface-2)] text-[var(--muted)] font-bold uppercase">
                            Sample
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] font-mono">
                        {formatWhen(e.when)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-none">
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        isPast
                          ? 'text-[var(--muted)] line-through'
                          : 'font-semibold text-[var(--ink)]'
                      }`}
                    >
                      {formatLeft(examTime - now)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteExam(e.id)}
                      className="w-7 h-7 rounded-lg text-[var(--muted)] hover:text-rose-600 hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
