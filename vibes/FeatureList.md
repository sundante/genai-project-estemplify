# GenAI Proposal & SOW Estimation Workbench — Feature List & User Stories

> Source: completed Codex build brief  
> Date: 2026-06-25  
> Role: Senior Solution Architect (primary user)

---

## Implementation Tracker

| Brief task | Status | Notes |
|------------|--------|-------|
| Task 1 — Replace Home Page | ✅ Complete | Orientation-first page, outcomes, workflow, current workspace status, and sample seed CTA. |
| Task 2 — Remove Export Button from Header | ✅ Complete | Header export button removed. |
| Task 3 — Add beforeunload Warning | ✅ Complete | Warns when Azure working copy has unsaved changes. |
| Task 4 — Install Export Libraries | ✅ Complete | `xlsx`, `docx`, `jspdf`, `jspdf-autotable`, `file-saver`, and `@types/file-saver` installed. |
| Task 5 — Add ROI Tab to Azure Estimation | ✅ Complete | `I. ROI` tab with inputs, sliders, calculations, narrative, and notes. |
| Task 6 — Section-Level Export Icons | ✅ Complete | Export dropdown appears consistently across all 9 Azure tabs. |
| Task 7 — Export Utility Refactor | ✅ Complete | Per-section export modules plus full-package exporter created under `src/utils/exports/`. |
| Task 8 — Print-Friendly Export View | ✅ Complete | `/print-export` route reads from `genai_sow_estimation_workspace_v1`. |
| Task 9 — Export Center Redesign | ✅ Complete | Full package cards, individual section exports, CSV package, and checklist. |
| Task 10 — Complete Missing Intake Fields | ✅ Complete | Opportunity Name, Target Delivery Type, Desired Future State, and missing options added. |
| Task 11 — Wire Global Search | ✅ Complete | Grouped search overlay across templates, WBS, assumptions, risks, components, and archetypes. |

Current implementation status is tracked in [`vibes/status.md`](status.md).

---

## Global / Cross-Cutting Features

### G-01 — Enterprise Layout Shell
As a Solution Architect, I want a consistent enterprise dashboard layout so I always know where I am in the workflow.
- Left sidebar with 13 nav items and icons
- Collapsible sidebar for narrow-screen use
- Header with breadcrumb, search, status pill, unsaved indicator, and dark mode toggle
- Active nav item highlighting; sub-items visually indented under Azure Estimation

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
- Search bar in header: "Search templates, WBS, assumptions, cloud components…"
- Results grouped by type: Templates | WBS Activities | Assumptions | Risks | Azure Components | Archetypes
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

---

## Page 1 — Home / Workbench Overview

### P1-01 — Orientation Hero
As a Solution Architect, I want a dashboard overview so I can understand the tool and start quickly.
- Title: "GenAI Proposal & SOW Estimation Workbench"
- Purpose line: "Turn a GenAI use-case conversation into a structured, exportable proposal package."
- Primary CTA: "Start Fresh" → navigates to Intake
- Secondary CTA: "Load Sample Scenario" → seeds the DemoClient sample and navigates to Azure Estimation
- Confirmation shown before replacing an existing workspace

### P1-02 — Outcome Cards
As a Solution Architect, I want to understand the tangible outputs so I know what the workbench can produce.
- Client-Facing Proposal Assets
- Working Estimation Files
- Machine-Readable Package
- Each card shows deliverables and export formats

### P1-03 — Workflow Stepper
As a Solution Architect, I want a visual stepper so I can see my progress through the 7-step estimation workflow.
- Steps: Intake → Classify → Score Complexity → Select Pattern → Estimate → Review Assumptions → Export
- Completed steps shown with check mark
- Progress bar + percentage
- Each step is clickable as a shortcut navigation

### P1-04 — Current Workspace Status
As a Solution Architect, I want to see a summary of my current estimation so I don't lose context while navigating.
- Shows: Client Name, Market Segment, Opportunity Stage, Selected Pattern, Last saved, Continue action
- Only visible when intake has been started

---

## Page 2 — Use-case Intake

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
- Compliance dropdown: Low, Moderate, High, HIPAA, GxP, FDA Traceability, Audit-grade

### P2-04 — Intake Validation
As a Solution Architect, I want validation so I can't proceed with incomplete context.
- Client Name required before export
- Opportunity Name required
- Market Segment required
- Business Problem min 30 chars
- At least one Data Type required
- PHI/PII ON + Compliance = Low → blocked with error
- Opportunity Stage = Production Planning → governance warning later in workflow

