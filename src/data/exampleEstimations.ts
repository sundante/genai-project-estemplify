import type { ComponentRow, ResourceRow, WBSRow, Workspace } from '../types'
import {
  createAssumptionRow,
  createComponentRow,
  createEmptyWorkspace,
  createResourceRow,
  createRiskRow,
  createWBSRow,
} from './emptyWorkspace'
import { calculateComponentCosts, calculateResourceEffort, calculateROI, deriveWbsEffortDays, deriveWbsSchedule } from '../utils/calculations'

export interface ExampleEstimation {
  id: 'basic-chatbot' | 'basic-rag' | 'ai-estimation'
  title: string
  subtitle: string
  industryUseCase: string
  searchTerms: string[]
  patternId: string
  patternName: string
  buildWorkspace: () => Workspace
}

export interface ComingSoonExampleEstimation {
  id: string
  title: string
  subtitle: string
  industryUseCase: string
  patternName: string
  searchTerms: string[]
  status: 'coming-soon'
}

export type ExampleCatalogueItem = ExampleEstimation | ComingSoonExampleEstimation

export function isAvailableExample(item: ExampleCatalogueItem): item is ExampleEstimation {
  return 'buildWorkspace' in item
}

function component(data: Partial<ComponentRow>): ComponentRow {
  const row = { ...createComponentRow(), ...data }
  return { ...row, ...calculateComponentCosts(row) }
}

function wbs(data: Partial<WBSRow>): WBSRow {
  const row = { ...createWBSRow(), ...data }
  const withEffort = { ...row, effortDays: deriveWbsEffortDays(row.hours ?? '') }
  return { ...withEffort, ...deriveWbsSchedule(withEffort) }
}

function resource(data: Partial<ResourceRow>): ResourceRow {
  const row = { ...createResourceRow(), ...data }
  const { effortHours, effortDays, cost } = calculateResourceEffort(row)
  return { ...row, effortHours, effortDays, costPlaceholder: cost }
}

function baseWorkspace(name: string): Workspace {
  const ws = createEmptyWorkspace()
  ws.name = name
  return ws
}

