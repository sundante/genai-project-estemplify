import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type RowType = 'master' | 'custom';

export interface WBSRow {
  id: string;
  phase: string;
  activity: string;
  deliverable: string;
  role: string;
  complexity: string;
  effortDays: number;
  dependency: string;
  acceptanceCriteria: string;
  rowType: RowType;
  includeInExport: boolean;
}

export interface ResourceRow {
  id: string;
  role: string;
  phase: string;
  allocation: number;
  durationWeeks: number;
  effortDays: number;
  ratePlaceholder: string;
  costPlaceholder: string;
  rowType: RowType;
  includeInExport: boolean;
}

export interface AssumptionRow {
  id: string;
  category: string;
  description: string;
  owner: string;
  impact: string;
  rowType: RowType;
  includeInExport: boolean;
}

export interface DependencyRow {
  id: string;
  category: string;
  description: string;
  owner: string;
  impact: string;
  rowType: RowType;
  includeInExport: boolean;
}

export interface RiskRow {
  id: string;
  riskId: string;
  description: string;
  probability: string;
  impact: string;
  mitigation: string;
  owner: string;
  rowType: RowType;
  includeInExport: boolean;
}

export interface InfraInputs {
  monthlyUsers: number;
  concurrentUsers: number;
  requestsPerUserPerDay: number;
  avgDocumentsPerWorkflow: number;
  avgPagesPerDocument: number;
  avgPromptTokens: number;
  avgRetrievalContextTokens: number;
  avgCompletionTokens: number;
  agentStepsPerWorkflow: number;
  evaluationCallsPerWorkflow: number;
  environments: string[];
  unitRateLLMInput: string;
  unitRateLLMOutput: string;
  unitRateEmbedding: string;
  unitRateOCR: string;
  unitRateStorage: string;
}

export interface IntakeData {
  clientName: string;
  opportunityName: string;
  marketSegment: string;
  businessFunction: string;
  opportunityStage: string;
  targetDeliveryType: string;
  businessProblem: string;
  currentProcess: string;
  desiredFutureState: string;
  targetUsers: string[];
  expectedOutcomes: string[];
  dataTypes: string[];
  sourceSystems: string[];
  phiPii: boolean;
  compliance: string;
}

export interface ComplexityScores {
  dataSources: number;
  dataTypes: number;
  integrationDepth: number;
  aiPattern: number;
  governanceNeed: number;
  userScale: number;
  complianceRequirement: number;
  groundTruthAvailability: number;
  smeValidationNeed: number;
  productionReadiness: number;
}

export interface AzureOverview {
  useCaseName: string;
  cloudProvider: string;
  solutionType: string;
  businessGoal: string;
}

export interface RoiInputs {
  currentEffortHoursPerWorkflow: number;
  currentFTECostPerHour: number;
  currentErrorRatePct: number;
  currentTurnaroundHours: number;
  projectedEffortReductionPct: number;
  projectedErrorReductionPct: number;
  projectedTurnaroundReductionPct: number;
  implementationCostPlaceholder: string;
  notes: string;
}

export interface EstimationBasis {
  hoursPerDay: number;
  daysPerWeek: number;
  defaultHourlyRate: number;
  resourceEffortFormula: string;
  resourceCostFormula: string;
  infraVolumeFormula: string;
  tokenCostFormula: string;
  roiFormula: string;
}

export type ClassificationSource = 'default' | 'custom';
export type ClassificationStatus = 'available' | 'planned' | 'custom';

export interface ClassificationPattern {
  id: string;
  name: string;
  patternType: string;
  whenToUse: string;
  capabilities: string[];
  complexity: string;
  timeline: string;
  triggers: string[];
  architectureImplications: string;
  estimationImplications: string;
  deliveryNotes: string;
  source: ClassificationSource;
  status: ClassificationStatus;
  includeInExport: boolean;
}

export interface ClassificationState {
  selectedPattern: string;
  patterns: ClassificationPattern[];
}

export interface WorkbenchState {
  darkMode: boolean;
  intake: IntakeData;
  classification: ClassificationState;
  complexity: ComplexityScores;
  azure: {
    mode: 'master' | 'working-copy';
    overview: AzureOverview;
    selectedComponents: string[];
    wbs: WBSRow[];
    resources: ResourceRow[];
    infra: InfraInputs;
    roi: RoiInputs;
    estimationBasis: EstimationBasis;
    assumptions: AssumptionRow[];
    dependencies: DependencyRow[];
    risks: RiskRow[];
    unsavedChanges: boolean;
  };
  validationStatus: 'draft' | 'validated' | 'ready-to-export';
}

