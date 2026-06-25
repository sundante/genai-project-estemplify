import { useNavigate } from 'react-router';
import { useWorkbench } from './WorkbenchContext';
import { WORKFLOW_STEPS } from '../workflow';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  FileJson,
  FileText,
  Layers,
  RefreshCw,
  Sheet,
} from 'lucide-react';

const outcomes = [
  {
    icon: FileText,
    title: 'Client-Facing Proposal Assets',
    subtitle: 'Hand to client or attach to RFP/SOW',
    deliverables: ['Solution overview narrative', 'Azure architecture component list', 'Agentic workflow design', 'Assumptions & dependencies register', 'Risk register'],
    formats: ['Word (.docx)', 'PDF'],
  },
  {
    icon: Sheet,
    title: 'Working Estimation Files',
    subtitle: 'Used by your delivery team to plan and track',
    deliverables: ['WBS with 20 activities across 6 phases', 'Resource loading plan (12 roles)', 'Infra + token cost model', 'ROI projection'],
    formats: ['Excel (.xlsx)', 'CSV package'],
  },
  {
    icon: FileJson,
    title: 'Machine-Readable Package',
    subtitle: 'Import into project tools or iterate later',
    deliverables: ['Full workspace snapshot', 'Per-section structured data', 'Reload-ready for future sessions'],
    formats: ['JSON', 'CSV'],
  },
];


export function HomePage() {
  const navigate = useNavigate();
  const { state, seedWorkspace } = useWorkbench();
  const selectedPatternName = state.classification.patterns.find(pattern => pattern.id === state.classification.selectedPattern)?.name || state.classification.selectedPattern;

  const loadSample = () => {
    if (state.intake.clientName) {
      const ok = window.confirm('This will replace your current workspace with the Agentic AI Prior Auth sample. Continue?');
      if (!ok) return;
    }
    seedWorkspace();
    navigate('/estimation');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full px-3 py-1 mb-4">
              <Bot className="size-3.5" />
              Internal AI Practice
            </div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">GenAI Proposal & SOW Estimation Workbench</h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">Turn a GenAI use-case conversation into a structured, exportable proposal package.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/intake')} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <ArrowRight className="size-4" />
              Start Fresh
            </Button>
            <Button onClick={loadSample} variant="outline" className="gap-2">
              <RefreshCw className="size-4" />
              Load Sample Scenario
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-slate-900 dark:text-slate-100 mb-4">What You Can Produce</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {outcomes.map(card => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-slate-100">{card.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.subtitle}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {card.deliverables.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.formats.map(format => <Badge key={format} variant="secondary">{format}</Badge>)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layers className="size-5 text-blue-600" />
          <h2 className="text-slate-900 dark:text-slate-100">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
          {WORKFLOW_STEPS.map(step => (
            <button
              key={step.n}
              onClick={() => navigate(step.navPath)}
              className="text-left rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
            >
              <div className="size-7 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center mb-3">{step.n}</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{step.name}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {state.intake.clientName && (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="size-4 text-blue-600" />
                <h2 className="text-slate-900 dark:text-slate-100">Current Workspace Status</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div><div className="text-xs text-slate-400">Client</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.intake.clientName}</div></div>
                <div><div className="text-xs text-slate-400">Segment</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.intake.marketSegment || '-'}</div></div>
                <div><div className="text-xs text-slate-400">Stage</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.intake.opportunityStage || '-'}</div></div>
                <div><div className="text-xs text-slate-400">Pattern</div><div className="font-medium text-slate-800 dark:text-slate-100">{selectedPatternName || '-'}</div></div>
                <div><div className="text-xs text-slate-400">Last saved</div><div className="font-medium text-slate-800 dark:text-slate-100">{new Date().toLocaleDateString()}</div></div>
              </div>
            </div>
            <Button onClick={() => navigate('/estimation')} variant="outline" className="gap-2">
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