function buildBasicChatbot(): Workspace {
  const ws = baseWorkspace('Example - Basic Chatbot Estimation')
  ws.opportunity = {
    ...ws.opportunity,
    clientName: 'Northstar Health Plan',
    opportunityName: 'Member Benefits Chatbot MVP',
    useCaseName: 'Member Benefits Chatbot',
    marketSegment: 'Payer',
    businessFunction: 'Member Experience',
    opportunityStage: 'MVP Planning',
    engagementType: 'MVP',
    commercialModel: 'Fixed Price',
    budgetIndicator: 'Medium',
    timelineExpectation: '6–8 weeks',
    complianceFlags: ['HIPAA', 'PHI/PII', 'Audit-grade logging'],
    integrationLandscape: ['API integration', 'CRM integration'],
    dataSources: ['Knowledge Base', 'Policies', 'APIs'],
    businessProblem: 'Members call support teams for benefit eligibility, coverage explanations, and common plan questions that can be answered from approved knowledge sources.',
    currentManualProcess: 'Members search portals or call support agents. Agents manually inspect benefit documents and CRM notes.',
    desiredFutureState: 'Members use a guided chatbot for approved benefit questions with escalation to live support when confidence is low.',
    painPoints: 'High call volume, inconsistent answers, long wait times, and limited self-service.',
    targetPersonas: 'Members, support agents, member experience leaders.',
    expectedOutcomes: 'Deflect common inquiries, improve response consistency, and reduce average handling time.',
    successMetrics: 'Containment rate, answer helpfulness, escalation rate, CSAT, average handling time reduction.',
    knownConstraints: 'No medical advice. Responses must cite approved sources and support audit review.',
  }
  ws.classification = {
    ...ws.classification,
    selectedPattern: 'basic-chatbot',
    selectedPatternName: 'Basic Chatbot',
    complexityBand: 'Standard',
    effortMultiplier: 1,
    recommendationReason: 'The use case is a bounded conversational assistant with controlled intents, approved knowledge, and escalation.',
    architectureImplications: 'Use a web chat UI, API orchestration, LLM response generation, guardrails, audit logging, and CRM handoff.',
  }
  ws.estimation.overview = {
    ...ws.estimation.overview,
    clientName: ws.opportunity.clientName,
    useCaseName: ws.opportunity.useCaseName,
    cloudProvider: 'Cloud Agnostic',
    selectedSolutionPattern: 'basic-chatbot',
    complexityBand: 'Standard',
    effortMultiplier: 1,
    winTheme: 'Fast, governed member self-service for benefit questions.',
    executiveSummary: 'Build an MVP chatbot that answers common member benefit questions from approved content and escalates low-confidence interactions to support.',
    businessGoal: 'Reduce support burden while improving member experience and answer consistency.',
    inScopeWorkflow: 'Web chat, benefit FAQ retrieval, source citation, escalation capture, audit logging, and MVP analytics.',
    outOfScope: 'Medical advice, claims adjudication, production call-center replacement, and multilingual support.',
    keySuccessMetrics: 'Containment rate, answer quality, escalation rate, CSAT, and support deflection.',
    targetMvpOutcomes: 'Working chatbot for top benefit questions with logging and escalation.',
    targetProductionOutcomes: 'Expanded content coverage, monitoring, support integration, and governance workflow.',
  }
  ws.estimation.components = [
    component({ componentCategory: 'Frontend / UI', logicalComponent: 'Member Chat UI', cloudProviderMapping: 'Web app / portal widget', requiredOptional: 'Required', purpose: 'Member-facing chat interface', costDriver: 'Monthly active users', sizingBasis: 'Members', unit: 'MAU', quantity: 5000, monthlyUnitCost: 0.02 }),
    component({ componentCategory: 'Orchestration', logicalComponent: 'Conversation Orchestrator', cloudProviderMapping: 'Serverless/API service', requiredOptional: 'Required', purpose: 'Controls prompt flow, guardrails, and escalation', costDriver: 'Requests', sizingBasis: 'Requests', unit: 'K calls', quantity: 60, monthlyUnitCost: 1.5 }),
    component({ componentCategory: 'LLM / Foundation Model', logicalComponent: 'LLM Response Service', cloudProviderMapping: 'Azure OpenAI / Bedrock / Vertex AI', requiredOptional: 'Required', purpose: 'Generate grounded answers', costDriver: 'Token volume', llmModel: 'Low-latency GPT-class model', monthlyInputTokensK: 18000, monthlyOutputTokensK: 5000, costPerKInputTokens: 0.0005, costPerKOutputTokens: 0.0015 }),
    component({ componentCategory: 'Monitoring / Observability', logicalComponent: 'Conversation Audit Log', cloudProviderMapping: 'Logging/analytics store', requiredOptional: 'Required', purpose: 'Auditability and support review', costDriver: 'Retention and event volume', sizingBasis: 'Events', unit: 'K events', quantity: 70, monthlyUnitCost: 0.35 }),
  ]
  ws.estimation.wbs = [
    wbs({ phase: 'Discovery', epic: 'Use Case Framing', task: 'Confirm member chatbot scope and top intents', deliverable: 'Intent backlog', ownerRole: 'Solution Architect', hours: 24, startDate: '2026-07-01', durationDays: 3 }),
    wbs({ phase: 'MVP', epic: 'Chat Experience', task: 'Build chat UI and API orchestration', deliverable: 'Chat MVP', ownerRole: 'Full-stack Engineer', hours: 80, startDate: '2026-07-06', durationDays: 10 }),
    wbs({ phase: 'MVP', epic: 'AI Layer', task: 'Configure prompts, grounding, safety responses, and escalation', deliverable: 'Prompt and guardrail pack', ownerRole: 'Prompt Engineer', hours: 56, startDate: '2026-07-08', durationDays: 8 }),
    wbs({ phase: 'Pilot', epic: 'Validation', task: 'Test responses against approved benefit scenarios', deliverable: 'Validation report', ownerRole: 'QA/Validation', hours: 40, startDate: '2026-07-20', durationDays: 5 }),
  ]
  ws.estimation.resources = [
    resource({ role: 'Solution Architect', phase: 'Discovery', location: 'Onshore', fte: 0.5, allocationPercent: 60, durationWeeks: 2, ratePlaceholder: 1200 }),
    resource({ role: 'Full-stack Engineer', phase: 'MVP', location: 'Offshore', fte: 1, allocationPercent: 100, durationWeeks: 3, ratePlaceholder: 800 }),
    resource({ role: 'Prompt Engineer', phase: 'MVP', location: 'Offshore', fte: 0.5, allocationPercent: 80, durationWeeks: 3, ratePlaceholder: 750 }),
    resource({ role: 'QA/Validation', phase: 'Pilot', location: 'Offshore', fte: 0.5, allocationPercent: 75, durationWeeks: 2, ratePlaceholder: 650 }),
  ]
  ws.estimation.assumptions = [
    { ...createAssumptionRow(), category: 'Data', description: 'Approved benefit FAQs and policy summaries are available before MVP build.', owner: 'Client', impact: 'Delays prompt grounding and test coverage.' },
    { ...createAssumptionRow(), category: 'Compliance', description: 'Chatbot will not provide medical advice or plan-specific adjudication decisions.', owner: 'Solution Architect', impact: 'Requires scope and disclaimer changes if expanded.' },
  ]
  ws.estimation.risks = [
    { ...createRiskRow(1), description: 'Low-quality source content may reduce answer accuracy.', probability: 'Medium', impact: 'High', severity: 'High', mitigation: 'Content readiness review and curated test set.', owner: 'Client/Product', targetDate: '2026-07-05' },
  ]
  ws.estimation.roi = {
    ...ws.estimation.roi,
    currentMonthlyCaseVolume: 18000,
    averageHandlingTimePerCase: 8,
    currentFteCount: 18,
    averageFullyLoadedHourlyCost: 58,
    currentErrorReworkRate: 6,
    averageReworkCost: 35,
    currentTurnaroundTime: 'Same day support queue with peak-hour backlog',
    currentAnnualOperatingCost: 1250000,
    currentLeakageAvoidableCost: 50000,
    expectedAutomationPercent: 30,
    expectedHandlingTimeReductionPercent: 18,
    expectedErrorReductionPercent: 20,
    expectedThroughputImprovementPercent: 25,
    expectedReworkReductionPercent: 15,
    expectedCostAvoidance: 40000,
    expectedRevenueUplift: 0,
    implementationCost: 185000,
    annualRunCost: 45000,
    discountRate: 8,
    timeHorizonYears: 3,
  }
  ws.estimation.roi = { ...ws.estimation.roi, ...calculateROI(ws.estimation.roi) }
  return ws
}