const defaultWBS: WBSRow[] = [
  { id: 'w1', phase: 'Discovery', activity: 'Discovery and requirement validation', deliverable: 'Requirements Document', role: 'Business Analyst', complexity: 'Low', effortDays: 5, dependency: '', acceptanceCriteria: 'Sign-off from stakeholders', rowType: 'master', includeInExport: true },
  { id: 'w2', phase: 'Discovery', activity: 'Current workflow analysis', deliverable: 'Workflow Process Map', role: 'Business Analyst', complexity: 'Medium', effortDays: 3, dependency: '', acceptanceCriteria: 'As-is workflow documented', rowType: 'master', includeInExport: true },
  { id: 'w3', phase: 'Discovery', activity: 'Data and document inventory', deliverable: 'Data Inventory Report', role: 'Data Engineer', complexity: 'Medium', effortDays: 3, dependency: 'w1', acceptanceCriteria: 'All data sources catalogued', rowType: 'master', includeInExport: true },
  { id: 'w4', phase: 'Design', activity: 'Azure architecture design', deliverable: 'Architecture Diagram & Decision Record', role: 'Solution Architect', complexity: 'High', effortDays: 5, dependency: 'w3', acceptanceCriteria: 'Architecture reviewed and approved', rowType: 'master', includeInExport: true },
  { id: 'w5', phase: 'Design', activity: 'Agent workflow design', deliverable: 'Agent Orchestration Design Document', role: 'GenAI Architect', complexity: 'High', effortDays: 5, dependency: 'w4', acceptanceCriteria: 'Agent flow approved by stakeholders', rowType: 'master', includeInExport: true },
  { id: 'w6', phase: 'Design', activity: 'Prompt and tool design', deliverable: 'Prompt Library & Tool Specifications', role: 'GenAI Architect', complexity: 'Medium', effortDays: 4, dependency: 'w5', acceptanceCriteria: 'Prompts peer-reviewed', rowType: 'master', includeInExport: true },
  { id: 'w7', phase: 'Build', activity: 'RAG ingestion pipeline', deliverable: 'Document Ingestion & Embedding Pipeline', role: 'AI/ML Engineer', complexity: 'High', effortDays: 8, dependency: 'w5', acceptanceCriteria: 'Pipeline ingests and indexes documents', rowType: 'master', includeInExport: true },
  { id: 'w8', phase: 'Build', activity: 'Document extraction pipeline', deliverable: 'OCR & Extraction Pipeline', role: 'AI/ML Engineer', complexity: 'High', effortDays: 5, dependency: 'w7', acceptanceCriteria: 'OCR accuracy >90% on test set', rowType: 'master', includeInExport: true },
  { id: 'w9', phase: 'Build', activity: 'Policy and guideline retrieval', deliverable: 'Retrieval & Ranking Module', role: 'AI/ML Engineer', complexity: 'High', effortDays: 5, dependency: 'w7', acceptanceCriteria: 'Top-3 retrieval accuracy validated', rowType: 'master', includeInExport: true },
  { id: 'w10', phase: 'Build', activity: 'Evidence mapping logic', deliverable: 'Evidence-to-Policy Mapping Module', role: 'AI/ML Engineer', complexity: 'High', effortDays: 6, dependency: 'w8', acceptanceCriteria: 'Mapping accuracy tested', rowType: 'master', includeInExport: true },
  { id: 'w11', phase: 'Build', activity: 'Recommendation generation', deliverable: 'Recommendation Engine', role: 'AI/ML Engineer', complexity: 'High', effortDays: 6, dependency: 'w10', acceptanceCriteria: 'Recommendations generated with rationale', rowType: 'master', includeInExport: true },
  { id: 'w12', phase: 'Build', activity: 'HITL review screen', deliverable: 'Human-in-the-Loop Review UI', role: 'Frontend Engineer', complexity: 'Medium', effortDays: 5, dependency: 'w11', acceptanceCriteria: 'Reviewers can approve/deny recommendations', rowType: 'master', includeInExport: true },
  { id: 'w13', phase: 'Build', activity: 'Q&T evaluation setup', deliverable: 'Quality & Trust Evaluation Framework', role: 'Q&T Engineer', complexity: 'High', effortDays: 5, dependency: 'w11', acceptanceCriteria: 'Evaluation metrics defined and baseline set', rowType: 'master', includeInExport: true },
  { id: 'w14', phase: 'Build', activity: 'Security and PHI controls', deliverable: 'Security & Compliance Layer', role: 'Cloud Engineer', complexity: 'High', effortDays: 5, dependency: 'w4', acceptanceCriteria: 'PHI controls validated by security team', rowType: 'master', includeInExport: true },
  { id: 'w15', phase: 'Build', activity: 'DevOps pipeline setup', deliverable: 'CI/CD Pipeline Configuration', role: 'Cloud Engineer', complexity: 'Medium', effortDays: 4, dependency: 'w4', acceptanceCriteria: 'Pipelines running in Dev and QA', rowType: 'master', includeInExport: true },
  { id: 'w16', phase: 'Build', activity: 'System integration', deliverable: 'Integration Layer & API Connectors', role: 'Backend Engineer', complexity: 'High', effortDays: 8, dependency: 'w15', acceptanceCriteria: 'All integration tests pass', rowType: 'master', includeInExport: true },
  { id: 'w17', phase: 'Test', activity: 'Testing and validation', deliverable: 'Test Report & Bug Backlog', role: 'QA Engineer', complexity: 'Medium', effortDays: 8, dependency: 'w16', acceptanceCriteria: 'All P0/P1 defects resolved', rowType: 'master', includeInExport: true },
  { id: 'w18', phase: 'Test', activity: 'UAT support', deliverable: 'UAT Sign-off Document', role: 'Business Analyst', complexity: 'Medium', effortDays: 5, dependency: 'w17', acceptanceCriteria: 'UAT sign-off obtained', rowType: 'master', includeInExport: true },
  { id: 'w19', phase: 'Deploy', activity: 'Deployment', deliverable: 'Production Deployment Record', role: 'Cloud Engineer', complexity: 'High', effortDays: 3, dependency: 'w18', acceptanceCriteria: 'System live in production', rowType: 'master', includeInExport: true },
  { id: 'w20', phase: 'KT', activity: 'Knowledge transfer', deliverable: 'KT Documentation & Runbook', role: 'Solution Architect', complexity: 'Low', effortDays: 3, dependency: 'w19', acceptanceCriteria: 'KT sessions completed', rowType: 'master', includeInExport: true },
];

