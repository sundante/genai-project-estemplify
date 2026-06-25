import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, CheckCircle, Clock, FileText, ExternalLink, SortAsc, X, Star } from 'lucide-react';

const templates = [
  {
    id: 'azure-agentic-ai',
    name: 'Azure Agentic AI Estimation',
    type: 'Estimation',
    pattern: 'Agentic Workflow',
    cloud: 'Azure',
    status: 'Available',
    description: 'Complete estimation template for agentic AI workflows including WBS, resource loading, infra and token estimation, and risk register.',
    sections: ['WBS (20 activities)', 'Resource Loading (12 roles)', 'Infra & Token Estimate', 'Assumptions (9)', 'Dependencies (9)', 'Risks (8)'],
    lastEdited: '2026-06-25',
    path: '/estimation',
    isFeatured: true,
  },
  {
    id: 'ai-estimation-generic',
    name: 'AI Estimation Template (Generic)',
    type: 'Estimation',
    pattern: 'Chatbot',
    cloud: 'Cloud Agnostic',
    status: 'Planned',
    description: 'Cloud-agnostic estimation template for general GenAI projects covering discovery through deployment.',
    sections: ['WBS (15+ activities)', 'Resource Loading', 'Risk Register'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'advanced-rag-wbs',
    name: 'Advanced RAG WBS',
    type: 'WBS',
    pattern: 'Advanced RAG',
    cloud: 'Cloud Agnostic',
    status: 'Planned',
    description: 'Pre-built WBS for Advanced and Hybrid RAG implementations including document ingestion, retrieval optimization, and RAGAS evaluation.',
    sections: ['25+ WBS activities', 'Discovery → Deploy phases'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'agentic-orchestration',
    name: 'Agentic Orchestration Template',
    type: 'Estimation',
    pattern: 'Agentic Workflow',
    cloud: 'Cloud Agnostic',
    status: 'Planned',
    description: 'Multi-agent orchestration estimation covering agent design, tool integration, HITL workflow, and Q&T evaluation framework.',
    sections: ['Agent Design', 'Tool Catalog', 'HITL Workflow', 'Q&T Framework'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'generic-assumptions',
    name: 'Generic Assumptions & Dependencies',
    type: 'Assumptions',
    pattern: 'Agentic Workflow',
    cloud: 'Cloud Agnostic',
    status: 'Planned',
    description: 'Reusable assumptions and dependencies register for GenAI projects across data, compliance, SME, ground truth, and production readiness.',
    sections: ['9 assumption categories', '9 dependency categories'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'cloud-components-azure',
    name: 'Azure Cloud Component Checklist',
    type: 'Cloud Components',
    pattern: 'Agentic Workflow',
    cloud: 'Azure',
    status: 'Planned',
    description: 'Azure-specific component checklist covering AI/ML services, storage, networking, identity, and monitoring. Includes purpose and cost driver for each.',
    sections: ['16 Azure components', 'Required vs Optional', 'Cost drivers'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'cloud-components-aws',
    name: 'AWS Cloud Component Checklist',
    type: 'Cloud Components',
    pattern: 'Agentic Workflow',
    cloud: 'AWS',
    status: 'Planned',
    description: 'AWS-specific component checklist covering Bedrock, SageMaker, OpenSearch, Lambda, and related services.',
    sections: ['AWS components', 'Required vs Optional', 'Cost drivers'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'cloud-components-gcp',
    name: 'GCP Cloud Component Checklist',
    type: 'Cloud Components',
    pattern: 'Agentic Workflow',
    cloud: 'GCP',
    status: 'Planned',
    description: 'GCP-specific component checklist covering Vertex AI, Gemini, BigQuery, Cloud Run, and related services.',
    sections: ['GCP components', 'Required vs Optional', 'Cost drivers'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'infra-token-azure',
    name: 'Azure Infra + Token Cost Model',
    type: 'Infra Cost',
    pattern: 'Agentic Workflow',
    cloud: 'Azure',
    status: 'Planned',
    description: 'Infrastructure and token cost estimation model for Azure OpenAI workloads with configurable usage inputs and per-environment cost breakdown.',
    sections: ['Usage inputs', 'Monthly estimates', 'Per-environment cost'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'doc-intelligence-wbs',
    name: 'Document Intelligence WBS',
    type: 'WBS',
    pattern: 'Document Intelligence',
    cloud: 'Azure',
    status: 'Draft',
    description: 'WBS for Azure Document Intelligence implementation covering form extraction, classification, and structured output pipeline.',
    sections: ['12 WBS activities', 'OCR + Extraction pipeline'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'nl2sql-estimation',
    name: 'NL2SQL / Talk-to-Data Estimation',
    type: 'Estimation',
    pattern: 'NL2SQL',
    cloud: 'Cloud Agnostic',
    status: 'Draft',
    description: 'Estimation template for natural language to SQL implementations covering schema understanding, prompt engineering, and query validation.',
    sections: ['WBS', 'Resource Loading', 'Risk Register'],
    lastEdited: null,
    path: null,
  },
  {
    id: 'qa-trust-layer',
    name: 'Quality & Trust Layer Estimation',
    type: 'Estimation',
    pattern: 'Q&T',
    cloud: 'Cloud Agnostic',
    status: 'Draft',
    description: 'Estimation template for adding a quality and trust layer to existing GenAI solutions covering evaluation, hallucination detection, and compliance logging.',
    sections: ['Evaluation framework setup', 'RAGAS metrics', 'Audit logging'],
    lastEdited: null,
    path: null,
  },
];

const templateTypes = ['All', 'Estimation', 'WBS', 'Assumptions', 'Cloud Components', 'Infra Cost', 'Token Cost', 'Proposal', 'SOW'];
const solutionPatterns = ['All', 'Chatbot', 'Basic RAG', 'Advanced RAG', 'Agentic Workflow', 'NL2SQL', 'Document Intelligence', 'Voice Agent', 'Q&T'];
const clouds = ['All', 'Cloud Agnostic', 'Azure', 'AWS', 'GCP'];
const statuses = ['All', 'Available', 'Planned', 'Draft', 'Master', 'Working Copy'];
const sortOptions = ['Name A-Z', 'Recently Edited', 'Template Type', 'Status', 'Solution Pattern'];

const statusConfig: Record<string, { label: string; color: string }> = {
  Available: { label: 'Available', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  Planned: { label: 'Planned', color: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400' },
  Draft: { label: 'Draft', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  Master: { label: 'Master', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  'Working Copy': { label: 'Working Copy', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
};

export function TemplateLibraryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState('All');
  const [patternFilter, setPatternFilter] = useState('All');
  const [cloudFilter, setCloudFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  let filtered = templates.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase()) || t.pattern.toLowerCase().includes(search.toLowerCase()) || t.cloud.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || t.type === typeFilter;
    const matchPattern = patternFilter === 'All' || t.pattern === patternFilter;
    const matchCloud = cloudFilter === 'All' || t.cloud === cloudFilter;
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchType && matchPattern && matchCloud && matchStatus;
  });

  if (sortBy === 'Name A-Z') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'Template Type') filtered.sort((a, b) => a.type.localeCompare(b.type));
  else if (sortBy === 'Status') filtered.sort((a, b) => a.status.localeCompare(b.status));
  else if (sortBy === 'Solution Pattern') filtered.sort((a, b) => a.pattern.localeCompare(b.pattern));
  else if (sortBy === 'Recently Edited') filtered.sort((a, b) => (b.lastEdited || '').localeCompare(a.lastEdited || ''));

  const activeFilterCount = [typeFilter, patternFilter, cloudFilter, statusFilter].filter(v => v !== 'All').length;

  const clearFilters = () => { setTypeFilter('All'); setPatternFilter('All'); setCloudFilter('All'); setStatusFilter('All'); setSearch(''); };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-slate-900 dark:text-slate-100">Template Library</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse and launch estimation templates. One template is available now — more coming soon.</p>
      </div>

      {/* Search + controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by name, type, cloud, pattern..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(v => !v)}
          className={`gap-2 ${activeFilterCount > 0 ? 'border-blue-400 text-blue-600 dark:text-blue-400' : ''}`}
        >
          <Filter className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <SortAsc className="size-4 text-slate-400" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear all</button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 dark:text-slate-400">Template Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{templateTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 dark:text-slate-400">Solution Pattern</label>
              <Select value={patternFilter} onValueChange={setPatternFilter}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{solutionPatterns.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 dark:text-slate-400">Cloud</label>
              <Select value={cloudFilter} onValueChange={setCloudFilter}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{clouds.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 dark:text-slate-400">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <FileText className="size-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No templates match your search.</p>
          <button onClick={clearFilters} className="text-sm text-blue-600 dark:text-blue-400 mt-2 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => {
            const sc = statusConfig[t.status] || statusConfig['Planned'];
            return (
              <div
                key={t.id}
                className={`bg-white dark:bg-slate-800 rounded-xl border-2 p-5 transition-all
                  ${t.status === 'Available'
                    ? 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md'
                    : 'border-slate-200 dark:border-slate-700'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {t.isFeatured && <Star className="size-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      <h3 className="text-slate-800 dark:text-slate-100 leading-tight">{t.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${sc.color}`}>
                        {t.status === 'Available' ? <CheckCircle className="size-2.5" /> : <Clock className="size-2.5" />}
                        {sc.label}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{t.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{t.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{t.cloud}</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{t.pattern}</span>
                </div>

                {t.sections.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 mb-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Includes</div>
                    <div className="space-y-0.5">
                      {t.sections.slice(0, 3).map(s => (
                        <div key={s} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="size-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                          {s}
                        </div>
                      ))}
                      {t.sections.length > 3 && <div className="text-xs text-slate-400">+{t.sections.length - 3} more</div>}
                    </div>
                  </div>
                )}

                {t.lastEdited && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Last edited: {t.lastEdited}</p>
                )}

                <Button
                  onClick={() => t.path ? navigate(t.path) : alert('This template is planned for a future iteration. The Azure Agentic AI Estimation template is currently available.')}
                  variant={t.status === 'Available' ? 'default' : 'outline'}
                  className={`w-full gap-2 ${t.status === 'Available' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                >
                  {t.status === 'Available' ? (
                    <><ExternalLink className="size-3.5" /> Open Template</>
                  ) : (
                    <><Clock className="size-3.5" /> Coming Soon</>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
