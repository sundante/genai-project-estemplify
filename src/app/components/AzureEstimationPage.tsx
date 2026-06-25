import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { WorkflowNav } from './WorkflowNav';
import { useWorkbench, WBSRow, ResourceRow, AssumptionRow, DependencyRow, RiskRow } from './WorkbenchContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  Save, Plus, Trash2, Edit2, Check, X, RefreshCw, Copy, Eye,
  AlertCircle, CheckCircle, Cloud, Layers, Table, Users, Server,
  Shield, AlertTriangle, ChevronDown, ChevronUp, Info, TrendingUp, Download
} from 'lucide-react';
import * as exportOverview from '../../utils/exports/exportOverview';
import * as exportComponents from '../../utils/exports/exportComponents';
import * as exportAgents from '../../utils/exports/exportAgents';
import * as exportWbs from '../../utils/exports/exportWbs';
import * as exportResources from '../../utils/exports/exportResources';
import * as exportInfra from '../../utils/exports/exportInfra';
import * as exportAssumptions from '../../utils/exports/exportAssumptions';
import * as exportRisks from '../../utils/exports/exportRisks';
import * as exportRoi from '../../utils/exports/exportRoi';
import { monthlyRunCost, workflowsPerMonth, exportSectionAsExcel, exportSectionAsPdf, exportSectionAsWord } from '../../utils/exports/core';

const TABS = [
  { id: 'overview', label: 'A. Overview', icon: Cloud },
  { id: 'components', label: 'B. Components', icon: Layers },
  { id: 'agents', label: 'C. Agents', icon: Layers },
  { id: 'wbs', label: 'D. WBS', icon: Table },
  { id: 'resources', label: 'E. Resources', icon: Users },
  { id: 'infra', label: 'F. Infra & Tokens', icon: Server },
  { id: 'assumptions', label: 'G. Assumptions', icon: Shield },
  { id: 'risks', label: 'H. Risks', icon: AlertTriangle },
  { id: 'roi', label: 'I. ROI', icon: TrendingUp },
  { id: 'delivery', label: 'J. Delivery & Support', icon: Users },
];

const TAB_PHASE_MAP: Record<string, string> = {
  overview: 'hld',
  components: 'hld',
  agents: 'hld',
  wbs: 'estimation',
  resources: 'estimation',
  infra: 'estimation',
  assumptions: 'risk-register',
  risks: 'risk-register',
  roi: 'roi',
  delivery: 'delivery',
};

const sectionExporters: Record<string, { exportAsExcel: (state: any) => void; exportAsPdf: (state: any) => void; exportAsWord: (state: any) => void | Promise<void> }> = {
  overview: exportOverview,
  components: exportComponents,
  agents: exportAgents,
  wbs: exportWbs,
  resources: exportResources,
  infra: exportInfra,
  assumptions: exportAssumptions,
  risks: exportRisks,
  roi: exportRoi,
  delivery: {
    exportAsExcel: (state) => exportSectionAsExcel('delivery', state),
    exportAsPdf: (state) => exportSectionAsPdf('delivery', state),
    exportAsWord: (state) => exportSectionAsWord('delivery', state),
  },
};

// ─── AZURE COMPONENTS ────────────────────────────────────────────────────────
const AZURE_COMPONENTS = [
  { id: 'azure-openai', name: 'Azure OpenAI / AI Foundry', purpose: 'LLM inference, embeddings, chat completions', required: true, costDriver: 'Token consumption (input/output)' },
  { id: 'azure-search', name: 'Azure AI Search', purpose: 'Vector + keyword hybrid search, RAG retrieval', required: true, costDriver: 'Index size, query volume' },
  { id: 'azure-doc-intelligence', name: 'Azure Document Intelligence', purpose: 'OCR, form extraction, layout analysis', required: true, costDriver: 'Pages processed per month' },
  { id: 'azure-functions', name: 'Azure Functions', purpose: 'Serverless agent orchestration and event triggers', required: true, costDriver: 'Executions and compute time' },
  { id: 'azure-app-service', name: 'Azure App Service', purpose: 'Host HITL review UI and API layer', required: true, costDriver: 'App plan tier, uptime' },
  { id: 'azure-api-management', name: 'Azure API Management', purpose: 'API gateway, rate limiting, security', required: true, costDriver: 'API calls per month' },
  { id: 'azure-blob-storage', name: 'Azure Blob Storage', purpose: 'Document repository, ingestion staging', required: true, costDriver: 'Storage GB + transaction volume' },
  { id: 'azure-cosmos-db', name: 'Azure Cosmos DB', purpose: 'Audit log, workflow state, agent memory', required: true, costDriver: 'RU/s provisioned + storage' },
  { id: 'azure-sql', name: 'Azure SQL Database', purpose: 'Relational data for structured claims records', required: false, costDriver: 'DTU/vCore tier, storage' },
  { id: 'azure-key-vault', name: 'Azure Key Vault', purpose: 'Secrets management, API key storage', required: true, costDriver: 'Operations (low cost)' },
  { id: 'azure-entra', name: 'Entra ID', purpose: 'Identity, SSO, and RBAC for HITL reviewers', required: true, costDriver: 'Monthly active users' },
  { id: 'azure-monitor', name: 'Azure Monitor', purpose: 'Telemetry, alerts, performance monitoring', required: true, costDriver: 'Data ingestion + retention' },
  { id: 'azure-log-analytics', name: 'Log Analytics', purpose: 'Centralized log queries and compliance auditing', required: false, costDriver: 'Data ingested + queried' },
  { id: 'azure-devops', name: 'Azure DevOps', purpose: 'CI/CD pipelines, sprint planning, repository', required: true, costDriver: 'Users, pipeline minutes' },
  { id: 'azure-communication', name: 'Azure Communication Services', purpose: 'Notifications and email alerts for HITL reviews', required: false, costDriver: 'Messages sent' },
  { id: 'azure-redis', name: 'Azure Cache for Redis', purpose: 'Session caching, prompt caching, rate limiting', required: false, costDriver: 'Cache size and tier' },
];

