# GenAI Proposal & SOW Estimation Workbench — Feature List & User Stories

> Source: completed Codex build briefs (Round 1 + Round 2 + Round 3 + Healthcare Depth)
> Date: 2026-06-25
> Role: Senior Solution Architect (primary user)

---

## Implementation Tracker

### Round 1 — Initial Build (All Complete)

| Brief task | Status | Notes |
|------------|--------|-------|
| Task 1 — Replace Home Page | ✅ Complete | Orientation-first page, outcomes, workflow, current workspace status, and sample seed CTA. |
| Task 2 — Remove Export Button from Header | ✅ Complete | Header export button removed. |
| Task 3 — Add beforeunload Warning | ✅ Complete | Warns when Azure working copy has unsaved changes. |
| Task 4 — Install Export Libraries | ✅ Complete | `xlsx`, `docx`, `jspdf`, `jspdf-autotable`, `file-saver`, and `@types/file-saver` installed. |
| Task 5 — Add ROI Tab to Azure Estimation | ✅ Complete | `I. ROI` tab with inputs, sliders, calculations, narrative, and notes. |
| Task 6 — Section-Level Export Icons | ✅ Complete | Export dropdown appears consistently across Azure tabs, including Delivery & Support. |
| Task 7 — Export Utility Refactor | ✅ Complete | Per-section export modules plus full-package exporter created under `src/utils/exports/`. |
| Task 8 — Print-Friendly Export View | ✅ Complete | `/print-export` route reads from `genai_sow_estimation_workspace_v1`. |
| Task 9 — Export Center Redesign | ✅ Complete | Full package cards, individual section exports, CSV package, and checklist. |
| Task 10 — Complete Missing Intake Fields | ✅ Complete | Opportunity Name, Target Delivery Type, Desired Future State, and missing options added. |
| Task 11 — Wire Global Search | ✅ Complete | Grouped search overlay across templates, WBS, assumptions, risks, components, and archetypes. |

### Round 2 — Workflow Restructure: RFP Intake to SOW Delivery (All Complete)

| Brief task | Status | Notes |
|------------|--------|-------|
| Task 0 — Engagement Phase Selection | ✅ Complete | `EngagementConfig` in state; 4 presets + custom checklist on Home; sidebar, stepper, and estimation tabs all phase-filtered. |
| Task 1 — Sidebar compression | ✅ Complete | 6 nav items; `/complexity` and `/patterns` removed from nav; `/patterns` redirects to `/estimation`. |
| Task 2 — 6-Step Workflow Stepper | ✅ Complete | `workflow.ts` rewritten; `WorkflowNav` uses `getActiveSteps()`; steps: intake → identify → estimate → review → delivery → export. |
| Task 3 — IntakeData: 3 new fields | ✅ Complete | `engagementType`, `commercialModel`, `budgetIndicator` in state, seed, and defaults. |
| Task 4 — DeliveryState interface | ✅ Complete | 20-field `DeliveryState` + `executiveSummary` on `AzureOverview`; `setDelivery` setter; seed data populated. |
| Task 5 — Intake Section D | ✅ Complete | Engagement & Commercial Context card with 3 selects; green completion indicator; page title "Project Intake". |
| Task 6 — Solution Identification + Complexity embed | ✅ Complete | Page renamed; complexity calibration collapsible below pattern grid; `dimensions`, `scoreLabels`, `getClassification` exported from ComplexityScoringPage. |
| Task 7 — Tab J: Delivery & Support | ✅ Complete | 6-card `DeliveryTab`; executiveSummary textarea in Overview tab; delivery added to `sectionExporters`. |
| Task 8 — Export wiring (delivery) | ✅ Complete | `'delivery'` in `SectionName`; 21-row `sectionTable` case; `'delivery'` in full-package `sections` array. |
| Task 9 — Home page minor updates | ✅ Complete | Outcome cards include delivery and executive summary deliverables. |

### Round 3 — Tail Items (All Complete)

