import type { ColumnDef, ComponentRow, AgentRow, WBSRow, ResourceRow, AssumptionRow, DependencyRow, RiskRow, DeliveryModelRow } from '../types'
import {
  COMPONENT_CATEGORIES, REQUIRED_OPTIONAL,
  RAID_TYPES, PROBABILITY_LEVELS, IMPACT_LEVELS, SEVERITY_LEVELS, RISK_STATUSES,
  ASSUMPTION_CATEGORIES, DEPENDENCY_STATUSES, LOCATION_OPTIONS, PHASE_OPTIONS,
} from './dropdownOptions'

export const COMPONENT_COLUMNS: ColumnDef<ComponentRow>[] = [
  { key: 'componentCategory', label: 'Category', type: 'select', options: COMPONENT_CATEGORIES, width: '160px', placeholder: 'Select category' },
  { key: 'logicalComponent', label: 'Component Name', type: 'text', width: '180px', placeholder: 'e.g. Embedding Service', required: true },
  { key: 'cloudProviderMapping', label: 'Cloud / Provider Mapping', type: 'text', width: '180px', placeholder: 'e.g. Azure OpenAI, Bedrock...' },
  { key: 'requiredOptional', label: 'Required / Optional', type: 'select', options: REQUIRED_OPTIONAL, width: '130px' },
  { key: 'selected', label: 'Selected', type: 'checkbox', width: '80px' },
  { key: 'purpose', label: 'Purpose', type: 'textarea', width: '220px', placeholder: 'What this component does' },
  { key: 'costDriver', label: 'Cost Driver', type: 'text', width: '160px', placeholder: 'e.g. Token volume, API calls' },
  { key: 'sizingBasis', label: 'Sizing Basis', type: 'text', width: '160px', placeholder: 'e.g. users, docs, GB' },
  { key: 'unit', label: 'Unit', type: 'text', width: '100px', placeholder: 'e.g. GB' },
  { key: 'quantity', label: 'Quantity', type: 'number', width: '95px', placeholder: '0' },
  { key: 'monthlyUnitCost', label: 'Unit Cost / Mo.', type: 'number', width: '120px', placeholder: '0' },
  { key: 'calculatedMonthlyCost', label: 'Infra Cost / Mo.', type: 'calculated', width: '120px', readOnly: true },
  { key: 'llmModel', label: 'LLM Model', type: 'text', width: '140px', placeholder: 'e.g. GPT-4.1 mini' },
  { key: 'monthlyInputTokensK', label: 'Input Tokens (K/mo.)', type: 'number', width: '140px', placeholder: '0' },
  { key: 'monthlyOutputTokensK', label: 'Output Tokens (K/mo.)', type: 'number', width: '145px', placeholder: '0' },
  { key: 'costPerKInputTokens', label: '$ / K Input', type: 'number', width: '105px', placeholder: '0' },
  { key: 'costPerKOutputTokens', label: '$ / K Output', type: 'number', width: '110px', placeholder: '0' },
  { key: 'calculatedMonthlyLlmCost', label: 'LLM Cost / Mo.', type: 'calculated', width: '120px', readOnly: true },
  { key: 'notes', label: 'Notes', type: 'textarea', width: '200px', placeholder: 'Additional notes' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const AGENT_COLUMNS: ColumnDef<AgentRow>[] = [
  { key: 'agentName', label: 'Agent Name', type: 'text', width: '160px', placeholder: 'e.g. Intake Agent', required: true },
  { key: 'enabled', label: 'Enabled', type: 'checkbox', width: '80px' },
  { key: 'responsibility', label: 'Role / Responsibility', type: 'textarea', width: '200px', placeholder: 'What this agent does' },
  { key: 'inputs', label: 'Inputs', type: 'textarea', width: '180px', placeholder: 'Data / context inputs' },
  { key: 'outputs', label: 'Outputs', type: 'textarea', width: '180px', placeholder: 'Results / artifacts produced' },
  { key: 'toolsUsed', label: 'Tools Used', type: 'textarea', width: '160px', placeholder: 'APIs, search, functions...' },
  { key: 'hitlTrigger', label: 'HITL Trigger', type: 'textarea', width: '160px', placeholder: 'When human review is needed' },
  { key: 'estimatedCallsPerWorkflow', label: 'Calls / Workflow', type: 'number', width: '120px', placeholder: '0' },
  { key: 'auditNotes', label: 'Audit / Observability Notes', type: 'textarea', width: '200px', placeholder: 'Logging, tracing requirements' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const WBS_COLUMNS: ColumnDef<WBSRow>[] = [
  { key: 'phase', label: 'Phase', type: 'select', options: PHASE_OPTIONS, width: '130px', required: true },
  { key: 'epic', label: 'Epic', type: 'text', width: '160px', placeholder: 'e.g. Data Pipeline' },
  { key: 'task', label: 'Task', type: 'text', width: '220px', placeholder: 'Specific task description', required: true },
  { key: 'deliverable', label: 'Deliverable', type: 'text', width: '180px', placeholder: 'Output artifact' },
  { key: 'ownerRole', label: 'Owner Role', type: 'text', width: '160px', placeholder: 'e.g. ML Engineer', required: true },
  { key: 'hours', label: 'Hours', type: 'number', width: '90px', placeholder: '0', required: true },
  { key: 'effortDays', label: 'Effort Days', type: 'calculated', width: '100px', readOnly: true },
  { key: 'startDate', label: 'Start', type: 'date', width: '120px' },
  { key: 'durationDays', label: 'Duration Days', type: 'number', width: '120px', placeholder: '0' },
  { key: 'endDate', label: 'End', type: 'date', width: '120px' },
  { key: 'predecessor', label: 'Predecessor', type: 'text', width: '140px', placeholder: 'Task or ID' },
  { key: 'milestone', label: 'Milestone', type: 'checkbox', width: '90px' },
  { key: 'complexity', label: 'Complexity', type: 'select', options: ['Low', 'Medium', 'High'], width: '110px' },
  { key: 'dependency', label: 'Dependency', type: 'text', width: '160px', placeholder: 'Blocking dependency' },
  { key: 'acceptanceCriteria', label: 'Acceptance Criteria', type: 'textarea', width: '220px', placeholder: 'Definition of done' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const RESOURCE_COLUMNS: ColumnDef<ResourceRow>[] = [
  { key: 'role', label: 'Role', type: 'text', width: '180px', placeholder: 'e.g. Solution Architect', required: true },
  { key: 'phase', label: 'Phase', type: 'select', options: PHASE_OPTIONS, width: '130px' },
  { key: 'location', label: 'Location', type: 'select', options: LOCATION_OPTIONS, width: '120px' },
  { key: 'fte', label: 'FTE', type: 'number', width: '80px', placeholder: '1', required: true },
  { key: 'allocationPercent', label: 'Allocation %', type: 'number', width: '110px', placeholder: '100', required: true },
  { key: 'durationWeeks', label: 'Duration (wks)', type: 'number', width: '120px', placeholder: '0', required: true },
  { key: 'effortHours', label: 'Effort Hours', type: 'calculated', width: '110px', readOnly: true },
  { key: 'effortDays', label: 'Effort Days', type: 'calculated', width: '100px', readOnly: true },
  { key: 'ratePlaceholder', label: 'Rate ($)', type: 'number', width: '100px', placeholder: '0' },
  { key: 'costPlaceholder', label: 'Cost ($)', type: 'calculated', width: '100px', readOnly: true },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const ASSUMPTION_COLUMNS: ColumnDef<AssumptionRow>[] = [
  { key: 'category', label: 'Category', type: 'select', options: ASSUMPTION_CATEGORIES, width: '140px' },
  { key: 'description', label: 'Description', type: 'textarea', width: '320px', placeholder: 'Describe the assumption', required: true },
  { key: 'owner', label: 'Owner', type: 'text', width: '140px', placeholder: 'Role or team' },
  { key: 'impact', label: 'Impact if Wrong', type: 'textarea', width: '220px', placeholder: 'Consequence if assumption fails' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const DEPENDENCY_COLUMNS: ColumnDef<DependencyRow>[] = [
  { key: 'category', label: 'Category', type: 'select', options: ASSUMPTION_CATEGORIES, width: '140px' },
  { key: 'description', label: 'Description', type: 'textarea', width: '280px', placeholder: 'Describe the dependency', required: true },
  { key: 'owner', label: 'Owner', type: 'text', width: '140px', placeholder: 'Role or team' },
  { key: 'dueBy', label: 'Due By', type: 'date', width: '120px' },
  { key: 'status', label: 'Status', type: 'select', options: DEPENDENCY_STATUSES, width: '120px' },
  { key: 'impact', label: 'Impact', type: 'textarea', width: '200px', placeholder: 'Blocker consequence' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const RISK_COLUMNS: ColumnDef<RiskRow>[] = [
  { key: 'riskId', label: 'ID', type: 'text', width: '80px', readOnly: true },
  { key: 'raidType', label: 'RAID Type', type: 'select', options: RAID_TYPES, width: '120px' },
  { key: 'description', label: 'Description', type: 'textarea', width: '260px', placeholder: 'Describe the risk / issue', required: true },
  { key: 'probability', label: 'Probability', type: 'select', options: PROBABILITY_LEVELS, width: '110px' },
  { key: 'impact', label: 'Impact', type: 'select', options: IMPACT_LEVELS, width: '100px' },
  { key: 'severity', label: 'Severity', type: 'select', options: SEVERITY_LEVELS, width: '100px' },
  { key: 'mitigation', label: 'Mitigation', type: 'textarea', width: '220px', placeholder: 'Mitigation or response plan' },
  { key: 'owner', label: 'Owner', type: 'text', width: '140px', placeholder: 'Risk owner' },
  { key: 'status', label: 'Status', type: 'select', options: RISK_STATUSES, width: '120px' },
  { key: 'targetDate', label: 'Target Date', type: 'date', width: '120px' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]

export const DELIVERY_MODEL_COLUMNS: ColumnDef<DeliveryModelRow>[] = [
  { key: 'label', label: 'Label', type: 'text', width: '180px', placeholder: 'e.g. Phase 1 - PoC', required: true },
  { key: 'value', label: 'Value / Description', type: 'textarea', width: '320px', placeholder: 'Detail or description' },
  { key: 'notes', label: 'Notes', type: 'textarea', width: '200px', placeholder: 'Additional context' },
  { key: 'includeInExport', label: 'Export', type: 'checkbox', width: '70px' },
]