// ─── AGENTS ──────────────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: 'intake', name: 'Intake Agent', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    responsibility: 'Receives and validates incoming prior authorization requests. Routes to appropriate workflow.',
    inputs: 'PA request form, patient ID, procedure code, diagnosis code',
    outputs: 'Validated request object, workflow initiation signal',
    tools: 'Azure Functions, Cosmos DB, Entra ID',
    callsPerWorkflow: 1,
  },
  {
    id: 'retrieval', name: 'Retrieval Agent', color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
    responsibility: 'Retrieves relevant clinical policies, payer guidelines, and coverage criteria from the knowledge base.',
    inputs: 'Procedure code, diagnosis, payer ID, member plan',
    outputs: 'Top-K policy chunks with relevance scores',
    tools: 'Azure AI Search, Azure OpenAI (embeddings), Blob Storage',
    callsPerWorkflow: 3,
  },
  {
    id: 'extraction', name: 'Evidence Extraction Agent', color: 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800',
    responsibility: 'Extracts structured clinical evidence from submitted documents (referral notes, lab results, imaging reports).',
    inputs: 'Submitted clinical documents (PDF, scanned)',
    outputs: 'Structured evidence entities: diagnoses, treatments, dates, lab values',
    tools: 'Azure Document Intelligence, Azure OpenAI (GPT-4)',
    callsPerWorkflow: 5,
  },
  {
    id: 'reasoning', name: 'Policy Reasoning Agent', color: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    responsibility: 'Maps extracted clinical evidence to specific policy criteria and coverage clauses.',
    inputs: 'Evidence entities, retrieved policy chunks',
    outputs: 'Evidence-to-policy mapping with matched/unmatched criteria',
    tools: 'Azure OpenAI (GPT-4), Azure AI Search',
    callsPerWorkflow: 2,
  },
  {
    id: 'recommendation', name: 'Recommendation Agent', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
    responsibility: 'Generates an approval, denial, or partial approval recommendation with detailed clinical rationale and references.',
    inputs: 'Evidence mapping, policy criteria, coverage rules',
    outputs: 'Recommendation (Approve/Deny/Partial), rationale, citation references, confidence score',
    tools: 'Azure OpenAI (GPT-4), Cosmos DB',
    callsPerWorkflow: 1,
  },
  {
    id: 'quality', name: 'Validation / Q&T Agent', color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    responsibility: 'Validates recommendation quality, detects hallucinations, and checks factual grounding against source documents.',
    inputs: 'Generated recommendation, source documents, policy text',
    outputs: 'Quality score, hallucination flags, grounding report',
    tools: 'Azure OpenAI (GPT-4), custom evaluation prompts',
    callsPerWorkflow: 2,
  },
  {
    id: 'hitl', name: 'HITL Review Agent', color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800',
    responsibility: 'Routes low-confidence recommendations to human reviewers. Manages review queue and escalation.',
    inputs: 'Recommendation + confidence score, quality report',
    outputs: 'Routing decision (auto-approve or human review), review UI assignment',
    tools: 'Azure App Service (HITL UI), Azure Communication Services, Cosmos DB',
    callsPerWorkflow: 1,
  },
  {
    id: 'audit', name: 'Audit and Feedback Agent', color: 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600',
    responsibility: 'Logs all workflow decisions, reviewer actions, and outcomes for compliance and model improvement.',
    inputs: 'All agent outputs, reviewer decisions',
    outputs: 'Immutable audit log entries, feedback signals for model improvement',
    tools: 'Cosmos DB, Log Analytics, Azure Monitor',
    callsPerWorkflow: 1,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ModeBar({ mode, onSetMode, onReset }: { mode: string; onSetMode: (m: 'master' | 'working-copy') => void; onReset: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {mode === 'master' ? (
        <>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
            <Eye className="size-3" /> Master Template — Read Only
          </span>
          <Button size="sm" onClick={() => onSetMode('working-copy')} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
            <Copy className="size-3.5" /> Create Editable Working Copy
          </Button>
        </>
      ) : (
        <>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
            <Edit2 className="size-3" /> Editable Working Copy
          </span>
          <Button size="sm" variant="outline" onClick={() => { if (window.confirm('Reset to master template? All custom rows and changes will be lost.')) { onReset(); onSetMode('master'); } }} className="gap-1.5 text-xs">
            <RefreshCw className="size-3.5" /> Reset to Master
          </Button>
        </>
      )}
    </div>
  );
}

function RowBadge({ type }: { type: 'master' | 'custom' }) {
  return type === 'master' ? (
    <span className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded">Master</span>
  ) : (
    <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">Custom</span>
  );
}

function SectionExportMenu({ tabId }: { tabId: string }) {
  const { state } = useWorkbench();
  const exporters = sectionExporters[tabId] || exportOverview;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exporters.exportAsExcel(state)}>Export as Excel (.xlsx)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exporters.exportAsPdf(state)}>Export as PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exporters.exportAsWord(state)}>Export as Word (.docx)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── SECTION: OVERVIEW ───────────────────────────────────────────────────────
