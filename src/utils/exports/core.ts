import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import type { WorkbenchState } from '../../app/components/WorkbenchContext';

export const isXlsxAvailable = Boolean(XLSX?.utils);
export const isPdfAvailable = Boolean(jsPDF && autoTable);
export const isDocxAvailable = Boolean(Document && Packer);

export type SectionName =
  | 'overview'
  | 'components'
  | 'agents'
  | 'wbs'
  | 'resources'
  | 'infra'
  | 'assumptions'
  | 'risks'
  | 'roi';

const appName = 'GenAI Proposal & SOW Estimation Workbench';

const components = [
  ['Azure OpenAI / AI Foundry', 'Required', 'LLM inference, embeddings, chat completions', 'Token consumption (input/output)'],
  ['Azure AI Search', 'Required', 'Vector + keyword hybrid search, RAG retrieval', 'Index size, query volume'],
  ['Azure Document Intelligence', 'Required', 'OCR, form extraction, layout analysis', 'Pages processed per month'],
  ['Azure Functions', 'Required', 'Serverless agent orchestration and event triggers', 'Executions and compute time'],
  ['Azure App Service', 'Required', 'Host HITL review UI and API layer', 'App plan tier, uptime'],
  ['Azure API Management', 'Required', 'API gateway, rate limiting, security', 'API calls per month'],
  ['Azure Blob Storage', 'Required', 'Document repository, ingestion staging', 'Storage GB + transaction volume'],
  ['Azure Cosmos DB', 'Required', 'Audit log, workflow state, agent memory', 'RU/s provisioned + storage'],
  ['Azure SQL Database', 'Optional', 'Relational data for structured claims records', 'DTU/vCore tier, storage'],
  ['Azure Key Vault', 'Required', 'Secrets management, API key storage', 'Operations'],
  ['Entra ID', 'Required', 'Identity, SSO, and RBAC for HITL reviewers', 'Monthly active users'],
  ['Azure Monitor', 'Required', 'Telemetry, alerts, performance monitoring', 'Data ingestion + retention'],
  ['Log Analytics', 'Optional', 'Centralized log queries and compliance auditing', 'Data ingested + queried'],
  ['Azure DevOps', 'Required', 'CI/CD pipelines, sprint planning, repository', 'Users, pipeline minutes'],
  ['Azure Communication Services', 'Optional', 'Notifications and email alerts for HITL reviews', 'Messages sent'],
  ['Azure Cache for Redis', 'Optional', 'Session caching, prompt caching, rate limiting', 'Cache size and tier'],
];

const agents = [
  ['Intake Agent', 'Yes', 'Receives and validates incoming prior authorization requests. Routes to appropriate workflow.', 1],
  ['Retrieval Agent', 'Yes', 'Retrieves relevant clinical policies, payer guidelines, and coverage criteria from the knowledge base.', 3],
  ['Evidence Extraction Agent', 'Yes', 'Extracts structured clinical evidence from submitted documents.', 5],
  ['Policy Reasoning Agent', 'Yes', 'Maps extracted clinical evidence to policy criteria and coverage clauses.', 2],
  ['Recommendation Agent', 'Yes', 'Generates a recommendation with clinical rationale and references.', 1],
  ['Validation / Q&T Agent', 'Yes', 'Validates recommendation quality, hallucination risk, and grounding.', 2],
  ['HITL Review Agent', 'Yes', 'Routes low-confidence recommendations to human reviewers.', 1],
  ['Audit and Feedback Agent', 'Yes', 'Logs decisions, reviewer actions, and feedback signals.', 1],
];

export function workflowsPerMonth(state: WorkbenchState) {
  const infra = state.azure.infra;
  return infra.monthlyUsers * infra.requestsPerUserPerDay * 30;
}