function buildBasicRag(): Workspace {
  const ws = baseWorkspace('Example - Basic RAG Estimation')
  ws.opportunity = {
    ...ws.opportunity,
    clientName: 'Evergreen Provider Network',
    opportunityName: 'Clinical Policy Knowledge Assistant',
    useCaseName: 'Provider Policy RAG Assistant',
    marketSegment: 'Provider',
    businessFunction: 'Clinical Workflow',
    opportunityStage: 'MVP Planning',
    engagementType: 'MVP',
    commercialModel: 'T&M',
    budgetIndicator: 'Medium',
    timelineExpectation: '8–12 weeks',
    complianceFlags: ['HIPAA', 'PHI/PII', 'Audit-grade logging'],
    integrationLandscape: ['Document repository integration', 'API integration'],
    dataSources: ['Documents', 'Guidelines', 'Knowledge Base', 'Scanned PDFs'],
    businessProblem: 'Clinical operations teams struggle to find current policy guidance across scattered PDF documents and internal repositories.',
    currentManualProcess: 'Users search folders and policy portals manually, then interpret long documents without source traceability.',
    desiredFutureState: 'A RAG assistant answers policy questions with citations to approved source documents.',
    painPoints: 'Slow search, inconsistent interpretation, stale documents, and weak traceability.',
    targetPersonas: 'Clinical operations analysts, care management leaders, policy SMEs.',
    expectedOutcomes: 'Faster policy lookup, better citation traceability, improved operational consistency.',
    successMetrics: 'Retrieval precision, answer groundedness, time saved per question, SME acceptance rate.',
    knownConstraints: 'Document access permissions and source freshness must be governed.',
  }
  ws.classification = {
    ...ws.classification,
    selectedPattern: 'basic-rag',
    selectedPatternName: 'Basic RAG',
    complexityBand: 'Standard',
    effortMultiplier: 1,
    recommendationReason: 'The solution centers on document ingestion, vector retrieval, grounded answer generation, and citations.',
    architectureImplications: 'Requires document parsing, embeddings, vector store, retrieval API, answer generation, and evaluation set.',
  }
  ws.estimation.overview = {
    ...ws.estimation.overview,
    clientName: ws.opportunity.clientName,
    useCaseName: ws.opportunity.useCaseName,
    cloudProvider: 'Cloud Agnostic',
    selectedSolutionPattern: 'basic-rag',
    complexityBand: 'Standard',
    effortMultiplier: 1,
    winTheme: 'Cited answers from approved provider policy content.',
    executiveSummary: 'Build a retrieval-augmented assistant that answers clinical policy questions from approved documents with citations and feedback capture.',
    businessGoal: 'Reduce policy lookup time and improve consistency in clinical operations decisions.',
    inScopeWorkflow: 'Document ingestion, chunking, embeddings, vector search, RAG answer flow, citation display, and evaluation harness.',
    outOfScope: 'EHR writeback, automated clinical decisions, multimodal imaging content, and real-time policy authoring.',
    keySuccessMetrics: 'Retrieval precision, grounded answer score, SME acceptance, time saved.',
    targetMvpOutcomes: 'Assistant answers selected policy questions with citations over curated source documents.',
    targetProductionOutcomes: 'Scheduled content refresh, role-based access, monitoring, and expanded policy corpus.',
  }
  ws.estimation.components = [
    component({ componentCategory: 'Document Processing', logicalComponent: 'PDF Ingestion Pipeline', cloudProviderMapping: 'Document parser / OCR service', requiredOptional: 'Required', purpose: 'Extract text and metadata from policy PDFs', costDriver: 'Pages processed', sizingBasis: 'Pages', unit: 'K pages', quantity: 20, monthlyUnitCost: 2.5 }),
    component({ componentCategory: 'Embedding Model', logicalComponent: 'Embedding Service', cloudProviderMapping: 'Embedding API', requiredOptional: 'Required', purpose: 'Create document embeddings', costDriver: 'Embedding tokens', monthlyInputTokensK: 12000, costPerKInputTokens: 0.0001 }),
    component({ componentCategory: 'Vector Store', logicalComponent: 'Policy Vector Index', cloudProviderMapping: 'Vector DB / cognitive search', requiredOptional: 'Required', purpose: 'Retrieve relevant policy chunks', costDriver: 'Index size and queries', sizingBasis: 'Vectors', unit: 'K vectors', quantity: 250, monthlyUnitCost: 0.08 }),
    component({ componentCategory: 'LLM / Foundation Model', logicalComponent: 'Grounded Answer Generator', cloudProviderMapping: 'Azure OpenAI / Bedrock / Vertex AI', requiredOptional: 'Required', purpose: 'Generate cited answers from retrieved context', costDriver: 'Token volume', llmModel: 'GPT-class RAG model', monthlyInputTokensK: 30000, monthlyOutputTokensK: 8000, costPerKInputTokens: 0.0005, costPerKOutputTokens: 0.0015 }),
  ]
  ws.estimation.wbs = [
    wbs({ phase: 'Discovery', epic: 'Content Readiness', task: 'Assess policy corpus and metadata quality', deliverable: 'Content readiness findings', ownerRole: 'Data Engineer', hours: 32, startDate: '2026-07-01', durationDays: 4 }),
    wbs({ phase: 'MVP', epic: 'RAG Pipeline', task: 'Build ingestion, chunking, embedding, and vector indexing flow', deliverable: 'RAG ingestion pipeline', ownerRole: 'Data Engineer', hours: 96, startDate: '2026-07-06', durationDays: 12 }),
    wbs({ phase: 'MVP', epic: 'AI Layer', task: 'Configure retrieval prompts, citation behavior, and fallback handling', deliverable: 'RAG prompt pack', ownerRole: 'AI/ML Engineer', hours: 72, startDate: '2026-07-10', durationDays: 9 }),
    wbs({ phase: 'Pilot', epic: 'Evaluation', task: 'Run SME evaluation against policy question set', deliverable: 'Evaluation scorecard', ownerRole: 'QA/Validation', hours: 48, startDate: '2026-07-24', durationDays: 6 }),
  ]
  ws.estimation.resources = [
    resource({ role: 'Solution Architect', phase: 'Discovery', location: 'Onshore', fte: 0.4, allocationPercent: 50, durationWeeks: 2, ratePlaceholder: 1200 }),
    resource({ role: 'Data Engineer', phase: 'MVP', location: 'Offshore', fte: 1, allocationPercent: 100, durationWeeks: 4, ratePlaceholder: 800 }),
    resource({ role: 'AI/ML Engineer', phase: 'MVP', location: 'Offshore', fte: 1, allocationPercent: 80, durationWeeks: 4, ratePlaceholder: 900 }),
    resource({ role: 'QA/Validation', phase: 'Pilot', location: 'Offshore', fte: 0.5, allocationPercent: 75, durationWeeks: 2, ratePlaceholder: 650 }),
  ]
  ws.estimation.assumptions = [
    { ...createAssumptionRow(), category: 'Data', description: 'Policy documents are approved for use and can be extracted into text.', owner: 'Client', impact: 'OCR and content cleansing effort may increase.' },
    { ...createAssumptionRow(), category: 'Governance', description: 'SMEs will provide evaluation questions and acceptance criteria.', owner: 'Client SME', impact: 'Evaluation timeline may slip.' },
  ]
  ws.estimation.risks = [
    { ...createRiskRow(1), description: 'Scanned or stale documents may reduce retrieval quality.', probability: 'Medium', impact: 'High', severity: 'High', mitigation: 'Run content profiling and define source refresh process.', owner: 'Data Lead', targetDate: '2026-07-08' },
  ]
  ws.estimation.roi = {
    ...ws.estimation.roi,
    currentMonthlyCaseVolume: 6500,
    averageHandlingTimePerCase: 18,
    currentFteCount: 10,
    averageFullyLoadedHourlyCost: 72,
    currentErrorReworkRate: 8,
    averageReworkCost: 90,
    currentTurnaroundTime: '1-3 business days for policy interpretation',
    currentAnnualOperatingCost: 980000,
    currentLeakageAvoidableCost: 120000,
    expectedAutomationPercent: 25,
    expectedHandlingTimeReductionPercent: 28,
    expectedErrorReductionPercent: 25,
    expectedThroughputImprovementPercent: 30,
    expectedReworkReductionPercent: 20,
    expectedCostAvoidance: 75000,
    expectedRevenueUplift: 0,
    implementationCost: 260000,
    annualRunCost: 70000,
    discountRate: 8,
    timeHorizonYears: 3,
  }
  ws.estimation.roi = { ...ws.estimation.roi, ...calculateROI(ws.estimation.roi) }
  return ws
}