| Item | Status | File | Description |
|------|--------|------|-------------|
| P-1 — executiveSummary in overview export | ✅ Complete | `src/utils/exports/core.ts` | Overview exports include `Win Theme / Executive Summary`. |
| P-2 — Export Center: Delivery section | ✅ Complete | `src/app/components/ExportCenterPage.tsx` | Delivery & Support row is actionable; package copy reflects 10 sections. |
| P-3 — Print-friendly: Delivery + executiveSummary | ✅ Complete | `src/app/components/PrintFriendlyExportView.tsx` | Print view includes executive summary and Delivery & Support table. |
| P-4 — Global search: new fields | ✅ Complete | `src/app/components/Layout.tsx` | Search indexes Section D, executive summary, and delivery fields. |
| P-5 — Pattern Library entry point | ✅ Complete | `src/app/components/SolutionClassificationPage.tsx` | Solution Identification links to `/patterns-library`. |

### Round 4 — SOW Completeness & Healthcare Depth (All Complete)

| Brief task | Status | Notes |
|------------|--------|-------|
| Healthcare intake fields | ✅ Complete | Compliance multi-select, EHR system, FHIR/API version, FDA pathway, and clinical validation flag. |
| Healthcare / Clinical AI preset | ✅ Complete | 5th preset activates all phases and highlights regulated clinical AI scope. |
| Healthcare master rows | ✅ Complete | Added 8 WBS rows, 6 assumptions, and 5 risks as opt-in master rows. |
| TCO calculated view | ✅ Complete | Overview tab and Overview export include labour build cost, monthly infra run cost, 12-month TCO, and effort days/hours. |
| Pattern Library link | ✅ Complete | Solution Identification has a Browse Pattern Library button. |

Current implementation status: [`vibes/status.md`](status.md).

---

## Global / Cross-Cutting Features

### G-01 — Enterprise Layout Shell
As a Solution Architect, I want a consistent enterprise dashboard layout so I always know where I am in the workflow.
- Left sidebar with 6 primary nav items: Home, Project Intake, Solution Identification, Estimation & Delivery, Export Center, Template Library
- Phase-aware sidebar hides Solution Identification or Estimation & Delivery when those phases are not active
- Collapsible sidebar for narrow-screen use
- Header with breadcrumb, search, status pill, unsaved indicator, and dark mode toggle
- Active nav item highlighting and workflow progress bar

### G-02 — Dark Mode
As a Solution Architect, I want a dark/light mode toggle so I can use the app comfortably in different environments.
- Toggle in header; persists to `localStorage`
- Light: white cards, slate-50 background, blue/teal accents
- Dark: slate-900 background, slate-800 cards, blue-400 accents with accessible contrast

### G-03 — Temporary Workspace Persistence
As a Solution Architect, I want my work saved to the browser so I don't lose progress if I accidentally navigate away.
- localStorage key: `genai_sow_estimation_workspace_v1`
- Persistent warning banner: "Temporary workspace only. Export your estimation package before closing or clearing browser data."
- Save Workspace / Load Workspace / Reset Workspace buttons
- `beforeunload` browser warning if unsaved changes exist
- "Unsaved" indicator dot in header

### G-04 — Global Search
As a Solution Architect, I want to search across all workbench content so I can quickly locate templates, WBS rows, assumptions, or cloud components.
- Search bar in header: "Search workspace..."
- Results grouped by type: Templates | WBS | Assumptions | Risks | Components | Intake | Delivery | Archetypes
- Indexes Section D engagement fields, win theme / executive summary, and Delivery & Support fields
- Dropdown overlay with grouped hits
- Empty state: "No matching results found."

### G-05 — Validation Engine
As a Solution Architect, I want real-time and package-level validation so I know my estimation is complete before exporting.
- Inline error messages on blur for required fields
- Section-level completion indicators (✓ / ○)
- Global validation status pill in header: Draft / Incomplete / Warnings / Validated / Ready to Export
- "Validate Estimation" button (in Export Center) triggers full-package validation
- Validation summary panel with error count and list
- Validation errors block export with warnings shown in export preview modal

### G-06 — Sanitisation Compliance
As a Solution Architect, I want all default data to use fictitious placeholders so I can safely demo the tool without exposing real client or company names.
- No real client names, company names, or proprietary references in code, seed data, UI, or exports
- Default placeholders: "DemoClient", "Sample Payer", "Sample Provider", "Internal AI Practice"
- File naming uses `ClientName` from Intake form (user-entered)

### G-07 — Phase-Based Personalisation
As a Solution Architect, I want to tailor the workflow to the client engagement so I only see relevant phases.
- `EngagementConfig.activePhases` is the single source of truth
- Presets include Full SOW Build, Advisory / Discovery, PoC / Pilot, Managed Service Transition, and Healthcare / Clinical AI
- Custom phase checklist on Home
- Phase selection drives sidebar visibility, workflow steps, back/next navigation, and Azure Estimation tab visibility

