import { ArrowDownRight, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ObservabilitySandbox } from './components/ObservabilitySandbox';
import { ReadmeViewer } from './components/ReadmeViewer';
import { WalkthroughSection } from './components/WalkthroughSection';
import { AUTHOR_PROFILE } from './data/labData';

const HERO_PREVIEWS = [
  {
    src: '/assets/aistudio/Screenshot_From_2026-11-27_13-00-44_3cf616a8.png',
    label: 'Task 2 · My Chart (CPU utilization)',
  },
  {
    src: '/assets/aistudio/Screenshot_From_2026-11-27_13-15-06_99a777b8.png',
    label: 'Task 3 · My Alert Policy Review',
  },
  {
    src: '/assets/aistudio/Screenshot_From_2026-11-27_13-24-43_a9bfc689.png',
    label: 'Task 5 · Uptime Test (200 OK in 3 ms)',
  },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const currentHero = HERO_PREVIEWS[heroSlide];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Navbar />

      <main>
        {/* Hero Split */}
        <section id="overview" className="mx-auto max-w-6xl px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: Editorial Lead */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Google Cloud Observability
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>By {AUTHOR_PROFILE.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{AUTHOR_PROFILE.completedDate}</span>
                </div>

                <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
                  Monitor Resources with Google Cloud Observability
                </h1>

                <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  I built this interactive lab showcase to document my hands-on Cloud Monitoring
                  implementation across three Compute Engine NGINX nodes—covering custom dashboards,
                  multi-condition alerting, dynamic resource groups, and global HTTP uptime checks.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#interactive-lab"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Explore Interactive Lab</span>
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href="#walkthrough"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Read Full Walkthrough</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Right Column: Matching Height Console Showcase */}
            <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="relative flex-1 min-h-[260px] bg-slate-950 overflow-hidden">
                <img
                  src={currentHero.src}
                  alt={currentHero.label}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-white dark:bg-slate-900">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                  {currentHero.label}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {HERO_PREVIEWS.map((item, idx) => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setHeroSlide(idx)}
                      className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                        heroSlide === idx
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Lab Summary Strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="p-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Compute Fleet</div>
              <div className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                3 VMs
              </div>
              <div className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                nginxstack-1..3 · us-west1-a
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Alerting Policy</div>
              <div className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                2 Conditions
              </div>
              <div className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                All met &gt; 20 · Email: Tester
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Resource Group</div>
              <div className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                VM instances
              </div>
              <div className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                Name Contains &quot;nginx&quot;
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">HTTP Uptime Test</div>
              <div className="mt-1 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                200 OK · 3 ms
              </div>
              <div className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                Port 80 / · 60s interval
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Cloud Monitoring Sandbox */}
        <ObservabilitySandbox
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />

        {/* Step-by-Step Walkthrough + Screenshots + Knowledge Checks */}
        <WalkthroughSection />

        {/* GitHub README.md Preview & Vercel Hosting */}
        <ReadmeViewer />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-8 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {AUTHOR_PROFILE.name}
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{AUTHOR_PROFILE.labTitle}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-mono">{AUTHOR_PROFILE.email}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#overview" className="hover:text-slate-900 dark:hover:text-slate-100">
              Overview
            </a>
            <a href="#interactive-lab" className="hover:text-slate-900 dark:hover:text-slate-100">
              Interactive Lab
            </a>
            <a href="#walkthrough" className="hover:text-slate-900 dark:hover:text-slate-100">
              Walkthrough
            </a>
            <a href="#readme" className="hover:text-slate-900 dark:hover:text-slate-100">
              README.md
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
