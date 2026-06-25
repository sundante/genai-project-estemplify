import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkbench, type ClassificationPattern } from './WorkbenchContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from './ui/sheet';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Columns3,
  Edit2,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Zap,
} from 'lucide-react';
import { WorkflowNav } from './WorkflowNav';

const complexityOptions = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High', 'Very High'];
const statusOptions = ['available', 'planned', 'custom'];
const sourceOptions = ['default', 'custom'];

const optionalColumns = [
  { id: 'capabilities', label: 'Capability Summary' },
  { id: 'source', label: 'Source' },
  { id: 'triggers', label: 'Triggers' },
  { id: 'architecture', label: 'Architecture Implications' },
  { id: 'estimation', label: 'Estimation Implications' },
  { id: 'delivery', label: 'Delivery Notes' },
  { id: 'export', label: 'Include in Export' },
] as const;

type OptionalColumn = typeof optionalColumns[number]['id'];

const complexityRank: Record<string, number> = {
  Low: 1,
  'Low-Medium': 2,
  Medium: 3,
  'Medium-High': 4,
  High: 5,
  'Very High': 6,
};

const complexityColor: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Low-Medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Medium-High': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Very High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function listToText(values: string[]) {
  return values.join(', ');
}

function textToList(value: string) {
  return value
    .split(/,|\n/)
    .map(item => item.trim())
    .filter(Boolean);
}

function blankPattern(): ClassificationPattern {
  return {
    id: `custom-classification-${Date.now()}`,
    name: '',
    patternType: '',
    whenToUse: '',
    capabilities: [],
    complexity: 'Medium',
    timeline: '',
    triggers: [],
    architectureImplications: '',
    estimationImplications: '',
    deliveryNotes: '',
    source: 'custom',
    status: 'custom',
    includeInExport: true,
  };
}