export function monthlyRunCost(state: WorkbenchState) {
  const infra = state.azure.infra;
  const workflows = workflowsPerMonth(state);
  const calls = workflows * (infra.agentStepsPerWorkflow + infra.evaluationCallsPerWorkflow);
  const inputTokens = calls * (infra.avgPromptTokens + infra.avgRetrievalContextTokens);
  const outputTokens = calls * infra.avgCompletionTokens;
  const ocrPages = workflows * infra.avgDocumentsPerWorkflow * infra.avgPagesPerDocument;
  const storageGB = ocrPages * 0.001;
  const input = parseFloat(infra.unitRateLLMInput || '');
  const output = parseFloat(infra.unitRateLLMOutput || '');
  const ocr = parseFloat(infra.unitRateOCR || '');
  const storage = parseFloat(infra.unitRateStorage || '');

  if ([input, output, ocr, storage].some(Number.isNaN)) return null;
  return (inputTokens / 1000) * input + (outputTokens / 1000) * output + ocrPages * ocr + storageGB * storage;
}

function safe(value: unknown) {
  return value === undefined || value === null || value === '' ? '-' : String(value);
}

export function fileStem(state: WorkbenchState, sectionName: string) {
  const client = (state.intake.clientName || 'DemoClient').replace(/[^\w-]+/g, '_');
  const useCase = (state.azure.overview.useCaseName || state.intake.opportunityName || 'UseCase').replace(/[^\w-]+/g, '_');
  const date = new Date().toISOString().split('T')[0];
  return `${client}_${useCase}_${sectionName}_${date}`;
}

export function downloadText(content: string, filename: string, mime: string) {
  saveAs(new Blob([content], { type: mime }), filename);
}