---

## Page 3 — Solution Classification

### P3-01 — Archetype Cards
As a Solution Architect, I want to browse 10 solution archetype cards so I can select the right pattern for my use-case.
- 10 cards: Basic Chatbot, Basic RAG, Advanced/Hybrid RAG, Agentic RAG, Full Agentic Workflow, NL2SQL, Document Intelligence, Clinical Summarization, Voice/Multimodal Agent, Quality & Trust Layer
- Each card shows: Pattern Name, When to Use, Typical Capabilities (tags), Typical Complexity badge, Indicative MVP Timeline, Select button
- Status badge per card: Planned / Available / Recommended

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

---

## Page 4 — Complexity Scoring

### P4-01 — 10-Dimension Scoring UI
As a Solution Architect, I want to score 10 dimensions 1–5 so the system can generate calibrated delivery guidance.
- Dimensions: Data Sources, Data Types, Integration Depth, AI Pattern, Governance Need, User Scale, Compliance Requirement, Ground Truth Availability, SME Validation Need, Production Readiness
- Score buttons 1–5 per dimension; unscored = Required indicator
- Helper text explaining what Low / High means per dimension
- Optional notes field per dimension

### P4-02 — Live Score Output
As a Solution Architect, I want instant feedback on my score so I understand the delivery implications.
- Running total score displayed prominently
- Band classification: 0–15 Low, 16–28 Medium, 29–40 High, 41+ Very High
- Output cards: Complexity Level, Recommended Delivery Model, Team Size, Timeline Band, Risk Level, Estimation Multiplier

### P4-03 — Score Validation
As a Solution Architect, I want all 10 dimensions scored before I proceed.
- Unscored dimensions highlighted
- "Next" button disabled until all 10 are scored

---

## Page 5 — Solution Pattern Builder

### P5-01 — Template Cards
As a Solution Architect, I want to see all available templates as cards so I can choose which to build from.
- 6 template cards from master list
- Each card: Status badge (Available / Planned), Template Type, Primary Output, Description, Open button
- Available: Azure Agentic AI Estimation (navigates to Page 6)
- Planned: all others → open "Planned — future iteration" modal

### P5-02 — Planned Template Modal
As a Solution Architect, I want to understand what planned templates will offer so I can plan ahead.
- Modal with template name, description, primary output
- Redirect suggestion: "Use Azure Agentic AI template in the meantime"

---

## Page 6 — Azure Agentic AI Estimation (Core Template)

### P6-01 — Master Template / Working Copy Toggle
As a Solution Architect, I want to work on a copy of the master template so I can customise without destroying the baseline.
- Two modes: View Master Template (read-only) / Editable Working Copy
- "Create Working Copy" button in master mode
- "Reset to Master" button in working copy mode (with confirmation)
- Master rows: read-only, cannot be deleted, can be excluded from export
- Custom rows: editable, deletable, addable only in working copy mode
- Row type indicator: Master / Custom

### P6-A — Solution Overview
As a Solution Architect, I want to document the high-level solution context for the estimation.
- Use-case Name (default: "Agentic AI Prior Authorization Assist")
- Cloud Provider: Azure (locked)
- Solution Type: Agentic Workflow + RAG + HITL + Q&T (default)
- Business Goal textarea
- In-scope workflow (ordered steps display)

### P6-B — Azure Component Selection
As a Solution Architect, I want to select which Azure components are in scope so the estimate reflects the real architecture.
- 16 components in a checklist table: Azure OpenAI/AI Foundry, Azure AI Search, Document Intelligence, Azure Functions, App Service, API Management, Blob Storage, Cosmos DB, SQL Database, Key Vault, Entra ID, Azure Monitor, Log Analytics, Azure DevOps, Azure Communication Services, Azure Cache for Redis
- Columns: Component, Selected, Required/Optional, Purpose, Cost Driver, Include in Export

### P6-C — Agentic Orchestration Design
As a Solution Architect, I want to model the agent workflow so I can show the orchestration design in proposals.
- 8 agent cards: Intake, Retrieval, Evidence Extraction, Policy Reasoning, Recommendation, Validation/Q&T, HITL Review, Audit & Feedback
- Each card: Enabled toggle, Responsibility, Inputs, Outputs, Tools Used, Estimated LLM calls/workflow, Include in Export