function recommendPattern(patterns: ClassificationPattern[], intake: { businessProblem: string; dataTypes: string[]; sourceSystems: string[]; opportunityStage: string }) {
  const haystack = [
    intake.businessProblem,
    intake.dataTypes.join(' '),
    intake.sourceSystems.join(' '),
    intake.opportunityStage,
  ].join(' ').toLowerCase();

  let best = '';
  let bestScore = 0;
  patterns.forEach(pattern => {
    const terms = [...pattern.triggers, pattern.name, pattern.whenToUse, ...pattern.capabilities].map(v => v.toLowerCase());
    const score = terms.reduce((sum, term) => sum + (term && haystack.includes(term) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = pattern.id;
    }
  });

  return best;
}

function patternName(patterns: ClassificationPattern[], id: string) {
  return patterns.find(pattern => pattern.id === id)?.name || id;
}

export function SolutionClassificationPage() {
  const {
    state,
    setClassification,
    addClassificationPattern,
    updateClassificationPattern,
    deleteClassificationPattern,
    resetClassificationPatterns,
  } = useWorkbench();
  const navigate = useNavigate();
  const patterns = state.classification.patterns;
  const selected = state.classification.selectedPattern;
  const recommended = recommendPattern(patterns, state.intake);

  const [search, setSearch] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [focusFilter, setFocusFilter] = useState('All');
  const [sort, setSort] = useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'name', dir: 'asc' });
  const [expanded, setExpanded] = useState<string | null>(recommended || null);
  const [visibleOptionalColumns, setVisibleOptionalColumns] = useState<OptionalColumn[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<ClassificationPattern | null>(null);
  const [form, setForm] = useState<ClassificationPattern>(blankPattern());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = patterns.filter(pattern => {
      const text = [pattern.name, pattern.patternType, pattern.whenToUse, pattern.timeline, pattern.complexity, pattern.capabilities.join(' '), pattern.triggers.join(' ')].join(' ').toLowerCase();
      const matchesSearch = !q || text.includes(q);
      const matchesComplexity = complexityFilter === 'All' || pattern.complexity === complexityFilter;
      const matchesStatus = statusFilter === 'All' || pattern.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || pattern.source === sourceFilter;
      const matchesFocus =
        focusFilter === 'All' ||
        (focusFilter === 'Recommended' && pattern.id === recommended) ||
        (focusFilter === 'Selected' && pattern.id === selected);
      return matchesSearch && matchesComplexity && matchesStatus && matchesSource && matchesFocus;
    });

    return [...rows].sort((a, b) => {
      let cmp = 0;
      if (sort.col === 'complexity') cmp = (complexityRank[a.complexity] || 0) - (complexityRank[b.complexity] || 0);
      else if (sort.col === 'timeline') cmp = a.timeline.localeCompare(b.timeline);
      else if (sort.col === 'patternType') cmp = (a.patternType || '').localeCompare(b.patternType || '');
      else if (sort.col === 'status') cmp = a.status.localeCompare(b.status);
      else if (sort.col === 'source') cmp = a.source.localeCompare(b.source);
      else if (sort.col === 'includeInExport') cmp = Number(a.includeInExport) - Number(b.includeInExport);
      else cmp = a.name.localeCompare(b.name);
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [complexityFilter, focusFilter, patterns, recommended, search, selected, sort, sourceFilter, statusFilter]);

  const openAdd = () => {
    setEditingPattern(null);
    setForm(blankPattern());
    setErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (pattern: ClassificationPattern) => {
    setEditingPattern(pattern);
    setForm({ ...pattern, capabilities: [...pattern.capabilities], triggers: [...pattern.triggers] });
    setErrors({});
    setDrawerOpen(true);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.whenToUse.trim()) next.whenToUse = 'Best-fit guidance is required';
    if (!form.complexity) next.complexity = 'Complexity is required';
    if (!form.timeline.trim()) next.timeline = 'Timeline is required';
    if (form.capabilities.length === 0) next.capabilities = 'Add at least one capability';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const savePattern = () => {
    if (!validate()) return;
    if (editingPattern) updateClassificationPattern(editingPattern.id, form);
    else addClassificationPattern({ ...form, id: `custom-classification-${Date.now()}`, source: 'custom', status: 'custom' });
    setDrawerOpen(false);
  };

  const deletePattern = (pattern: ClassificationPattern) => {
    if (pattern.source !== 'custom') return;
    if (window.confirm(`Delete custom classification "${pattern.name}"?`)) {
      deleteClassificationPattern(pattern.id);
      if (expanded === pattern.id) setExpanded(null);
    }
  };

  const toggleOptionalColumn = (column: OptionalColumn) => {
    setVisibleOptionalColumns(current =>
      current.includes(column) ? current.filter(item => item !== column) : [...current, column]
    );
  };

  const showColumn = (column: OptionalColumn) => visibleOptionalColumns.includes(column);
  const columnCount = 8 + visibleOptionalColumns.length;

  const toggleSort = (col: string) => {
    setSort(prev => prev.col === col ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' });
  };

  const sortTh = (col: string, label: string, stickyClass = '') => (
    <th
      onClick={() => toggleSort(col)}
      className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide whitespace-nowrap cursor-pointer select-none group
        ${sort.col === col ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
        ${stickyClass}`}
    >
      <span className="flex items-center gap-1">
        {label}
        {sort.col === col
          ? sort.dir === 'asc' ? <ArrowUp className="size-3 shrink-0" /> : <ArrowDown className="size-3 shrink-0" />
          : <ArrowUpDown className="size-3 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />
        }
      </span>
    </th>
  );

  return (
    <div className="flex flex-col min-h-full">
    <div className="flex-1 px-5 py-4 space-y-4 w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-slate-900 dark:text-slate-100">Solution Classification</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select, edit, or add solution archetypes in a compact classification catalogue.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={resetClassificationPatterns} className="gap-2">
            <RotateCcw className="size-4" />
            Reset Catalogue
          </Button>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="size-4" />
            Add Classification
          </Button>
        </div>
      </div>

      {recommended && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-y border-blue-200 dark:border-blue-800 px-4 py-3 flex items-center gap-3 -mx-5">
          <Zap className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            Recommended: <strong>{patternName(patterns, recommended)}</strong>
            <span className="text-blue-600 dark:text-blue-400"> based on intake text, data types, source systems, and triggers.</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_repeat(5,minmax(140px,1fr))] gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search classifications..." className="pl-9" />
          </div>
          <Select value={complexityFilter} onValueChange={setComplexityFilter}>
            <SelectTrigger><SelectValue placeholder="Complexity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All complexity</SelectItem>
              {complexityOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All status</SelectItem>
              {statusOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All source</SelectItem>
              {sourceOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={focusFilter} onValueChange={setFocusFilter}>
            <SelectTrigger><SelectValue placeholder="Focus" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All rows</SelectItem>
              <SelectItem value="Recommended">Recommended</SelectItem>
              <SelectItem value="Selected">Selected</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between gap-2">
                <span className="flex items-center gap-2"><Columns3 className="size-4" /> Columns</span>
                <span className="text-xs text-slate-400">{visibleOptionalColumns.length}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Priority columns are always visible</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {optionalColumns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={showColumn(column.id)}
                  onCheckedChange={() => toggleOptionalColumn(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="border-y border-slate-200 dark:border-slate-700 -mx-5 bg-white dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className={`${visibleOptionalColumns.length ? 'min-w-[1500px]' : 'min-w-[1080px]'} w-full table-fixed text-sm`}>
              <colgroup>
                <col className="w-16" />
                <col className="w-64" />
                <col className="w-32" />
                <col className="w-32" />
                <col className="w-48" />
                <col className="w-40" />
                <col />
                {showColumn('capabilities') && <col className="w-80" />}
                {showColumn('source') && <col className="w-28" />}
                {showColumn('triggers') && <col className="w-72" />}
                {showColumn('architecture') && <col className="w-96" />}
                {showColumn('estimation') && <col className="w-96" />}
                {showColumn('delivery') && <col className="w-80" />}
                {showColumn('export') && <col className="w-32" />}
                <col className="w-44" />
              </colgroup>
              <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Select</th>
                  {sortTh('name', 'Name')}
                  {sortTh('complexity', 'Complexity')}
                  {sortTh('timeline', 'Timeline')}
                  {sortTh('patternType', 'Pattern Type')}
                  {sortTh('status', 'Status')}
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">When to Use</th>
                  {showColumn('capabilities') && <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Capability Summary</th>}
                  {showColumn('source') && sortTh('source', 'Source')}
                  {showColumn('triggers') && <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Triggers</th>}
                  {showColumn('architecture') && <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Architecture</th>}
                  {showColumn('estimation') && <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Estimation</th>}
                  {showColumn('delivery') && <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">Delivery Notes</th>}
                  {showColumn('export') && sortTh('includeInExport', 'Export')}
                  <th className="sticky right-0 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.6)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(pattern => {
                  const isSelected = selected === pattern.id;
                  const isRecommended = recommended === pattern.id;
                  const isExpanded = expanded === pattern.id;
                  return (
                    <Fragment key={pattern.id}>
                      <tr className={`${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-slate-800'} hover:bg-slate-50 dark:hover:bg-slate-900/60`}>
                        <td className="px-4 py-3">
                          <button onClick={() => setClassification(isSelected ? '' : pattern.id)} className={`size-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                            {isSelected && <CheckCircle className="size-3.5" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setExpanded(isExpanded ? null : pattern.id)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </button>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">{pattern.name}</div>
                              <div className="flex items-center gap-1 mt-1">
                                {isRecommended && <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Recommended</Badge>}
                                {isSelected && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Selected</Badge>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${complexityColor[pattern.complexity] || 'bg-slate-100 text-slate-600'}`}>{pattern.complexity}</span></td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">{pattern.timeline}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">{pattern.patternType || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Badge variant="secondary">{pattern.status}</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><div className="line-clamp-2">{pattern.whenToUse}</div></td>
                        {showColumn('capabilities') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><div className="line-clamp-2">{pattern.capabilities.join(', ')}</div></td>}
                        {showColumn('source') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{pattern.source}</td>}
                        {showColumn('triggers') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><div className="line-clamp-2">{pattern.triggers.join(', ') || '-'}</div></td>}
                        {showColumn('architecture') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><div className="line-clamp-2">{pattern.architectureImplications || '-'}</div></td>}
                        {showColumn('estimation') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><div className="line-clamp-2">{pattern.estimationImplications || '-'}</div></td>}
                        {showColumn('delivery') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><div className="line-clamp-2">{pattern.deliveryNotes || '-'}</div></td>}
                        {showColumn('export') && <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{pattern.includeInExport ? 'Yes' : 'No'}</td>}
                        <td className="sticky right-0 bg-inherit px-4 py-3 whitespace-nowrap shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.6)]">
                          <Button size="sm" variant="outline" onClick={() => openEdit(pattern)} className="gap-1.5 mr-2"><Edit2 className="size-3.5" /> Edit</Button>
                          <Button size="sm" variant="outline" disabled={pattern.source !== 'custom'} onClick={() => deletePattern(pattern)} className="gap-1.5 text-red-600 hover:text-red-700"><Trash2 className="size-3.5" /> Delete</Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50 dark:bg-slate-900/70">
                          <td colSpan={columnCount} className="px-6 py-5">
                            {/* Metadata chips */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-xs">
                              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">Pattern Type: <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-medium">{pattern.patternType || '—'}</span></span>
                              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">Complexity: <span className={`px-2 py-0.5 rounded-full font-medium ${complexityColor[pattern.complexity] || 'bg-slate-100 text-slate-600'}`}>{pattern.complexity}</span></span>
                              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">Timeline: <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-medium">{pattern.timeline}</span></span>
                              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">Status: <Badge variant="secondary">{pattern.status}</Badge></span>
                              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">Source: <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-medium">{pattern.source}</span></span>
                              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">Export: <span className={`px-2 py-0.5 rounded-full font-medium ${pattern.includeInExport ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>{pattern.includeInExport ? 'Included' : 'Excluded'}</span></span>
                            </div>
                            {/* When to Use + Delivery Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-4 text-sm">
                              <div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">When to Use</div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pattern.whenToUse}</p>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Delivery Notes</div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pattern.deliveryNotes || '—'}</p>
                              </div>
                            </div>
                            {/* Architecture + Estimation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-4 text-sm">
                              <div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Architecture Implications</div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pattern.architectureImplications || '—'}</p>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Estimation Implications</div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pattern.estimationImplications || '—'}</p>
                              </div>
                            </div>
                            {/* Capabilities + Triggers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                              <div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Capabilities</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {pattern.capabilities.map(cap => (
                                    <span key={cap} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{cap}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Recommendation Keywords</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {pattern.triggers.map(trigger => (
                                    <span key={trigger} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">{trigger}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={columnCount} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No matching classifications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingPattern ? 'Edit Classification' : 'Add Classification'}</SheetTitle>
          </SheetHeader>
          <div className="px-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Pattern Type</Label>
                <Input value={form.patternType} onChange={e => setForm(p => ({ ...p, patternType: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Complexity *</Label>
                <Select value={form.complexity} onValueChange={v => setForm(p => ({ ...p, complexity: v }))}>
                  <SelectTrigger className={errors.complexity ? 'border-red-500' : ''}><SelectValue /></SelectTrigger>
                  <SelectContent>{complexityOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
                {errors.complexity && <p className="text-xs text-red-500">{errors.complexity}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Timeline *</Label>
                <Input value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))} className={errors.timeline ? 'border-red-500' : ''} />
                {errors.timeline && <p className="text-xs text-red-500">{errors.timeline}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as ClassificationPattern['status'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statusOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Include in export</Label>
                <Select value={form.includeInExport ? 'yes' : 'no'} onValueChange={v => setForm(p => ({ ...p, includeInExport: v === 'yes' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Best Fit / When to Use *</Label>
              <Textarea value={form.whenToUse} onChange={e => setForm(p => ({ ...p, whenToUse: e.target.value }))} className={`min-h-20 ${errors.whenToUse ? 'border-red-500' : ''}`} />
              {errors.whenToUse && <p className="text-xs text-red-500">{errors.whenToUse}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Capabilities * (comma or newline separated)</Label>
              <Textarea value={listToText(form.capabilities)} onChange={e => setForm(p => ({ ...p, capabilities: textToList(e.target.value) }))} className={errors.capabilities ? 'border-red-500' : ''} />
              {errors.capabilities && <p className="text-xs text-red-500">{errors.capabilities}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Triggers (comma or newline separated)</Label>
              <Textarea value={listToText(form.triggers)} onChange={e => setForm(p => ({ ...p, triggers: textToList(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Architecture Implications</Label>
              <Textarea value={form.architectureImplications} onChange={e => setForm(p => ({ ...p, architectureImplications: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Estimation Implications</Label>
              <Textarea value={form.estimationImplications} onChange={e => setForm(p => ({ ...p, estimationImplications: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Delivery Notes</Label>
              <Textarea value={form.deliveryNotes} onChange={e => setForm(p => ({ ...p, deliveryNotes: e.target.value }))} />
            </div>
          </div>
          <SheetFooter>
            <div className="flex gap-2">
              <Button onClick={savePattern} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
              <Button variant="outline" onClick={() => setDrawerOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
    <WorkflowNav
      nextDisabled={!selected}
      nextDisabledReason="Select a solution pattern to continue"
    />
    </div>
  );
}