function OverviewTab() {
  const { state, setAzureOverview, setAzureMode } = useWorkbench();
  const { overview, mode } = state.azure;
  const isEditable = mode === 'working-copy';
  const basis = state.azure.estimationBasis;
  const parseRate = (value: string) => {
    const parsed = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : basis.defaultHourlyRate;
  };
  const includedResources = state.azure.resources.filter(row => row.includeInExport);
  const effortDays = includedResources.reduce((sum, row) => sum + row.effortDays, 0);
  const effortHours = effortDays * basis.hoursPerDay;
  const buildCost = includedResources.reduce((sum, row) => sum + row.effortDays * basis.hoursPerDay * parseRate(row.ratePlaceholder), 0);
  const runCost = monthlyRunCost(state) || 0;
  const tco12 = buildCost + runCost * 12;
  const money = (value: number, suffix = '') => value > 0 ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}${suffix}` : '—';

  const inScopeSteps = [
    'Intake request received and validated',
    'Retrieve relevant policy and clinical guidelines',
    'Extract evidence from submitted clinical documents',
    'Map extracted evidence to policy criteria',
    'Generate recommendation with clinical rationale',
    'Human-in-the-loop (HITL) review for low-confidence cases',
    'Audit logging of all decisions and actions',
    'Feedback loop for model improvement',
  ];

  return (
    <div className="space-y-5">
      <ModeBar mode={mode} onSetMode={setAzureMode} onReset={() => {}} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label>Use-case Name</Label>
          <Input
            value={overview.useCaseName}
            onChange={e => isEditable && setAzureOverview({ useCaseName: e.target.value })}
            readOnly={!isEditable}
            className={!isEditable ? 'bg-slate-50 dark:bg-slate-900' : ''}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Cloud Provider</Label>
          <Input value={overview.cloudProvider} readOnly className="bg-slate-50 dark:bg-slate-900" />
        </div>
        <div className="space-y-1.5">
          <Label>Solution Type</Label>
          <Input
            value={overview.solutionType}
            onChange={e => isEditable && setAzureOverview({ solutionType: e.target.value })}
            readOnly={!isEditable}
            className={!isEditable ? 'bg-slate-50 dark:bg-slate-900' : ''}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Business Goal</Label>
        <Textarea
          value={overview.businessGoal}
          onChange={e => isEditable && setAzureOverview({ businessGoal: e.target.value })}
          readOnly={!isEditable}
          className={`min-h-20 ${!isEditable ? 'bg-slate-50 dark:bg-slate-900' : ''}`}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Win Theme / Executive Summary</Label>
        <Textarea
          value={overview.executiveSummary ?? ''}
          onChange={e => isEditable && setAzureOverview({ executiveSummary: e.target.value })}
          readOnly={!isEditable}
          placeholder="Describe why this approach wins — the key differentiator and business impact headline for the proposal cover..."
          className={`min-h-24 ${!isEditable ? 'bg-slate-50 dark:bg-slate-900' : ''}`}
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="size-4 text-blue-500" />
          <h4 className="text-slate-800 dark:text-slate-100">Cost Summary (auto-calculated)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Estimated Build Cost (Labour)</div>
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{money(buildCost)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{effortDays > 0 ? `${effortDays} days / ${effortHours} hours` : 'Add resource rates to calculate'}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Run Cost (Infra)</div>
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{money(runCost, runCost > 0 ? ' / mo' : '')}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">From Infra & Tokens unit rates</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">12-Month TCO</div>
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">{money(tco12)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Build labour + 12 months run cost</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h4 className="text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Layers className="size-4 text-blue-500" /> In-Scope Workflow
        </h4>
        <div className="space-y-2">
          {inScopeSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">{i + 1}</div>
              <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: COMPONENTS ─────────────────────────────────────────────────────
function ComponentsTab() {
  const { state, toggleAzureComponent, setAzureMode } = useWorkbench();
  const { selectedComponents, mode } = state.azure;
  const isEditable = mode === 'working-copy';

  return (
    <div className="space-y-5">
      <ModeBar mode={mode} onSetMode={setAzureMode} onReset={() => {}} />
      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <CheckCircle className="size-4 text-emerald-500" />
        {selectedComponents.length} components selected
      </div>

      <div className="grid grid-cols-1 gap-3">
        {AZURE_COMPONENTS.map(comp => {
          const selected = selectedComponents.includes(comp.id);
          return (
            <button
              key={comp.id}
              disabled={!isEditable}
              onClick={() => isEditable && toggleAzureComponent(comp.id)}
              className={`text-left w-full rounded-lg border p-4 transition-all ${
                selected
                  ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              } ${!isEditable ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                  {selected && <Check className="size-2.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{comp.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${comp.required ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      {comp.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{comp.purpose}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Cost driver: {comp.costDriver}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION: AGENTS ─────────────────────────────────────────────────────────
function AgentsTab() {
  const [expanded, setExpanded] = useState<string | null>('intake');

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-4">
        <Info className="size-4 text-blue-500" />
        8 agents in the Prior Authorization workflow. Click to expand each agent's design.
      </div>
      {AGENTS.map(agent => (
        <div key={agent.id} className={`rounded-xl border-2 overflow-hidden ${agent.color}`}>
          <button
            onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{agent.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{agent.callsPerWorkflow} call{agent.callsPerWorkflow > 1 ? 's' : ''}/workflow</span>
            </div>
            {expanded === agent.id ? <ChevronUp className="size-4 text-slate-400" /> : <ChevronDown className="size-4 text-slate-400" />}
          </button>
          {expanded === agent.id && (
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-current/10">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Responsibility</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{agent.responsibility}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Tools</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{agent.tools}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Inputs</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{agent.inputs}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Outputs</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{agent.outputs}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SECTION: WBS ────────────────────────────────────────────────────────────
function WBSTab() {
  const { state, setAzureMode, resetToMaster, addWBSRow, deleteWBSRow, updateWBSRow, setEstimationBasis } = useWorkbench();
  const { wbs, mode } = state.azure;
  const basis = state.azure.estimationBasis;
  const isEditable = mode === 'working-copy';
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Partial<WBSRow>>({ phase: '', activity: '', deliverable: '', role: '', complexity: 'Medium', effortDays: 1, dependency: '', acceptanceCriteria: '', includeInExport: true });

  const totalEffort = wbs.filter(r => r.includeInExport).reduce((s, r) => s + r.effortDays, 0);
  const totalEffortHours = totalEffort * basis.hoursPerDay;

  const handleAdd = () => {
    if (!newRow.activity || !newRow.phase || !newRow.role) return;
    addWBSRow({
      id: `custom-${Date.now()}`,
      phase: newRow.phase!,
      activity: newRow.activity!,
      deliverable: newRow.deliverable || '',
      role: newRow.role!,
      complexity: newRow.complexity || 'Medium',
      effortDays: newRow.effortDays || 1,
      dependency: newRow.dependency || '',
      acceptanceCriteria: newRow.acceptanceCriteria || '',
      rowType: 'custom',
      includeInExport: true,
    });
    setAdding(false);
    setNewRow({ phase: '', activity: '', deliverable: '', role: '', complexity: 'Medium', effortDays: 1, dependency: '', acceptanceCriteria: '', includeInExport: true });
  };

  const phases = ['Discovery', 'Design', 'Build', 'Test', 'Deploy', 'KT', 'Govern'];
  const roles = ['Business Analyst', 'Solution Architect', 'GenAI Architect', 'AI/ML Engineer', 'Backend Engineer', 'Data Engineer', 'Cloud Engineer', 'Frontend Engineer', 'QA Engineer', 'Q&T Engineer', 'Healthcare SME', 'Project Manager'];

  const duplicateRow = (row: WBSRow) => {
    addWBSRow({
      ...row,
      id: `custom-${Date.now()}`,
      activity: `${row.activity} copy`,
      rowType: 'custom',
      includeInExport: true,
    });
  };

  return (
    <div className="space-y-4">
      <ModeBar mode={mode} onSetMode={setAzureMode} onReset={resetToMaster} />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Base calculation</div>
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">Total effort = included WBS effort days × hours per day</div>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs">Editable WBS effort formula / note</Label>
            <Input value={basis.resourceEffortFormula} onChange={e => setEstimationBasis({ resourceEffortFormula: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>{wbs.length} activities</span>
          <span>•</span>
          <span>{totalEffort} effort days / {totalEffortHours} effort hours (selected)</span>
        </div>
        {isEditable && (
          <Button size="sm" onClick={() => setAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
            <Plus className="size-4" /> Add Row
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Phase</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Activity</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Deliverable</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Complexity</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Days / Hours</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Export</th>
                {isEditable && <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {wbs.map(row => (
                <tr key={row.id} className={`${!row.includeInExport ? 'opacity-50' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {isEditable ? (
                      <select value={row.phase} onChange={e => updateWBSRow(row.id, { phase: e.target.value })} className="w-28 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs">
                        {phases.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{row.phase}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isEditable ? (
                      <Input value={row.activity} onChange={e => updateWBSRow(row.id, { activity: e.target.value })} className="min-w-56 h-8 text-xs" />
                    ) : (
                      <div className="text-sm text-slate-800 dark:text-slate-100">{row.activity}</div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isEditable ? (
                      <Input value={row.deliverable} onChange={e => updateWBSRow(row.id, { deliverable: e.target.value })} className="min-w-52 h-8 text-xs" />
                    ) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400">{row.deliverable || '-'}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {isEditable ? (
                      <select value={row.role} onChange={e => updateWBSRow(row.id, { role: e.target.value })} className="w-40 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs">
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : row.role}
                  </td>
                  <td className="px-3 py-2">
                    {isEditable ? (
                      <select value={row.complexity} onChange={e => updateWBSRow(row.id, { complexity: e.target.value })} className="w-24 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs">
                        {['Low', 'Medium', 'High'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        row.complexity === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                        row.complexity === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      }`}>{row.complexity}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 text-center">
                    {isEditable ? (
                      <div className="space-y-1">
                        <input type="number" min={0.5} step={0.5} value={row.effortDays} onChange={e => updateWBSRow(row.id, { effortDays: parseFloat(e.target.value) || 0 })} className="w-20 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-center" />
                        <div className="text-[10px] text-slate-400">{row.effortDays * basis.hoursPerDay} hrs</div>
                      </div>
                    ) : (
                      <div>
                        <div>{row.effortDays}</div>
                        <div className="text-[10px] text-slate-400">{row.effortDays * basis.hoursPerDay} hrs</div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2"><RowBadge type={row.rowType} /></td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.includeInExport}
                      onChange={() => updateWBSRow(row.id, { includeInExport: !row.includeInExport })}
                      className="rounded"
                    />
                  </td>
                  {isEditable && (
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button onClick={() => duplicateRow(row)} className="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300" title="Duplicate as custom row">
                        <Copy className="size-3.5" />
                      </button>
                      {row.rowType === 'custom' && (
                        <button onClick={() => deleteWBSRow(row.id)} className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300">
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add row form */}
      {adding && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 space-y-3">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Add Custom WBS Row</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Phase *</Label>
              <select value={newRow.phase} onChange={e => setNewRow(p => ({ ...p, phase: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select phase</option>
                {phases.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">Activity *</Label>
              <Input placeholder="Activity description" value={newRow.activity || ''} onChange={e => setNewRow(p => ({ ...p, activity: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Deliverable</Label>
              <Input placeholder="Key deliverable" value={newRow.deliverable || ''} onChange={e => setNewRow(p => ({ ...p, deliverable: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role *</Label>
              <select value={newRow.role} onChange={e => setNewRow(p => ({ ...p, role: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Effort Days / Hours *</Label>
              <Input type="number" min={0.5} step={0.5} value={newRow.effortDays || ''} onChange={e => setNewRow(p => ({ ...p, effortDays: parseFloat(e.target.value) }))} />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{newRow.effortDays ? `${newRow.effortDays * basis.hoursPerDay} effort hours` : 'Uses current hours/day basis'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Complexity</Label>
              <select value={newRow.complexity} onChange={e => setNewRow(p => ({ ...p, complexity: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Low', 'Medium', 'High'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Check className="size-3.5" /> Add</Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="gap-1.5"><X className="size-3.5" /> Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION: RESOURCES ──────────────────────────────────────────────────────
function ResourcesTab() {
  const { state, setAzureMode, resetToMaster, addResourceRow, deleteResourceRow, updateResourceRow, setEstimationBasis } = useWorkbench();
  const { resources, mode } = state.azure;
  const basis = state.azure.estimationBasis;
  const isEditable = mode === 'working-copy';
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Partial<ResourceRow>>({ role: '', phase: '', allocation: 100, durationWeeks: 4, effortDays: 20, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', includeInExport: true });

  const includedResources = resources.filter(r => r.includeInExport);
  const parseMoney = (value: string) => {
    const parsed = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : basis.defaultHourlyRate;
  };
  const rowCost = (row: ResourceRow) => row.effortDays * basis.hoursPerDay * parseMoney(row.ratePlaceholder);
  const totalEffort = includedResources.reduce((s, r) => s + r.effortDays, 0);
  const totalPersonWeeks = resources.reduce((s, r) => s + (r.durationWeeks * r.allocation / 100), 0);
  const maxWeeks = Math.max(...resources.map(r => r.durationWeeks), 0);
  const totalCost = includedResources.reduce((sum, row) => sum + rowCost(row), 0);

  const roles = ['Solution Architect', 'GenAI Architect', 'AI/ML Engineer', 'Backend Engineer', 'Data Engineer', 'Cloud Engineer', 'Frontend Engineer', 'QA Engineer', 'Q&T Engineer', 'Business Analyst', 'Healthcare SME', 'Project Manager'];

  const handleAdd = () => {
    if (!newRow.role) return;
    addResourceRow({
      id: `custom-${Date.now()}`,
      role: newRow.role!,
      phase: newRow.phase || '',
      allocation: newRow.allocation || 100,
      durationWeeks: newRow.durationWeeks || 4,
      effortDays: newRow.effortDays || 20,
      ratePlaceholder: newRow.ratePlaceholder || 'TBD',
      costPlaceholder: newRow.costPlaceholder || 'TBD',
      rowType: 'custom',
      includeInExport: true,
    });
    setAdding(false);
    setNewRow({ role: '', phase: '', allocation: 100, durationWeeks: 4, effortDays: 20, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', includeInExport: true });
  };

  const updateResourceInputs = (row: ResourceRow, data: Partial<ResourceRow>) => {
    const next = { ...row, ...data };
    const effortDays = Math.round(next.durationWeeks * basis.daysPerWeek * (next.allocation / 100));
    const rate = parseMoney(next.ratePlaceholder);
    updateResourceRow(row.id, {
      ...data,
      effortDays,
      costPlaceholder: rate > 0 ? `$${(effortDays * basis.hoursPerDay * rate).toFixed(0)}` : 'TBD',
    });
  };

  const applyDefaultRate = () => {
    resources.forEach(row => {
      const rate = basis.defaultHourlyRate;
      updateResourceRow(row.id, {
        ratePlaceholder: rate > 0 ? String(rate) : 'TBD',
        costPlaceholder: rate > 0 ? `$${rowCost({ ...row, ratePlaceholder: String(rate) }).toFixed(0)}` : 'TBD',
      });
    });
  };

  return (
    <div className="space-y-4">
      <ModeBar mode={mode} onSetMode={setAzureMode} onReset={resetToMaster} />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Hours per day</Label>
            <Input type="number" min={1} value={basis.hoursPerDay} onChange={e => setEstimationBasis({ hoursPerDay: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Days per week</Label>
            <Input type="number" min={1} value={basis.daysPerWeek} onChange={e => setEstimationBasis({ daysPerWeek: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Default hourly billing rate</Label>
            <Input type="number" min={0} value={basis.defaultHourlyRate || ''} onChange={e => setEstimationBasis({ defaultHourlyRate: parseFloat(e.target.value) || 0 })} placeholder="Enterprise default or client-specific rate" />
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={applyDefaultRate} disabled={!isEditable} className="w-full">Apply default rate</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Editable effort formula</Label>
            <Input value={basis.resourceEffortFormula} onChange={e => setEstimationBasis({ resourceEffortFormula: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Editable cost formula</Label>
            <Input value={basis.resourceCostFormula} onChange={e => setEstimationBasis({ resourceCostFormula: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalEffort}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Total Effort Days</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalPersonWeeks.toFixed(0)}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Person Weeks</div>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{maxWeeks}</div>
          <div className="text-xs text-teal-600 dark:text-teal-400">Est. Duration Weeks</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{totalCost > 0 ? `$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'TBD'}</div>
          <div className="text-xs text-amber-600 dark:text-amber-400">Resource Cost</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">{resources.length} roles loaded</span>
        {isEditable && <Button size="sm" onClick={() => setAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Plus className="size-4" /> Add Role</Button>}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {['Role', 'Phase', 'Allocation %', 'Duration (wks)', 'Effort Days', 'Rate', 'Cost', 'Type', 'Export', isEditable ? 'Actions' : ''].filter(Boolean).map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {resources.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">{row.role}</td>
                  <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{row.phase}</td>
                  <td className="px-3 py-2 text-center">
                    {isEditable ? (
                      <input type="number" min={1} max={100} value={row.allocation} onChange={e => updateResourceInputs(row, { allocation: parseInt(e.target.value) || 0 })} className="w-16 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-0.5 text-xs" />
                    ) : (
                      <span className="text-sm">{row.allocation}%</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {isEditable ? (
                      <input type="number" min={1} value={row.durationWeeks} onChange={e => updateResourceInputs(row, { durationWeeks: parseInt(e.target.value) || 0 })} className="w-16 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-0.5 text-xs" />
                    ) : (
                      <span className="text-sm">{row.durationWeeks}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center font-medium text-slate-800 dark:text-slate-100">{row.effortDays}</td>
                  <td className="px-3 py-2 text-xs text-slate-400 text-center">
                    {isEditable ? (
                      <input value={row.ratePlaceholder} onChange={e => updateResourceInputs(row, { ratePlaceholder: e.target.value })} className="w-20 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-0.5 text-xs" />
                    ) : row.ratePlaceholder}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400 text-center">{rowCost(row) > 0 ? `$${rowCost(row).toFixed(0)}` : row.costPlaceholder}</td>
                  <td className="px-3 py-2"><RowBadge type={row.rowType} /></td>
                  <td className="px-3 py-2"><input type="checkbox" checked={row.includeInExport} onChange={() => updateResourceRow(row.id, { includeInExport: !row.includeInExport })} className="rounded" /></td>
                  {isEditable && (
                    <td className="px-3 py-2">
                      {row.rowType === 'custom' && (
                        <button onClick={() => deleteResourceRow(row.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adding && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 space-y-3">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Add Custom Resource Row</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Role *</Label>
              <select value={newRow.role} onChange={e => setNewRow(p => ({ ...p, role: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phase</Label>
              <Input placeholder="e.g. Build" value={newRow.phase || ''} onChange={e => setNewRow(p => ({ ...p, phase: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Allocation %</Label>
              <Input type="number" min={1} max={100} value={newRow.allocation || ''} onChange={e => setNewRow(p => ({ ...p, allocation: parseInt(e.target.value) }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Duration Weeks</Label>
              <Input type="number" min={1} value={newRow.durationWeeks || ''} onChange={e => setNewRow(p => ({ ...p, durationWeeks: parseInt(e.target.value), effortDays: Math.round(parseInt(e.target.value) * (newRow.allocation || 100) / 100 * 5) }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Hourly Rate</Label>
              <Input placeholder="e.g. 150" value={newRow.ratePlaceholder || ''} onChange={e => setNewRow(p => ({ ...p, ratePlaceholder: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Check className="size-3.5" /> Add</Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="gap-1.5"><X className="size-3.5" /> Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION: INFRA & TOKENS ─────────────────────────────────────────────────
function InfraTokensTab() {
  const { state, setInfra, setEstimationBasis } = useWorkbench();
  const infra = state.azure.infra;
  const basis = state.azure.estimationBasis;

  const workflowsPerMonth = infra.monthlyUsers * infra.requestsPerUserPerDay * 30;
  const llmCallsPerMonth = workflowsPerMonth * (infra.agentStepsPerWorkflow + infra.evaluationCallsPerWorkflow);
  const inputTokensPerMonth = llmCallsPerMonth * (infra.avgPromptTokens + infra.avgRetrievalContextTokens);
  const outputTokensPerMonth = llmCallsPerMonth * infra.avgCompletionTokens;
  const ocrPagesPerMonth = workflowsPerMonth * infra.avgDocumentsPerWorkflow * infra.avgPagesPerDocument;
  const storageGB = (ocrPagesPerMonth * 0.001).toFixed(1);
  const vectorIndexGB = (workflowsPerMonth * infra.avgDocumentsPerWorkflow * 0.0001).toFixed(2);
  const tokenCost = (inputTokensPerMonth / 1000 * parseFloat(infra.unitRateLLMInput || '0')) + (outputTokensPerMonth / 1000 * parseFloat(infra.unitRateLLMOutput || '0'));
  const ocrCost = ocrPagesPerMonth * parseFloat(infra.unitRateOCR || '0');
  const storageCost = parseFloat(storageGB) * parseFloat(infra.unitRateStorage || '0');
  const hasAllRunRates = Boolean(infra.unitRateLLMInput && infra.unitRateLLMOutput && infra.unitRateOCR && infra.unitRateStorage);

  const numericInput = (label: string, key: keyof typeof infra, min = 0) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        min={min}
        value={(infra[key] as number) || ''}
        onChange={e => setInfra({ [key]: parseFloat(e.target.value) || 0 } as any)}
        className="h-9"
      />
    </div>
  );

  const calcCard = (label: string, value: string | number, sub?: string) => (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</div>
      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Calculation Basis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Editable volume formula</Label>
            <Input value={basis.infraVolumeFormula} onChange={e => setEstimationBasis({ infraVolumeFormula: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Editable token cost formula</Label>
            <Input value={basis.tokenCostFormula} onChange={e => setEstimationBasis({ tokenCostFormula: e.target.value })} />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Current base: {infra.monthlyUsers.toLocaleString()} monthly users x {infra.requestsPerUserPerDay} requests/user/day x 30 days = {workflowsPerMonth.toLocaleString()} workflows/month.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Usage Inputs</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {numericInput('Monthly Users', 'monthlyUsers', 1)}
          {numericInput('Concurrent Users', 'concurrentUsers', 1)}
          {numericInput('Requests / User / Day', 'requestsPerUserPerDay', 1)}
          {numericInput('Docs / Workflow', 'avgDocumentsPerWorkflow', 1)}
          {numericInput('Pages / Document', 'avgPagesPerDocument', 1)}
          {numericInput('Avg Prompt Tokens', 'avgPromptTokens')}
          {numericInput('Avg Retrieval Context Tokens', 'avgRetrievalContextTokens')}
          {numericInput('Avg Completion Tokens', 'avgCompletionTokens')}
          {numericInput('Agent Steps / Workflow', 'agentStepsPerWorkflow')}
          {numericInput('Evaluation Calls / Workflow', 'evaluationCallsPerWorkflow')}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Unit Rates (optional — enter to estimate costs)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">LLM Input ($ / 1K tokens)</Label><Input placeholder="e.g. 0.01" value={infra.unitRateLLMInput} onChange={e => setInfra({ unitRateLLMInput: e.target.value })} /></div>
          <div className="space-y-1.5"><Label className="text-xs">LLM Output ($ / 1K tokens)</Label><Input placeholder="e.g. 0.03" value={infra.unitRateLLMOutput} onChange={e => setInfra({ unitRateLLMOutput: e.target.value })} /></div>
          <div className="space-y-1.5"><Label className="text-xs">Embedding ($ / 1K tokens)</Label><Input placeholder="e.g. 0.0001" value={infra.unitRateEmbedding} onChange={e => setInfra({ unitRateEmbedding: e.target.value })} /></div>
          <div className="space-y-1.5"><Label className="text-xs">OCR ($ / page)</Label><Input placeholder="e.g. 0.001" value={infra.unitRateOCR} onChange={e => setInfra({ unitRateOCR: e.target.value })} /></div>
          <div className="space-y-1.5"><Label className="text-xs">Storage ($ / GB / month)</Label><Input placeholder="e.g. 0.02" value={infra.unitRateStorage} onChange={e => setInfra({ unitRateStorage: e.target.value })} /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Calculated Estimates (Monthly)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {calcCard('Workflows / Month', workflowsPerMonth)}
          {calcCard('LLM Calls / Month', llmCallsPerMonth)}
          {calcCard('Input Tokens / Month', inputTokensPerMonth, 'prompt + context tokens')}
          {calcCard('Output Tokens / Month', outputTokensPerMonth)}
          {calcCard('OCR Pages / Month', ocrPagesPerMonth.toLocaleString())}
          {calcCard('Est. Storage', `${storageGB} GB`, 'document storage')}
          {calcCard('Vector Index', `${vectorIndexGB} GB`, 'embedding index estimate')}
          {calcCard('Monthly Token Cost', infra.unitRateLLMInput && infra.unitRateLLMOutput ? `$${tokenCost.toFixed(0)}` : 'Enter rates', basis.tokenCostFormula)}
          {calcCard('Monthly OCR Cost', infra.unitRateOCR ? `$${ocrCost.toFixed(0)}` : 'Enter rate', 'OCR pages/month x OCR page rate')}
          {calcCard('Monthly Storage Cost', infra.unitRateStorage ? `$${storageCost.toFixed(0)}` : 'Enter rate', 'Storage GB x storage rate')}
          {calcCard('Total Monthly Run Cost', hasAllRunRates ? `$${(tokenCost + ocrCost + storageCost).toFixed(0)}` : 'TBD', 'Token + OCR + storage costs')}
          {calcCard('Environments', infra.environments.join(', '))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="size-3.5 flex-shrink-0" />
            Estimates are indicative. Actual costs depend on model version, pricing tier, data volume, and region. Use Azure Pricing Calculator for final numbers.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: ASSUMPTIONS ────────────────────────────────────────────────────
function AssumptionsTab() {
  const { state, setAzureMode, addAssumption, updateAssumption, deleteAssumption, addDependency, updateDependency, deleteDependency } = useWorkbench();
  const { assumptions, dependencies, mode } = state.azure;
  const isEditable = mode === 'working-copy';
  const [view, setView] = useState<'assumptions' | 'dependencies'>('assumptions');
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ category: '', description: '', owner: '', impact: 'Medium' });

  const assumptionCategories = ['Data Availability', 'PHI/PII and Compliance', 'SME Availability', 'Ground Truth', 'Cloud Environment', 'Security Approval', 'Model Performance', 'Production Readiness', 'Cost Estimate'];
  const dependencyCategories = ['Source System Access', 'API Availability', 'Azure Subscription', 'Network / Security', 'SME Review', 'Test Data', 'Ground Truth Dataset', 'UAT Users', 'Production Approval'];
  const impactLevels = ['Low', 'Medium', 'High'];
  const impactColor = { Low: 'text-emerald-600', Medium: 'text-amber-600', High: 'text-red-600' };

  const rows = view === 'assumptions' ? assumptions : dependencies;

  const handleAdd = () => {
    if (!newRow.description) return;
    const base = { id: `custom-${Date.now()}`, ...newRow, rowType: 'custom' as const, includeInExport: true };
    if (view === 'assumptions') addAssumption(base);
    else addDependency(base);
    setAdding(false);
    setNewRow({ category: '', description: '', owner: '', impact: 'Medium' });
  };

  const handleDelete = (id: string) => {
    if (view === 'assumptions') deleteAssumption(id);
    else deleteDependency(id);
  };

  const handleUpdate = (id: string, data: any) => {
    if (view === 'assumptions') updateAssumption(id, data);
    else updateDependency(id, data);
  };

  return (
    <div className="space-y-4">
      <ModeBar mode={mode} onSetMode={setAzureMode} onReset={() => {}} />

      <div className="flex gap-2">
        {(['assumptions', 'dependencies'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)} ({v === 'assumptions' ? assumptions.length : dependencies.length})
          </button>
        ))}
        {isEditable && <Button size="sm" onClick={() => setAdding(true)} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Plus className="size-4" /> Add</Button>}
      </div>

      <div className="space-y-2">
        {rows.map(row => (
          <div key={row.id} className={`bg-white dark:bg-slate-800 rounded-xl border p-4 ${!row.includeInExport ? 'opacity-60 border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={row.includeInExport} onChange={() => handleUpdate(row.id, { includeInExport: !row.includeInExport })} className="mt-1 rounded flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{row.category}</span>
                  <span className={`text-xs font-medium ${impactColor[row.impact as keyof typeof impactColor] || 'text-slate-600'}`}>Impact: {row.impact}</span>
                  <RowBadge type={row.rowType} />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{row.description}</p>
                {row.owner && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Owner: {row.owner}</p>}
              </div>
              {isEditable && row.rowType === 'custom' && (
                <button onClick={() => handleDelete(row.id)} className="p-1 text-red-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 space-y-3">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Add Custom {view === 'assumptions' ? 'Assumption' : 'Dependency'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <select value={newRow.category} onChange={e => setNewRow(p => ({ ...p, category: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select category</option>
                {(view === 'assumptions' ? assumptionCategories : dependencyCategories).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Owner</Label>
              <Input placeholder="e.g. Client IT" value={newRow.owner} onChange={e => setNewRow(p => ({ ...p, owner: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Impact</Label>
              <select value={newRow.impact} onChange={e => setNewRow(p => ({ ...p, impact: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {impactLevels.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-1 md:col-span-3">
              <Label className="text-xs">Description *</Label>
              <Textarea placeholder="Describe the assumption or dependency..." value={newRow.description} onChange={e => setNewRow(p => ({ ...p, description: e.target.value }))} className="min-h-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Check className="size-3.5" /> Add</Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="gap-1.5"><X className="size-3.5" /> Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION: RISKS ──────────────────────────────────────────────────────────
function RisksTab() {
  const { state, setAzureMode, addRisk, updateRisk, deleteRisk } = useWorkbench();
  const { risks, mode } = state.azure;
  const isEditable = mode === 'working-copy';
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ description: '', probability: 'Medium', impact: 'Medium', mitigation: '', owner: '' });

  const levels = ['Low', 'Medium', 'High'];
  const levelColor = { Low: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', Medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', High: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };

  const nextRiskId = `R-${String(risks.length + 1).padStart(2, '0')}`;

  const handleAdd = () => {
    if (!newRow.description) return;
    addRisk({ id: `custom-${Date.now()}`, riskId: nextRiskId, ...newRow, rowType: 'custom', includeInExport: true });
    setAdding(false);
    setNewRow({ description: '', probability: 'Medium', impact: 'Medium', mitigation: '', owner: '' });
  };

  const highRisks = risks.filter(r => r.impact === 'High' || r.probability === 'High').length;

  return (
    <div className="space-y-4">
      <ModeBar mode={mode} onSetMode={setAzureMode} onReset={() => {}} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">{risks.length} risks</span>
          {highRisks > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="size-3.5" /> {highRisks} high impact
            </span>
          )}
        </div>
        {isEditable && <Button size="sm" onClick={() => setAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Plus className="size-4" /> Add Risk</Button>}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {['ID', 'Description', 'Prob.', 'Impact', 'Mitigation', 'Owner', 'Type', 'Export', isEditable ? 'Actions' : ''].filter(Boolean).map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {risks.map(row => (
                <tr key={row.id} className={`${!row.includeInExport ? 'opacity-50' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">{row.riskId}</span>
                  </td>
                  <td className="px-3 py-3 max-w-xs">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{row.description}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColor[row.probability as keyof typeof levelColor]}`}>{row.probability}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColor[row.impact as keyof typeof levelColor]}`}>{row.impact}</span>
                  </td>
                  <td className="px-3 py-3 max-w-xs">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{row.mitigation}</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.owner}</td>
                  <td className="px-3 py-3"><RowBadge type={row.rowType} /></td>
                  <td className="px-3 py-3"><input type="checkbox" checked={row.includeInExport} onChange={() => updateRisk(row.id, { includeInExport: !row.includeInExport })} className="rounded" /></td>
                  {isEditable && (
                    <td className="px-3 py-3">
                      {row.rowType === 'custom' && (
                        <button onClick={() => deleteRisk(row.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="size-3.5" /></button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adding && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 space-y-3">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Add Custom Risk</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1 md:col-span-3">
              <Label className="text-xs">Risk Description *</Label>
              <Textarea placeholder="Describe the risk..." value={newRow.description} onChange={e => setNewRow(p => ({ ...p, description: e.target.value }))} className="min-h-16" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Probability</Label>
              <select value={newRow.probability} onChange={e => setNewRow(p => ({ ...p, probability: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Impact</Label>
              <select value={newRow.impact} onChange={e => setNewRow(p => ({ ...p, impact: e.target.value }))} className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Owner</Label>
              <Input placeholder="e.g. Project Manager" value={newRow.owner} onChange={e => setNewRow(p => ({ ...p, owner: e.target.value }))} />
            </div>
            <div className="space-y-1 md:col-span-3">
              <Label className="text-xs">Mitigation Strategy</Label>
              <Textarea placeholder="How will this risk be mitigated..." value={newRow.mitigation} onChange={e => setNewRow(p => ({ ...p, mitigation: e.target.value }))} className="min-h-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"><Check className="size-3.5" /> Add</Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="gap-1.5"><X className="size-3.5" /> Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION: ROI ────────────────────────────────────────────────────────────
function RoiTab() {
  const { state, setRoi, setEstimationBasis } = useWorkbench();
  const roi = state.azure.roi;
  const basis = state.azure.estimationBasis;
  const workflows = workflowsPerMonth(state);
  const hoursSaved = workflows * roi.currentEffortHoursPerWorkflow * (roi.projectedEffortReductionPct / 100);
  const turnaroundReductionHours = roi.currentTurnaroundHours * (roi.projectedTurnaroundReductionPct / 100);
  const projectedTurnaround = Math.max(0, roi.currentTurnaroundHours - turnaroundReductionHours);
  const reworkAvoided = workflows * (roi.currentErrorRatePct / 100) * (roi.projectedErrorReductionPct / 100);
  const runCost = monthlyRunCost(state);
  const canNarrate = roi.currentEffortHoursPerWorkflow > 0 && roi.currentErrorRatePct > 0;

  const numeric = (label: string, key: keyof typeof roi) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type="number" min={0} value={roi[key] as number} onChange={e => setRoi({ [key]: parseFloat(e.target.value) || 0 } as any)} />
    </div>
  );

  const slider = (label: string, key: keyof typeof roi) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{roi[key] as number}%</span>
      </div>
      <Slider value={[roi[key] as number]} min={0} max={100} step={1} onValueChange={v => setRoi({ [key]: v[0] } as any)} />
    </div>
  );

  const outcome = (label: string, value: string, sub?: string) => (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">{value}</div>
      {sub && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Calculation Basis</h3>
        <div className="space-y-1.5">
          <Label className="text-xs">Editable ROI formula</Label>
          <Input value={basis.roiFormula} onChange={e => setEstimationBasis({ roiFormula: e.target.value })} />
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Current base: {workflows.toLocaleString()} workflows/month x {roi.currentEffortHoursPerWorkflow} manual hours/workflow x {roi.projectedEffortReductionPct}% effort reduction.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Current State</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {numeric('Effort per workflow (hours)', 'currentEffortHoursPerWorkflow')}
          {numeric('Error/rework rate (%)', 'currentErrorRatePct')}
          {numeric('Current turnaround (hours)', 'currentTurnaroundHours')}
          <div className="space-y-1.5">
            <Label className="text-xs">Rate placeholder — fill in for cost calculation</Label>
            <Input type="text" value={roi.currentFTECostPerHour || ''} onChange={e => setRoi({ currentFTECostPerHour: parseFloat(e.target.value) || 0 })} placeholder="0" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Projected Improvement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slider('Effort reduction (%)', 'projectedEffortReductionPct')}
          {slider('Error reduction (%)', 'projectedErrorReductionPct')}
          {slider('Turnaround reduction (%)', 'projectedTurnaroundReductionPct')}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Calculated Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {outcome('Hours saved/month', hoursSaved.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
          {outcome('Turnaround improvement', `Reduced by ${turnaroundReductionHours.toFixed(1)} hours`, `from ${roi.currentTurnaroundHours} to ${projectedTurnaround.toFixed(1)} hours`)}
          {outcome('Rework avoided/month', reworkAvoided.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
          {outcome('Monthly run cost', runCost === null ? 'TBD' : `$${runCost.toFixed(0)}`)}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-slate-800 dark:text-slate-100">Proposal Summary Statement</h3>
          <Input className="max-w-xs" value={roi.implementationCostPlaceholder} onChange={e => setRoi({ implementationCostPlaceholder: e.target.value })} placeholder="Implementation cost placeholder" />
        </div>
        <blockquote className="border-l-4 border-blue-500 pl-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {canNarrate
            ? `At projected volumes of ${workflows.toLocaleString()} workflows/month, this solution is estimated to save ${hoursSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} hours/month in manual effort and reduce rework by ${roi.projectedErrorReductionPct}%. With an indicative implementation investment of ${roi.implementationCostPlaceholder || 'TBD'}, cost recovery is driven by operational efficiency gains.`
            : 'Fill in current state inputs and unit rates to generate the full ROI narrative.'}
        </blockquote>
      </div>

      <div className="space-y-1.5">
        <Label>ROI assumptions and caveats</Label>
        <Textarea value={roi.notes} onChange={e => setRoi({ notes: e.target.value })} className="min-h-28" />
      </div>
    </div>
  );
}

// ─── SECTION: DELIVERY & SUPPORT ─────────────────────────────────────────────
function DeliveryTab() {
  const { state, setDelivery } = useWorkbench();
  const navigate = useNavigate();
  const d = state.azure.delivery;
  const intake = state.intake;

  const pctSum = d.onshorePct + d.offshorePct + d.nearshorePct;

  const field = (label: string, children: React.ReactNode) => (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Section 1 — Engagement Context (read-only) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Engagement & Commercial Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div><div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Engagement Type</div><div className="font-medium text-slate-800 dark:text-slate-100">{intake.engagementType || '—'}</div></div>
          <div><div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commercial Model</div><div className="font-medium text-slate-800 dark:text-slate-100">{intake.commercialModel || '—'}</div></div>
          <div><div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Budget Indicator</div><div className="font-medium text-slate-800 dark:text-slate-100">{intake.budgetIndicator || '—'}</div></div>
        </div>
        {(!intake.engagementType || !intake.commercialModel) && (
          <button onClick={() => navigate('/intake')} className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Edit in Project Intake ↗
          </button>
        )}
      </div>

      {/* Section 2 — Team Structure */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Team Structure</h3>
        <div className="space-y-4">
          {field('Pod Composition',
            <Textarea
              value={d.podComposition}
              onChange={e => setDelivery({ podComposition: e.target.value })}
              placeholder="e.g. Solution Architect (0.5 FTE), GenAI Architect (1 FTE), AI/ML Engineer (2 FTE), QA Engineer (1 FTE)"
              className="min-h-20"
            />
          )}
          <div>
            <Label className="text-sm mb-2 block">Onshore / Offshore / Nearshore %</Label>
            <div className="grid grid-cols-3 gap-3">
              {(['onshorePct', 'offshorePct', 'nearshorePct'] as const).map((key, i) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-slate-500 dark:text-slate-400">{['Onshore', 'Offshore', 'Nearshore'][i]}</Label>
                  <Input type="number" min={0} max={100} value={d[key]} onChange={e => setDelivery({ [key]: parseInt(e.target.value) || 0 })} />
                </div>
              ))}
            </div>
            {pctSum !== 100 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">Total = {pctSum}% — should sum to 100%</p>
            )}
          </div>
          {field('Client-Side Resources Required',
            <Textarea value={d.clientResources} onChange={e => setDelivery({ clientResources: e.target.value })} placeholder="e.g. Named SME reviewer, UAT test cases, EHR API access..." />
          )}
        </div>
      </div>

      {/* Section 3 — Delivery Model */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Delivery Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {field('Engagement Model',
            <Select value={d.engagementModel} onValueChange={v => setDelivery({ engagementModel: v })}>
              <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
              <SelectContent>
                {['Agile Sprints', 'Waterfall', 'Agile-Waterfall Hybrid', 'Kanban / Continuous'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {field('Phase Approach',
            <Select value={d.phaseApproach} onValueChange={v => setDelivery({ phaseApproach: v })}>
              <SelectTrigger><SelectValue placeholder="Select approach" /></SelectTrigger>
              <SelectContent>
                {['Single-Phase MVP', 'Phased Delivery (P0 PoC → P1 MVP → P2 Production)', 'Iterative Releases', 'Big Bang'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {field('PoC / Phase 0 Scope (if applicable)',
            <Textarea value={d.pocScope} onChange={e => setDelivery({ pocScope: e.target.value })} placeholder="Describe the PoC objectives, duration, and success criteria..." className="min-h-20" />
          )}
          {field('Key Milestones / Phase Gates',
            <Textarea value={d.keyMilestones} onChange={e => setDelivery({ keyMilestones: e.target.value })} placeholder="e.g. Week 4: PoC sign-off; Week 12: MVP demo; Week 20: UAT complete..." />
          )}
        </div>
      </div>

      {/* Section 4 — Support Model */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Support & Managed Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {field('Hypercare Period',
            <Select value={d.hypercareWeeks} onValueChange={v => setDelivery({ hypercareWeeks: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['None', '2 weeks', '4 weeks', '6 weeks', '8 weeks', 'Custom'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {field('Support Model',
            <Select value={d.supportModel} onValueChange={v => setDelivery({ supportModel: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['Client-operated (KT only)', 'Managed Service', 'Hybrid (shared ops)', 'None'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {field('Support Tier',
            <Select value={d.supportTier} onValueChange={v => setDelivery({ supportTier: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['L1 only', 'L1 + L2', 'L1 + L2 + L3', 'L3 escalation only'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {field('SLA – Availability', <Input value={d.slaAvailability} onChange={e => setDelivery({ slaAvailability: e.target.value })} placeholder="99.5%" />)}
          {field('SLA – Response Time', <Input value={d.slaResponseTime} onChange={e => setDelivery({ slaResponseTime: e.target.value })} placeholder="4 hours for P1" />)}
          {field('Maintenance Window', <Input value={d.maintenanceWindow} onChange={e => setDelivery({ maintenanceWindow: e.target.value })} placeholder="Sundays 02:00–04:00 UTC" />)}
        </div>
      </div>

      {/* Section 5 — Responsibilities */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Responsibilities (Simplified RACI)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {field('Client Will Provide',
            <Textarea
              value={d.clientResponsibilities}
              onChange={e => setDelivery({ clientResponsibilities: e.target.value })}
              placeholder="e.g. Access to EHR system APIs, named SME reviewer, UAT test cases, HIPAA BAA, environment provisioning..."
              className="min-h-32"
            />
          )}
          {field('Practice Will Deliver',
            <Textarea
              value={d.practiceResponsibilities}
              onChange={e => setDelivery({ practiceResponsibilities: e.target.value })}
              placeholder="e.g. Architecture design, build, test, deployment, documentation, KT sessions, hypercare support..."
              className="min-h-32"
            />
          )}
        </div>
      </div>

      {/* Section 6 — Training & Change Management */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-slate-800 dark:text-slate-100 mb-4">Training & Change Management</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex-1">
              <Label className="mb-0.5 block">Training Plan Required</Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Include a formal training programme in the SOW scope</p>
            </div>
            <Switch checked={d.trainingRequired} onCheckedChange={v => setDelivery({ trainingRequired: v })} />
          </div>
          {d.trainingRequired && field('Training Approach',
            <Select value={d.trainingApproach} onValueChange={v => setDelivery({ trainingApproach: v })}>
              <SelectTrigger><SelectValue placeholder="Select approach" /></SelectTrigger>
              <SelectContent>
                {['Self-service runbook', 'Live training sessions', 'Video walkthroughs', 'Embedded trainer', 'None'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {field('Change Management Considerations',
            <Textarea value={d.changeManagementNotes} onChange={e => setDelivery({ changeManagementNotes: e.target.value })} placeholder="Stakeholder engagement plan, comms strategy, adoption risks..." className="min-h-20" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export function AzureEstimationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, saveWorkspace, setValidationStatus } = useWorkbench();
  const activePhases = state.engagementConfig.activePhases;

  const visibleTabs = TABS.filter(t => {
    const phase = TAB_PHASE_MAP[t.id];
    return !phase || activePhases.includes(phase);
  });

  const rawTab = searchParams.get('tab') || 'overview';
  const activeTab = visibleTabs.find(t => t.id === rawTab) ? rawTab : (visibleTabs[0]?.id ?? 'overview');

  const setTab = (tab: string) => setSearchParams({ tab });

  const handleValidate = () => {
    const errors: string[] = [];
    if (!state.azure.overview.useCaseName) errors.push('Use-case name required');
    if (state.azure.selectedComponents.length === 0) errors.push('At least one Azure component required');
    if (state.azure.wbs.length === 0) errors.push('WBS must have at least one row');
    const invalidWBS = state.azure.wbs.some(r => !r.phase || !r.activity || !r.role || r.effortDays <= 0);
    if (invalidWBS) errors.push('All WBS rows must have Phase, Activity, Role, and Effort Days > 0');

    if (errors.length === 0) {
      setValidationStatus('validated');
      alert('Validation passed! All required fields are complete.');
    } else {
      alert('Validation issues:\n' + errors.map(e => '• ' + e).join('\n'));
    }
  };

  const tabContent: Record<string, JSX.Element> = {
    overview: <OverviewTab />,
    components: <ComponentsTab />,
    agents: <AgentsTab />,
    wbs: <WBSTab />,
    resources: <ResourcesTab />,
    infra: <InfraTokensTab />,
    assumptions: <AssumptionsTab />,
    risks: <RisksTab />,
    roi: <RoiTab />,
    delivery: <DeliveryTab />,
  };

  const currentTab = visibleTabs.find(tab => tab.id === activeTab) || visibleTabs[0];

  return (
    <div className="flex flex-col min-h-full">
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-slate-900 dark:text-slate-100">Azure Agentic AI Estimation</h1>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Sample</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Prior Authorization / Claims Review — Azure Cloud, Agentic Workflow + RAG + HITL + Q&T</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleValidate} className="gap-1.5">
            <CheckCircle className="size-3.5" /> Validate
          </Button>
          <Button size="sm" onClick={saveWorkspace} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
            <Save className="size-3.5" /> Save
          </Button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max border-b border-slate-200 dark:border-slate-700">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${active
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-slate-900 dark:text-slate-100">{currentTab.label}</h2>
          <SectionExportMenu tabId={currentTab.id} />
        </div>
        {tabContent[activeTab] || <OverviewTab />}
      </div>
    </div>
    <WorkflowNav warnOnBack />
    </div>
  );
}
