import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  FolderKanban,
  Globe,
  Moon,
  Play,
  RotateCcw,
  Server,
  Sun,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { AUTHOR_PROFILE, TIME_LABELS, VM_INSTANCES } from '../data/labData';

type SandboxTab = 'fleet' | 'dashboard' | 'alerting' | 'uptime';
type MetricMode = 'utilization' | 'usage';
type TimeWindow = '1h' | '6h' | '1d';

interface SimVmState {
  id: string;
  cpuUtilization: number;
  cpuUsage: number;
  httpHealthy: boolean;
}

interface ObservabilitySandboxProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const REGION_PROBES = [
  { region: 'North America', location: 'Oregon, US', latencyMs: 3 },
  { region: 'Europe', location: 'Belgium, EU', latencyMs: 112 },
  { region: 'Asia Pacific', location: 'Tokyo, JP', latencyMs: 138 },
  { region: 'South America', location: 'Sao Paulo, BR', latencyMs: 164 },
];

export function ObservabilitySandbox({ darkMode, onToggleDarkMode }: ObservabilitySandboxProps) {
  const [activeTab, setActiveTab] = useState<SandboxTab>('dashboard');

  // Task 4: Dynamic resource group filter
  const [groupFilter, setGroupFilter] = useState('nginx');
  const [groupName, setGroupName] = useState('VM instances');

  // Task 2: Dashboard & Metrics Explorer controls
  const [metricMode, setMetricMode] = useState<MetricMode>('utilization');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('1h');
  const [showThresholdLine, setShowThresholdLine] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [visibleVms, setVisibleVms] = useState<Record<string, boolean>>({
    'nginxstack-1': true,
    'nginxstack-2': true,
    'nginxstack-3': true,
  });

  // Task 3 & Task 6: Multi-condition alert simulation & disable confirmation
  const [policyEnabled, setPolicyEnabled] = useState(true);
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);
  const [multiConditionMode, setMultiConditionMode] = useState<'all' | 'any'>('all');
  const [simStates, setSimStates] = useState<Record<string, SimVmState>>({
    'nginxstack-1': { id: 'nginxstack-1', cpuUtilization: 1.962, cpuUsage: 0.005, httpHealthy: true },
    'nginxstack-2': { id: 'nginxstack-2', cpuUtilization: 2.174, cpuUsage: 0.005, httpHealthy: true },
    'nginxstack-3': { id: 'nginxstack-3', cpuUtilization: 12.032, cpuUsage: 0.021, httpHealthy: true },
  });

  // Task 5: Uptime check test state
  const [uptimeTestState, setUptimeTestState] = useState<'idle' | 'testing' | 'done'>('done');
  const [uptimeCheckEnabled, setUptimeCheckEnabled] = useState(true);

  const matchedGroupVms = useMemo(() => {
    const query = groupFilter.trim().toLowerCase();
    if (!query) return [];
    return VM_INSTANCES.filter((vm) => vm.name.toLowerCase().includes(query));
  }, [groupFilter]);

  const alertEvaluations = useMemo(() => {
    return VM_INSTANCES.map((vm) => {
      const state = simStates[vm.id];
      const cond1 = state.cpuUsage > 20;
      const cond2 = state.cpuUtilization > 20;
      const triggered =
        policyEnabled && (multiConditionMode === 'all' ? cond1 && cond2 : cond1 || cond2);
      return {
        vm,
        state,
        cond1,
        cond2,
        triggered,
      };
    });
  }, [simStates, policyEnabled, multiConditionMode]);

  const anyAlertTriggered = alertEvaluations.some((item) => item.triggered);

  const unhealthyHttpVms = VM_INSTANCES.filter((vm) => !simStates[vm.id].httpHealthy);
  const uptimePass = unhealthyHttpVms.length === 0;

  const handleRunUptimeTest = () => {
    setUptimeTestState('testing');
    window.setTimeout(() => {
      setUptimeTestState('done');
    }, 350);
  };

  const handleResetSimulation = () => {
    setGroupFilter('nginx');
    setGroupName('VM instances');
    setPolicyEnabled(true);
    setUptimeCheckEnabled(true);
    setMultiConditionMode('all');
    setSimStates({
      'nginxstack-1': { id: 'nginxstack-1', cpuUtilization: 1.962, cpuUsage: 0.005, httpHealthy: true },
      'nginxstack-2': { id: 'nginxstack-2', cpuUtilization: 2.174, cpuUsage: 0.005, httpHealthy: true },
      'nginxstack-3': { id: 'nginxstack-3', cpuUtilization: 12.032, cpuUsage: 0.021, httpHealthy: true },
    });
  };

  const handleSimulateSpike = (vmId: string) => {
    setSimStates((prev) => ({
      ...prev,
      [vmId]: {
        ...prev[vmId],
        cpuUsage: 24.5,
        cpuUtilization: 68.4,
      },
    }));
  };

  // Chart geometry helpers
  const chartWidth = 760;
  const chartHeight = 250;
  const padLeft = 48;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 30;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  const maxY = metricMode === 'utilization' ? 160 : 0.85;
  const thresholdYValue = metricMode === 'utilization' ? 20 : 0.2;

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(val, maxY));
    return padTop + plotH - (clamped / maxY) * plotH;
  };

  const getX = (index: number) => {
    return padLeft + (index / (TIME_LABELS.length - 1)) * plotW;
  };

  const getWindowSeries = (vmIndex: number) => {
    const vm = VM_INSTANCES[vmIndex];
    const base = metricMode === 'utilization' ? vm.seriesUtilization : vm.seriesUsage;
    const liveVal =
      metricMode === 'utilization'
        ? simStates[vm.id].cpuUtilization
        : simStates[vm.id].cpuUsage;

    const scaled = base.map((point, idx) => {
      if (idx === base.length - 1) return liveVal;
      if (timeWindow === '6h') return Number((point * 0.85).toFixed(3));
      if (timeWindow === '1d') return Number((point * 0.72).toFixed(3));
      return point;
    });
    return scaled;
  };

  return (
    <section
      id="interactive-lab"
      className="mx-auto max-w-6xl px-6 py-16 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
            Interactive Cloud Monitoring Sandbox
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Test My Lab Configuration Live
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            I recreated every component I built in project{' '}
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {AUTHOR_PROFILE.projectId}
            </span>{' '}
            so you can inspect the fleet, trigger my multi-condition alert policy, edit the dynamic
            group filter, and run the HTTP uptime check yourself.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetSimulation}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Baseline</span>
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark console theme'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {darkMode ? (
              <>
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Light Surface</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Console Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workspace Container */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Segmented Console Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 px-4 py-3">
          <div
            role="tablist"
            aria-label="Observability lab modules"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              <span>01. My Dashboard & Chart</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'alerting'}
              onClick={() => setActiveTab('alerting')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'alerting'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              <span>02. My Alert Policy</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'fleet'}
              onClick={() => setActiveTab('fleet')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'fleet'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
              <span>03. Fleet & Group</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'uptime'}
              onClick={() => setActiveTab('uptime')}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'uptime'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>04. My Uptime Check</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            <span>{AUTHOR_PROFILE.projectId}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{AUTHOR_PROFILE.regionZone}</span>
          </div>
        </div>

        {/* TAB 1: DASHBOARD & METRICS EXPLORER */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>My Dashboard</span>
                  <span aria-hidden="true">/</span>
                  <span>My Chart</span>
                  <span aria-hidden="true">·</span>
                  <span>Unaggregated Line Chart</span>
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  VM Instance — {metricMode === 'utilization' ? 'CPU utilization (%)' : 'CPU usage (s/s)'}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setMetricMode('utilization')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      metricMode === 'utilization'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    CPU utilization
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricMode('usage')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      metricMode === 'usage'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    CPU usage
                  </button>
                </div>

                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-950">
                  {(['1h', '6h', '1d'] as TimeWindow[]).map((win) => (
                    <button
                      key={win}
                      type="button"
                      onClick={() => setTimeWindow(win)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer ${
                        timeWindow === win
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {win}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowThresholdLine((v) => !v)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    showThresholdLine
                      ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {showThresholdLine ? 'Hide Threshold (20)' : 'Show Threshold (20)'}
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="mt-6 relative">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto select-none"
                role="img"
                aria-label="Time series line chart of VM Instance CPU metrics"
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Horizontal gridlines */}
                {(metricMode === 'utilization' ? [0, 50, 100, 150] : [0, 0.25, 0.5, 0.75]).map((tick) => {
                  const y = getY(tick);
                  return (
                    <g key={tick}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        className="stroke-slate-200 dark:stroke-slate-800"
                        strokeWidth={1}
                      />
                      <text
                        x={padLeft - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono tabular-nums"
                      >
                        {metricMode === 'utilization' ? `${tick}%` : tick.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Threshold Line */}
                {showThresholdLine && (
                  <g>
                    <line
                      x1={padLeft}
                      y1={getY(thresholdYValue)}
                      x2={chartWidth - padRight}
                      y2={getY(thresholdYValue)}
                      stroke="#DC2626"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={chartWidth - padRight}
                      y={getY(thresholdYValue) - 5}
                      textAnchor="end"
                      className="fill-red-600 dark:fill-red-400 text-[10px] font-mono font-semibold"
                    >
                      Alert Threshold ({metricMode === 'utilization' ? '20%' : '0.20 / 20'})
                    </text>
                  </g>
                )}

                {/* X-axis labels */}
                {TIME_LABELS.map((label, idx) => {
                  if (idx % 2 !== 0 && idx !== TIME_LABELS.length - 1) return null;
                  return (
                    <text
                      key={label}
                      x={getX(idx)}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono tabular-nums"
                    >
                      {label}
                    </text>
                  );
                })}

                {/* Data lines */}
                {VM_INSTANCES.map((vm, vmIdx) => {
                  if (!visibleVms[vm.id]) return null;
                  const pts = getWindowSeries(vmIdx);
                  const pathD = pts
                    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`)
                    .join(' ');
                  return (
                    <g key={vm.id}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={vm.color}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {hoveredIdx !== null && (
                        <circle
                          cx={getX(hoveredIdx)}
                          cy={getY(pts[hoveredIdx])}
                          r={4}
                          fill={vm.color}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Hover Crosshair & Interactive Columns */}
                {hoveredIdx !== null && (
                  <line
                    x1={getX(hoveredIdx)}
                    y1={padTop}
                    x2={getX(hoveredIdx)}
                    y2={chartHeight - padBottom}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                )}

                {TIME_LABELS.map((_, idx) => {
                  const colW = plotW / TIME_LABELS.length;
                  return (
                    <rect
                      key={idx}
                      x={getX(idx) - colW / 2}
                      y={padTop}
                      width={colW}
                      height={plotH}
                      fill="transparent"
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredIdx(idx)}
                    />
                  );
                })}
              </svg>

              {/* Floating Hover Readout */}
              {hoveredIdx !== null && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-xs font-mono tabular-nums">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Nov 27, 2026 · {TIME_LABELS[hoveredIdx]}
                  </span>
                  <div className="flex flex-wrap items-center gap-5">
                    {VM_INSTANCES.map((vm, vmIdx) => {
                      const val = getWindowSeries(vmIdx)[hoveredIdx];
                      return (
                        <span key={vm.id} className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
                          <span
                            className="h-2.5 w-2.5 rounded-xs inline-block"
                            style={{ backgroundColor: vm.color }}
                          />
                          <span>{vm.name}:</span>
                          <span className="font-semibold">
                            {metricMode === 'utilization' ? `${val.toFixed(2)}%` : val.toFixed(3)}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Instance Toggle + Breakdown Table */}
            <div className="mt-6 overflow-x-auto border-t border-slate-200 dark:border-slate-800 pt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 pr-4 font-medium">Series</th>
                    <th className="py-2.5 px-4 font-medium">Instance ID</th>
                    <th className="py-2.5 px-4 font-medium">Zone</th>
                    <th className="py-2.5 px-4 font-medium text-right">Current Value</th>
                    <th className="py-2.5 pl-4 font-medium text-right">Load Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {VM_INSTANCES.map((vm) => {
                    const live = simStates[vm.id];
                    const displayVal =
                      metricMode === 'utilization'
                        ? `${live.cpuUtilization.toFixed(3)}%`
                        : live.cpuUsage.toFixed(3);
                    const checked = visibleVms[vm.id];
                    return (
                      <tr key={vm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 pr-4">
                          <label className="inline-flex items-center gap-2.5 cursor-pointer font-medium text-slate-900 dark:text-slate-100">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setVisibleVms((prev) => ({ ...prev, [vm.id]: !prev[vm.id] }))
                              }
                              className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                            />
                            <span
                              className="h-2.5 w-2.5 rounded-xs inline-block shrink-0"
                              style={{ backgroundColor: vm.color }}
                            />
                            <span className="font-mono">{vm.name}</span>
                          </label>
                        </td>
                        <td className="py-2.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {vm.instanceId}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {vm.zone}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                          {displayVal}
                        </td>
                        <td className="py-2.5 pl-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSimulateSpike(vm.id)}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap"
                          >
                            Simulate Spike
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-CONDITION ALERTING POLICY */}
        {activeTab === 'alerting' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Alerting</span>
                  <span aria-hidden="true">/</span>
                  <span>Policies</span>
                  <span aria-hidden="true">·</span>
                  <span>Channel: {AUTHOR_PROFILE.alertChannelName} ({AUTHOR_PROFILE.alertChannelEmail})</span>
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  My Alert Policy
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-950 text-xs">
                  <button
                    type="button"
                    onClick={() => setMultiConditionMode('all')}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      multiConditionMode === 'all'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All conditions met
                  </button>
                  <button
                    type="button"
                    onClick={() => setMultiConditionMode('any')}
                    className={`rounded-md px-3 py-1.5 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      multiConditionMode === 'any'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Any condition met
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (policyEnabled) {
                      setConfirmDisableOpen(true);
                    } else {
                      setPolicyEnabled(true);
                    }
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    policyEnabled
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{policyEnabled ? 'Policy Enabled (Turn off)' : 'Policy Disabled (Enable)'}</span>
                </button>
              </div>
            </div>

            {/* Disable confirmation dialog (Task 6) */}
            {confirmDisableOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="disable-policy-title"
                className="mt-5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h4
                    id="disable-policy-title"
                    className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Disable My Alert Policy?
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                    Matches Task 6 teardown: turns off alert evaluation so no notifications fire after the lab ends.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmDisableOpen(false)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPolicyEnabled(false);
                      setConfirmDisableOpen(false);
                    }}
                    className="rounded-lg bg-slate-900 dark:bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    Turn off
                  </button>
                </div>
              </div>
            )}

            {/* Policy Status Banner */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-3">
                {!policyEnabled ? (
                  <XCircle className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
                ) : anyAlertTriggered ? (
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
                )}
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {!policyEnabled
                      ? 'Policy Disabled — Monitoring paused'
                      : anyAlertTriggered
                      ? `Incident Open — Email dispatched to ${AUTHOR_PROFILE.alertChannelName} (${AUTHOR_PROFILE.alertChannelEmail})`
                      : 'Nominal — Conditions within threshold (≤ 20)'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                1 min rolling window · mean
              </span>
            </div>

            {/* Interactive VM Threshold Sliders */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {alertEvaluations.map(({ vm, state, cond1, cond2, triggered }) => (
                <div
                  key={vm.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    triggered
                      ? 'border-red-300 dark:border-red-800 bg-red-50/40 dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {vm.name}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        !policyEnabled
                          ? 'text-slate-500'
                          : triggered
                          ? 'text-red-600 dark:text-red-400'
                          : cond1 || cond2
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {!policyEnabled
                        ? 'Disabled'
                        : triggered
                        ? 'Alert Firing'
                        : cond1 || cond2
                        ? '1 of 2 Met'
                        : 'Nominal'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <label htmlFor={`${vm.id}-usage`} className="text-slate-600 dark:text-slate-300">
                          Cond 1: CPU usage (&gt; 20)
                        </label>
                        <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                          {state.cpuUsage.toFixed(2)} {cond1 ? '· Violated' : ''}
                        </span>
                      </div>
                      <input
                        id={`${vm.id}-usage`}
                        type="range"
                        min={0}
                        max={40}
                        step={0.5}
                        value={state.cpuUsage}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSimStates((prev) => ({
                            ...prev,
                            [vm.id]: { ...prev[vm.id], cpuUsage: val },
                          }));
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <label htmlFor={`${vm.id}-util`} className="text-slate-600 dark:text-slate-300">
                          Cond 2: CPU utilization (&gt; 20%)
                        </label>
                        <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                          {state.cpuUtilization.toFixed(1)}% {cond2 ? '· Violated' : ''}
                        </span>
                      </div>
                      <input
                        id={`${vm.id}-util`}
                        type="range"
                        min={0}
                        max={100}
                        step={0.5}
                        value={state.cpuUtilization}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSimStates((prev) => ({
                            ...prev,
                            [vm.id]: { ...prev[vm.id], cpuUtilization: val },
                          }));
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VM FLEET & RESOURCE GROUP */}
        {activeTab === 'fleet' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                    Dynamic Resource Group
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Edit the filter criterion below to see how Cloud Monitoring dynamically selects matching Compute Engine instances.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="group-name-input"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Group Name
                  </label>
                  <input
                    id="group-name-input"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="group-filter-input"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Criterion: Name Contains
                  </label>
                  <input
                    id="group-filter-input"
                    type="text"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                    placeholder="e.g. nginx or stack-2"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-blue-600"
                  />
                </div>

                <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                  <span>Group preview: </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {matchedGroupVms.length} of {VM_INSTANCES.length} instances matched
                  </span>
                </div>
              </div>

              <div className="lg:col-span-8 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 pr-4 font-medium">VM Instance</th>
                      <th className="py-2.5 px-3 font-medium">Zone</th>
                      <th className="py-2.5 px-3 font-medium">Machine</th>
                      <th className="py-2.5 px-3 font-medium">Internal IP</th>
                      <th className="py-2.5 px-3 font-medium">External IP</th>
                      <th className="py-2.5 pl-3 font-medium text-right">Group Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {VM_INSTANCES.map((vm) => {
                      const isMatch = matchedGroupVms.some((m) => m.id === vm.id);
                      return (
                        <tr
                          key={vm.id}
                          className={
                            isMatch
                              ? 'bg-blue-50/40 dark:bg-blue-950/20'
                              : 'opacity-55'
                          }
                        >
                          <td className="py-3 pr-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                            <span className="inline-flex items-center gap-2">
                              <Server className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                              {vm.name}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                            {vm.zone}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                            {vm.machineType}
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                            {vm.internalIp}
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-200">
                            {vm.externalIp}
                          </td>
                          <td className="py-3 pl-3 text-right font-medium">
                            {isMatch ? (
                              <span className="text-emerald-700 dark:text-emerald-400">
                                Included in {groupName || 'Group'}
                              </span>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400">Excluded</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UPTIME CHECK */}
        {activeTab === 'uptime' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>{AUTHOR_PROFILE.uptimeCheckId}</span>
                  <span aria-hidden="true">·</span>
                  <span>HTTP :80 /</span>
                  <span aria-hidden="true">·</span>
                  <span>Every 60s</span>
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  My Uptime check
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUptimeCheckEnabled((v) => !v)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                >
                  {uptimeCheckEnabled ? 'Uptime Alert: Enabled' : 'Uptime Alert: Disabled'}
                </button>
                <button
                  type="button"
                  onClick={handleRunUptimeTest}
                  disabled={uptimeTestState === 'testing'}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{uptimeTestState === 'testing' ? 'Probing Targets...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>

            {/* Test Result Output */}
            <div className="mt-6">
              {uptimeTestState === 'done' && (
                <div
                  className={`rounded-lg border px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                    uptimePass
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                      : 'border-red-300 dark:border-red-800 bg-red-50/70 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-medium">
                    {uptimePass ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {uptimePass
                        ? 'Responded with "200 (OK)" in 3 ms across VM instances group.'
                        : `Probe failed on ${unhealthyHttpVms.map((v) => v.name).join(', ')} — ${
                            uptimeCheckEnabled
                              ? `Alert firing to ${AUTHOR_PROFILE.alertChannelName}`
                              : 'Alert policy disabled'
                          }.`}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums">Target: Group ({groupName})</span>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Target Instance HTTP Health Toggle */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Simulate Target Endpoint Availability (Port 80)
                </h4>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {VM_INSTANCES.map((vm) => {
                    const healthy = simStates[vm.id].httpHealthy;
                    return (
                      <div key={vm.id} className="flex items-center justify-between px-4 py-3 text-xs">
                        <div>
                          <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                            {vm.name}
                          </div>
                          <div className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                            http://{vm.externalIp}:80/
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSimStates((prev) => ({
                              ...prev,
                              [vm.id]: { ...prev[vm.id], httpHealthy: !healthy },
                            }));
                            setUptimeTestState('done');
                          }}
                          className={`rounded-md px-3 py-1.5 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            healthy
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {healthy ? '200 OK (Drop NGINX)' : '502 Down (Restore)'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Global Check Regions */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Global Prober Locations
                </h4>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                  {REGION_PROBES.map((probe) => (
                    <div key={probe.region} className="flex items-center justify-between px-4 py-3 text-xs">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {probe.region}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">{probe.location}</div>
                      </div>
                      <div className="font-mono tabular-nums text-right">
                        <span
                          className={
                            uptimePass
                              ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                              : 'font-semibold text-red-600 dark:text-red-400'
                          }
                        >
                          {uptimePass ? `200 OK · ${probe.latencyMs} ms` : '502 Timeout'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