---

## Page 1 — Home / Workbench Overview

### P1-01 — Orientation Hero
As a Solution Architect, I want a dashboard overview so I can understand the tool and start quickly.
- Title: "GenAI Proposal & SOW Estimation Workbench"
- Purpose line: "Turn a GenAI use-case conversation into a structured, exportable proposal package."
- Primary CTA: "Start Fresh" → navigates to Intake
- Secondary CTA: "Load Sample Scenario" → seeds the DemoClient sample and navigates to Azure Estimation
- Confirmation shown before replacing an existing workspace

### P1-02 — Engagement Setup Panel
As a Solution Architect, I want to choose the engagement shape before starting so the app matches the scope of work.
- 5 preset cards for common engagement types, including Healthcare / Clinical AI
- "Customise phases" collapsible checklist
- "Begin Engagement" CTA starts with the selected phases
- "Load Sample Scenario" seeds DemoClient and Full SOW Build data
- "Reconfigure engagement" link reopens setup after a workspace exists

### P1-03 — Outcome Cards
As a Solution Architect, I want to understand the tangible outputs so I know what the workbench can produce.
- Client-Facing Proposal Assets
- Working Estimation Files
- Machine-Readable Package
- Delivery & Support Considerations
- Win theme / executive summary
- Each card shows deliverables and export formats

### P1-04 — Workflow Stepper
As a Solution Architect, I want a visual stepper so I can see my progress through the phase-aware estimation workflow.
- Full SOW steps: Intake → Identify → Estimate → Review → Delivery → Export
- Advisory preset can show a shorter 3-step flow
- Completed steps shown with check mark
- Progress bar + percentage
- Each step is clickable as a shortcut navigation
- Step list is generated by `getActiveSteps(activePhases)`

### P1-05 — Current Workspace Status
As a Solution Architect, I want to see a summary of my current estimation so I don't lose context while navigating.
- Shows: Client Name, Market Segment, Opportunity Stage, Selected Pattern, Last saved, Continue action
- Only visible when intake has been started

---

## Page 2 — Project Intake

### P2-01 — Section A: Client / Opportunity
As a Solution Architect, I want to capture client and opportunity context as the foundation for the estimation.
- Client Name (required, text)
- Opportunity Name (required, text)
- Market Segment (required, dropdown): Payer, Provider, MedTech, Pharma, Imaging, RCM, Internal Enterprise, Other
- Business Function (dropdown): Claims, Prior Authorization, Care Management, Member Experience, Clinical Workflow, IT Support, Research, Imaging Operations, Revenue Cycle, Enterprise Knowledge, Other
- Opportunity Stage (dropdown): Discovery, Proposal, RFP, SOW, MVP Planning, Production Planning
- Target Delivery Type (dropdown): Advisory, MVP, Pilot, Production Build, Production Support, Managed Service

### P2-02 — Section B: Business Requirement
As a Solution Architect, I want to document the business problem and target personas so the estimation reflects real context.
- Business Problem textarea (required, min 30 chars, with char counter)
- Current Manual Process textarea
- Desired Future State textarea
- Target Users / Personas (multi-select chips): Business User, Claims Analyst, Nurse, Physician, Care Manager, Support Engineer, Data Scientist, Researcher, Customer Care Agent, Admin Staff, Reviewer, Auditor, Developer
- Expected Business Outcomes (checkboxes): Reduce manual effort, Reduce turnaround time, Improve accuracy, Improve compliance, Improve user experience, Improve revenue cycle, Reduce cost, Improve quality metrics, Increase throughput, Reduce risk

