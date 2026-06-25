export interface WorkflowStep {
  n: number;
  name: string;
  path: string;
  navPath: string;
  desc: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    n: 1,
    name: 'Intake',
    path: '/intake',
    navPath: '/intake',
    desc: 'Capture client context, business problem, data types, and compliance requirements.',
  },
  {
    n: 2,
    name: 'Classify',
    path: '/classify',
    navPath: '/classify',
    desc: 'Select the right GenAI solution pattern from 10 archetypes (RAG, Agentic, NL2SQL, etc.).',
  },
  {
    n: 3,
    name: 'Score Complexity',
    path: '/complexity',
    navPath: '/complexity',
    desc: 'Rate 10 dimensions 1–5 to calibrate team size, timeline, and effort multiplier.',
  },
  {
    n: 4,
    name: 'Select Pattern',
    path: '/patterns',
    navPath: '/patterns',
    desc: 'Choose from reusable estimation templates; the Azure Agentic AI template is fully available now.',
  },
  {
    n: 5,
    name: 'Estimate',
    path: '/estimation',
    navPath: '/estimation',
    desc: 'Build WBS, resource loading, infra costs, token volumes, and ROI projection.',
  },
  {
    n: 6,
    name: 'Review',
    path: '/estimation',
    navPath: '/estimation?tab=assumptions',
    desc: 'Validate assumptions, dependencies, and risks before finalising.',
  },
  {
    n: 7,
    name: 'Export',
    path: '/export',
    navPath: '/export',
    desc: 'Download a full estimation package as Excel, Word, PDF, JSON, or CSV.',
  },
];

export function getStepForPath(pathname: string, search: string): WorkflowStep | undefined {
  if (pathname === '/estimation' && search.includes('tab=assumptions')) {
    return WORKFLOW_STEPS.find(s => s.n === 6);
  }
  return WORKFLOW_STEPS.find(s => s.path === pathname && s.n !== 6);
}
