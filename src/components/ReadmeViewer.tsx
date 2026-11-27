import { Check, Code2, Copy, Download, Eye, Terminal } from 'lucide-react';
import { useState } from 'react';
import { AUTHOR_PROFILE, README_MARKDOWN, VM_INSTANCES } from '../data/labData';

export function ReadmeViewer() {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(README_MARKDOWN);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = README_MARKDOWN;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([README_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="readme"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
            GitHub Repository Documentation & Vercel Hosting
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Project README.md
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Ready to push straight to GitHub and deploy on Vercel. Toggle between the formatted
            preview and raw Markdown, or download <span className="font-mono">README.md</span> directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'raw'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Raw Markdown</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:hover:bg-blue-700 cursor-pointer whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main README Document */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 px-5 py-3 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>README.md</span>
            <span>{README_MARKDOWN.split('\n').length} lines</span>
          </div>

          {viewMode === 'raw' ? (
            <pre className="p-5 overflow-x-auto text-xs leading-relaxed font-mono text-slate-800 dark:text-slate-200 max-h-[540px] overflow-y-auto whitespace-pre-wrap">
              {README_MARKDOWN}
            </pre>
          ) : (
            <article className="p-6 md:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-[540px] overflow-y-auto">
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {AUTHOR_PROFILE.labTitle}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Author: {AUTHOR_PROFILE.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{AUTHOR_PROFILE.email}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{AUTHOR_PROFILE.projectId}</span>
                  <span aria-hidden="true">·</span>
                  <span>{AUTHOR_PROFILE.completedDate}</span>
                </div>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Overview
                </h4>
                <p>
                  In this hands-on Google Cloud lab, I configured end-to-end observability across a
                  three-node NGINX Compute Engine fleet using Google Cloud Monitoring. Rather than
                  treating monitoring as passive graphs, I structured the workflow around core Site
                  Reliability Engineering (SRE) practices: visualizing real-time CPU utilization on a
                  custom dashboard, reducing alert fatigue with a multi-condition alerting policy,
                  organizing instances dynamically through resource groups, verifying external
                  availability with global HTTP uptime checks, and cleanly decommissioning alert
                  policies after validation.
                </p>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Infrastructure Inventory
                </h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                        <th className="py-2 px-3 font-medium">Instance</th>
                        <th className="py-2 px-3 font-medium">Zone</th>
                        <th className="py-2 px-3 font-medium">Internal IP</th>
                        <th className="py-2 px-3 font-medium">External IP</th>
                        <th className="py-2 px-3 font-medium text-right">CPU Util</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                      {VM_INSTANCES.map((vm) => (
                        <tr key={vm.id}>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {vm.name}
                          </td>
                          <td className="py-2 px-3">{vm.zone}</td>
                          <td className="py-2 px-3">{vm.internalIp}</td>
                          <td className="py-2 px-3">{vm.externalIp}</td>
                          <td className="py-2 px-3 text-right">{vm.baselineCpuUtilization}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Key Configurations Summary
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-slate-900 dark:text-slate-100">Custom Dashboard:</strong>{' '}
                    <span className="font-mono">My Dashboard</span> with Line widget{' '}
                    <span className="font-mono">My Chart</span> tracking{' '}
                    <span className="font-mono">VM Instance - CPU utilization</span>.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-slate-100">Multi-Condition Alerting:</strong>{' '}
                    <span className="font-mono">My Alert Policy</span> requiring both{' '}
                    <span className="font-mono">CPU usage &gt; 20</span> and{' '}
                    <span className="font-mono">CPU utilization &gt; 20%</span> over a 1-minute rolling
                    window, delivered to Email channel <span className="font-mono">Tester</span>.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-slate-100">Resource Group:</strong>{' '}
                    <span className="font-mono">VM instances</span> dynamically matching{' '}
                    <span className="font-mono">Name Contains nginx</span>.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-slate-100">Uptime Check:</strong>{' '}
                    <span className="font-mono">My Uptime check</span> probing HTTP Port 80 every 60s,
                    passing with <span className="font-mono">200 (OK) in 3 ms</span>.
                  </li>
                </ul>
              </div>
            </article>
          )}
        </div>

        {/* Right Vercel Deployment Checklist */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold">Deploy to Vercel</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            This repository includes <span className="font-mono">vercel.json</span> preconfigured for
            Vite static builds and SPA routing, plus all 30+ console screenshots inside{' '}
            <span className="font-mono">public/assets/aistudio/</span>.
          </p>
          <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                1. Push to GitHub
              </span>
              <pre className="mt-1.5 rounded-lg bg-slate-950 text-slate-100 p-3 font-mono text-[11px] overflow-x-auto">
{`git init
git add .
git commit -m "Add Cloud Monitoring lab"
git push -u origin main`}
              </pre>
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                2. Import on Vercel
              </span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Select your GitHub repository in Vercel. Framework Preset auto-detects{' '}
                <span className="font-mono">Vite</span> with output{' '}
                <span className="font-mono">dist</span>.
              </p>
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                3. Deploy Live
              </span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Click Deploy—no API keys or environment variables are needed for the interactive
                walkthrough and simulator.
              </p>
            </li>
          </ol>
        </aside>
      </div>
    </section>
  );
}