### P2-03 — Section C: Data and System Inputs
As a Solution Architect, I want to capture data types and system inputs so the estimation reflects the actual integration complexity.
- Data Types (checkboxes): Structured Data, Unstructured Documents, PDFs, Scanned Documents, Clinical Notes, Claims Data, Contracts, Policies, Guidelines, Audio, Images, FHIR/HL7, SQL Tables, Logs, Knowledge Base
- Source Systems (input chips): EHR System, Claims System, CRM, RIS/PACS, Document Repository, Knowledge Base, Data Warehouse, SQL Database, APIs, Cloud Storage, Workflow Tool
- PHI/PII toggle
- Compliance framework multi-select: HIPAA, SOC 2 Type II, GDPR, HITRUST, FDA 21 CFR Part 11, FedRAMP, PCI-DSS
- EHR System select: Epic, Cerner / Oracle Health, Meditech, Athenahealth, Custom / Other, Not Applicable
- Integration Standard select: FHIR R4, FHIR R4B, FHIR DSTU2, Proprietary API, Not Applicable
- FDA Regulatory Pathway select: Not a medical device, Class I, Class II, Under Assessment, Not Applicable
- Clinical Validation Required switch enabled only when PHI/PII is on

### P2-04 — Section D: Engagement & Commercial Context
As a Solution Architect, I want to capture commercial context so delivery planning and proposal framing are aligned.
- Engagement Type select: New Build, Enhancement / Extension, Advisory, PoC / Pilot, Managed Service
- Commercial Model select: T&M, Fixed Price, Milestone-based, Managed Service, Hybrid T&M + Milestone
- Budget Indicator select: Under $250K, $250K-$500K, $500K-$1M, $1M-$2M, $2M+, TBD / Not Disclosed
- Green completion indicator when all three values are selected
- Fields drive the Delivery & Support tab and exports

### P2-05 — Intake Validation
As a Solution Architect, I want validation so I can't proceed with incomplete context.
- Client Name required before export
- Opportunity Name required
- Market Segment required
- Business Problem min 30 chars
- At least one Data Type required
- PHI/PII ON requires at least one compliance framework
- Opportunity Stage = Production Planning → governance warning later in workflow

---

## Page 3 — Solution Identification

### P3-01 — Classification Catalogue
As a Solution Architect, I want to browse and manage solution patterns so I can select the right pattern for my use-case.
- Pattern catalogue table with search, filters, sort, optional columns, and row expansion
- Columns cover pattern name, when to use, capabilities, triggers, architecture implications, estimation implications, delivery notes, and export inclusion
- Status badge per card: Planned / Available / Recommended
- Actions: Select, add classification, edit custom rows, delete custom rows, reset catalogue

### P3-02 — Recommendation Logic
As a Solution Architect, I want the system to auto-recommend a pattern based on my intake so I have a starting point.
- Recommendations derived from intake: business problem text + data types + opportunity stage
- "Recommended" banner above grid with pattern name + brief reasoning
- Recommended card visually highlighted (blue border)

### P3-03 — Selected Pattern Panel
As a Solution Architect, I want a detail panel for the selected pattern so I understand the estimation implications.
- Recommended Pattern name
- Why recommended (reasoning from intake signals)
- Architecture implications
- Estimation implications (complexity multiplier hint)
- Suggested next step

### P3-04 — Embedded Complexity Calibration
As a Solution Architect, I want to score 10 dimensions 1–5 so the system can generate calibrated delivery guidance.
- Dimensions: Data Sources, Data Types, Integration Depth, AI Pattern, Governance Need, User Scale, Compliance Requirement, Ground Truth Availability, SME Validation Need, Production Readiness
- Score buttons 1–5 per dimension; unscored = Required indicator
- Collapsible panel below the pattern catalogue
- Always-visible summary pill with complexity band, score, and multiplier

### P3-05 — Live Score Output
As a Solution Architect, I want instant feedback on my score so I understand the delivery implications.
- Running total score displayed prominently
- Band classification: 0–15 Low, 16–28 Medium, 29–40 High, 41+ Very High
- Output cards: Complexity Level, Recommended Delivery Model, Team Size, Timeline Band, Risk Level, Estimation Multiplier

### P3-06 — Pattern Library Entry Point
As a Solution Architect, I want to access the Pattern Library from Solution Identification so I can review deeper pattern assets without a direct URL.
- "Browse Pattern Library" link in the Solution Identification header
- Navigates to `/patterns-library`

### P3-07 — Score Validation
As a Solution Architect, I want all 10 dimensions scored before I proceed.
- Unscored dimensions highlighted
- "Next" button disabled until all 10 are scored

---

## Registered Utility Page — Solution Pattern Builder

### U1-01 — Template Cards
As a Solution Architect, I want to see all available templates as cards so I can choose which to build from.
- 6 template cards from master list
- Each card: Status badge (Available / Planned), Template Type, Primary Output, Description, Open button
- Available: Azure Agentic AI Estimation (navigates to Estimation & Delivery)
- Planned: all others → open "Planned — future iteration" modal