function buildAiEstimation(): Workspace {
  const ws = baseWorkspace('Example - AI Estimation Template')
  ws.opportunity = {
    ...ws.opportunity,
    clientName: 'Citius Health Enterprise',
    opportunityName: 'Enterprise AI Intake and Automation MVP',
    useCaseName: 'AI Operations Estimation Template',
    marketSegment: 'Internal Enterprise',
    businessFunction: 'Enterprise Knowledge',
    opportunityStage: 'Proposal',
    engagementType: 'Pilot',
    commercialModel: 'Hybrid',
    budgetIndicator: 'Strategic',
    timelineExpectation: '3–6 months',
    complianceFlags: ['SOC2', 'PHI/PII', 'Audit-grade logging', 'Client-specific security review'],
    integrationLandscape: ['API integration', 'Enterprise integration', 'Data warehouse integration'],
    dataSources: ['Structured Data', 'Documents', 'APIs', 'Knowledge Base', 'Logs'],
    businessProblem: 'Enterprise teams need a repeatable AI estimation and delivery approach for multiple candidate use cases with consistent governance.',
    currentManualProcess: 'Teams estimate AI opportunities from scratch with inconsistent assumptions, resourcing, and component costing.',
    desiredFutureState: 'A reusable estimation approach with standard components, WBS, resource loading, assumptions, and export-ready package.',
    painPoints: 'Slow proposal cycles, inconsistent scope, limited cost traceability, and unclear AI delivery roles.',
    targetPersonas: 'AI practice leaders, solution architects, delivery managers, client stakeholders.',
    expectedOutcomes: 'Faster estimation, reusable delivery patterns, clearer resource loading, and better proposal quality.',
    successMetrics: 'Estimation cycle time, reuse rate, proposal quality, forecast accuracy, stakeholder acceptance.',
    knownConstraints: 'Examples are guidance only and must be tailored per client opportunity.',
  }
  ws.classification = {
    ...ws.classification,
    selectedPattern: 'advanced-rag',
    selectedPatternName: 'Advanced / Hybrid RAG',
    complexityBand: 'Enhanced',
    effortMultiplier: 1.25,
    recommendationReason: 'The template combines solutioning, components, WBS, resources, and governance for a reusable AI estimation package.',
    architectureImplications: 'Use modular components, configurable WBS, resource loading tied to phases, and export-ready assumptions.',
  }
  ws.estimation.overview = {
    ...ws.estimation.overview,
    clientName: ws.opportunity.clientName,
    useCaseName: ws.opportunity.useCaseName,
    cloudProvider: 'Cloud Agnostic',
    selectedSolutionPattern: 'advanced-rag',
    complexityBand: 'Enhanced',
    effortMultiplier: 1.25,
    winTheme: 'Reusable AI estimation guidance for faster, higher-quality proposals.',
    executiveSummary: 'This example demonstrates how to structure an AI estimation package across intake, solution pattern, components, WBS, resources, assumptions, risks, and exports.',
    businessGoal: 'Standardize how AI opportunities are estimated and communicated.',
    inScopeWorkflow: 'Reusable AI estimation shell, components, WBS, resource loading, cost drivers, risks, and governance assumptions.',
    outOfScope: 'Client-specific legal terms, final production architecture, and committed pricing.',
    keySuccessMetrics: 'Reusable estimate completeness, role coverage, phase coverage, and export readiness.',
    targetMvpOutcomes: 'A complete editable estimation example for AI Practice teams.',
    targetProductionOutcomes: 'A governed estimation operating model with reusable examples and templates.',
  }
  ws.estimation.components = [
    component({ componentCategory: 'Frontend / UI', logicalComponent: 'Estimator Workbench UI', cloudProviderMapping: 'React web app', requiredOptional: 'Required', purpose: 'Capture estimation inputs', costDriver: 'Users', sizingBasis: 'Users', unit: 'Seats', quantity: 25, monthlyUnitCost: 5 }),
    component({ componentCategory: 'Data Pipeline', logicalComponent: 'Example Data Seeder', cloudProviderMapping: 'Application data module', requiredOptional: 'Required', purpose: 'Seed example estimation content', costDriver: 'Maintenance effort', sizingBasis: 'Examples', unit: 'Examples', quantity: 3, monthlyUnitCost: 25 }),
    component({ componentCategory: 'LLM / Foundation Model', logicalComponent: 'Optional Proposal Narrative Assistant', cloudProviderMapping: 'LLM API', requiredOptional: 'Optional', purpose: 'Generate first-draft proposal narrative from structured estimate', costDriver: 'Token volume', llmModel: 'GPT-class model', monthlyInputTokensK: 10000, monthlyOutputTokensK: 3000, costPerKInputTokens: 0.0005, costPerKOutputTokens: 0.0015 }),
    component({ componentCategory: 'Evaluation / Testing', logicalComponent: 'Estimate Completeness Checks', cloudProviderMapping: 'Application validation', requiredOptional: 'Required', purpose: 'Check missing WBS/resources/components before export', costDriver: 'Rule count', sizingBasis: 'Rules', unit: 'Rules', quantity: 20, monthlyUnitCost: 1 }),
  ]
  ws.estimation.wbs = [
    wbs({ phase: 'Discovery', epic: 'Opportunity Framing', task: 'Capture intake and classify solution pattern', deliverable: 'Qualified opportunity profile', ownerRole: 'Solution Architect', hours: 24, startDate: '2026-07-01', durationDays: 3 }),
    wbs({ phase: 'Discovery', epic: 'Architecture', task: 'Define reusable component model and cost drivers', deliverable: 'Component inventory', ownerRole: 'GenAI Architect', hours: 40, startDate: '2026-07-04', durationDays: 5 }),
    wbs({ phase: 'MVP', epic: 'Estimation Build', task: 'Build WBS, resource loading, and export package', deliverable: 'Estimation workspace', ownerRole: 'Full-stack Engineer', hours: 96, startDate: '2026-07-10', durationDays: 12 }),
    wbs({ phase: 'Pilot', epic: 'Governance', task: 'Validate example assumptions, risks, and resource model', deliverable: 'Validated estimation example', ownerRole: 'PM/Scrum Master', hours: 32, startDate: '2026-07-24', durationDays: 4 }),
  ]
  ws.estimation.resources = [
    resource({ role: 'Solution Architect', phase: 'Discovery', location: 'Onshore', fte: 0.5, allocationPercent: 60, durationWeeks: 2, ratePlaceholder: 1200 }),
    resource({ role: 'GenAI Architect', phase: 'Discovery', location: 'Onshore', fte: 0.5, allocationPercent: 60, durationWeeks: 2, ratePlaceholder: 1300 }),
    resource({ role: 'Full-stack Engineer', phase: 'MVP', location: 'Offshore', fte: 1, allocationPercent: 100, durationWeeks: 4, ratePlaceholder: 800 }),
    resource({ role: 'PM/Scrum Master', phase: 'Pilot', location: 'Onshore', fte: 0.25, allocationPercent: 50, durationWeeks: 4, ratePlaceholder: 1000 }),
  ]
  ws.estimation.assumptions = [
    { ...createAssumptionRow(), category: 'Resource', description: 'AI Practice roles and rates are placeholders and must be adjusted per client/commercial model.', owner: 'Delivery Lead', impact: 'Cost estimate may be inaccurate if not tailored.' },
    { ...createAssumptionRow(), category: 'Governance', description: 'Examples are illustrative and not contractual delivery commitments.', owner: 'Solution Architect', impact: 'Proposal must be reviewed before client submission.' },
  ]
  ws.estimation.risks = [
    { ...createRiskRow(1), description: 'Users may treat seeded examples as final estimates without tailoring.', probability: 'Medium', impact: 'Medium', severity: 'Medium', mitigation: 'Label examples clearly and require explicit seed action.', owner: 'AI Practice', targetDate: '2026-07-01' },
  ]
  ws.estimation.roi = {
    ...ws.estimation.roi,
    currentMonthlyCaseVolume: 240,
    averageHandlingTimePerCase: 180,
    currentFteCount: 6,
    averageFullyLoadedHourlyCost: 95,
    currentErrorReworkRate: 12,
    averageReworkCost: 450,
    currentTurnaroundTime: '3-5 business days per estimation package',
    currentAnnualOperatingCost: 720000,
    currentLeakageAvoidableCost: 90000,
    expectedAutomationPercent: 35,
    expectedHandlingTimeReductionPercent: 32,
    expectedErrorReductionPercent: 25,
    expectedThroughputImprovementPercent: 40,
    expectedReworkReductionPercent: 30,
    expectedCostAvoidance: 85000,
    expectedRevenueUplift: 125000,
    implementationCost: 325000,
    annualRunCost: 90000,
    discountRate: 9,
    timeHorizonYears: 3,
  }
  ws.estimation.roi = { ...ws.estimation.roi, ...calculateROI(ws.estimation.roi) }
  return ws
}

