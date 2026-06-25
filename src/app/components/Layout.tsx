import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import {
  Home, FileText, Layers, BarChart2, Grid, Cloud, Table,
  Users, Server, Shield, AlertTriangle, Download, BookOpen,
  Moon, Sun, Search, CheckCircle, AlertCircle, ChevronRight,
  Save, FolderOpen, RotateCcw, LogOut, Menu, X, Zap
} from 'lucide-react';
import { useWorkbench } from './WorkbenchContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getActiveSteps, getStepForPath } from '../workflow';

const ALL_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, exact: true, phase: null },
  { path: '/intake', label: 'Project Intake', icon: FileText, phase: null },
  { path: '/classify', label: 'Solution Identification', icon: Layers, phase: 'solution-id' },
  { path: '/estimation', label: 'Estimation & Delivery', icon: Cloud, phase: 'any-estimation' },
  { path: '/export', label: 'Export Center', icon: Download, phase: null },
  { path: '/templates', label: 'Template Library', icon: BookOpen, phase: null },
] as const;

const BREADCRUMB_NAMES: Record<string, string> = {
  '/': 'Home',
  '/intake': 'Project Intake',
  '/classify': 'Solution Identification',
  '/complexity': 'Complexity Scoring',
  '/patterns': 'Solution Pattern Builder',
  '/estimation': 'Estimation & Delivery',
  '/export': 'Export Center',
  '/templates': 'Template Library',
  '/print-export': 'Print Export',
};

const searchTemplates = [
  { title: 'Agentic AI Prior Auth Estimate', text: 'Generated sample estimation for an agentic AI prior authorization workflow, including WBS, resources, infra, ROI, assumptions, and risks.', path: '/estimation' },
  { title: 'Advanced RAG WBS', text: 'Pre-built WBS for Advanced and Hybrid RAG implementations including document ingestion and retrieval optimization.', path: '/templates' },
  { title: 'Generic Assumptions & Dependencies', text: 'Reusable assumptions and dependencies register for GenAI projects.', path: '/templates' },
  { title: 'Azure Cloud Component Checklist', text: 'Azure-specific component checklist covering AI services, storage, identity, and monitoring.', path: '/templates' },
];

const searchComponents = [
  { title: 'Azure OpenAI / AI Foundry', text: 'LLM inference, embeddings, chat completions', path: '/estimation?tab=components' },
  { title: 'Azure AI Search', text: 'Vector + keyword hybrid search, RAG retrieval', path: '/estimation?tab=components' },
  { title: 'Azure Document Intelligence', text: 'OCR, form extraction, layout analysis', path: '/estimation?tab=components' },
  { title: 'Azure Functions', text: 'Serverless agent orchestration and event triggers', path: '/estimation?tab=components' },
  { title: 'Azure Cosmos DB', text: 'Audit log, workflow state, agent memory', path: '/estimation?tab=components' },
];