### U1-02 — Planned Template Modal
As a Solution Architect, I want to understand what planned templates will offer so I can plan ahead.
- Modal with template name, description, primary output
- Redirect suggestion: "Use Azure Agentic AI template in the meantime"

---

## Page 4 — Estimation & Delivery

### P4-01 — Master Template / Working Copy Toggle
As a Solution Architect, I want to work on a copy of the master template so I can customise without destroying the baseline.
- Two modes: View Master Template (read-only) / Editable Working Copy
- "Create Working Copy" button in master mode
- "Reset to Master" button in working copy mode (with confirmation)
- Master rows: read-only, cannot be deleted, can be excluded from export
- Custom rows: editable, deletable, addable only in working copy mode
- Row type indicator: Master / Custom

### P4-A — Solution Overview
As a Solution Architect, I want to document the high-level solution context for the estimation.
- Use-case Name (default: "Agentic AI Prior Authorization Assist")
- Cloud Provider: Azure (locked)
- Solution Type: Agentic Workflow + RAG + HITL + Q&T (default)
- Business Goal textarea
- Win Theme / Executive Summary textarea
- In-scope workflow (ordered steps display)

### P4-B — Azure Component Selection
As a Solution Architect, I want to select which Azure components are in scope so the estimate reflects the real architecture.
- 16 components in a checklist table: Azure OpenAI/AI Foundry, Azure AI Search, Document Intelligence, Azure Functions, App Service, API Management, Blob Storage, Cosmos DB, SQL Database, Key Vault, Entra ID, Azure Monitor, Log Analytics, Azure DevOps, Azure Communication Services, Azure Cache for Redis
- Columns: Component, Selected, Required/Optional, Purpose, Cost Driver, Include in Export

### P4-C — Agentic Orchestration Design
As a Solution Architect, I want to model the agent workflow so I can show the orchestration design in proposals.
- 8 agent cards: Intake, Retrieval, Evidence Extraction, Policy Reasoning, Recommendation, Validation/Q&T, HITL Review, Audit & Feedback
- Each card: Enabled toggle, Responsibility, Inputs, Outputs, Tools Used, Estimated LLM calls/workflow, Include in Export

### P4-D — WBS Builder
As a Solution Architect, I want a pre-built WBS that I can customise so I don't start from scratch each time.
- Editable table: Phase, Activity, Deliverable, Role, Complexity, Effort Days / Hours, Dependency, Acceptance Criteria, Row Type, Include in Export
- 28 master WBS rows preloaded across Discovery, Design, Build, Test, Deploy, KT, and Govern phases
- Healthcare rows w21–w28 are opt-in and cover PHI de-identification, FHIR/EHR integration, clinical validation, bias testing, drift monitoring, and Responsible AI documentation
- Actions: Create Working Copy, Add Row, Duplicate Row, Delete Custom Row only, Exclude Selected, Reset to Master
- Validation: Phase required, Activity required, Role required, Effort Days > 0

### P4-E — Resource Loading
As a Solution Architect, I want to load resources against the WBS so I can produce a staffing plan.
- Editable table: Role, Phase, Allocation %, Duration Weeks, Effort Days, Rate Placeholder, Cost Placeholder, Row Type, Include in Export
- 12 master roles: Solution Architect, GenAI Architect, AI/ML Engineer, Backend Engineer, Data Engineer, Cloud Engineer, Frontend Engineer, QA Engineer, Q&T Engineer, Business Analyst, Healthcare SME, Project Manager
- Calculated summary: Total Effort Days, Person Weeks, Estimated Build Duration, Resource Cost Placeholder

### P4-F — Infra + Token Estimation
As a Solution Architect, I want to estimate infrastructure and token costs so I can include indicative run-cost ranges in proposals.
- Inputs: Monthly users, concurrent users, requests/user/day, avg documents/workflow, avg pages/document, avg prompt tokens, avg retrieval context tokens, avg completion tokens, agent steps/workflow, evaluation calls/workflow, environments (Dev/QA/UAT/Prod)
- Optional unit cost placeholders: cost/1K input tokens, cost/1K output tokens, OCR cost/page, storage cost/GB, search monthly, app runtime monthly, monitoring monthly
- Calculated outputs: Workflows/month, LLM calls/month, Input tokens/month, Output tokens/month, Total tokens/month, Embedding volume, OCR page volume, Storage estimate, Vector index estimate, Monthly infra cost placeholder, Monthly token cost placeholder, Total monthly run cost placeholder
- No hardcoded prices; all unit costs are user-entered placeholders