### P6-D — WBS Builder
As a Solution Architect, I want a pre-built WBS that I can customise so I don't start from scratch each time.
- Editable table: Phase, Activity, Deliverable, Role, Complexity, Effort Days, Dependency, Acceptance Criteria, Row Type, Include in Export
- 20 master WBS rows preloaded across Discovery, Design, Build, Test, Deploy, KT phases
- Actions: Create Working Copy, Add Row, Duplicate Row, Delete Custom Row only, Exclude Selected, Reset to Master
- Validation: Phase required, Activity required, Role required, Effort Days > 0

### P6-E — Resource Loading
As a Solution Architect, I want to load resources against the WBS so I can produce a staffing plan.
- Editable table: Role, Phase, Allocation %, Duration Weeks, Effort Days, Rate Placeholder, Cost Placeholder, Row Type, Include in Export
- 12 master roles: Solution Architect, GenAI Architect, AI/ML Engineer, Backend Engineer, Data Engineer, Cloud Engineer, Frontend Engineer, QA Engineer, Q&T Engineer, Business Analyst, Healthcare SME, Project Manager
- Calculated summary: Total Effort Days, Person Weeks, Estimated Build Duration, Resource Cost Placeholder

### P6-F — Infra + Token Estimation
As a Solution Architect, I want to estimate infrastructure and token costs so I can include indicative run-cost ranges in proposals.
- Inputs: Monthly users, concurrent users, requests/user/day, avg documents/workflow, avg pages/document, avg prompt tokens, avg retrieval context tokens, avg completion tokens, agent steps/workflow, evaluation calls/workflow, environments (Dev/QA/UAT/Prod)
- Optional unit cost placeholders: cost/1K input tokens, cost/1K output tokens, OCR cost/page, storage cost/GB, search monthly, app runtime monthly, monitoring monthly
- Calculated outputs: Workflows/month, LLM calls/month, Input tokens/month, Output tokens/month, Total tokens/month, Embedding volume, OCR page volume, Storage estimate, Vector index estimate, Monthly infra cost placeholder, Monthly token cost placeholder, Total monthly run cost placeholder
- No hardcoded prices; all unit costs are user-entered placeholders

### P6-G — Assumptions & Dependencies
As a Solution Architect, I want pre-populated assumption and dependency registers so proposals have a complete risk disclosure section.
- Assumptions table: Category, Description, Owner, Impact, Row Type, Include in Export (9 master rows)
- Dependencies table: Category, Description, Owner, Impact, Row Type, Include in Export (9 master rows)
- Default categories: Data Availability, PHI/PII, SME Availability, Ground Truth, Cloud Environment, Security Approval, Model Performance, Production Readiness, Cost Estimate
- Add custom rows; master rows cannot be deleted

### P6-H — Risk Register
As a Solution Architect, I want a pre-populated risk register so I can include risk disclosure in proposals.
- Editable table: Risk ID, Risk Description, Probability, Impact, Mitigation, Owner, Row Type, Include in Export
- 8 master risk rows (data quality, ground truth, PHI/PII, integration, token costs, SME availability, hallucination, scope creep)
- Add custom risks; master risks cannot be deleted

---

## Page 7 — Template Library

### P7-01 — Template Catalogue
As a Solution Architect, I want to see all templates in a searchable library so I can find and compare templates quickly.
- 16 template cards (1 Available Now, 15 Planned)
- Each card: Name, Type badge, Cloud badge, Status badge, Description, Sections list, Last edited date, Open button

### P7-02 — Search & Filter
As a Solution Architect, I want to filter the template library so I can find templates relevant to my engagement.
- Text search (name, description, type)
- Filter: Template Type (Estimation, WBS, Assumptions, Component List, etc.)
- Filter: Solution Pattern (Basic Chatbot, RAG, Agentic, NL2SQL, etc.)
- Filter: Cloud (Azure, AWS, GCP, Cloud Agnostic)
- Filter: Status (Available, Planned)
- Featured/starred templates shown first

---

## Page 8 — Export Center

### P8-01 — Export Preview Modal
As a Solution Architect, I want to preview what will be exported before downloading so I can verify completeness.
- Pre-export modal showing: Included sections list, WBS row count, Resource row count, Assumption count, Dependency count, Risk count, Validation status, Selected format, Any warnings
- "Proceed with Export" and "Cancel" buttons