function highlight(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

export function Layout() {
  const { state, setDarkMode, saveWorkspace, loadWorkspace, resetWorkspace } = useWorkbench();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const activePhases = state.engagementConfig.activePhases;
  const ESTIMATION_PHASES = ['hld', 'estimation', 'delivery', 'roi', 'risk-register'];

  const navItems = ALL_NAV_ITEMS.filter(item => {
    if (!item.phase) return true;
    if (item.phase === 'solution-id') return activePhases.includes('solution-id');
    if (item.phase === 'any-estimation') return ESTIMATION_PHASES.some(p => activePhases.includes(p));
    return true;
  });

  const activeSteps = getActiveSteps(activePhases);

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    if (path === '/estimation') return location.pathname.startsWith('/estimation');
    return location.pathname === path;
  };

  const validationIcon = {
    draft: <AlertCircle className="size-4 text-amber-500" />,
    validated: <CheckCircle className="size-4 text-emerald-500" />,
    'ready-to-export': <CheckCircle className="size-4 text-blue-500" />,
  }[state.validationStatus];

  const validationLabel = {
    draft: 'Draft',
    validated: 'Validated',
    'ready-to-export': 'Ready to Export',
  }[state.validationStatus];

  const currentStep = getStepForPath(location.pathname, location.search);

  const handleReset = () => {
    if (window.confirm('Reset workspace? All unsaved changes will be lost.')) {
      resetWorkspace();
    }
  };

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 200);
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const groupedResults = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return [] as Array<{ category: string; items: Array<{ title: string; text: string; path: string }> }>;
    const match = (item: { title: string; text: string }) => `${item.title} ${item.text}`.toLowerCase().includes(q);
    const groups = [
      { category: 'Templates', items: searchTemplates.filter(match) },
      { category: 'WBS', items: state.azure.wbs.map(r => ({ title: r.activity, text: r.deliverable || r.acceptanceCriteria, path: '/estimation?tab=wbs' })).filter(match) },
      { category: 'Assumptions', items: state.azure.assumptions.map(r => ({ title: r.category, text: r.description, path: '/estimation?tab=assumptions' })).filter(match) },
      { category: 'Risks', items: state.azure.risks.map(r => ({ title: r.riskId, text: r.description, path: '/estimation?tab=risks' })).filter(match) },
      { category: 'Components', items: searchComponents.filter(match) },
      {
        category: 'Intake',
        items: [
          { title: 'Engagement Type', text: state.intake.engagementType, path: '/intake' },
          { title: 'Commercial Model', text: state.intake.commercialModel, path: '/intake' },
          { title: 'Budget Indicator', text: state.intake.budgetIndicator, path: '/intake' },
          { title: 'Compliance Frameworks', text: state.intake.complianceFlags.join(' '), path: '/intake' },
          { title: 'EHR System', text: state.intake.ehrSystem, path: '/intake' },
          { title: 'Integration Standard', text: state.intake.fhirVersion, path: '/intake' },
          { title: 'FDA Regulatory Pathway', text: state.intake.fdaPathway, path: '/intake' },
          { title: 'Clinical Validation Required', text: state.intake.clinicalValidationRequired ? 'Clinical validation required' : 'Clinical validation not required', path: '/intake' },
          { title: 'Win Theme / Executive Summary', text: state.azure.overview.executiveSummary, path: '/estimation?tab=overview' },
        ].filter(match),
      },
      {
        category: 'Delivery',
        items: [
          { title: 'Pod Composition', text: state.azure.delivery.podComposition, path: '/estimation?tab=delivery' },
          { title: 'Delivery Mix', text: `${state.azure.delivery.onshorePct}% onshore ${state.azure.delivery.offshorePct}% offshore ${state.azure.delivery.nearshorePct}% nearshore`, path: '/estimation?tab=delivery' },
          { title: 'Client Resources', text: state.azure.delivery.clientResources, path: '/estimation?tab=delivery' },
          { title: 'Engagement Model', text: state.azure.delivery.engagementModel, path: '/estimation?tab=delivery' },
          { title: 'Phase Approach', text: state.azure.delivery.phaseApproach, path: '/estimation?tab=delivery' },
          { title: 'PoC / Phase 0 Scope', text: state.azure.delivery.pocScope, path: '/estimation?tab=delivery' },
          { title: 'Key Milestones', text: state.azure.delivery.keyMilestones, path: '/estimation?tab=delivery' },
          { title: 'Hypercare Period', text: state.azure.delivery.hypercareWeeks, path: '/estimation?tab=delivery' },
          { title: 'Support Model', text: state.azure.delivery.supportModel, path: '/estimation?tab=delivery' },
          { title: 'Support Tier', text: state.azure.delivery.supportTier, path: '/estimation?tab=delivery' },
          { title: 'SLA Availability', text: state.azure.delivery.slaAvailability, path: '/estimation?tab=delivery' },
          { title: 'SLA Response Time', text: state.azure.delivery.slaResponseTime, path: '/estimation?tab=delivery' },
          { title: 'Maintenance Window', text: state.azure.delivery.maintenanceWindow, path: '/estimation?tab=delivery' },
          { title: 'Training Required', text: state.azure.delivery.trainingRequired ? 'Training required' : 'Training not required', path: '/estimation?tab=delivery' },
          { title: 'Training Approach', text: state.azure.delivery.trainingApproach, path: '/estimation?tab=delivery' },
          { title: 'Client Responsibilities', text: state.azure.delivery.clientResponsibilities, path: '/estimation?tab=delivery' },
          { title: 'Practice Responsibilities', text: state.azure.delivery.practiceResponsibilities, path: '/estimation?tab=delivery' },
          { title: 'Change Management Notes', text: state.azure.delivery.changeManagementNotes, path: '/estimation?tab=delivery' },
        ].filter(match),
      },
      { category: 'Archetypes', items: state.classification.patterns.map(pattern => ({ title: pattern.name, text: `${pattern.whenToUse} ${pattern.capabilities.join(' ')} ${pattern.triggers.join(' ')}`, path: '/classify' })).filter(match) },
    ];
    return groups.filter(group => group.items.length > 0);
  }, [debouncedSearch, state.azure.assumptions, state.azure.delivery, state.azure.overview.executiveSummary, state.azure.risks, state.azure.wbs, state.classification.patterns, state.intake.budgetIndicator, state.intake.clinicalValidationRequired, state.intake.commercialModel, state.intake.complianceFlags, state.intake.ehrSystem, state.intake.engagementType, state.intake.fdaPathway, state.intake.fhirVersion]);

  const selectResult = (path: string) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 bg-slate-900 dark:bg-slate-950 border-r border-slate-700 flex flex-col transition-all duration-200 z-20`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b border-slate-700 ${!sidebarOpen && 'justify-center'}`}>
          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="size-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white text-sm font-semibold leading-none">GenForge</div>
              <div className="text-slate-400 text-xs mt-0.5">AI Estimation Workbench</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, 'exact' in item ? item.exact : undefined);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors
                  ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
              >
                <Icon className="flex-shrink-0 size-4" />
                {sidebarOpen && (
                  <span className="flex-1 truncate text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer actions */}
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-700 space-y-1">
            <button onClick={saveWorkspace} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Save className="size-3.5" /><span>Save Workspace</span>
            </button>
            <button onClick={loadWorkspace} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <FolderOpen className="size-3.5" /><span>Load Workspace</span>
            </button>
            <button onClick={handleReset} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
              <RotateCcw className="size-3.5" /><span>Reset Workspace</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3 px-4 h-14 flex-shrink-0 z-10">
          <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <span className="text-slate-800 dark:text-slate-100 font-medium">GenForge</span>
            <ChevronRight className="size-3.5" />
            <span>{BREADCRUMB_NAMES[location.pathname] || 'Overview'}</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search workspace..."
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onKeyDown={e => {
                if (e.key === 'Escape') setSearchOpen(false);
              }}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
            {searchOpen && debouncedSearch && (
              <div className="absolute right-0 top-full mt-2 w-[34rem] max-h-[360px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-2">
                {groupedResults.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">No matching results found.</div>
                ) : groupedResults.map(group => (
                  <div key={group.category} className="py-1">
                    <div className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wide">{group.category}</div>
                    {group.items.map((item, index) => (
                      <button
                        key={`${group.category}-${item.title}-${index}`}
                        onClick={() => selectResult(item.path)}
                        className="w-full text-left px-2 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{group.category}</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{highlight(item.title, debouncedSearch)}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{highlight(item.text, debouncedSearch)}</div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Validation status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            {validationIcon}
            <span className="text-xs text-slate-600 dark:text-slate-300">{validationLabel}</span>
          </div>

          {/* Unsaved indicator */}
          {state.azure.unsavedChanges && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs text-amber-700 dark:text-amber-400">Unsaved</span>
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!state.darkMode)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title={state.darkMode ? 'Light mode' : 'Dark mode'}
          >
            {state.darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </header>

        {/* Workspace banner */}
        {!bannerDismissed && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-700 px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 flex-1">
              <strong>Temporary workspace only.</strong> Export your estimation package before closing or clearing browser data.
            </p>
            <div className="flex items-center gap-2">
              <button onClick={saveWorkspace} className="text-xs text-amber-700 dark:text-amber-400 underline hover:no-underline">Save now</button>
              <button onClick={() => navigate('/export')} className="text-xs text-amber-700 dark:text-amber-400 underline hover:no-underline">Export</button>
              <button onClick={() => setBannerDismissed(true)} className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300">
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Workflow progress bar */}
        {currentStep && (
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center gap-1 flex-shrink-0 overflow-x-auto">
            {activeSteps.map((step, i) => {
              const isCurrent = step.n === currentStep.n;
              const isCompleted = step.n < currentStep.n;
              return (
                <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => navigate(step.navPath)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                      ${isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                  >
                    {isCompleted
                      ? <CheckCircle className="size-3 shrink-0" />
                      : <span className={`size-4 rounded-full flex items-center justify-center text-[10px] font-bold leading-none
                          ${isCurrent ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>{step.n}</span>
                    }
                    {step.name}
                  </button>
                  {i < activeSteps.length - 1 && (
                    <ChevronRight className="size-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