### P4-G — Assumptions & Dependencies
As a Solution Architect, I want pre-populated assumption and dependency registers so proposals have a complete risk disclosure section.
- Assumptions table: Category, Description, Owner, Impact, Row Type, Include in Export (15 master rows)
- Dependencies table: Category, Description, Owner, Impact, Row Type, Include in Export (9 master rows)
- Default categories: Data Availability, PHI/PII, SME Availability, Ground Truth, Cloud Environment, Security Approval, Model Performance, Production Readiness, Cost Estimate
- Add custom rows; master rows cannot be deleted

### P4-H — Risk Register
As a Solution Architect, I want a pre-populated risk register so I can include risk disclosure in proposals.
- Editable table: Risk ID, Risk Description, Probability, Impact, Mitigation, Owner, Row Type, Include in Export
- 13 master risk rows, including FDA pathway, EHR API change, clinical validation, PHI logging, and physician adoption risks
- Add custom risks; master risks cannot be deleted

### P4-I — ROI Projection
As a Solution Architect, I want to quantify current-state improvement so the proposal can communicate value.
- Current effort, turnaround, error/rework, and cost inputs
- Improvement sliders for effort reduction, turnaround reduction, error reduction, and automation coverage
- Live calculated benefits and ROI narrative
- ROI notes included in exports

### P4-J — Delivery & Support
As a Solution Architect, I want to capture delivery and support assumptions so the SOW reflects how the engagement will actually be delivered.
- Engagement context read-only summary from Intake Section D
- Team structure: pod composition, onshore/offshore/nearshore mix, client resources
- Delivery model: engagement model, phase approach, PoC / Phase 0 scope, milestones, hypercare
- Support & managed service: support model, support tier, SLA availability, response time, maintenance window
- Responsibilities / RACI: client responsibilities and Internal AI Practice responsibilities
- Training & change management: training required, training approach, change management notes
- Section-level Excel, PDF, and Word exports

### P4-K — Cost Summary / TCO
As a Solution Architect, I want a quick calculated cost summary so I can sanity-check the SOW economics before export.
- Overview tab shows Estimated Build Cost (Labour), Monthly Run Cost (Infra), and 12-Month TCO
- Build labour tile shows included resource effort in both days and hours
- Build cost uses `effortDays × hoursPerDay × hourly rate`
- Monthly run cost uses the Infra & Tokens unit-rate calculation
- Overview export includes compliance frameworks, healthcare context, TCO rows, and effort days/hours

---

## Page 5 — Template Library

### P5-01 — Template Catalogue
As a Solution Architect, I want to see all templates in a searchable library so I can find and compare templates quickly.
- 16 template cards (1 Available Now, 15 Planned)
- Each card: Name, Type badge, Cloud badge, Status badge, Description, Sections list, Last edited date, Open button

### P5-02 — Search & Filter
As a Solution Architect, I want to filter the template library so I can find templates relevant to my engagement.
- Text search (name, description, type)
- Filter: Template Type (Estimation, WBS, Assumptions, Component List, etc.)
- Filter: Solution Pattern (Basic Chatbot, RAG, Agentic, NL2SQL, etc.)
- Filter: Cloud (Azure, AWS, GCP, Cloud Agnostic)
- Filter: Status (Available, Planned)
- Featured/starred templates shown first

---

## Page 6 — Export Center

### P6-01 — Export Preview / Checklist
As a Solution Architect, I want to preview what will be exported before downloading so I can verify completeness.
- Pre-export checklist showing required client, segment, pattern, complexity, WBS, resource, and delivery/support readiness
- Row count badges for WBS, resources, assumptions, and risks
- "Validate & Export" sets workspace validation status and exports when ready

### P6-02 — Excel Export
As a Solution Architect, I want to export the full estimation as an Excel workbook so I can share it with stakeholders.
- Primary: `xlsx` library → 10-section workbook
- Sections: Overview, Components, Agents, WBS, Resources, Infra & Tokens, ROI, Assumptions & Dependencies, Risks, Delivery & Support
- Fallback: CSV package download if xlsx unavailable

