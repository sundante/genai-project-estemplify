import { useMemo } from 'react';
import { useWorkbench, STORAGE_KEY } from './WorkbenchContext';
import { WorkflowNav } from './WorkflowNav';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, Download, FileJson, FileText, FileType, Sheet, XCircle } from 'lucide-react';
import * as fullPackage from '../../utils/exports/exportFullPackage';
import * as exportOverview from '../../utils/exports/exportOverview';
import * as exportComponents from '../../utils/exports/exportComponents';
import * as exportAgents from '../../utils/exports/exportAgents';
import * as exportWbs from '../../utils/exports/exportWbs';
import * as exportResources from '../../utils/exports/exportResources';
import * as exportInfra from '../../utils/exports/exportInfra';
import * as exportAssumptions from '../../utils/exports/exportAssumptions';
import * as exportRisks from '../../utils/exports/exportRisks';
import * as exportRoi from '../../utils/exports/exportRoi';
import { exportCsvPackage, exportJson, exportSectionAsExcel, exportSectionAsPdf, exportSectionAsWord } from '../../utils/exports/core';

const sectionRows = [
  { name: 'Overview', count: () => 22, exporters: exportOverview },
  { name: 'Components', count: (s: any) => s.azure.selectedComponents.length, exporters: exportComponents },
  { name: 'Agents', count: () => 8, exporters: exportAgents },
  { name: 'WBS', count: (s: any) => s.azure.wbs.filter((r: any) => r.includeInExport).length, exporters: exportWbs },
  { name: 'Resources', count: (s: any) => s.azure.resources.filter((r: any) => r.includeInExport).length, exporters: exportResources },
  { name: 'Infra & Tokens', count: () => 12, exporters: exportInfra },
  { name: 'Assumptions & Dependencies', count: (s: any) => s.azure.assumptions.filter((r: any) => r.includeInExport).length + s.azure.dependencies.filter((r: any) => r.includeInExport).length, exporters: exportAssumptions },
  { name: 'Risks', count: (s: any) => s.azure.risks.filter((r: any) => r.includeInExport).length, exporters: exportRisks },
  { name: 'ROI', count: () => 6, exporters: exportRoi },
  {
    name: 'Delivery & Support',
    count: () => 21,
    exporters: {
      exportAsExcel: (state: any) => exportSectionAsExcel('delivery', state),
      exportAsPdf: (state: any) => exportSectionAsPdf('delivery', state),
      exportAsWord: (state: any) => exportSectionAsWord('delivery', state),
    },
  },
];

function StatusLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? <CheckCircle2 className="size-4 text-emerald-500" /> : <XCircle className="size-4 text-red-500" />}
      <span className={ok ? 'text-slate-700 dark:text-slate-300' : 'text-red-600 dark:text-red-400'}>{label}</span>
    </div>
  );
}

export function ExportCenterPage() {
  const { state, setValidationStatus } = useWorkbench();

  const validation = useMemo(() => {
    const complexityComplete = Object.values(state.complexity).every(v => v > 0);
    const wbsRows = state.azure.wbs.filter(r => r.includeInExport).length;
    const resourceRows = state.azure.resources.filter(r => r.includeInExport).length;
    return {
      client: Boolean(state.intake.clientName),
      segment: Boolean(state.intake.marketSegment),
      pattern: Boolean(state.classification.selectedPattern),
      complexity: complexityComplete,
      wbs: wbsRows > 0,
      resources: resourceRows > 0,
      wbsRows,
      resourceRows,
      assumptionRows: state.azure.assumptions.filter(r => r.includeInExport).length,
      riskRows: state.azure.risks.filter(r => r.includeInExport).length,
    };
  }, [state]);
  const allValid = validation.client && validation.segment && validation.pattern && validation.complexity && validation.wbs && validation.resources;

  const openPrint = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.open('/print-export', '_blank');
  };

  const fullCards = [
    { title: 'Excel Workbook (.xlsx)', desc: '10-section workbook with all sections', icon: Sheet, action: () => fullPackage.exportAsExcel(state) },
    { title: 'Word Document (.docx)', desc: 'Formatted proposal document with cover page', icon: FileText, action: () => fullPackage.exportAsWord(state) },
    { title: 'PDF', desc: 'Print-ready document via jsPDF or browser print', icon: FileType, action: () => fullPackage.exportAsPdf(state) },
    { title: 'JSON', desc: 'Full workspace snapshot for reload or API use', icon: FileJson, action: () => exportJson(state) },
  ];

  return (
    <div className="flex flex-col min-h-full">
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-7">
      <div>
        <h1 className="text-slate-900 dark:text-slate-100">Export Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Download the full proposal package or export individual sections.</p>
      </div>

      <section>
        <h2 className="text-slate-900 dark:text-slate-100 mb-4">Export Full Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {fullCards.map(card => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                <Icon className="size-6 text-blue-600 mb-3" />
                <h3 className="text-slate-900 dark:text-slate-100">{card.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 min-h-10">{card.desc}</p>
                <Button onClick={card.action} className="mt-4 w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="size-4" />
                  Download
                </Button>
              </article>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="link" onClick={() => exportCsvPackage(state)} className="px-0">Export CSV Package</Button>
          <Button variant="link" onClick={openPrint} className="px-0">Open Print View</Button>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-slate-900 dark:text-slate-100 mb-4">Export Individual Sections</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {sectionRows.map(row => (
            <div key={row.name} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-800 dark:text-slate-100">{row.name}</span>
                <Badge variant="secondary">{row.count(state)} rows</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => row.exporters.exportAsExcel(state)} title="Export Excel"><Sheet className="size-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => row.exporters.exportAsPdf(state)} title="Export PDF"><FileType className="size-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => row.exporters.exportAsWord(state)} title="Export Word"><FileText className="size-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-slate-900 dark:text-slate-100 mb-4">Pre-Export Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatusLine ok={validation.client} label="Client name set" />
          <StatusLine ok={validation.segment} label="Market segment selected" />
          <StatusLine ok={validation.pattern} label="Solution pattern selected" />
          <StatusLine ok={validation.complexity} label="All 10 complexity dimensions scored" />
          <StatusLine ok={validation.wbs} label="WBS has at least 1 included row" />
          <StatusLine ok={validation.resources} label="At least 1 included resource row" />
          <StatusLine ok={Boolean(state.azure.delivery.engagementModel || state.azure.delivery.phaseApproach || state.azure.delivery.supportModel)} label="Delivery & Support considerations captured" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">{validation.wbsRows} WBS rows</Badge>
          <Badge variant="outline">{validation.resourceRows} resource rows</Badge>
          <Badge variant="outline">{validation.assumptionRows} assumption rows</Badge>
          <Badge variant="outline">{validation.riskRows} risk rows</Badge>
        </div>
        <Button
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => {
            setValidationStatus(allValid ? 'ready-to-export' : 'draft');
            if (!allValid) {
              alert('Complete the checklist items before Validate & Export.');
              return;
            }
            fullPackage.exportAsExcel(state);
          }}
        >
          <Download className="size-4" />
          Validate & Export
        </Button>
      </section>
    </div>
    <WorkflowNav />
    </div>
  );
}