### P8-02 — Excel Export
As a Solution Architect, I want to export the full estimation as an Excel workbook so I can share it with stakeholders.
- Primary: `xlsx` library → 13-sheet workbook
- Sheets: Opportunity Summary, Use-case Classification, Complexity Score, Azure Component Selection, Agentic Orchestration, WBS, Resource Loading, Infra Estimation, Token Estimation, Assumptions, Dependencies, Risks, Cost Summary
- Fallback: CSV package download if xlsx unavailable

### P8-03 — Word Document Export
As a Solution Architect, I want to export a Word proposal document so I can include it in client proposals.
- Primary: `docx` library → structured Word document
- Sections: Cover Page, Opportunity Summary, Solution Overview, Architecture Pattern, Azure Component List, Agentic Workflow Description, WBS Summary, Resource Loading Summary, Infra & Token Estimate Summary, Assumptions, Dependencies, Risks, Acceptance Criteria, Appendix with detailed tables
- Fallback: Word-compatible HTML `.doc` download

### P8-04 — PDF Export
As a Solution Architect, I want to export a PDF so I can attach it to emails and proposals without editing risk.
- Primary: `jsPDF` + `autoTable` → full PDF with all sections and tables, auto page-break for long tables
- Fallback: open Print-Friendly Export View in new tab for browser "Save as PDF"
- PDF must include all included rows; no content cropped

### P8-05 — JSON Export
As a Solution Architect, I want a JSON export so I can reload the workspace or use the data programmatically.
- Full workspace JSON with all sections
- Indented, readable format

### P8-06 — CSV Package Export
As a Solution Architect, I want individual CSVs so I can import data into Excel, Jira, or other tools.
- Separate CSVs: WBS, Resources, Assumptions, Dependencies, Risks
- Only `includeInExport === true` rows
- Proper CSV escaping

### P8-07 — Print-Friendly Export View
As a Solution Architect, I want a clean print view so I can produce a PDF via the browser print dialog.
- Opens in new tab
- White background, no sidebar, no controls
- All included sections expanded, full-width tables
- Page breaks between major sections
- Cover page with client name, use-case, date
- Footer placeholder
- CSS `@media print` rules

### P8-08 — Export File Naming
As a Solution Architect, I want consistent file names so exports are easy to identify in my file system.
- Pattern: `{ClientName}_{UseCaseName}_{TemplateType}_{YYYY-MM-DD}`
- Example: `DemoClient_Agentic_PA_Assist_Azure_Estimation_2026-06-25`
- Falls back to `DemoClient` if client name not set

---

## Data / Architecture Features

### DA-01 — TypeScript Data Model
All workspace data modelled as TypeScript interfaces:
`Workspace`, `Opportunity`, `UseCaseIntake`, `SolutionClassification`, `ComplexityScore`, `SolutionArchetype`, `AzureComponent`, `AgentDefinition`, `WBSRow`, `ResourceRow`, `InfraTokenEstimate`, `AssumptionRow`, `DependencyRow`, `RiskRow`, `ExportPackage`, `ValidationError`, `TemplateMetadata`

### DA-02 — Master Data Files
Immutable seed data in separate files (never mutated directly):
`masterTemplates.ts`, `azureComponents.ts`, `archetypes.ts`, `defaultWbsRows.ts`, `defaultResourceRows.ts`, `defaultAssumptions.ts`, `defaultDependencies.ts`, `defaultRisks.ts`

### DA-03 — Utility Layer
`storage.ts` — localStorage save/load/reset  
`validation.ts` — per-page and full-package validators  
`calculations.ts` — effort totals, token math, cost placeholders  
`exportExcel.ts`, `exportWord.ts`, `exportPdf.ts`, `exportCsv.ts` — export implementations  
`ids.ts` — `crypto.randomUUID()` wrapper  

### DA-04 — Live Calculations
- `totalEffortDays` = sum of WBS effort days where `includeInExport = true`
- `personWeeks` = `totalEffortDays / 5`
- `workflowsPerMonth` = `monthlyUsers × requestsPerUserPerDay × 30`
- `llmCallsPerMonth` = `workflowsPerMonth × (agentSteps + evaluationCalls)`
- `inputTokensPerMonth` = `workflowsPerMonth × agentSteps × (promptTokens + retrievalTokens)`
- `outputTokensPerMonth` = `workflowsPerMonth × agentSteps × completionTokens`
- `ocrPagesPerMonth` = `workflowsPerMonth × avgDocuments × avgPages`