export const EXAMPLE_ESTIMATIONS: ExampleEstimation[] = [
  {
    id: 'basic-chatbot',
    title: 'Basic Chatbot Estimation',
    subtitle: 'Payer member support chatbot MVP',
    industryUseCase: 'Member benefit questions, support deflection, and governed escalation.',
    searchTerms: ['chatbot', 'member support', 'benefits', 'payer', 'self service', 'call deflection', 'faq', 'conversation'],
    patternId: 'basic-chatbot',
    patternName: 'Basic Chatbot',
    buildWorkspace: buildBasicChatbot,
  },
  {
    id: 'basic-rag',
    title: 'Basic RAG Estimation',
    subtitle: 'Provider policy and guideline knowledge assistant',
    industryUseCase: 'Cited answers from approved provider policy content.',
    searchTerms: ['rag', 'retrieval', 'policy', 'guideline', 'provider', 'knowledge assistant', 'citations', 'documents', 'pdf'],
    patternId: 'basic-rag',
    patternName: 'Basic RAG',
    buildWorkspace: buildBasicRag,
  },
  {
    id: 'ai-estimation',
    title: 'AI Estimation Template',
    subtitle: 'Reusable AI Practice estimation package',
    industryUseCase: 'Structured estimation example spanning components, WBS, resources, assumptions, and risks.',
    searchTerms: ['ai estimation', 'practice', 'proposal', 'wbs', 'resource loading', 'components', 'governance', 'roi'],
    patternId: 'advanced-rag',
    patternName: 'Advanced / Hybrid RAG',
    buildWorkspace: buildAiEstimation,
  },
]