const defaultResources: ResourceRow[] = [
  { id: 'r1', role: 'Solution Architect', phase: 'All Phases', allocation: 50, durationWeeks: 16, effortDays: 40, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r2', role: 'GenAI Architect', phase: 'Design + Build', allocation: 100, durationWeeks: 12, effortDays: 60, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r3', role: 'AI/ML Engineer', phase: 'Build + Test', allocation: 100, durationWeeks: 12, effortDays: 60, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r4', role: 'Backend Engineer', phase: 'Build', allocation: 100, durationWeeks: 8, effortDays: 40, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r5', role: 'Data Engineer', phase: 'Discovery + Build', allocation: 100, durationWeeks: 8, effortDays: 40, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r6', role: 'Cloud Engineer', phase: 'All Phases', allocation: 75, durationWeeks: 16, effortDays: 60, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r7', role: 'Frontend Engineer', phase: 'Build', allocation: 100, durationWeeks: 5, effortDays: 25, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r8', role: 'QA Engineer', phase: 'Test', allocation: 100, durationWeeks: 8, effortDays: 40, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r9', role: 'Q&T Engineer', phase: 'Build + Test', allocation: 100, durationWeeks: 6, effortDays: 30, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r10', role: 'Business Analyst', phase: 'Discovery + Test', allocation: 100, durationWeeks: 10, effortDays: 50, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r11', role: 'Healthcare SME', phase: 'Discovery + Validation', allocation: 25, durationWeeks: 10, effortDays: 13, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
  { id: 'r12', role: 'Project Manager', phase: 'All Phases', allocation: 50, durationWeeks: 20, effortDays: 50, ratePlaceholder: 'TBD', costPlaceholder: 'TBD', rowType: 'master', includeInExport: true },
];

const defaultAssumptions: AssumptionRow[] = [
  { id: 'a1', category: 'Data Availability', description: 'Client data, documents, and policies will be available and accessible at project kickoff', owner: 'Client', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'a2', category: 'PHI/PII and Compliance', description: 'PHI handling will comply with HIPAA requirements and all compliance controls will be implemented per client security policy', owner: 'Client + Delivery Team', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'a3', category: 'SME Availability', description: 'Healthcare subject matter experts will be available for at least 2 hours per week for requirements review and validation', owner: 'Client', impact: 'Medium', rowType: 'master', includeInExport: true },
  { id: 'a4', category: 'Ground Truth', description: 'A labeled ground truth dataset will be provided by the client within 4 weeks of project start for evaluation purposes', owner: 'Client', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'a5', category: 'Cloud Environment', description: 'Azure subscription with required service quotas (Azure OpenAI, AI Search, Document Intelligence) will be provisioned before build phase', owner: 'Client', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'a6', category: 'Security Approval', description: 'Security architecture review and approval will be completed before production deployment', owner: 'Client IT/Security', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'a7', category: 'Model Performance', description: 'Azure OpenAI GPT-4 class models will meet baseline accuracy thresholds for clinical reasoning tasks', owner: 'Delivery Team', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'a8', category: 'Production Readiness', description: 'Client infrastructure and operational teams will be ready to support production deployment within the agreed timeline', owner: 'Client', impact: 'Medium', rowType: 'master', includeInExport: true },
  { id: 'a9', category: 'Cost Estimate', description: 'Token cost and infrastructure cost estimates are indicative and based on projected usage; actual costs may vary', owner: 'Delivery Team', impact: 'Medium', rowType: 'master', includeInExport: true },
];

const defaultDependencies: DependencyRow[] = [
  { id: 'd1', category: 'Source System Access', description: 'EHR and Claims system API access credentials and documentation must be provided by client', owner: 'Client IT', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'd2', category: 'API Availability', description: 'Source system APIs must have documented endpoints and available test/sandbox environments', owner: 'Client IT', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'd3', category: 'Azure Subscription', description: 'Active Azure subscription with appropriate service quotas and billing approval must be in place', owner: 'Client', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'd4', category: 'Network / Security', description: 'Network connectivity, firewall rules, and VPN access for the development team must be configured by client', owner: 'Client IT/Security', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'd5', category: 'SME Review', description: 'Healthcare SMEs must review and validate AI-generated recommendation outputs before UAT', owner: 'Client Clinical Team', impact: 'Medium', rowType: 'master', includeInExport: true },
  { id: 'd6', category: 'Test Data', description: 'Anonymized and representative test data must be available for development and QA testing', owner: 'Client', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'd7', category: 'Ground Truth Dataset', description: 'Labeled ground truth dataset for Q&T evaluation must be delivered to the team', owner: 'Client Clinical Team', impact: 'High', rowType: 'master', includeInExport: true },
  { id: 'd8', category: 'UAT Users', description: 'Business users (claims analysts, nurses) must be available for scheduled UAT sessions', owner: 'Client Business', impact: 'Medium', rowType: 'master', includeInExport: true },
  { id: 'd9', category: 'Production Approval', description: 'Production deployment requires sign-off from IT, Security, and Clinical leadership', owner: 'Client', impact: 'High', rowType: 'master', includeInExport: true },
];

const defaultRisks: RiskRow[] = [
  { id: 'risk1', riskId: 'R-01', description: 'Data quality issues may impact extraction accuracy and model performance', probability: 'Medium', impact: 'High', mitigation: 'Conduct data quality assessment in Discovery; establish data cleansing pipeline', owner: 'Data Engineer', rowType: 'master', includeInExport: true },
  { id: 'risk2', riskId: 'R-02', description: 'Lack of labeled or ground truth data may delay evaluation and validation phases', probability: 'Medium', impact: 'High', mitigation: 'Initiate ground truth labeling effort early; consider synthetic data augmentation', owner: 'Q&T Engineer', rowType: 'master', includeInExport: true },
  { id: 'risk3', riskId: 'R-03', description: 'PHI/PII controls and compliance requirements may increase delivery timeline', probability: 'Medium', impact: 'High', mitigation: 'Engage security and compliance team at project start; include compliance buffer in timeline', owner: 'Solution Architect', rowType: 'master', includeInExport: true },
  { id: 'risk4', riskId: 'R-04', description: 'Integration endpoint availability may delay implementation phases', probability: 'High', impact: 'High', mitigation: 'Define API contracts early; build mock APIs for parallel development', owner: 'Backend Engineer', rowType: 'master', includeInExport: true },
  { id: 'risk5', riskId: 'R-05', description: 'Token costs may significantly exceed estimates based on actual usage patterns', probability: 'Medium', impact: 'Medium', mitigation: 'Implement token usage monitoring; optimize prompt design; set cost alerts in Azure', owner: 'GenAI Architect', rowType: 'master', includeInExport: true },
  { id: 'risk6', riskId: 'R-06', description: 'SME availability may impact clinical validation and approval timelines', probability: 'High', impact: 'Medium', mitigation: 'Schedule SME sessions upfront; identify backup reviewers', owner: 'Project Manager', rowType: 'master', includeInExport: true },
  { id: 'risk7', riskId: 'R-07', description: 'Hallucination and incorrect recommendations require robust Q&T and HITL controls', probability: 'High', impact: 'High', mitigation: 'Implement multi-layer evaluation; require HITL review for all low-confidence outputs', owner: 'Q&T Engineer', rowType: 'master', includeInExport: true },
  { id: 'risk8', riskId: 'R-08', description: 'Scope creep may occur if production integrations expand beyond initial agreement', probability: 'Medium', impact: 'High', mitigation: 'Maintain clear scope document; use change control process for scope additions', owner: 'Project Manager', rowType: 'master', includeInExport: true },
];

const defaultClassificationPatterns: ClassificationPattern[] = [
  {
    id: 'basic-chatbot',
    name: 'Basic Chatbot',
    patternType: 'Conversational AI',
    whenToUse: 'Simple FAQ or guided Q&A with no document retrieval needed',
    capabilities: ['Intent recognition', 'Response templating', 'Basic dialog flow', 'Channel integration'],
    complexity: 'Low',
    timeline: '4-8 weeks',
    triggers: ['faq', 'simple', 'chatbot', 'helpdesk', 'guided'],
    architectureImplications: 'Requires a lightweight conversation layer, configured intents, response templates, and channel integration.',
    estimationImplications: 'Usually low integration depth and smaller delivery team; effort concentrates on content quality and UX refinement.',
    deliveryNotes: 'Best suited for constrained use cases where source content is stable and answers can be governed centrally.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'basic-rag',
    name: 'Basic RAG',
    patternType: 'Retrieval Augmented Generation',
    whenToUse: 'Document Q&A with citation from a single or small set of documents',
    capabilities: ['Vector search', 'Contextual generation', 'Source citation', 'Single knowledge base'],
    complexity: 'Low-Medium',
    timeline: '6-10 weeks',
    triggers: ['document', 'qa', 'citation', 'pdf', 'knowledge', 'search'],
    architectureImplications: 'Needs document ingestion, chunking, embeddings, vector search, prompt grounding, and citation rendering.',
    estimationImplications: 'Effort depends on document quality, indexing approach, and citation accuracy expectations.',
    deliveryNotes: 'Keep the knowledge base narrow in early releases to simplify evaluation and improve trust.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'advanced-rag',
    name: 'Advanced / Hybrid RAG',
    patternType: 'Retrieval Augmented Generation',
    whenToUse: 'Multi-source enterprise or policy search with hybrid retrieval and reranking',
    capabilities: ['Hybrid dense+sparse retrieval', 'Reranking', 'Multi-index search', 'Policy/guideline retrieval'],
    complexity: 'Medium-High',
    timeline: '10-16 weeks',
    triggers: ['enterprise', 'multi-source', 'policy', 'hybrid', 'advanced', 'reranking', 'guideline'],
    architectureImplications: 'Adds source connectors, hybrid search, reranking, metadata filtering, and stronger evaluation loops.',
    estimationImplications: 'Higher data engineering and evaluation effort; timelines expand with each additional source system.',
    deliveryNotes: 'Plan for retrieval tuning and SME validation as first-class workstreams.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'agentic-rag',
    name: 'Agentic RAG',
    patternType: 'Agentic AI',
    whenToUse: 'Retrieval combined with tool use, iterative reasoning, and multi-step planning',
    capabilities: ['Tool-augmented retrieval', 'Iterative reasoning', 'Dynamic context assembly', 'Agent orchestration'],
    complexity: 'High',
    timeline: '14-20 weeks',
    triggers: ['agentic', 'tool', 'reasoning', 'iterative'],
    architectureImplications: 'Requires orchestration, tool contracts, memory/state handling, guardrails, and observability.',
    estimationImplications: 'Adds backend, evaluation, and governance effort beyond standard RAG delivery.',
    deliveryNotes: 'Use when retrieval alone is not enough and the workflow needs controlled tool execution.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'agentic-workflow',
    name: 'Full Agentic Workflow',
    patternType: 'Agentic AI',
    whenToUse: 'Multi-step automated workflows with decisioning, tool use, and human-in-the-loop',
    capabilities: ['Multi-agent orchestration', 'Decisioning', 'HITL integration', 'Audit logging', 'Q&T layer'],
    complexity: 'Very High',
    timeline: '18-28 weeks',
    triggers: ['workflow', 'multi-step', 'decision', 'prior auth', 'orchestration'],
    architectureImplications: 'Needs multiple agents, workflow state, tool/API integration, HITL queues, audit logs, and quality controls.',
    estimationImplications: 'Requires cross-functional staffing and explicit buffers for integration, testing, security, and SME validation.',
    deliveryNotes: 'Best fit for operational processes where AI recommendations must be reviewed, traced, and governed.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'nl2sql',
    name: 'NL2SQL / Talk-to-Data',
    patternType: 'Structured Data AI',
    whenToUse: 'Natural language queries over structured databases or data warehouses',
    capabilities: ['Schema understanding', 'SQL generation', 'Query validation', 'Result summarization'],
    complexity: 'Medium',
    timeline: '8-14 weeks',
    triggers: ['sql', 'analytics', 'data', 'structured', 'dashboard', 'warehouse', 'report'],
    architectureImplications: 'Requires schema metadata, query generation, query safety checks, execution controls, and result summarization.',
    estimationImplications: 'Complexity increases with schema size, join ambiguity, and governance requirements.',
    deliveryNotes: 'Constrain early releases to curated semantic models and read-only query execution.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'doc-intelligence',
    name: 'Document Intelligence',
    patternType: 'Document AI',
    whenToUse: 'Extraction from scanned, unstructured, or complex documents (forms, contracts, clinical notes)',
    capabilities: ['OCR processing', 'Layout analysis', 'Entity extraction', 'Classification', 'Key-value extraction'],
    complexity: 'Medium-High',
    timeline: '10-16 weeks',
    triggers: ['scanned', 'extraction', 'forms', 'contracts', 'unstructured', 'document', 'ocr'],
    architectureImplications: 'Needs OCR, document classification, extraction schemas, human review, and downstream validation.',
    estimationImplications: 'Effort varies with document variety, scan quality, field count, and accuracy targets.',
    deliveryNotes: 'Budget for representative sample sets and exception handling.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'clinical-summarization',
    name: 'Clinical Summarization',
    patternType: 'Healthcare GenAI',
    whenToUse: 'Summarization of clinical notes, discharge summaries, or patient records',
    capabilities: ['Medical NLP', 'SOAP note structuring', 'Clinical entity recognition', 'FHIR output'],
    complexity: 'High',
    timeline: '12-18 weeks',
    triggers: ['clinical', 'summarization', 'notes', 'fhir', 'medical', 'discharge', 'patient', 'ehr'],
    architectureImplications: 'Requires PHI controls, clinical prompt design, source grounding, and clinical review workflows.',
    estimationImplications: 'Validation and compliance needs increase delivery effort and acceptance criteria.',
    deliveryNotes: 'Include clinical SMEs and quality reviewers from discovery. Establish clear accuracy thresholds before launch and plan for a human review queue for edge cases.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'voice-agent',
    name: 'Voice / Multimodal Agent',
    patternType: 'Multimodal AI',
    whenToUse: 'Voice-based interaction, call transcription, dictation, or image + text analysis',
    capabilities: ['Speech-to-text', 'Multimodal input', 'Transcription', 'Voice response', 'Image analysis'],
    complexity: 'Very High',
    timeline: '16-24 weeks',
    triggers: ['voice', 'audio', 'call', 'multimodal', 'dictation', 'transcription', 'speech'],
    architectureImplications: 'Requires speech or multimodal pipelines, latency planning, channel integration, and specialized evaluation.',
    estimationImplications: 'Testing matrix expands across audio quality, accents, devices, and interaction paths.',
    deliveryNotes: 'Prototype latency and accuracy across target devices and accents before committing to production scope. Establish fallback paths for low-confidence transcriptions.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
  {
    id: 'quality-trust',
    name: 'Quality & Trust Layer',
    patternType: 'Governance',
    whenToUse: 'Production governance layer needed — evaluation, hallucination detection, audit trails, and feedback loops.',
    capabilities: ['Automated evaluation', 'Hallucination detection', 'Bias testing', 'Compliance logging', 'Feedback loop'],
    complexity: 'High',
    timeline: '4–8 weeks (add-on)',
    triggers: ['governance', 'production', 'quality', 'trust', 'compliance'],
    architectureImplications: 'Adds evaluation pipelines, audit storage, monitoring, feedback collection, and governance reporting.',
    estimationImplications: 'Often runs in parallel with solution delivery but needs dedicated Q&T ownership.',
    deliveryNotes: 'Use for production-bound solutions or regulated workflows.',
    source: 'default',
    status: 'available',
    includeInExport: true,
  },
];

const defaultState: WorkbenchState = {
  darkMode: false,
  intake: {
    clientName: '',
    opportunityName: '',
    marketSegment: '',
    businessFunction: '',
    opportunityStage: '',
    targetDeliveryType: '',
    businessProblem: '',
    currentProcess: '',
    desiredFutureState: '',
    targetUsers: [],
    expectedOutcomes: [],
    dataTypes: [],
    sourceSystems: [],
    phiPii: false,
    compliance: '',
  },
  classification: { selectedPattern: '', patterns: defaultClassificationPatterns },
  complexity: {
    dataSources: 0,
    dataTypes: 0,
    integrationDepth: 0,
    aiPattern: 0,
    governanceNeed: 0,
    userScale: 0,
    complianceRequirement: 0,
    groundTruthAvailability: 0,
    smeValidationNeed: 0,
    productionReadiness: 0,
  },
  azure: {
    mode: 'master',
    overview: {
      useCaseName: 'Agentic AI Prior Authorization Assist',
      cloudProvider: 'Azure',
      solutionType: 'Agentic Workflow + RAG + HITL + Q&T',
      businessGoal: 'Automate and accelerate Prior Authorization review using agentic AI to reduce turnaround time, improve accuracy, and ensure compliance with clinical guidelines.',
    },
    selectedComponents: ['azure-openai', 'azure-search', 'azure-doc-intelligence', 'azure-functions', 'azure-app-service', 'azure-api-management', 'azure-blob-storage', 'azure-cosmos-db', 'azure-key-vault', 'azure-entra', 'azure-monitor', 'azure-devops'],
    wbs: defaultWBS,
    resources: defaultResources,
    infra: {
      monthlyUsers: 500,
      concurrentUsers: 50,
      requestsPerUserPerDay: 10,
      avgDocumentsPerWorkflow: 5,
      avgPagesPerDocument: 8,
      avgPromptTokens: 800,
      avgRetrievalContextTokens: 2000,
      avgCompletionTokens: 600,
      agentStepsPerWorkflow: 8,
      evaluationCallsPerWorkflow: 2,
      environments: ['Dev', 'QA', 'UAT', 'Prod'],
      unitRateLLMInput: '',
      unitRateLLMOutput: '',
      unitRateEmbedding: '',
      unitRateOCR: '',
      unitRateStorage: '',
    },
    roi: {
      currentEffortHoursPerWorkflow: 2,
      currentFTECostPerHour: 0,
      currentErrorRatePct: 40,
      currentTurnaroundHours: 48,
      projectedEffortReductionPct: 70,
      projectedErrorReductionPct: 80,
      projectedTurnaroundReductionPct: 85,
      implementationCostPlaceholder: 'TBD',
      notes: '',
    },
    estimationBasis: {
      hoursPerDay: 8,
      daysPerWeek: 5,
      defaultHourlyRate: 0,
      resourceEffortFormula: 'Effort days = duration weeks x days per week x allocation %',
      resourceCostFormula: 'Resource cost = effort days x hours per day x hourly billing rate',
      infraVolumeFormula: 'Workflows/month = monthly users x requests per user per day x 30',
      tokenCostFormula: 'Monthly token cost = input tokens/1K x input rate + output tokens/1K x output rate',
      roiFormula: 'Hours saved/month = workflows/month x current effort hours x projected effort reduction %',
    },
    assumptions: defaultAssumptions,
    dependencies: defaultDependencies,
    risks: defaultRisks,
    unsavedChanges: false,
  },
  validationStatus: 'draft',
};

interface WorkbenchContextValue {
  state: WorkbenchState;
  setDarkMode: (v: boolean) => void;
  setIntake: (data: Partial<IntakeData>) => void;
  setClassification: (pattern: string) => void;
  addClassificationPattern: (pattern: ClassificationPattern) => void;
  updateClassificationPattern: (id: string, data: Partial<ClassificationPattern>) => void;
  deleteClassificationPattern: (id: string) => void;
  resetClassificationPatterns: () => void;
  setComplexity: (scores: Partial<ComplexityScores>) => void;
  setAzureMode: (mode: 'master' | 'working-copy') => void;
  setAzureOverview: (data: Partial<AzureOverview>) => void;
  toggleAzureComponent: (id: string) => void;
  setWBS: (rows: WBSRow[]) => void;
  addWBSRow: (row: WBSRow) => void;
  deleteWBSRow: (id: string) => void;
  updateWBSRow: (id: string, data: Partial<WBSRow>) => void;
  setResources: (rows: ResourceRow[]) => void;
  addResourceRow: (row: ResourceRow) => void;
  deleteResourceRow: (id: string) => void;
  updateResourceRow: (id: string, data: Partial<ResourceRow>) => void;
  setInfra: (data: Partial<InfraInputs>) => void;
  setRoi: (data: Partial<RoiInputs>) => void;
  setEstimationBasis: (data: Partial<EstimationBasis>) => void;
  addAssumption: (row: AssumptionRow) => void;
  updateAssumption: (id: string, data: Partial<AssumptionRow>) => void;
  deleteAssumption: (id: string) => void;
  addDependency: (row: DependencyRow) => void;
  updateDependency: (id: string, data: Partial<DependencyRow>) => void;
  deleteDependency: (id: string) => void;
  addRisk: (row: RiskRow) => void;
  updateRisk: (id: string, data: Partial<RiskRow>) => void;
  deleteRisk: (id: string) => void;
  resetToMaster: () => void;
  saveWorkspace: () => void;
  loadWorkspace: () => void;
  resetWorkspace: () => void;
  seedWorkspace: () => void;
  setValidationStatus: (s: WorkbenchState['validationStatus']) => void;
}

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export const STORAGE_KEY = 'genai_sow_estimation_workspace_v1';
const LEGACY_STORAGE_KEY = 'genforge_workspace';
const DARK_MODE_KEY = 'genforge_dark_mode';

function loadFromStorage(): WorkbenchState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    const darkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        intake: { ...defaultState.intake, ...parsed.intake },
        classification: {
          ...defaultState.classification,
          ...parsed.classification,
          patterns: parsed.classification?.patterns?.length ? parsed.classification.patterns : defaultClassificationPatterns,
        },
        complexity: { ...defaultState.complexity, ...parsed.complexity },
        azure: {
          ...defaultState.azure,
          ...parsed.azure,
          overview: { ...defaultState.azure.overview, ...parsed.azure?.overview },
          infra: { ...defaultState.azure.infra, ...parsed.azure?.infra },
          roi: { ...defaultState.azure.roi, ...parsed.azure?.roi },
          estimationBasis: { ...defaultState.azure.estimationBasis, ...parsed.azure?.estimationBasis },
        },
        darkMode,
      };
    }
  } catch {}
  return { ...defaultState, darkMode: localStorage.getItem(DARK_MODE_KEY) === 'true' };
}

