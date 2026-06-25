import type {
  Workspace,
  Opportunity,
  SolutionClassification,
  ComplexityScore,
  EstimationWorkspace,
  EstimationOverview,
  InfraTokenEstimate,
  ROIBusinessCase,
  DeliveryModel,
  ComponentRow,
  AgentRow,
  WBSRow,
  ResourceRow,
  AssumptionRow,
  DependencyRow,
  RiskRow,
  DeliveryModelRow,
} from '../types'
import { generateId } from '../utils/ids'
import { COMPLEXITY_DIMENSIONS } from './dropdownOptions'

export function createEmptyOpportunity(): Opportunity {
  return {
    clientName: '',
    opportunityName: '',
    useCaseName: '',
    marketSegment: '',
    businessFunction: '',
    opportunityStage: '',
    engagementType: '',
    commercialModel: '',
    budgetIndicator: '',
    timelineExpectation: '',
    complianceFlags: [],
    integrationLandscape: [],
    dataSources: [],
    businessProblem: '',
    currentManualProcess: '',
    desiredFutureState: '',
    painPoints: '',
    targetPersonas: '',
    expectedOutcomes: '',
    successMetrics: '',
    knownConstraints: '',
    notes: '',
  }
}

export function createEmptyComplexityScore(): ComplexityScore {
  return {
    dimensions: COMPLEXITY_DIMENSIONS.map(d => ({ ...d, score: 1 })),
    totalScore: 10,
    band: 'Standard',
    multiplier: 1.0,
    riskLevel: '',
    recommendedTeamSize: '',
    recommendedTimeline: '',
  }
}

export function createEmptyClassification(): SolutionClassification {
  return {
    selectedPattern: '',
    selectedPatternName: '',
    secondaryPatterns: [],
    recommendationReason: '',
    complexityBand: '',
    effortMultiplier: 1.0,
    architectureImplications: '',
    estimationImplications: '',
    complexityScore: createEmptyComplexityScore(),
    customPatterns: [],
  }
}

export function createEmptyOverview(): EstimationOverview {
  return {
    useCaseName: '',
    clientName: '',
    cloudProvider: '',
    selectedSolutionPattern: '',
    secondaryPatterns: [],
    complexityBand: '',
    effortMultiplier: 1.0,
    winTheme: '',
    executiveSummary: '',
    businessGoal: '',
    inScopeWorkflow: '',
    outOfScope: '',
    keySuccessMetrics: '',
    targetMvpOutcomes: '',
    targetProductionOutcomes: '',
  }
}

export function createEmptyInfraTokenEstimate(): InfraTokenEstimate {
  return {
    monthlyUsers: '',
    concurrentUsers: '',
    requestsPerUserPerDay: '',
    workflowsPerMonth: '',
    averageDocumentsPerWorkflow: '',
    averagePagesPerDocument: '',
    averagePromptTokens: '',
    averageRetrievalContextTokens: '',
    averageCompletionTokens: '',
    agentStepsPerWorkflow: '',
    evaluationCallsPerWorkflow: '',
    embeddingRefreshFrequency: '',
    environments: [],
    runtimePlaceholder: '',
    searchRetrievalPlaceholder: '',
    storageGb: '',
    logRetentionDays: '',
    costPerKInputTokens: '',
    costPerKOutputTokens: '',
    ocrCostPerPage: '',
    embeddingCostPerKTokens: '',
    vectorSearchMonthlyCost: '',
    appRuntimeMonthlyCost: '',
    databaseMonthlyCost: '',
    monitoringMonthlyCost: '',
    storageCostPerGb: '',
    networkCostPlaceholder: '',
    calculatedWorkflowsPerMonth: 0,
    calculatedLlmCallsPerMonth: 0,
    calculatedInputTokensPerMonth: 0,
    calculatedOutputTokensPerMonth: 0,
    calculatedTotalTokensPerMonth: 0,
    calculatedOcrPagesPerMonth: 0,
    calculatedMonthlyTokenCost: 0,
    calculatedMonthlyOcrCost: 0,
    calculatedMonthlyInfraCost: 0,
    calculatedMonthlyRunRate: 0,
    calculatedAnnualRunRate: 0,
  }
}