### P6-03 — Word Document Export
As a Solution Architect, I want to export a Word proposal document so I can include it in client proposals.
- Primary: `docx` library → structured Word document
- Sections: Cover Page, Opportunity Summary, Solution Overview, Azure Component List, Agentic Workflow Description, WBS, Resource Loading, Infra & Token Estimate, ROI, Assumptions & Dependencies, Risks, Delivery & Support
- Fallback: Word-compatible HTML `.doc` download

### P6-04 — PDF Export
As a Solution Architect, I want to export a PDF so I can attach it to emails and proposals without editing risk.
- Primary: `jsPDF` + `autoTable` → full PDF with all sections and tables, auto page-break for long tables
- Fallback: open Print-Friendly Export View in new tab for browser "Save as PDF"
- PDF must include all included rows; no content cropped

### P6-05 — JSON Export
As a Solution Architect, I want a JSON export so I can reload the workspace or use the data programmatically.
- Full workspace JSON with all sections
- Indented, readable format

### P6-06 — CSV Package Export
As a Solution Architect, I want individual CSVs so I can import data into Excel, Jira, or other tools.
- Separate CSVs: WBS, Resources, Assumptions, Dependencies, Risks, ROI
- Only `includeInExport === true` rows
- Proper CSV escaping

### P6-07 — Print-Friendly Export View
As a Solution Architect, I want a clean print view so I can produce a PDF via the browser print dialog.
- Opens in new tab
- White background, no sidebar, no controls
- All included sections expanded, full-width tables
- Page breaks between major sections
- Cover page with client name, use-case, date
- Opportunity summary includes Win Theme / Executive Summary
- Delivery & Support Considerations render as a key/value section
- Footer placeholder
- CSS `@media print` rules

### P6-08 — Export File Naming
As a Solution Architect, I want consistent file names so exports are easy to identify in my file system.
- Pattern: `{ClientName}_{UseCaseName}_{TemplateType}_{YYYY-MM-DD}`
- Example: `DemoClient_Agentic_PA_Assist_Azure_Estimation_2026-06-25`
- Falls back to `DemoClient` if client name not set

---

## Data / Architecture Features

### DA-01 — TypeScript Data Model
All workspace data modelled as TypeScript interfaces:
`WorkbenchState`, `IntakeData`, `EngagementConfig`, `DeliveryState`, `AzureOverview`, `SolutionClassification`, `ComplexityScore`, `ClassificationPattern`, `AzureComponent`, `AgentDefinition`, `WBSRow`, `ResourceRow`, `InfraTokenEstimate`, `AssumptionRow`, `DependencyRow`, `RiskRow`, `ROIState`, `ValidationStatus`

Healthcare intake additions:
- `complianceFlags: string[]`
- `ehrSystem: string`
- `fhirVersion: string`
- `fdaPathway: string`
- `clinicalValidationRequired: boolean`

### DA-02 — Master Data Files
Seed data and TypeScript interfaces live in `WorkbenchContext.tsx`.
- State persists to `localStorage`
- `seedWorkspace()` loads the DemoClient sample
- `loadFromStorage` merges persisted data with current defaults so new fields are backfilled

### DA-03 — Utility Layer
- `src/app/workflow.ts` — phase-aware workflow steps and route mapping
- `src/utils/exports/core.ts` — shared export tables, file naming, CSV helpers, calculations, section exporters
- `src/utils/exports/exportFullPackage.ts` — full-package Excel, Word, and PDF exports
- `src/utils/exports/export*.ts` — thin per-section export wrappers

### DA-04 — Live Calculations
- `totalEffortDays` = sum of WBS effort days where `includeInExport = true`
- `personWeeks` = `totalEffortDays / 5`
- `workflowsPerMonth` = `monthlyUsers × requestsPerUserPerDay × 30`
- `llmCallsPerMonth` = `workflowsPerMonth × (agentSteps + evaluationCalls)`
- `inputTokensPerMonth` = `workflowsPerMonth × agentSteps × (promptTokens + retrievalTokens)`
- `outputTokensPerMonth` = `workflowsPerMonth × agentSteps × completionTokens`
- `ocrPagesPerMonth` = `workflowsPerMonth × avgDocuments × avgPages`
