import type { Workspace, ValidationError, WorkspaceStatus, Opportunity, SolutionClassification, WBSRow, ResourceRow, RiskRow } from '../types'
import { generateId } from './ids'

function err(section: string, field: string, message: string, severity: ValidationError['severity'] = 'error'): ValidationError {
  return { id: generateId(), section, field, severity, message }
}

// ─── Section validators ────────────────────────────────────────────────────────

export function validateIntake(opp: Opportunity): ValidationError[] {
  const errors: ValidationError[] = []
  if (!opp.clientName?.trim()) errors.push(err('Intake', 'clientName', 'Client Name is required before export.'))
  if (!opp.useCaseName?.trim()) errors.push(err('Intake', 'useCaseName', 'Use Case Name is required before export.'))
  if (!opp.marketSegment?.trim()) errors.push(err('Intake', 'marketSegment', 'Market Segment is required before export.'))
  if ((opp.businessProblem?.trim()?.length ?? 0) < 30) errors.push(err('Intake', 'businessProblem', 'Business Problem must be at least 30 characters.'))
  if (!opp.dataSources?.length) errors.push(err('Intake', 'dataSources', 'At least one Data Source must be selected before export.'))
  if (opp.complianceFlags?.includes('PHI/PII') && opp.budgetIndicator === 'Low') {
    errors.push(err('Intake', 'complianceFlags', 'PHI/PII compliance flag requires budget indicator of at least Medium.', 'warning'))
  }
  return errors
}

export function validateClassification(cls: SolutionClassification): ValidationError[] {
  const errors: ValidationError[] = []
  if (!cls.selectedPattern) errors.push(err('Classification', 'selectedPattern', 'A solution pattern must be selected before export.'))
  return errors
}

export function validateOverview(overview: Workspace['estimation']['overview']): ValidationError[] {
  const errors: ValidationError[] = []
  if (!overview.cloudProvider) errors.push(err('Overview', 'cloudProvider', 'Cloud Provider is required before full proposal export.'))
  if (!overview.executiveSummary?.trim()) errors.push(err('Overview', 'executiveSummary', 'Executive Summary is required before proposal export.'))
  if (!overview.businessGoal?.trim()) errors.push(err('Overview', 'businessGoal', 'Business Goal is required before proposal export.'))
  return errors
}

export function validateComponents(rows: Workspace['estimation']['components']): ValidationError[] {
  const errors: ValidationError[] = []
  const exportRows = rows.filter(r => r.includeInExport)
  if (exportRows.length === 0) errors.push(err('Components', 'rows', 'At least one component is required before architecture export.', 'warning'))
  return errors
}

export function validateWBS(rows: WBSRow[]): ValidationError[] {
  const errors: ValidationError[] = []
  const exportRows = rows.filter(r => r.includeInExport)
  if (exportRows.length === 0) errors.push(err('WBS', 'rows', 'At least one WBS row is required before estimation export.', 'warning'))
  for (const row of exportRows) {
    if (!row.phase) errors.push(err('WBS', row.id, `WBS row "${row.task || row.id}" is missing Phase.`))
    if (!row.task?.trim()) errors.push(err('WBS', row.id, `A WBS row is missing the Task description.`))
    if (!row.ownerRole?.trim()) errors.push(err('WBS', row.id, `WBS row "${row.task || row.id}" is missing Owner Role.`))
    if (row.hours === '' || Number(row.hours) <= 0) errors.push(err('WBS', row.id, `WBS row "${row.task || row.id}" must have Hours > 0.`))
  }
  return errors
}

export function validateResources(rows: ResourceRow[]): ValidationError[] {
  const errors: ValidationError[] = []
  const exportRows = rows.filter(r => r.includeInExport)
  if (exportRows.length === 0) errors.push(err('Resources', 'rows', 'At least one resource row is required before estimation export.', 'warning'))
  for (const row of exportRows) {
    if (row.fte === '' || Number(row.fte) <= 0) errors.push(err('Resources', row.id, `Resource row "${row.role || row.id}" must have FTE > 0.`))
    if (row.durationWeeks === '' || Number(row.durationWeeks) <= 0) errors.push(err('Resources', row.id, `Resource row "${row.role || row.id}" must have Duration Weeks > 0.`))
    const alloc = Number(row.allocationPercent)
    if (alloc < 1 || alloc > 100) errors.push(err('Resources', row.id, `Resource row "${row.role || row.id}" Allocation % must be between 1 and 100.`))
  }
  return errors
}

export function validateRisks(rows: RiskRow[]): ValidationError[] {
  const errors: ValidationError[] = []
  if (rows.length === 0) errors.push(err('Risks', 'rows', 'No risks have been added. Consider documenting known risks.', 'warning'))
  for (const row of rows) {
    if ((row.severity === 'High' || row.severity === 'Critical') && !row.mitigation?.trim()) {
      errors.push(err('Risks', row.id, `High/Critical risk "${row.riskId}" requires a Mitigation plan.`))
    }
  }
  return errors
}

export function validateROI(roi: Workspace['estimation']['roi']): ValidationError[] {
  const errors: ValidationError[] = []
  if (roi.implementationCost === '' || Number(roi.implementationCost) <= 0) {
    errors.push(err('ROI', 'implementationCost', 'Implementation Cost is required for ROI calculation.', 'warning'))
  }
  if (roi.annualRunCost === '' || Number(roi.annualRunCost) < 0) {
    errors.push(err('ROI', 'annualRunCost', 'Annual Run Cost is required for ROI calculation.', 'warning'))
  }
  const rate = Number(roi.discountRate)
  if (roi.discountRate !== '' && (rate < 0 || rate > 100)) {
    errors.push(err('ROI', 'discountRate', 'Discount Rate must be between 0 and 100.'))
  }
  return errors
}

// ─── Full package validator ────────────────────────────────────────────────────

export function validateFullPackage(workspace: Workspace): ValidationError[] {
  return [
    ...validateIntake(workspace.opportunity),
    ...validateClassification(workspace.classification),
    ...validateOverview(workspace.estimation.overview),
    ...validateComponents(workspace.estimation.components),
    ...validateWBS(workspace.estimation.wbs),
    ...validateResources(workspace.estimation.resources),
    ...validateRisks(workspace.estimation.risks),
    ...validateROI(workspace.estimation.roi),
  ]
}

export function getValidationStatus(errors: ValidationError[]): WorkspaceStatus {
  if (errors.length === 0) return 'Ready to Export'
  const hasErrors = errors.some(e => e.severity === 'error')
  if (hasErrors) return 'Incomplete'
  const hasWarnings = errors.some(e => e.severity === 'warning')
  if (hasWarnings) return 'Warnings'
  return 'Validated'
}

export function getStatusColor(status: WorkspaceStatus): string {
  switch (status) {
    case 'Ready to Export': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    case 'Validated': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'Warnings': return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'Incomplete': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-slate-500 bg-slate-50 border-slate-200'
  }
}

export function getStatusColorDark(status: WorkspaceStatus): string {
  switch (status) {
    case 'Ready to Export': return 'dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800'
    case 'Validated': return 'dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800'
    case 'Warnings': return 'dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800'
    case 'Incomplete': return 'dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
    default: return 'dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700'
  }
}
