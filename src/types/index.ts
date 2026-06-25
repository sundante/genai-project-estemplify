// ─── Core Enums ───────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'

export type WorkspaceStatus =
  | 'Draft'
  | 'Incomplete'
  | 'Warnings'
  | 'Validated'
  | 'Ready to Export'

export type ComplexityBand = 'Standard' | 'Enhanced' | 'Complex' | 'Transformative'

export type RowType = 'custom'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export type ExportFormat = 'excel' | 'word' | 'pdf' | 'json' | 'csv' | 'print'

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
  id: string
  section: string
  field: string
  severity: ValidationSeverity
  message: string
}

// ─── Opportunity (Intake) ─────────────────────────────────────────────────────

export interface Opportunity {
  clientName: string
  opportunityName: string
  useCaseName: string
  marketSegment: string
  businessFunction: string
  opportunityStage: string
  engagementType: string
  commercialModel: string
  budgetIndicator: string
  timelineExpectation: string
  complianceFlags: string[]
  integrationLandscape: string[]
  dataSources: string[]
  businessProblem: string
  currentManualProcess: string
  desiredFutureState: string
  painPoints: string
  targetPersonas: string
  expectedOutcomes: string
  successMetrics: string
  knownConstraints: string
  notes: string
}

// ─── Solution Classification ──────────────────────────────────────────────────

export interface SolutionPattern {
  id: string
  name: string
  description: string
  bestFit: string
  typicalInputs: string
  typicalOutputs: string
  complexityBaseline: string
  estimatedMvpRange: string
  governanceLevel: string
  isCustom?: boolean
}

export interface ComplexityDimension {
  id: string
  label: string
  description: string
  score: number // 1–5
}

export interface ComplexityScore {
  dimensions: ComplexityDimension[]
  totalScore: number
  band: ComplexityBand
  multiplier: number
  riskLevel: string
  recommendedTeamSize: string
  recommendedTimeline: string
}

export interface SolutionClassification {
  selectedPattern: string
  selectedPatternName: string
  secondaryPatterns: string[]
  recommendationReason: string
  complexityBand: ComplexityBand | ''
  effortMultiplier: number
  architectureImplications: string
  estimationImplications: string
  complexityScore: ComplexityScore
  customPatterns: SolutionPattern[]
}

// ─── Estimation Rows ──────────────────────────────────────────────────────────

export interface ComponentRow {
  id: string
  componentCategory: string
  logicalComponent: string
  cloudProviderMapping: string
  requiredOptional: 'Required' | 'Optional' | ''
  selected: boolean
  purpose: string
  costDriver: string
  sizingBasis: string
  unit: string
  quantity: number | ''
  monthlyUnitCost: number | ''
  calculatedMonthlyCost: number
  llmModel: string
  monthlyInputTokensK: number | ''
  monthlyOutputTokensK: number | ''
  costPerKInputTokens: number | ''
  costPerKOutputTokens: number | ''
  calculatedMonthlyLlmCost: number
  notes: string
  rowType: RowType
  includeInExport: boolean
}

export interface AgentRow {
  id: string
  agentName: string
  enabled: boolean
  responsibility: string
  inputs: string
  outputs: string
  toolsUsed: string
  hitlTrigger: string
  estimatedCallsPerWorkflow: number | ''
  auditNotes: string
  rowType: RowType
  includeInExport: boolean
}

export interface WBSRow {
  id: string
  phase: string
  epic: string
  task: string
  deliverable: string
  ownerRole: string
  hours: number | ''
  effortDays: number | ''
  startDate: string
  durationDays: number | ''
  endDate: string
  predecessor: string
  milestone: boolean
  complexity: string
  dependency: string
  acceptanceCriteria: string
  rowType: RowType
  includeInExport: boolean
}

export interface ResourceRow {
  id: string
  role: string
  phase: string
  location: string
  fte: number | ''
  allocationPercent: number | ''
  durationWeeks: number | ''
  effortHours: number | ''
  effortDays: number | ''
  ratePlaceholder: number | ''
  costPlaceholder: number | ''
  rowType: RowType
  includeInExport: boolean
}

export interface InfraTokenEstimate {
  monthlyUsers: number | ''
  concurrentUsers: number | ''
  requestsPerUserPerDay: number | ''
  workflowsPerMonth: number | ''
  averageDocumentsPerWorkflow: number | ''
  averagePagesPerDocument: number | ''
  averagePromptTokens: number | ''
  averageRetrievalContextTokens: number | ''
  averageCompletionTokens: number | ''
  agentStepsPerWorkflow: number | ''
  evaluationCallsPerWorkflow: number | ''
  embeddingRefreshFrequency: string
  environments: string[]
  runtimePlaceholder: string
  searchRetrievalPlaceholder: string
  storageGb: number | ''
  logRetentionDays: number | ''
  costPerKInputTokens: number | ''
  costPerKOutputTokens: number | ''
  ocrCostPerPage: number | ''
  embeddingCostPerKTokens: number | ''
  vectorSearchMonthlyCost: number | ''
  appRuntimeMonthlyCost: number | ''
  databaseMonthlyCost: number | ''
  monitoringMonthlyCost: number | ''
  storageCostPerGb: number | ''
  networkCostPlaceholder: number | ''
  // Calculated outputs
  calculatedWorkflowsPerMonth: number
  calculatedLlmCallsPerMonth: number
  calculatedInputTokensPerMonth: number
  calculatedOutputTokensPerMonth: number
  calculatedTotalTokensPerMonth: number
  calculatedOcrPagesPerMonth: number
  calculatedMonthlyTokenCost: number
  calculatedMonthlyOcrCost: number
  calculatedMonthlyInfraCost: number
  calculatedMonthlyRunRate: number
  calculatedAnnualRunRate: number
}