export const COMING_SOON_EXAMPLE_ESTIMATIONS: ComingSoonExampleEstimation[] = [
  {
    id: 'advanced-rag-wbs',
    title: 'Advanced RAG WBS',
    subtitle: 'Multi-source RAG with evaluation and governance',
    industryUseCase: 'Large document estates, hybrid retrieval, evaluation layers, and controlled rollout.',
    patternName: 'Advanced / Hybrid RAG',
    searchTerms: ['advanced rag', 'hybrid rag', 'multi source', 'evaluation', 'knowledge graph', 'governance'],
    status: 'coming-soon',
  },
  {
    id: 'agentic-orchestration',
    title: 'Agentic Orchestration',
    subtitle: 'Workflow automation with planner/tool execution',
    industryUseCase: 'Coordinated AI workflow automation across APIs, review queues, and enterprise tools.',
    patternName: 'Full Agentic Workflow',
    searchTerms: ['agentic', 'agents', 'orchestration', 'workflow', 'tool use', 'automation'],
    status: 'coming-soon',
  },
  {
    id: 'fine-tuned-model',
    title: 'Fine-tuned Model Estimation',
    subtitle: 'Domain adaptation and supervised tuning',
    industryUseCase: 'Fine-tuning or adapter-based model specialization for repeatable domain tasks.',
    patternName: 'Fine-tuned Model',
    searchTerms: ['fine tune', 'fine-tuned', 'model adaptation', 'training', 'domain model'],
    status: 'coming-soon',
  },
  {
    id: 'hybrid-genai-ml',
    title: 'Hybrid GenAI + ML Estimation',
    subtitle: 'GenAI combined with predictive/classical ML',
    industryUseCase: 'Use cases that combine generated explanations with scoring, prediction, or optimization models.',
    patternName: 'Hybrid GenAI + ML',
    searchTerms: ['hybrid', 'genai', 'machine learning', 'prediction', 'scoring', 'ml'],
    status: 'coming-soon',
  },
  {
    id: 'nl2sql',
    title: 'NL2SQL Estimation',
    subtitle: 'Talk-to-data and governed semantic query',
    industryUseCase: 'Business users ask natural-language questions over governed data models.',
    patternName: 'NL2SQL / Talk-to-Data',
    searchTerms: ['nl2sql', 'talk to data', 'analytics', 'sql', 'semantic layer', 'dashboard'],
    status: 'coming-soon',
  },
  {
    id: 'document-intelligence',
    title: 'Document Intelligence Estimation',
    subtitle: 'Extraction, classification, and summarization',
    industryUseCase: 'Document intake workflows for forms, clinical notes, contracts, claims, or correspondence.',
    patternName: 'Document Intelligence',
    searchTerms: ['document intelligence', 'extraction', 'classification', 'summarization', 'ocr', 'forms'],
    status: 'coming-soon',
  },
  {
    id: 'voice-agent',
    title: 'Voice Agent Estimation',
    subtitle: 'Voice and multimodal conversational workflow',
    industryUseCase: 'Voice-based assistant flows with ASR, TTS, routing, and transcript governance.',
    patternName: 'Voice / Multimodal Agent',
    searchTerms: ['voice', 'multimodal', 'asr', 'tts', 'call center', 'speech'],
    status: 'coming-soon',
  },
  {
    id: 'quality-trust',
    title: 'Q&T Evaluation Template',
    subtitle: 'Quality, trust, safety, and evaluation framework',
    industryUseCase: 'Evaluation harnesses, safety controls, monitoring, and AI governance acceptance gates.',
    patternName: 'Quality & Trust Layer',
    searchTerms: ['quality', 'trust', 'evaluation', 'safety', 'guardrails', 'monitoring'],
    status: 'coming-soon',
  },
]

export const EXAMPLE_ESTIMATION_CATALOGUE: ExampleCatalogueItem[] = [
  ...EXAMPLE_ESTIMATIONS,
  ...COMING_SOON_EXAMPLE_ESTIMATIONS,
]
