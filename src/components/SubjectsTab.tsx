import React, { useState } from 'react';
import { ExamBoard, Subject } from '../types';
import { CATALOG, HUES, HUE_NAMES, applyBounds } from '../constants/grades';
import { Plus, Trash2, BookOpen, Sparkles } from 'lucide-react';

interface SubjectsTabProps {
  subjects: Subject[];
  onAddSubject: (name: string, board: ExamBoard, max?: number) => void;
  onUpdateSubject: (s: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export const SubjectsTab: React.FC<SubjectsTabProps> = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [boardInput, setBoardInput] = useState<ExamBoard>('cambridge');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNameChange = (val: string) => {
    setNameInput(val);
    const cat = CATALOG.find((c) => c.n.toLowerCase() === val.trim().toLowerCase());
    if (cat) {
      setBoardInput(cat.b);
    }
  };

  const handleAdd = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a subject name.');
      return;
    }
    if (subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('This subject has already been added.');
      return;
    }
    const cat = CATALOG.find((c) => c.n.toLowerCase() === trimmed.toLowerCase());
    onAddSubject(trimmed, boardInput, cat?.m);
    setNameInput('');
    setErrorMsg('');
  };

  const handleInlineNameChange = (s: Subject, newName: string) => {
    const updated = { ...s, name: newName };
    applyBounds(updated, s.bounds.max);
    onUpdateSubject(updated);
  };

  const handleInlineBoardChange = (s: Subject, newBoard: ExamBoard) => {
    const updated = { ...s, board: newBoard };
    applyBounds(updated, s.bounds.max);
    onUpdateSubject(updated);
  };

  const handleInlineHueChange = (s: Subject, newHue: number) => {
    onUpdateSubject({ ...s, hue: newHue });
  };

  // Quick add candidates: catalog items not yet in subjects
  const unaddedCatalog = CATALOG.filter(
    (c) => !subjects.some((s) => s.name.toLowerCase() === c.n.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: ACTIVE SUBJECTS LIST */}
      <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-5 shadow-xs">
        <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-display font-bold text-lg text-[var(--ink)]">Your Subjects</h2>
          </div>
          <span className="text-xs text-[var(--muted)] font-mono">
            {subjects.length} active
          </span>
        </div>

        <ul className="divide-y divide-[var(--line)] flex flex-col">
          {subjects.map((s) => (
            <li key={s.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-none shadow-xs"
                  style={{ backgroundColor: `hsl(${s.hue} 75% 45%)` }}
                />
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => handleInlineNameChange(s, e.target.value)}
                  maxLength={40}
                  className="font-semibold text-sm text-[var(--ink)] bg-transparent border-b border-transparent hover:border-[var(--line)] focus:border-[var(--accent)] focus:outline-none px-1 py-0.5 rounded w-full max-w-[200px]"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-between sm:justify-end">
                {/* Board Selector */}
                <select
                  value={s.board}
                  onChange={(e) => handleInlineBoardChange(s, e.target.value as ExamBoard)}
                  className="h-8 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-medium focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                >
                  <option value="cambridge">Cambridge (A*-G)</option>
                  <option value="edexcel">Edexcel (9-1)</option>
                  <option value="oxford">OxfordAQA (9-1)</option>
                </select>

                {/* Color Swatches */}
                <div className="flex gap-1 items-center" role="group" aria-label="Subject accent colour">
                  {HUES.map((h, i) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleInlineHueChange(s, h)}
                      title={HUE_NAMES[i]}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                        s.hue === h ? 'ring-2 ring-[var(--ink)] scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: `hsl(${h} 75% 45%)` }}
                    />
                  ))}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => onDeleteSubject(s.id)}
                  disabled={subjects.length <= 1}
                  className="w-8 h-8 rounded-lg text-[var(--muted)] hover:text-rose-600 hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title={subjects.length <= 1 ? 'Must keep at least 1 subject' : 'Remove subject'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN: ADD SUBJECT & QUICK ADD */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Add Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h2 className="font-display font-bold text-lg text-[var(--ink)] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--accent)]" />
              <span>Add a Subject</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--muted)]">Subject Name</label>
              <input
                type="text"
                list="catalog-datalist"
                placeholder="e.g. Computer Science"
                value={nameInput}
                onChange={(e) => handleNameChange(e.target.value)}
                maxLength={40}
                className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
              <datalist id="catalog-datalist">
                {CATALOG.map((c) => (
                  <option key={c.n} value={c.n} />
                ))}
              </datalist>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[var(--muted)]">Exam Board & Scale</label>
              <select
                value={boardInput}
                onChange={(e) => setBoardInput(e.target.value as ExamBoard)}
                className="h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] font-semibold focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="cambridge">Cambridge International (A* to G)</option>
                <option value="edexcel">Pearson Edexcel (9 to 1)</option>
                <option value="oxford">OxfordAQA (9 to 1)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-1 h-10 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-105 active:scale-95 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>

            {errorMsg && <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>}
          </div>
        </div>

        {/* Quick Add Card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Quick Add From Syllabus Catalog</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-[260px] overflow-y-auto pr-1">
            {unaddedCatalog.length === 0 ? (
              <span className="text-xs text-[var(--muted)]">All catalog subjects have been added.</span>
            ) : (
              unaddedCatalog.map((cat) => (
                <button
                  key={cat.n}
                  type="button"
                  onClick={() => onAddSubject(cat.n, cat.b, cat.m)}
                  className="px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--bg)] hover:bg-[var(--surface-2)] text-[var(--ink)] text-xs font-medium transition-colors cursor-pointer"
                >
                  + {cat.n}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
