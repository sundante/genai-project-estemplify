import type { ComplexityBand, WBSRow, ResourceRow, InfraTokenEstimate, ROIBusinessCase, ComponentRow } from '../types'
import { safeNum } from './format'

// ─── Complexity ───────────────────────────────────────────────────────────────

export function getComplexityBand(totalScore: number): ComplexityBand {
  if (totalScore <= 18) return 'Standard'
  if (totalScore <= 30) return 'Enhanced'
  if (totalScore <= 42) return 'Complex'
  return 'Transformative'
}

export function getEffortMultiplier(band: ComplexityBand): number {
  const map: Record<ComplexityBand, number> = {
    Standard: 1.0,
    Enhanced: 1.25,
    Complex: 1.5,
    Transformative: 2.0,
  }
  return map[band]
}

export function calculateComplexityBand(scores: number[]): {
  totalScore: number
  band: ComplexityBand
  multiplier: number
} {
  const totalScore = scores.reduce((acc, s) => acc + safeNum(s, 1), 0)
  const band = getComplexityBand(totalScore)
  return { totalScore, band, multiplier: getEffortMultiplier(band) }
}

// ─── WBS ──────────────────────────────────────────────────────────────────────

export interface WBSSummary {
  totalHours: number
  totalDays: number
  adjustedHours: number
  adjustedDays: number
  byPhase: Record<string, { hours: number; days: number; adjustedHours: number; adjustedDays: number }>
}

export function calculateWBSSummary(rows: WBSRow[], multiplier = 1.0): WBSSummary {
  const byPhase: WBSSummary['byPhase'] = {}
  let totalHours = 0

  for (const row of rows) {
    if (!row.includeInExport) continue
    const h = safeNum(row.hours)
    totalHours += h
    const phase = row.phase || 'Unassigned'
    if (!byPhase[phase]) byPhase[phase] = { hours: 0, days: 0, adjustedHours: 0, adjustedDays: 0 }
    byPhase[phase].hours += h
  }

  for (const phase of Object.keys(byPhase)) {
    byPhase[phase].days = byPhase[phase].hours / 8
    byPhase[phase].adjustedHours = byPhase[phase].hours * multiplier
    byPhase[phase].adjustedDays = byPhase[phase].adjustedHours / 8
  }

  return {
    totalHours,
    totalDays: totalHours / 8,
    adjustedHours: totalHours * multiplier,
    adjustedDays: (totalHours * multiplier) / 8,
    byPhase,
  }
}

export function deriveWbsEffortDays(hours: number | ''): number | '' {
  if (hours === '' || hours === 0) return ''
  return Math.round((safeNum(hours) / 8) * 100) / 100
}

function parseDate(value: string): Date | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDays(value: string, days: number): string {
  const date = parseDate(value)
  if (!date || days <= 0) return ''
  date.setDate(date.getDate() + days - 1)
  return toDateInputValue(date)
}

function diffDays(start: string, end: string): number | '' {
  const startDate = parseDate(start)
  const endDate = parseDate(end)
  if (!startDate || !endDate || endDate < startDate) return ''
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((endDate.getTime() - startDate.getTime()) / msPerDay) + 1
}

export function deriveWbsSchedule(row: WBSRow): Partial<WBSRow> {
  const duration = safeNum(row.durationDays)
  if (row.startDate && duration > 0) return { endDate: addDays(row.startDate, duration) }
  if (row.startDate && row.endDate && row.durationDays === '') return { durationDays: diffDays(row.startDate, row.endDate) }
  return {}
}

// ─── Components ──────────────────────────────────────────────────────────────

export function calculateComponentCosts(row: ComponentRow): {
  calculatedMonthlyCost: number
  calculatedMonthlyLlmCost: number
} {
  const calculatedMonthlyCost = safeNum(row.quantity) * safeNum(row.monthlyUnitCost)
  const calculatedMonthlyLlmCost =
    safeNum(row.monthlyInputTokensK) * safeNum(row.costPerKInputTokens) +
    safeNum(row.monthlyOutputTokensK) * safeNum(row.costPerKOutputTokens)

  return { calculatedMonthlyCost, calculatedMonthlyLlmCost }
}

export function calculateComponentCostSummary(rows: ComponentRow[]): {
  monthlyInfraCost: number
  monthlyLlmCost: number
  monthlyRunCost: number
  annualRunCost: number
} {
  let monthlyInfraCost = 0
  let monthlyLlmCost = 0

  for (const row of rows) {
    if (!row.includeInExport || !row.selected) continue
    const { calculatedMonthlyCost, calculatedMonthlyLlmCost } = calculateComponentCosts(row)
    monthlyInfraCost += calculatedMonthlyCost
    monthlyLlmCost += calculatedMonthlyLlmCost
  }

  const monthlyRunCost = monthlyInfraCost + monthlyLlmCost
  return {
    monthlyInfraCost,
    monthlyLlmCost,
    monthlyRunCost,
    annualRunCost: monthlyRunCost * 12,
  }
}

