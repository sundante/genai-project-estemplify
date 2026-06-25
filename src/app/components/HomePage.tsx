import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkbench } from './WorkbenchContext';
import { getActiveSteps } from '../workflow';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileJson,
  FileText,
  Layers,
  Settings,
  Sheet,
} from 'lucide-react';

const outcomes = [
  {
    icon: FileText,
    title: 'Client-Facing Proposal Assets',
    subtitle: 'Hand to client or attach to RFP/SOW',
    deliverables: [
      'Solution overview narrative',
      'Win theme / executive summary',
      'Azure architecture component list',
      'Agentic workflow design',
      'Delivery & support considerations',
      'Assumptions & dependencies register',
      'Risk register',
    ],
    formats: ['Word (.docx)', 'PDF'],
  },
  {
    icon: Sheet,
    title: 'Working Estimation Files',
    subtitle: 'Used by your delivery team to plan and track',
    deliverables: [
      'WBS with 20 activities across 6 phases',
      'Resource loading plan (12 roles)',
      'Infra + token cost model',
      'ROI projection',
    ],
    formats: ['Excel (.xlsx)', 'CSV package'],
  },
  {
    icon: FileJson,
    title: 'Machine-Readable Package',
    subtitle: 'Import into project tools or iterate later',
    deliverables: [
      'Full workspace snapshot',
      'Per-section structured data',
      'Reload-ready for future sessions',
    ],
    formats: ['JSON', 'CSV'],
  },
];

const PRESETS = [
  {
    name: 'Advisory / Briefing Note',
    description: 'Quick assessment and solution recommendation — no estimation required.',
    outputs: ['Solution Brief', 'Recommendations'],
    phases: ['intake', 'solution-id', 'export'],
  },
  {
    name: 'Technical Proposal',
    description: 'Architecture and HLD for a client-facing proposal.',
    outputs: ['Solution Brief', 'Architecture HLD', 'Risk Register'],
    phases: ['intake', 'solution-id', 'hld', 'risk-register', 'export'],
  },
  {
    name: 'Effort Estimate',
    description: 'Full effort, resource, and infra cost estimation with business case.',
    outputs: ['Architecture HLD', 'WBS', 'Resource Plan', 'Cost Model', 'ROI Model', 'Risk Register'],
    phases: ['intake', 'solution-id', 'hld', 'estimation', 'risk-register', 'roi', 'export'],
  },
  {
    name: 'Full SOW Build',
    description: 'Complete proposal package — all phases, all outputs.',
    outputs: ['Solution Brief', 'Architecture HLD', 'WBS', 'Resource Plan', 'Cost Model', 'Delivery Plan', 'ROI Model', 'Risk Register'],
    phases: ['intake', 'solution-id', 'hld', 'estimation', 'delivery', 'roi', 'risk-register', 'export'],
  },
  {
    name: 'Healthcare / Clinical AI',
    description: 'Full SOW for a regulated clinical GenAI engagement. Activates all phases and surfaces HIPAA, EHR integration, clinical validation, and PHI control rows throughout.',
    outputs: ['Solution Brief', 'HLD', 'WBS', 'Resource Plan', 'Infra Cost', 'Risk Register', 'ROI Model', 'Delivery Plan'],
    phases: ['intake', 'solution-id', 'hld', 'estimation', 'delivery', 'roi', 'risk-register', 'export'],
  },
];

const CUSTOMISABLE_PHASES = [
  { id: 'solution-id', label: 'Solution Identification' },
  { id: 'hld', label: 'Architecture & HLD' },
  { id: 'estimation', label: 'Effort & Resource Estimate' },
  { id: 'delivery', label: 'Delivery & Support Model' },
  { id: 'roi', label: 'Business Case & ROI' },
  { id: 'risk-register', label: 'Assumptions & Risk Register' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { state, setEngagementConfig } = useWorkbench();
  const [showSetup, setShowSetup] = useState(!state.intake.clientName);
  const [customOpen, setCustomOpen] = useState(false);

  const activeSteps = getActiveSteps(state.engagementConfig.activePhases);
  const selectedPatternName =
    state.classification.patterns.find(p => p.id === state.classification.selectedPattern)?.name ||
    state.classification.selectedPattern;

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setEngagementConfig({ preset: preset.name, activePhases: preset.phases });
  };

  const togglePhase = (phaseId: string) => {
    const current = state.engagementConfig.activePhases;
    const locked = ['intake', 'export'];
    if (locked.includes(phaseId)) return;
    const next = current.includes(phaseId)
      ? current.filter(p => p !== phaseId)
      : [...current, phaseId];
    setEngagementConfig({ preset: 'Custom', activePhases: next });
  };

  const canBegin = !!state.engagementConfig.preset;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-7">
        <div className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full px-3 py-1 mb-4 w-fit">
          <Bot className="size-3.5" />
          Internal AI Practice
        </div>
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">
          GenAI Proposal & SOW Estimation Workbench
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Turn a GenAI use-case conversation into a structured, exportable proposal package — scoped to exactly what your engagement needs.
        </p>
      </section>

      {showSetup && (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-slate-900 dark:text-slate-100 mb-1">Configure Your Engagement</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select the type of engagement to configure which phases and outputs are included. Only relevant steps appear in your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESETS.map(preset => {
              const isSelected = state.engagementConfig.preset === preset.name;
              const isHealthcare = preset.name === 'Healthcare / Clinical AI';
              return (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className={`text-left rounded-lg border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  } ${isHealthcare ? 'border-l-4 border-l-teal-500' : ''}`}
                >
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                      <CheckCircle2 className="size-3.5" /> Selected
                    </div>
                  )}
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">{preset.name}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.outputs.map(o => (
                      <span key={o} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded px-1.5 py-0.5">{o}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <Collapsible open={customOpen} onOpenChange={setCustomOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                <ChevronDown className={`size-4 transition-transform ${customOpen ? 'rotate-180' : ''}`} />
                Customise phases
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CUSTOMISABLE_PHASES.map(phase => {
                  const active = state.engagementConfig.activePhases.includes(phase.id);
                  return (
                    <label key={phase.id} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => togglePhase(phase.id)}
                        className="rounded"
                      />
                      {phase.label}
                    </label>
                  );
                })}
              </div>
              {state.engagementConfig.preset === 'Custom' && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Custom configuration selected.</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <Button
              onClick={() => { setShowSetup(false); navigate('/intake'); }}
              disabled={!canBegin}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Begin Engagement <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      )}

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
          <h2 className="text-slate-900 dark:text-slate-100">
            How It Works
            {state.engagementConfig.preset && (
              <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                — {state.engagementConfig.preset}
              </span>
            )}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          {activeSteps.map(step => (
            <button
              key={step.id}
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="size-4 text-blue-600" />
                <h2 className="text-slate-900 dark:text-slate-100">Current Workspace Status</h2>
                <button
                  onClick={() => setShowSetup(v => !v)}
                  className="ml-auto flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Settings className="size-3.5" />
                  Reconfigure engagement
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div><div className="text-xs text-slate-400">Client</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.intake.clientName}</div></div>
                <div><div className="text-xs text-slate-400">Segment</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.intake.marketSegment || '-'}</div></div>
                <div><div className="text-xs text-slate-400">Stage</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.intake.opportunityStage || '-'}</div></div>
                <div><div className="text-xs text-slate-400">Pattern</div><div className="font-medium text-slate-800 dark:text-slate-100">{selectedPatternName || '-'}</div></div>
                <div><div className="text-xs text-slate-400">Engagement</div><div className="font-medium text-slate-800 dark:text-slate-100">{state.engagementConfig.preset || '-'}</div></div>
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