export function createEmptyROI(): ROIBusinessCase {
  return {
    currentMonthlyCaseVolume: '',
    averageHandlingTimePerCase: '',
    currentFteCount: '',
    averageFullyLoadedHourlyCost: '',
    currentErrorReworkRate: '',
    averageReworkCost: '',
    currentTurnaroundTime: '',
    currentAnnualOperatingCost: '',
    currentLeakageAvoidableCost: '',
    expectedAutomationPercent: '',
    expectedHandlingTimeReductionPercent: '',
    expectedErrorReductionPercent: '',
    expectedThroughputImprovementPercent: '',
    expectedReworkReductionPercent: '',
    expectedCostAvoidance: '',
    expectedRevenueUplift: '',
    implementationCost: '',
    annualRunCost: '',
    discountRate: '',
    timeHorizonYears: '',
    calculatedMonthlyHoursSaved: 0,
    calculatedAnnualHoursSaved: 0,
    calculatedAnnualProductivitySavings: 0,
    calculatedAnnualReworkSavings: 0,
    calculatedAnnualAvoidedCost: 0,
    calculatedAnnualNetBenefit: 0,
    calculatedPaybackMonths: 0,
    calculatedNpv: 0,
    calculatedRoiPercent: 0,
    calculatedThreeYearBenefit: 0,
    calculatedThreeYearCost: 0,
    savingsNarrative: '',
  }
}

export function createEmptyDeliveryModel(): DeliveryModel {
  return {
    engagementModel: '',
    phaseApproach: [],
    podComposition: [],
    locationSplit: [],
    supportTiers: [],
    slaModel: [],
    raciSummary: [],
    trainingPlan: [],
    ktPlan: [],
    governanceCadence: [],
  }
}

export function createEmptyEstimationWorkspace(): EstimationWorkspace {
  return {
    overview: createEmptyOverview(),
    components: [],
    agents: [],
    wbs: [],
    resources: [],
    infraTokens: createEmptyInfraTokenEstimate(),
    assumptions: [],
    finopsAssumptions: [],
    dependencies: [],
    risks: [],
    roi: createEmptyROI(),
    deliveryModel: createEmptyDeliveryModel(),
  }
}

export function createEmptyWorkspace(): Workspace {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    name: 'New Estimation Workspace',
    createdAt: now,
    updatedAt: now,
    status: 'Draft',
    opportunity: createEmptyOpportunity(),
    classification: createEmptyClassification(),
    estimation: createEmptyEstimationWorkspace(),
    exportHistory: [],
    validationErrors: [],
  }
}

// ─── Row factory functions ─────────────────────────────────────────────────────

export function createComponentRow(): ComponentRow {
  return {
    id: generateId(),
    componentCategory: '',
    logicalComponent: '',
    cloudProviderMapping: '',
    requiredOptional: '',
    selected: true,
    purpose: '',
    costDriver: '',
    sizingBasis: '',
    unit: '',
    quantity: '',
    monthlyUnitCost: '',
    calculatedMonthlyCost: 0,
    llmModel: '',
    monthlyInputTokensK: '',
    monthlyOutputTokensK: '',
    costPerKInputTokens: '',
    costPerKOutputTokens: '',
    calculatedMonthlyLlmCost: 0,
    notes: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createAgentRow(): AgentRow {
  return {
    id: generateId(),
    agentName: '',
    enabled: true,
    responsibility: '',
    inputs: '',
    outputs: '',
    toolsUsed: '',
    hitlTrigger: '',
    estimatedCallsPerWorkflow: '',
    auditNotes: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createWBSRow(): WBSRow {
  return {
    id: generateId(),
    phase: '',
    epic: '',
    task: '',
    deliverable: '',
    ownerRole: '',
    hours: '',
    effortDays: '',
    startDate: '',
    durationDays: '',
    endDate: '',
    predecessor: '',
    milestone: false,
    complexity: '',
    dependency: '',
    acceptanceCriteria: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createResourceRow(): ResourceRow {
  return {
    id: generateId(),
    role: '',
    phase: '',
    location: '',
    fte: '',
    allocationPercent: '',
    durationWeeks: '',
    effortHours: '',
    effortDays: '',
    ratePlaceholder: '',
    costPlaceholder: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createAssumptionRow(): AssumptionRow {
  return {
    id: generateId(),
    category: '',
    description: '',
    owner: '',
    impact: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createDependencyRow(): DependencyRow {
  return {
    id: generateId(),
    category: '',
    description: '',
    owner: '',
    dueBy: '',
    status: '',
    impact: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createRiskRow(index: number): RiskRow {
  return {
    id: generateId(),
    riskId: `R-${String(index).padStart(3, '0')}`,
    raidType: 'Risk',
    description: '',
    probability: '',
    impact: '',
    severity: '',
    mitigation: '',
    owner: '',
    status: 'Open',
    targetDate: '',
    rowType: 'custom',
    includeInExport: true,
  }
}

export function createDeliveryModelRow(section: string): DeliveryModelRow {
  return {
    id: generateId(),
    section,
    label: '',
    value: '',
    notes: '',
    rowType: 'custom',
    includeInExport: true,
  }
}
