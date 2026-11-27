import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  HelpCircle,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AUTHOR_PROFILE,
  KNOWLEDGE_CHECKS,
  LAB_TASKS,
  type LabScreenshot,
} from '../data/labData';

export function WalkthroughSection() {
  const [selectedTaskId, setSelectedTaskId] = useState<number>(1);
  const [lightboxItems, setLightboxItems] = useState<LabScreenshot[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Knowledge check state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  const activeTask = LAB_TASKS.find((t) => t.id === selectedTaskId) ?? LAB_TASKS[0];

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev + 1) % lightboxItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev === null
            ? null
            : (prev - 1 + lightboxItems.length) % lightboxItems.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx, lightboxItems.length]);

  const openLightbox = (screenshots: LabScreenshot[], idx: number) => {
    setLightboxItems(screenshots);
    setLightboxIdx(idx);
  };

  const toggleOption = (qId: string, optionId: string, multiSelect: boolean) => {
    setCheckedQuestions((prev) => ({ ...prev, [qId]: false }));
    setSelectedAnswers((prev) => {
      const current = prev[qId] ?? [];
      if (!multiSelect) {
        return { ...prev, [qId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [qId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [qId]: [...current, optionId] };
    });
  };

  return (
    <section
      id="walkthrough"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-2xl mb-10">
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
          Lab Engineering Log · {AUTHOR_PROFILE.name}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Step-by-Step Walkthrough & Screenshots
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Every task below reflects my actual execution inside the Google Cloud Console on{' '}
          {AUTHOR_PROFILE.completedDate}. Select any task to inspect my notes, exact parameters,
          and full-resolution screenshots.
        </p>
      </div>

      {/* Task Stepper Navigation + Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stepper List */}
        <div
          role="tablist"
          aria-label="Lab tasks"
          className="lg:col-span-4 flex flex-col divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
        >
          {LAB_TASKS.map((task) => {
            const active = task.id === selectedTaskId;
            return (
              <button
                key={task.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedTaskId(task.id)}
                className={`text-left px-4 py-3.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 text-slate-900 dark:text-white'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      active
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    Task {task.number}
                  </span>
                  {task.screenshots.length > 0 && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      {task.screenshots.length} {task.screenshots.length === 1 ? 'capture' : 'captures'}
                    </span>
                  )}
                </div>
                <div className="mt-1 font-display text-sm font-semibold">
                  {task.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Task Detail */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>Task {activeTask.number} of 07</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>Written by {AUTHOR_PROFILE.name}</span>
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-slate-100">
                  {activeTask.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selectedTaskId === 1}
                  onClick={() => setSelectedTaskId((id) => Math.max(1, id - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={selectedTaskId === LAB_TASKS.length}
                  onClick={() => setSelectedTaskId((id) => Math.min(LAB_TASKS.length, id + 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* First-person engineering note */}
            <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {activeTask.firstPersonNote}
            </p>

            {/* Executed Actions */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2.5">
                Actions Executed
              </h4>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {activeTask.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums shrink-0">
                      0{index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Configuration Table */}
            {activeTask.configTable && activeTask.configTable.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Verified Parameters
                </h4>
                <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {activeTask.configTable.map((row) => (
                    <div
                      key={row.property}
                      className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                    >
                      <dt className="font-medium text-slate-500 dark:text-slate-400">
                        {row.property}
                      </dt>
                      <dd className="font-mono text-slate-900 dark:text-slate-100">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Screenshots Grid */}
            {activeTask.screenshots.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Console Captures ({activeTask.screenshots.length})
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Click any screenshot to inspect full resolution
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTask.screenshots.map((shot, idx) => {
                    const isBroken = brokenImages[shot.src];
                    return (
                      <button
                        key={shot.src}
                        type="button"
                        onClick={() => openLightbox(activeTask.screenshots, idx)}
                        className="group text-left rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer"
                      >
                        <div className="relative aspect-video bg-slate-900 overflow-hidden">
                          {isBroken ? (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-800 text-slate-300 p-4">
                              <ImageIcon className="h-6 w-6" aria-hidden="true" />
                              <span className="text-xs font-medium text-center">{shot.title}</span>
                            </div>
                          ) : (
                            <img
                              src={shot.src}
                              alt={`${shot.title} — ${shot.caption}`}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={() =>
                                setBrokenImages((prev) => ({ ...prev, [shot.src]: true }))
                              }
                              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                            />
                          )}
                          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-1 text-[11px] font-medium text-white opacity-90 group-hover:opacity-100">
                            <Expand className="h-3 w-3" aria-hidden="true" />
                            <span>Inspect</span>
                          </span>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {shot.title}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                              {shot.timestamp}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {shot.caption}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Knowledge Check Section */}
      <div className="mt-14 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
            Interactive Assessment Review
          </p>
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Lab Knowledge Checks
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            Test yourself on the three SRE & Cloud Monitoring questions from the lab.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {KNOWLEDGE_CHECKS.map((item) => {
            const chosen = selectedAnswers[item.id] ?? [];
            const isChecked = checkedQuestions[item.id];
            const correctIds = item.options.filter((o) => o.correct).map((o) => o.id);
            const isFullyCorrect =
              isChecked &&
              chosen.length === correctIds.length &&
              correctIds.every((id) => chosen.includes(id));

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {item.taskRef}
                  </div>
                  <h4 className="mt-1.5 font-display text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.question}
                  </h4>

                  <div className="mt-4 space-y-2">
                    {item.options.map((opt) => {
                      const active = chosen.includes(opt.id);
                      let rowStyle =
                        'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700';
                      if (isChecked) {
                        if (opt.correct) {
                          rowStyle =
                            'border-emerald-400 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30';
                        } else if (active && !opt.correct) {
                          rowStyle =
                            'border-red-400 dark:border-red-700 bg-red-50/60 dark:bg-red-950/30';
                        }
                      } else if (active) {
                        rowStyle =
                          'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleOption(item.id, opt.id, item.multiSelect)}
                          className={`w-full text-left rounded-lg border px-3 py-2.5 text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${rowStyle}`}
                        >
                          <span
                            className={`mt-0.5 h-3.5 w-3.5 shrink-0 border flex items-center justify-center ${
                              item.multiSelect ? 'rounded-xs' : 'rounded-full'
                            } ${
                              active
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 leading-snug">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {isChecked ? (
                    <div className="space-y-2">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-semibold ${
                          isFullyCorrect
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {isFullyCorrect ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        )}
                        <span>
                          {isFullyCorrect ? 'Verified Correct' : 'Review Highlighted Answers'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={chosen.length === 0}
                      onClick={() =>
                        setCheckedQuestions((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full rounded-lg bg-slate-900 dark:bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      Verify Answer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIdx !== null && lightboxItems[lightboxIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot viewer"
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-white p-4 md:p-6"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-xs text-slate-400 font-mono tabular-nums">
                {lightboxItems[lightboxIdx].timestamp} · Capture {lightboxIdx + 1} of{' '}
                {lightboxItems.length}
              </div>
              <h4 className="font-display text-base font-bold text-white">
                {lightboxItems[lightboxIdx].title}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close screenshot viewer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative mx-auto flex flex-1 w-full max-w-6xl items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItems[lightboxIdx].src}
              alt={lightboxItems[lightboxIdx].title}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full rounded-lg border border-slate-800 object-contain"
            />
          </div>

          <div
            className="mx-auto flex w-full max-w-6xl flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-slate-300">
              {lightboxItems[lightboxIdx].caption}
            </p>
            {lightboxItems.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx(
                      (lightboxIdx - 1 + lightboxItems.length) % lightboxItems.length
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((lightboxIdx + 1) % lightboxItems.length)
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium hover:bg-slate-800 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