// ─── Resources ────────────────────────────────────────────────────────────────

export interface ResourceSummary {
  totalEffortHours: number
  totalEffortDays: number
  totalCost: number
  byPhase: Record<string, { hours: number; days: number; fte: number }>
  byRole: Record<string, { hours: number; days: number; cost: number }>
  locationSplit: Record<string, { hours: number; percent: number }>
  personWeeks: number
}

export function calculateResourceEffort(row: ResourceRow): { effortHours: number; effortDays: number; cost: number } {
  const fte = safeNum(row.fte)
  const alloc = safeNum(row.allocationPercent) / 100
  const weeks = safeNum(row.durationWeeks)
  const rate = safeNum(row.ratePlaceholder)
  const effortHours = fte * alloc * weeks * 40
  const effortDays = effortHours / 8
  const cost = effortDays * rate
  return { effortHours, effortDays, cost }
}

export function calculateResourceSummary(rows: ResourceRow[]): ResourceSummary {
  const byPhase: ResourceSummary['byPhase'] = {}
  const byRole: ResourceSummary['byRole'] = {}
  const locationHours: Record<string, number> = {}
  let totalEffortHours = 0
  let totalCost = 0

  for (const row of rows) {
    if (!row.includeInExport) continue
    const { effortHours, effortDays, cost } = calculateResourceEffort(row)
    totalEffortHours += effortHours
    totalCost += cost

    const phase = row.phase || 'Unassigned'
    if (!byPhase[phase]) byPhase[phase] = { hours: 0, days: 0, fte: 0 }
    byPhase[phase].hours += effortHours
    byPhase[phase].days += effortDays
    byPhase[phase].fte += safeNum(row.fte)

    const role = row.role || 'Unassigned'
    if (!byRole[role]) byRole[role] = { hours: 0, days: 0, cost: 0 }
    byRole[role].hours += effortHours
    byRole[role].days += effortDays
    byRole[role].cost += cost

    const loc = row.location || 'TBD'
    locationHours[loc] = (locationHours[loc] || 0) + effortHours
  }

  const locationSplit: ResourceSummary['locationSplit'] = {}
  for (const [loc, hours] of Object.entries(locationHours)) {
    locationSplit[loc] = { hours, percent: totalEffortHours > 0 ? (hours / totalEffortHours) * 100 : 0 }
  }

  return {
    totalEffortHours,
    totalEffortDays: totalEffortHours / 8,
    totalCost,
    byPhase,
    byRole,
    locationSplit,
    personWeeks: totalEffortHours / 40,
  }
}

// ─── Legacy Infra Token Calculations ──────────────────────────────────────────

export function calculateInfraTokens(est: InfraTokenEstimate): Partial<InfraTokenEstimate> {
  const monthlyUsers = safeNum(est.monthlyUsers)
  const reqPerDay = safeNum(est.requestsPerUserPerDay)
  const agentSteps = safeNum(est.agentStepsPerWorkflow, 1)
  const evalCalls = safeNum(est.evaluationCallsPerWorkflow)
  const promptTokens = safeNum(est.averagePromptTokens)
  const retrievalTokens = safeNum(est.averageRetrievalContextTokens)
  const completionTokens = safeNum(est.averageCompletionTokens)
  const docsPerWorkflow = safeNum(est.averageDocumentsPerWorkflow)
  const pagesPerDoc = safeNum(est.averagePagesPerDocument)

  const workflowsPerMonth = monthlyUsers * reqPerDay * 30
  const llmCallsPerMonth = workflowsPerMonth * (agentSteps + evalCalls)
  const inputTokensPerMonth = workflowsPerMonth * agentSteps * (promptTokens + retrievalTokens)
  const outputTokensPerMonth = workflowsPerMonth * agentSteps * completionTokens
  const totalTokensPerMonth = inputTokensPerMonth + outputTokensPerMonth
  const ocrPagesPerMonth = workflowsPerMonth * docsPerWorkflow * pagesPerDoc

  const costPerKInput = safeNum(est.costPerKInputTokens)
  const costPerKOutput = safeNum(est.costPerKOutputTokens)
  const ocrCostPerPage = safeNum(est.ocrCostPerPage)

  const monthlyTokenCost =
    (inputTokensPerMonth / 1000) * costPerKInput +
    (outputTokensPerMonth / 1000) * costPerKOutput
  const monthlyOcrCost = ocrPagesPerMonth * ocrCostPerPage
  const monthlyInfraCost =
    safeNum(est.vectorSearchMonthlyCost) +
    safeNum(est.appRuntimeMonthlyCost) +
    safeNum(est.databaseMonthlyCost) +
    safeNum(est.monitoringMonthlyCost) +
    safeNum(est.storageGb) * safeNum(est.storageCostPerGb) +
    safeNum(est.networkCostPlaceholder)

  const monthlyRunRate = monthlyTokenCost + monthlyOcrCost + monthlyInfraCost

  return {
    calculatedWorkflowsPerMonth: workflowsPerMonth,
    calculatedLlmCallsPerMonth: llmCallsPerMonth,
    calculatedInputTokensPerMonth: inputTokensPerMonth,
    calculatedOutputTokensPerMonth: outputTokensPerMonth,
    calculatedTotalTokensPerMonth: totalTokensPerMonth,
    calculatedOcrPagesPerMonth: ocrPagesPerMonth,
    calculatedMonthlyTokenCost: monthlyTokenCost,
    calculatedMonthlyOcrCost: monthlyOcrCost,
    calculatedMonthlyInfraCost: monthlyInfraCost,
    calculatedMonthlyRunRate: monthlyRunRate,
    calculatedAnnualRunRate: monthlyRunRate * 12,
  }
}

