export interface WorkflowStep {
  id: string;
  n: number;
  name: string;
  path: string;
  navPath: string;
  desc: string;
}

export const ALL_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'intake',
    n: 1,
    name: 'Intake',
    path: '/intake',
    navPath: '/intake',
    desc: 'Capture client context, engagement type, commercial model, and compliance requirements.',
  },
  {
    id: 'identify',
    n: 2,
    name: 'Identify Solution',
    path: '/classify',
    navPath: '/classify',
    desc: 'Select the GenAI solution pattern and calibrate complexity for scoping.',
  },
  {
    id: 'architect',
    n: 3,
    name: 'Architecture & HLD',
    path: '/estimation',
    navPath: '/estimation?tab=overview',
    desc: 'Define solution overview, component inventory, and agent design for the high-level design.',
  },
  {
    id: 'estimate',
    n: 4,
    name: 'Estimate',
    path: '/estimation',
    navPath: '/estimation?tab=wbs',
    desc: 'Build WBS, resource loading, infra costs, and ROI projection.',
  },
  {
    id: 'review',
    n: 5,
    name: 'Review',
    path: '/estimation',
    navPath: '/estimation?tab=assumptions',
    desc: 'Validate assumptions, dependencies, and risks before finalising.',
  },
  {
    id: 'delivery',
    n: 6,
    name: 'Delivery Plan',
    path: '/estimation',
    navPath: '/estimation?tab=delivery',
    desc: 'Define team structure, support tiers, SLAs, PoC scope, and commercial model.',
  },
  {
    id: 'export',
    n: 7,
    name: 'Export',
    path: '/export',
    navPath: '/export',
    desc: 'Download the full proposal package.',
  },
];

export const WORKFLOW_STEPS = ALL_WORKFLOW_STEPS;

const PHASE_TO_STEP_IDS: Record<string, string[]> = {
  'intake':        ['intake'],
  'solution-id':   ['identify'],
  'hld':           ['architect'],
  'estimation':    ['estimate'],
  'delivery':      ['delivery'],
  'roi':           ['estimate'],
  'risk-register': ['review'],
  'export':        ['export'],
};

export function getActiveSteps(activePhases: string[]): WorkflowStep[] {
  const activeStepIds = new Set(activePhases.flatMap(p => PHASE_TO_STEP_IDS[p] ?? []));
  return ALL_WORKFLOW_STEPS.filter(s => activeStepIds.has(s.id));
}

const HLD_TABS = new Set(['overview', 'components', 'agents']);

export function getStepForPath(pathname: string, search: string): WorkflowStep | undefined {
  if (pathname !== '/estimation') {
    return ALL_WORKFLOW_STEPS.find(s => s.path === pathname && s.path !== '/estimation');
  }
  const tab = new URLSearchParams(search).get('tab') || 'overview';
  if (tab === 'delivery') return ALL_WORKFLOW_STEPS.find(s => s.id === 'delivery');
  if (tab === 'assumptions' || tab === 'risks') return ALL_WORKFLOW_STEPS.find(s => s.id === 'review');
  if (HLD_TABS.has(tab)) return ALL_WORKFLOW_STEPS.find(s => s.id === 'architect');
  return ALL_WORKFLOW_STEPS.find(s => s.id === 'estimate');
}