export interface AssumptionRow {
  id: string
  category: string
  description: string
  owner: string
  impact: string
  rowType: RowType
  includeInExport: boolean
}

export interface DependencyRow {
  id: string
  category: string
  description: string
  owner: string
  dueBy: string
  status: string
  impact: string
  rowType: RowType
  includeInExport: boolean
}

export interface RiskRow {
  id: string
  riskId: string
  raidType: string
  description: string
  probability: string
  impact: string
  severity: string
  mitigation: string
  owner: string
  status: string
  targetDate: string
  rowType: RowType
  includeInExport: boolean
}

// ─── ROI ──────────────────────────────────────────────────────────────────────

export interface ROIBusinessCase {
  // Current state
  currentMonthlyCaseVolume: number | ''
  averageHandlingTimePerCase: number | ''
  currentFteCount: number | ''
  averageFullyLoadedHourlyCost: number | ''
  currentErrorReworkRate: number | ''
  averageReworkCost: number | ''
  currentTurnaroundTime: string
  currentAnnualOperatingCost: number | ''
  currentLeakageAvoidableCost: number | ''
  // Projections
  expectedAutomationPercent: number | ''
  expectedHandlingTimeReductionPercent: number | ''
  expectedErrorReductionPercent: number | ''
  expectedThroughputImprovementPercent: number | ''
  expectedReworkReductionPercent: number | ''
  expectedCostAvoidance: number | ''
  expectedRevenueUplift: number | ''
  implementationCost: number | ''
  annualRunCost: number | ''
  discountRate: number | ''
  timeHorizonYears: number | ''
  // Calculated
  calculatedMonthlyHoursSaved: number
  calculatedAnnualHoursSaved: number
  calculatedAnnualProductivitySavings: number
  calculatedAnnualReworkSavings: number
  calculatedAnnualAvoidedCost: number
  calculatedAnnualNetBenefit: number
  calculatedPaybackMonths: number
  calculatedNpv: number
  calculatedRoiPercent: number
  calculatedThreeYearBenefit: number
  calculatedThreeYearCost: number
  savingsNarrative: string
}

// ─── Delivery Model ───────────────────────────────────────────────────────────

export interface DeliveryModelRow {
  id: string
  section: string
  label: string
  value: string
  notes: string
  rowType: RowType
  includeInExport: boolean
}

export interface DeliveryModel {
  engagementModel: string
  phaseApproach: DeliveryModelRow[]
  podComposition: DeliveryModelRow[]
  locationSplit: DeliveryModelRow[]
  supportTiers: DeliveryModelRow[]
  slaModel: DeliveryModelRow[]
  raciSummary: DeliveryModelRow[]
  trainingPlan: DeliveryModelRow[]
  ktPlan: DeliveryModelRow[]
  governanceCadence: DeliveryModelRow[]
}

// ─── Estimation Overview ──────────────────────────────────────────────────────

export interface EstimationOverview {
  useCaseName: string
  clientName: string
  cloudProvider: string
  selectedSolutionPattern: string
  secondaryPatterns: string[]
  complexityBand: string
  effortMultiplier: number
  winTheme: string
  executiveSummary: string
  businessGoal: string
  inScopeWorkflow: string
  outOfScope: string
  keySuccessMetrics: string
  targetMvpOutcomes: string
  targetProductionOutcomes: string
}

// ─── Estimation Workspace ─────────────────────────────────────────────────────

export interface EstimationWorkspace {
  overview: EstimationOverview
  components: ComponentRow[]
  agents: AgentRow[]
  wbs: WBSRow[]
  resources: ResourceRow[]
  infraTokens: InfraTokenEstimate
  assumptions: AssumptionRow[]
  finopsAssumptions: AssumptionRow[]
  dependencies: DependencyRow[]
  risks: RiskRow[]
  roi: ROIBusinessCase
  deliveryModel: DeliveryModel
}

// ─── Export ───────────────────────────────────────────────────────────────────

export interface ExportRecord {
  id: string
  format: ExportFormat
  fileName: string
  generatedAt: string
  sectionsIncluded: string[]
  validationStatus: WorkspaceStatus
}

export interface ExportPackage {
  selectedSections: string[]
  format: ExportFormat
  fileName: string
  generatedAt: string
  validationStatus: WorkspaceStatus
}

// ─── Root Workspace ───────────────────────────────────────────────────────────

export interface Workspace {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  status: WorkspaceStatus
  opportunity: Opportunity
  classification: SolutionClassification
  estimation: EstimationWorkspace
  exportHistory: ExportRecord[]
  validationErrors: ValidationError[]
}

// ─── Column Definition ────────────────────────────────────────────────────────

export type ColumnType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'calculated'

export interface ColumnDef<T = Record<string, unknown>> {
  key: keyof T
  label: string
  type: ColumnType
  width?: string
  options?: string[]
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  minWidth?: string
}