export function WorkbenchProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkbenchState>(loadFromStorage);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
    localStorage.setItem(DARK_MODE_KEY, String(state.darkMode));
  }, [state.darkMode]);

  const update = useCallback((updater: (prev: WorkbenchState) => WorkbenchState) => {
    setState(prev => {
      const next = updater(prev);
      return next;
    });
  }, []);

  const setDarkMode = (v: boolean) => update(s => ({ ...s, darkMode: v }));

  const setIntake = (data: Partial<IntakeData>) =>
    update(s => ({ ...s, intake: { ...s.intake, ...data } }));

  const setClassification = (pattern: string) =>
    update(s => ({ ...s, classification: { ...s.classification, selectedPattern: pattern } }));

  const addClassificationPattern = (pattern: ClassificationPattern) =>
    update(s => ({ ...s, classification: { ...s.classification, patterns: [...s.classification.patterns, pattern] } }));

  const updateClassificationPattern = (id: string, data: Partial<ClassificationPattern>) =>
    update(s => ({
      ...s,
      classification: {
        ...s.classification,
        patterns: s.classification.patterns.map(pattern => pattern.id === id ? { ...pattern, ...data } : pattern),
      },
    }));

  const deleteClassificationPattern = (id: string) =>
    update(s => {
      const target = s.classification.patterns.find(pattern => pattern.id === id);
      if (!target || target.source !== 'custom') return s;
      return {
        ...s,
        classification: {
          ...s.classification,
          selectedPattern: s.classification.selectedPattern === id ? '' : s.classification.selectedPattern,
          patterns: s.classification.patterns.filter(pattern => pattern.id !== id),
        },
      };
    });

  const resetClassificationPatterns = () =>
    update(s => ({ ...s, classification: { selectedPattern: '', patterns: defaultClassificationPatterns } }));

  const setComplexity = (scores: Partial<ComplexityScores>) =>
    update(s => ({ ...s, complexity: { ...s.complexity, ...scores } }));

  const setAzureMode = (mode: 'master' | 'working-copy') =>
    update(s => ({ ...s, azure: { ...s.azure, mode } }));

  const setAzureOverview = (data: Partial<AzureOverview>) =>
    update(s => ({ ...s, azure: { ...s.azure, overview: { ...s.azure.overview, ...data }, unsavedChanges: s.azure.mode === 'working-copy' } }));

  const toggleAzureComponent = (id: string) =>
    update(s => {
      const sel = s.azure.selectedComponents.includes(id)
        ? s.azure.selectedComponents.filter(c => c !== id)
        : [...s.azure.selectedComponents, id];
      return { ...s, azure: { ...s.azure, selectedComponents: sel, unsavedChanges: s.azure.mode === 'working-copy' } };
    });

  const setWBS = (rows: WBSRow[]) => update(s => ({ ...s, azure: { ...s.azure, wbs: rows, unsavedChanges: true } }));
  const addWBSRow = (row: WBSRow) => update(s => ({ ...s, azure: { ...s.azure, wbs: [...s.azure.wbs, row], unsavedChanges: true } }));
  const deleteWBSRow = (id: string) => update(s => ({ ...s, azure: { ...s.azure, wbs: s.azure.wbs.filter(r => r.id !== id || r.rowType === 'master'), unsavedChanges: true } }));
  const updateWBSRow = (id: string, data: Partial<WBSRow>) => update(s => ({ ...s, azure: { ...s.azure, wbs: s.azure.wbs.map(r => r.id === id ? { ...r, ...data } : r), unsavedChanges: true } }));

  const setResources = (rows: ResourceRow[]) => update(s => ({ ...s, azure: { ...s.azure, resources: rows, unsavedChanges: true } }));
  const addResourceRow = (row: ResourceRow) => update(s => ({ ...s, azure: { ...s.azure, resources: [...s.azure.resources, row], unsavedChanges: true } }));
  const deleteResourceRow = (id: string) => update(s => ({ ...s, azure: { ...s.azure, resources: s.azure.resources.filter(r => r.id !== id || r.rowType === 'master'), unsavedChanges: true } }));
  const updateResourceRow = (id: string, data: Partial<ResourceRow>) => update(s => ({ ...s, azure: { ...s.azure, resources: s.azure.resources.map(r => r.id === id ? { ...r, ...data } : r), unsavedChanges: true } }));

  const setInfra = (data: Partial<InfraInputs>) =>
    update(s => ({ ...s, azure: { ...s.azure, infra: { ...s.azure.infra, ...data }, unsavedChanges: true } }));

  const setRoi = (data: Partial<RoiInputs>) =>
    update(s => ({ ...s, azure: { ...s.azure, roi: { ...s.azure.roi, ...data }, unsavedChanges: true } }));

  const setEstimationBasis = (data: Partial<EstimationBasis>) =>
    update(s => ({ ...s, azure: { ...s.azure, estimationBasis: { ...s.azure.estimationBasis, ...data }, unsavedChanges: true } }));

  const addAssumption = (row: AssumptionRow) => update(s => ({ ...s, azure: { ...s.azure, assumptions: [...s.azure.assumptions, row], unsavedChanges: true } }));
  const updateAssumption = (id: string, data: Partial<AssumptionRow>) => update(s => ({ ...s, azure: { ...s.azure, assumptions: s.azure.assumptions.map(r => r.id === id ? { ...r, ...data } : r), unsavedChanges: true } }));
  const deleteAssumption = (id: string) => update(s => ({ ...s, azure: { ...s.azure, assumptions: s.azure.assumptions.filter(r => r.id !== id || r.rowType === 'master'), unsavedChanges: true } }));

  const addDependency = (row: DependencyRow) => update(s => ({ ...s, azure: { ...s.azure, dependencies: [...s.azure.dependencies, row], unsavedChanges: true } }));
  const updateDependency = (id: string, data: Partial<DependencyRow>) => update(s => ({ ...s, azure: { ...s.azure, dependencies: s.azure.dependencies.map(r => r.id === id ? { ...r, ...data } : r), unsavedChanges: true } }));
  const deleteDependency = (id: string) => update(s => ({ ...s, azure: { ...s.azure, dependencies: s.azure.dependencies.filter(r => r.id !== id || r.rowType === 'master'), unsavedChanges: true } }));

  const addRisk = (row: RiskRow) => update(s => ({ ...s, azure: { ...s.azure, risks: [...s.azure.risks, row], unsavedChanges: true } }));
  const updateRisk = (id: string, data: Partial<RiskRow>) => update(s => ({ ...s, azure: { ...s.azure, risks: s.azure.risks.map(r => r.id === id ? { ...r, ...data } : r), unsavedChanges: true } }));
  const deleteRisk = (id: string) => update(s => ({ ...s, azure: { ...s.azure, risks: s.azure.risks.filter(r => r.id !== id || r.rowType === 'master'), unsavedChanges: true } }));

  const resetToMaster = () =>
    update(s => ({ ...s, azure: { ...s.azure, wbs: defaultWBS, resources: defaultResources, assumptions: defaultAssumptions, dependencies: defaultDependencies, risks: defaultRisks, unsavedChanges: false } }));

  const saveWorkspace = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    update(s => ({ ...s, azure: { ...s.azure, unsavedChanges: false } }));
  };

  const loadWorkspace = () => {
    const loaded = loadFromStorage();
    setState(loaded);
  };

  const resetWorkspace = () => setState({ ...defaultState, darkMode: state.darkMode });

  const seedWorkspace = () => {
    setState({
      ...defaultState,
      darkMode: state.darkMode,
      intake: {
        ...defaultState.intake,
        clientName: 'DemoClient',
        opportunityName: 'Agentic AI Prior Authorization Assist',
        marketSegment: 'Payer',
        businessFunction: 'Prior Authorization',
        opportunityStage: 'Proposal',
        targetDeliveryType: 'MVP',
        businessProblem: 'Manual prior authorization process requires clinicians to review 200+ requests per day, with 40% requiring rework due to missing documentation. Average turnaround is 48 hours.',
        currentProcess: 'Clinical staff manually review PA requests, cross-reference payer policies, and make approve/deny recommendations with limited tooling support.',
        desiredFutureState: 'Automated agentic AI workflow that retrieves policy, extracts clinical evidence, generates recommendation, and routes to HITL review, reducing turnaround to under 4 hours.',
        targetUsers: ['Claims Analyst', 'Nurse', 'Care Manager', 'Reviewer'],
        expectedOutcomes: ['Reduce manual effort', 'Reduce turnaround time', 'Improve accuracy', 'Reduce risk'],
        dataTypes: ['PDFs', 'Scanned Documents', 'Clinical Notes', 'Policies', 'Guidelines', 'FHIR/HL7'],
        sourceSystems: ['EHR System', 'Claims System', 'Document Repository'],
        phiPii: true,
        compliance: 'HIPAA',
      },
      classification: { selectedPattern: 'agentic-workflow', patterns: defaultClassificationPatterns },
      complexity: {
        dataSources: 4,
        dataTypes: 4,
        integrationDepth: 4,
        aiPattern: 4,
        governanceNeed: 4,
        userScale: 4,
        complianceRequirement: 4,
        groundTruthAvailability: 4,
        smeValidationNeed: 4,
        productionReadiness: 4,
      },
      azure: {
        ...defaultState.azure,
        mode: 'working-copy',
        overview: {
          ...defaultState.azure.overview,
          useCaseName: 'Agentic AI Prior Authorization Assist',
        },
        roi: {
          ...defaultState.azure.roi,
          currentEffortHoursPerWorkflow: 2,
          currentFTECostPerHour: 0,
          currentErrorRatePct: 40,
          currentTurnaroundHours: 48,
          projectedEffortReductionPct: 70,
          projectedErrorReductionPct: 80,
          projectedTurnaroundReductionPct: 85,
        },
      },
    });
  };

  const setValidationStatus = (v: WorkbenchState['validationStatus']) =>
    update(s => ({ ...s, validationStatus: v }));

  return (
    <WorkbenchContext.Provider value={{
      state, setDarkMode, setIntake, setClassification,
      addClassificationPattern, updateClassificationPattern, deleteClassificationPattern, resetClassificationPatterns,
      setComplexity,
      setAzureMode, setAzureOverview, toggleAzureComponent,
      setWBS, addWBSRow, deleteWBSRow, updateWBSRow,
      setResources, addResourceRow, deleteResourceRow, updateResourceRow,
      setInfra, setRoi, setEstimationBasis,
      addAssumption, updateAssumption, deleteAssumption,
      addDependency, updateDependency, deleteDependency,
      addRisk, updateRisk, deleteRisk,
      resetToMaster, saveWorkspace, loadWorkspace, resetWorkspace, seedWorkspace,
      setValidationStatus,
    }}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench() {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) throw new Error('useWorkbench must be used within WorkbenchProvider');
  return ctx;
}

export { defaultWBS, defaultResources, defaultAssumptions, defaultDependencies, defaultRisks, defaultClassificationPatterns };