// ─── ROI ──────────────────────────────────────────────────────────────────────

export function calculateROI(roi: ROIBusinessCase): Partial<ROIBusinessCase> {
  const volume = safeNum(roi.currentMonthlyCaseVolume)
  const handlingTime = safeNum(roi.averageHandlingTimePerCase) // minutes
  const hourlyCost = safeNum(roi.averageFullyLoadedHourlyCost)
  const errorRate = safeNum(roi.currentErrorReworkRate) / 100
  const reworkCost = safeNum(roi.averageReworkCost)
  const handlingReduction = safeNum(roi.expectedHandlingTimeReductionPercent) / 100
  const errorReduction = safeNum(roi.expectedErrorReductionPercent) / 100
  const avoidedCost = safeNum(roi.expectedCostAvoidance)
  const revenueUplift = safeNum(roi.expectedRevenueUplift)
  const implCost = safeNum(roi.implementationCost)
  const annualRunCost = safeNum(roi.annualRunCost)
  const discountRate = safeNum(roi.discountRate) / 100
  const years = safeNum(roi.timeHorizonYears, 3)

  const currentAnnualHours = (volume * handlingTime * 12) / 60
  const annualHoursSaved = currentAnnualHours * handlingReduction
  const annualProductivitySavings = annualHoursSaved * hourlyCost
  const annualReworkSavings = volume * 12 * errorRate * reworkCost * errorReduction
  const annualNetBenefit = annualProductivitySavings + annualReworkSavings + avoidedCost + revenueUplift - annualRunCost

  const paybackMonths = annualNetBenefit > 0 ? (implCost / (annualNetBenefit / 12)) : 0

  // NPV: sum of discounted annual net benefits minus implementation cost
  let npv = -implCost
  for (let y = 1; y <= years; y++) {
    npv += annualNetBenefit / Math.pow(1 + discountRate, y)
  }

  const totalBenefit = annualNetBenefit * years
  const totalCost = implCost + annualRunCost * years
  const roiPercent = totalCost > 0 ? ((totalBenefit - totalCost) / totalCost) * 100 : 0

  let savingsNarrative = ''
  if (annualNetBenefit > 0) {
    savingsNarrative = `Based on the inputs provided, this initiative is projected to deliver approximately ${
      annualNetBenefit.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    } in annual net benefit, with an estimated payback period of ${paybackMonths.toFixed(1)} months. Over ${years} years, the projected ROI is ${roiPercent.toFixed(1)}%.`
  }

  return {
    calculatedMonthlyHoursSaved: annualHoursSaved / 12,
    calculatedAnnualHoursSaved: annualHoursSaved,
    calculatedAnnualProductivitySavings: annualProductivitySavings,
    calculatedAnnualReworkSavings: annualReworkSavings,
    calculatedAnnualAvoidedCost: avoidedCost,
    calculatedAnnualNetBenefit: annualNetBenefit,
    calculatedPaybackMonths: paybackMonths,
    calculatedNpv: npv,
    calculatedRoiPercent: roiPercent,
    calculatedThreeYearBenefit: annualNetBenefit * Math.min(years, 3),
    calculatedThreeYearCost: implCost + annualRunCost * Math.min(years, 3),
    savingsNarrative,
  }
}
