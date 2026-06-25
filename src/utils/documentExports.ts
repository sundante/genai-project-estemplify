import * as XLSX from 'xlsx'
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Workspace } from '../types'
import type { ExportSection } from './exportSections'
import { todayIso } from './format'

export type DocumentExportFormat = 'excel' | 'doc' | 'pdf'

interface ExportTable {
  title: string
  rows: object[]
}

function cleanFilePart(value: string) {
  return (value || 'Untitled').replace(/[^a-zA-Z0-9_-]/g, '_')
}

function exportFileName(workspace: Workspace, section: ExportSection, ext: string) {
  const client = cleanFilePart(workspace.opportunity.clientName || 'Client')
  const useCase = cleanFilePart(workspace.opportunity.useCaseName || 'UseCase')
  const label = section === 'all' ? 'ProposalPackage' : section
  return `${client}_${useCase}_${label}_${todayIso()}.${ext}`
}

function kv(title: string, data: object): ExportTable {
  return {
    title,
    rows: Object.entries(data).map(([field, value]) => ({
      Field: field,
      Value: Array.isArray(value) ? value.join(', ') : String(value ?? ''),
    })),
  }
}

function getExportTables(workspace: Workspace, section: ExportSection): ExportTable[] {
  const { opportunity, classification, estimation } = workspace
  const allTables: Record<Exclude<ExportSection, 'all'>, ExportTable[]> = {
    overview: [
      kv('Overview', estimation.overview),
      kv('Classification', {
        selectedPattern: classification.selectedPatternName || classification.selectedPattern,
        recommendationReason: classification.recommendationReason,
        architectureImplications: classification.architectureImplications,
        complexityBand: classification.complexityBand,
        effortMultiplier: classification.effortMultiplier,
      }),
      kv('Opportunity Context', {
        clientName: opportunity.clientName,
        useCaseName: opportunity.useCaseName,
        marketSegment: opportunity.marketSegment,
        engagementType: opportunity.engagementType,
        commercialModel: opportunity.commercialModel,
        timelineExpectation: opportunity.timelineExpectation,
        businessProblem: opportunity.businessProblem,
      }),
    ],
    components: [{
      title: 'Components',
      rows: estimation.components.filter(row => row.includeInExport),
    }],
    wbs: [{
      title: 'WBS',
      rows: estimation.wbs.filter(row => row.includeInExport),
    }],
    resources: [{
      title: 'Resources',
      rows: estimation.resources.filter(row => row.includeInExport),
    }],
    assumptions: [{
      title: 'Assumptions',
      rows: [
        ...estimation.assumptions.filter(row => row.includeInExport),
        ...estimation.dependencies.filter(row => row.includeInExport),
        ...estimation.finopsAssumptions.filter(row => row.includeInExport),
      ],
    }],
    risks: [{
      title: 'Risks',
      rows: estimation.risks.filter(row => row.includeInExport),
    }],
    roi: [kv('ROI', estimation.roi)],
    delivery: [
      kv('Delivery Model', { engagementModel: estimation.deliveryModel.engagementModel }),
      { title: 'Phase Approach', rows: estimation.deliveryModel.phaseApproach.filter(row => row.includeInExport) },
      { title: 'Pod Composition', rows: estimation.deliveryModel.podComposition.filter(row => row.includeInExport) },
      { title: 'Location Split', rows: estimation.deliveryModel.locationSplit.filter(row => row.includeInExport) },
      { title: 'Support Tiers', rows: estimation.deliveryModel.supportTiers.filter(row => row.includeInExport) },
      { title: 'SLA Model', rows: estimation.deliveryModel.slaModel.filter(row => row.includeInExport) },
      { title: 'RACI Summary', rows: estimation.deliveryModel.raciSummary.filter(row => row.includeInExport) },
      { title: 'Training Plan', rows: estimation.deliveryModel.trainingPlan.filter(row => row.includeInExport) },
      { title: 'KT Plan', rows: estimation.deliveryModel.ktPlan.filter(row => row.includeInExport) },
      { title: 'Governance Cadence', rows: estimation.deliveryModel.governanceCadence.filter(row => row.includeInExport) },
    ],
  }

  if (section !== 'all') return allTables[section]
  return [
    ...allTables.overview,
    ...allTables.components,
    ...allTables.wbs,
    ...allTables.resources,
    ...allTables.assumptions,
    ...allTables.risks,
    ...allTables.roi,
    ...allTables.delivery,
  ]
}

function normalizeRows(rows: ExportTable['rows']) {
  if (rows.length === 0) return [{ Status: 'No rows included' }]
  return rows.map(row => {
    const normalized: Record<string, string | number | boolean> = {}
    Object.entries(row as Record<string, unknown>).forEach(([key, value]) => {
      normalized[key] = Array.isArray(value) ? value.join(', ') : (value ?? '') as string | number | boolean
    })
    return normalized
  })
}

function exportExcel(workspace: Workspace, section: ExportSection) {
  const workbook = XLSX.utils.book_new()
  getExportTables(workspace, section).forEach((table, index) => {
    const sheet = XLSX.utils.json_to_sheet(normalizeRows(table.rows))
    const sheetName = table.title.slice(0, 28) || `Sheet ${index + 1}`
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName)
  })
  XLSX.writeFile(workbook, exportFileName(workspace, section, 'xlsx'))
}

async function exportDoc(workspace: Workspace, section: ExportSection) {
  const children = [
    new Paragraph({
      text: `${workspace.opportunity.clientName || 'Client'} - ${workspace.opportunity.useCaseName || 'Use Case'}`,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({ text: `Generated ${todayIso()}` }),
  ]

  getExportTables(workspace, section).forEach(table => {
    children.push(new Paragraph({ text: table.title, heading: HeadingLevel.HEADING_1 }))
    normalizeRows(table.rows).forEach((row, index) => {
      children.push(new Paragraph({ children: [new TextRun({ text: `${index + 1}.`, bold: true })] }))
      Object.entries(row).forEach(([key, value]) => {
        children.push(new Paragraph({ text: `${key}: ${String(value)}` }))
      })
    })
  })

  const document = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(document)
  saveAs(blob, exportFileName(workspace, section, 'docx'))
}

function exportPdf(workspace: Workspace, section: ExportSection) {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(14)
  doc.text(`${workspace.opportunity.clientName || 'Client'} - ${workspace.opportunity.useCaseName || 'Use Case'}`, 14, 14)
  doc.setFontSize(9)
  doc.text(`Generated ${todayIso()}`, 14, 21)

  let y = 28
  getExportTables(workspace, section).forEach(table => {
    const rows = normalizeRows(table.rows)
    const columns = Object.keys(rows[0] ?? { Status: '' })
    doc.setFontSize(11)
    doc.text(table.title, 14, y)
    autoTable(doc, {
      startY: y + 3,
      head: [columns],
      body: rows.map(row => columns.map(col => String(row[col] ?? ''))),
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14, right: 14 },
    })
    y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 20
    y += 10
    if (y > 180) {
      doc.addPage()
      y = 18
    }
  })

  doc.save(exportFileName(workspace, section, 'pdf'))
}

export async function exportWorkspaceDocument(workspace: Workspace, section: ExportSection, format: DocumentExportFormat) {
  if (format === 'excel') {
    exportExcel(workspace, section)
    return
  }
  if (format === 'doc') {
    await exportDoc(workspace, section)
    return
  }
  exportPdf(workspace, section)
}