function csv(rows: unknown[][]) {
  return rows.map(row => row.map(cell => `"${safe(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}

export function sectionTable(section: SectionName, state: WorkbenchState): { title: string; headers: string[]; rows: unknown[][] } {
  const { azure, intake, classification, complexity } = state;
  const selectedComponents = new Set(azure.selectedComponents);
  const selectedPatternName = classification.patterns.find(pattern => pattern.id === classification.selectedPattern)?.name || classification.selectedPattern;

  if (section === 'overview') {
    return {
      title: 'Solution Overview',
      headers: ['Field', 'Value'],
      rows: [
        ['Client', intake.clientName],
        ['Opportunity', intake.opportunityName],
        ['Use-case', azure.overview.useCaseName],
        ['Market Segment', intake.marketSegment],
        ['Business Function', intake.businessFunction],
        ['Delivery Type', intake.targetDeliveryType],
        ['Solution Pattern', selectedPatternName],
        ['Business Problem', intake.businessProblem],
        ['Current Process', intake.currentProcess],
        ['Desired Future State', intake.desiredFutureState],
        ['Business Goal', azure.overview.businessGoal],
        ['Complexity Scores', Object.values(complexity).join(', ')],
      ],
    };
  }

  if (section === 'components') {
    return {
      title: 'Azure Components',
      headers: ['Component', 'Required/Optional', 'Purpose', 'Cost Driver'],
      rows: components.filter(row => selectedComponents.has(row[0].toLowerCase().replace(/ \/ ai foundry/, '').replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')) || row[1] === 'Required'),
    };
  }

  if (section === 'agents') return { title: 'Agentic Workflow', headers: ['Agent', 'Enabled', 'Responsibility', 'LLM Calls/Workflow'], rows: agents };

  if (section === 'wbs') {
    return {
      title: 'WBS',
      headers: ['Phase', 'Activity', 'Deliverable', 'Role', 'Complexity', 'Effort Days', 'Dependency', 'Acceptance Criteria', 'Row Type'],
      rows: azure.wbs.filter(r => r.includeInExport).map(r => [r.phase, r.activity, r.deliverable, r.role, r.complexity, r.effortDays, r.dependency, r.acceptanceCriteria, r.rowType]),
    };
  }

  if (section === 'resources') {
    const basis = azure.estimationBasis;
    const parseRate = (value: string) => {
      const parsed = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
      return Number.isFinite(parsed) ? parsed : basis.defaultHourlyRate;
    };
    return {
      title: 'Resource Loading',
      headers: ['Role', 'Phase', 'Allocation %', 'Duration Weeks', 'Effort Days', 'Rate', 'Cost'],
      rows: [
        ['Calculation Basis', basis.resourceEffortFormula, '', '', '', '', basis.resourceCostFormula],
        ...azure.resources.filter(r => r.includeInExport).map(r => {
          const rate = parseRate(r.ratePlaceholder);
          const cost = rate > 0 ? `$${(r.effortDays * basis.hoursPerDay * rate).toFixed(0)}` : r.costPlaceholder;
          return [r.role, r.phase, r.allocation, r.durationWeeks, r.effortDays, r.ratePlaceholder, cost];
        }),
      ],
    };
  }

  if (section === 'infra') {
    const infra = azure.infra;
    const basis = azure.estimationBasis;
    return {
      title: 'Infra & Tokens',
      headers: ['Input Parameter', 'Value'],
      rows: [
        ['Volume Formula', basis.infraVolumeFormula],
        ['Token Cost Formula', basis.tokenCostFormula],
        ['Monthly Users', infra.monthlyUsers],
        ['Concurrent Users', infra.concurrentUsers],
        ['Requests / User / Day', infra.requestsPerUserPerDay],
        ['Workflows / Month', workflowsPerMonth(state)],
        ['Docs / Workflow', infra.avgDocumentsPerWorkflow],
        ['Pages / Document', infra.avgPagesPerDocument],
        ['Avg Prompt Tokens', infra.avgPromptTokens],
        ['Avg Retrieval Context Tokens', infra.avgRetrievalContextTokens],
        ['Avg Completion Tokens', infra.avgCompletionTokens],
        ['Agent Steps / Workflow', infra.agentStepsPerWorkflow],
        ['Evaluation Calls / Workflow', infra.evaluationCallsPerWorkflow],
        ['Monthly Run Cost', monthlyRunCost(state) === null ? 'TBD' : `$${monthlyRunCost(state)!.toFixed(0)}`],
      ],
    };
  }

  if (section === 'assumptions') {
    return {
      title: 'Assumptions & Dependencies',
      headers: ['Type', 'Category', 'Description', 'Owner', 'Impact'],
      rows: [
        ...azure.assumptions.filter(r => r.includeInExport).map(r => ['Assumption', r.category, r.description, r.owner, r.impact]),
        ...azure.dependencies.filter(r => r.includeInExport).map(r => ['Dependency', r.category, r.description, r.owner, r.impact]),
      ],
    };
  }

  if (section === 'risks') {
    return {
      title: 'Risks',
      headers: ['Risk ID', 'Description', 'Probability', 'Impact', 'Mitigation', 'Owner'],
      rows: azure.risks.filter(r => r.includeInExport).map(r => [r.riskId, r.description, r.probability, r.impact, r.mitigation, r.owner]),
    };
  }

  const roi = azure.roi;
  const basis = azure.estimationBasis;
  const workflows = workflowsPerMonth(state);
  const hoursSaved = workflows * roi.currentEffortHoursPerWorkflow * (roi.projectedEffortReductionPct / 100);
  const targetTurnaround = roi.currentTurnaroundHours * (1 - roi.projectedTurnaroundReductionPct / 100);
  const reworkAvoided = workflows * (roi.currentErrorRatePct / 100) * (roi.projectedErrorReductionPct / 100);
  return {
    title: 'ROI Projection',
    headers: ['Metric', 'Current State', 'Projected', 'Improvement'],
    rows: [
      ['ROI Formula', basis.roiFormula, '-', '-'],
      ['Workflows / Month', workflows, workflows, '-'],
      ['Manual Effort Hours', roi.currentEffortHoursPerWorkflow, Math.max(0, roi.currentEffortHoursPerWorkflow * (1 - roi.projectedEffortReductionPct / 100)).toFixed(2), `${hoursSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} hours saved/month`],
      ['Error/Rework Rate', `${roi.currentErrorRatePct}%`, `${Math.max(0, roi.currentErrorRatePct * (1 - roi.projectedErrorReductionPct / 100)).toFixed(1)}%`, `${reworkAvoided.toLocaleString(undefined, { maximumFractionDigits: 0 })} rework cases avoided/month`],
      ['Turnaround', `${roi.currentTurnaroundHours} hours`, `${targetTurnaround.toFixed(1)} hours`, `Reduced by ${(roi.currentTurnaroundHours - targetTurnaround).toFixed(1)} hours`],
      ['Monthly Run Cost', 'TBD', monthlyRunCost(state) === null ? 'TBD' : `$${monthlyRunCost(state)!.toFixed(0)}`, '-'],
      ['Implementation Investment', roi.implementationCostPlaceholder, roi.implementationCostPlaceholder, '-'],
    ],
  };
}

export function exportSectionAsExcel(section: SectionName, state: WorkbenchState) {
  const table = sectionTable(section, state);
  if (!isXlsxAvailable) {
    downloadText(csv([table.headers, ...table.rows]), `${fileStem(state, table.title)}.csv`, 'text/csv;charset=utf-8');
    return;
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([table.headers, ...table.rows]), table.title.slice(0, 31));
  XLSX.writeFile(wb, `${fileStem(state, table.title)}.xlsx`);
}

export function exportSectionAsPdf(section: SectionName, state: WorkbenchState) {
  const table = sectionTable(section, state);
  if (!isPdfAvailable) {
    window.open('/print-export', '_blank');
    return;
  }
  const doc = new jsPDF({ orientation: table.headers.length > 6 ? 'landscape' : 'portrait' });
  const date = new Date().toLocaleDateString();
  doc.setFontSize(14);
  doc.text(`${appName} - ${table.title}`, 14, 16);
  doc.setFontSize(9);
  doc.text(`${safe(state.intake.clientName)} | ${safe(state.azure.overview.useCaseName)} | ${date}`, 14, 23);
  autoTable(doc, {
    startY: 30,
    head: [table.headers],
    body: table.rows.map(row => row.map(safe)),
    styles: { overflow: 'linebreak', fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.text(`Page ${doc.getNumberOfPages()}`, doc.internal.pageSize.width - 28, doc.internal.pageSize.height - 10);
    },
  });
  doc.save(`${fileStem(state, table.title)}.pdf`);
}

export async function exportSectionAsWord(section: SectionName, state: WorkbenchState) {
  const table = sectionTable(section, state);
  if (!isDocxAvailable) {
    const html = `<html><body><h1>${table.title}</h1><table border="1">${[table.headers, ...table.rows].map(row => `<tr>${row.map(cell => `<td>${safe(cell)}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
    downloadText(html, `${fileStem(state, table.title)}.html`, 'text/html;charset=utf-8');
    return;
  }
  const header = new TableRow({
    children: table.headers.map(h => new TableCell({
      shading: { fill: '2563EB' },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })],
    })),
  });
  const rows = table.rows.map(row => new TableRow({
    children: row.map(cell => new TableCell({ children: [new Paragraph(safe(cell))] })),
  }));
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: table.title, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: `${safe(state.intake.clientName)} | ${safe(state.azure.overview.useCaseName)} | ${new Date().toLocaleDateString()}`, alignment: AlignmentType.LEFT }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [header, ...rows] }),
      ],
    }],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileStem(state, table.title)}.docx`);
}

export function exportJson(state: WorkbenchState) {
  downloadText(JSON.stringify({ exportDate: new Date().toISOString(), ...state }, null, 2), `${fileStem(state, 'Workspace')}.json`, 'application/json;charset=utf-8');
}

export function exportCsvPackage(state: WorkbenchState) {
  (['wbs', 'resources', 'assumptions', 'risks', 'roi'] as SectionName[]).forEach(section => {
    const table = sectionTable(section, state);
    downloadText(csv([table.headers, ...table.rows]), `${fileStem(state, table.title)}.csv`, 'text/csv;charset=utf-8');
  });
}
