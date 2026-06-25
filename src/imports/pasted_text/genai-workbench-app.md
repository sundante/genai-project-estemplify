Build an interactive web application prototype called “GenAI Proposal & SOW Estimation Workbench”.

Purpose:
This web app helps Senior Solution Architects in an Internal AI Practice standardize and accelerate proposal building, SOW development, scoping, WBS creation, technology stack selection, resource loading, infrastructure estimation, token estimation, assumptions, dependencies, and exportable estimation assets for GenAI and Agentic AI use-cases.

The application should feel like a professional enterprise internal tool: clean, modern, consulting-oriented, healthcare/AI-ready, and usable during client discovery and proposal planning conversations.

Core Context:
The web app supports repeatable templates for common GenAI solution patterns:
1. AI Estimation Template
2. Advanced RAG WBS
3. Agentic Orchestration
4. Generic Assumptions and Dependencies
5. Cloud Specific Component List
6. Cloud Specific Infra + Token Estimation

Initially implement one working estimation template:
“Azure Cloud Specific Agentic AI Sample Use-case Implementation Estimation”.

Other templates should be visible as planned modules / coming soon modules.

Global Requirements:
- No login.
- No user profile.
- No backend database.
- No user-session management.
- Use browser local storage only for temporary workspace persistence.
- Show banner: “Temporary workspace only. Export your estimation package before closing or clearing browser data.”
- Add buttons: Save Temporary Workspace, Load Temporary Workspace, Reset Workspace, Export Before Closing.

Design Style:
- Enterprise SaaS dashboard style.
- Left sidebar navigation.
- Top header with page title, current workflow step, dark mode toggle, search, validation status, and export actions.
- Use white cards, light blue/teal accents, subtle borders, clean tables, badges, and stepper navigation.
- Dark mode should use dark navy background, dark cards, blue/teal highlights, readable white/gray text, and accessible contrast.
- Persist dark/light mode in browser local storage.

Primary Navigation:
Create a left sidebar with:
1. Home / Workbench Overview
2. Use-case Intake
3. Solution Classification
4. Complexity Scoring
5. Solution Pattern Builder
6. Azure Agentic AI Estimation
7. WBS Builder
8. Resource Loading
9. Infra + Token Estimation
10. Assumptions & Dependencies
11. Risks
12. Export Center
13. Template Library

Home / Workbench Overview:
Create a dashboard with:
- Title: “GenAI Proposal & SOW Estimation Workbench”
- Subtitle: “Reusable solutioning, scoping, estimation and export toolkit for GenAI proposals.”
- Four summary cards:
  - Use-case Intake
  - Solution Classification
  - Azure Agentic AI Estimation
  - Export Proposal Assets
- Workflow stepper:
  Intake → Classify → Score Complexity → Select Pattern → Estimate → Review Assumptions → Export
- CTA: “Start New Estimation”
- CTA: “Open Azure Agentic AI Sample”

Use-case Intake Page:
Create a form with:

A. Client / Opportunity
- Client Name
- Market Segment dropdown: Payer, Provider, MedTech, Pharma, Imaging, RCM, Internal Enterprise
- Business Function dropdown: Claims, Prior Authorization, Care Management, Member Experience, Clinical Workflow, IT Support, Research, Imaging Operations, Revenue Cycle
- Opportunity Stage dropdown: Discovery, Proposal, RFP, SOW, MVP Planning, Production Planning

B. Business Requirement
- Business Problem textarea
- Current Manual Process textarea
- Target Users / Personas multi-select:
  Business User, Claims Analyst, Nurse, Physician, Care Manager, Support Engineer, Data Scientist, Researcher, Customer Care Agent, Admin Staff
- Expected Business Outcomes checkboxes:
  Reduce manual effort, Reduce turnaround time, Improve accuracy, Improve compliance, Improve user experience, Improve revenue cycle, Reduce cost, Improve quality metrics

C. Data and System Inputs
- Data Type checkboxes:
  Structured Data, Unstructured Documents, PDFs, Scanned Documents, Clinical Notes, Claims Data, Contracts, Policies, Guidelines, Audio, Images, FHIR/HL7, SQL Tables
- Source Systems input chips:
  EHR, Claims System, CRM, RIS/PACS, Document Repository, Knowledge Base, Data Warehouse, SQL Database, APIs
- PHI/PII toggle
- Compliance dropdown: Low, Moderate, High, HIPAA, GxP, FDA traceability, Audit-grade

Add “Save Intake Temporarily” button using local storage behavior.

Solution Classification Page:
Create a decision navigator that recommends solution type based on inputs.

Add cards for solution archetypes:
1. Basic Chatbot
2. Basic RAG
3. Advanced / Hybrid RAG
4. Agentic RAG
5. Full Agentic Workflow
6. NL2SQL / Talk-to-Data
7. Document Intelligence
8. Clinical Summarization
9. Voice / Multimodal Agent
10. Quality & Trust Layer

Each card should show:
- Pattern Name
- When to use
- Typical capabilities
- Typical complexity
- Indicative MVP timeline
- Select button

Recommendation logic:
- Simple FAQ → Basic Chatbot
- Document Q&A with citations → Basic RAG
- Multi-source enterprise/policy search → Advanced RAG
- Multi-step workflow/tool use/decisioning → Agentic Workflow
- Structured analytics query → NL2SQL
- Extraction from scanned or unstructured documents → Document Intelligence
- Voice/call/dictation → Voice Agent
- Production governance needed → Add Q&T layer

Complexity Scoring Page:
Build interactive scoring with dimensions:
- Data Sources
- Data Types
- Integration Depth
- AI Pattern
- Governance Need
- User Scale
- Compliance Requirement
- Ground Truth Availability
- SME Validation Need
- Production Readiness

Each dimension has score 1 to 5.
Show total score and classify:
- 0-15: Low Complexity
- 16-28: Medium Complexity
- 29-40: High Complexity
- 41+: Very High Complexity

Show output cards:
- Recommended Delivery Model
- Recommended Team Size
- Recommended Timeline Band
- Risk Level
- Estimation Multiplier

Solution Pattern Builder Page:
Show reusable solution templates as tiles:
- AI Estimation Template
- Advanced RAG WBS
- Agentic Orchestration
- Generic Assumptions and Dependencies
- Cloud Specific Component List
- Cloud Specific Infra + Token Estimation

For each tile show:
- Status: Available / Planned
- Description
- Primary Output
- Open Template button

Only “Azure Agentic AI Estimation” should be fully implemented.
Other tiles should open modal: “Template placeholder - to be built in future iteration”.

Template Library:
Add search and filters:
- Search by template name, category, cloud, solution type, status.
- Filters:
  - Template Type: Estimation, WBS, Assumptions, Cloud Components, Infra Cost, Token Cost, Proposal, SOW
  - Solution Pattern: Chatbot, Basic RAG, Advanced RAG, Agentic Workflow, NL2SQL, Document Intelligence, Voice Agent, Q&T
  - Cloud: Cloud Agnostic, Azure, AWS, GCP
  - Status: Available, Planned, Draft, Master, Working Copy
- Sort:
  - Name A-Z
  - Recently Edited
  - Template Type
  - Status
  - Solution Pattern

Master Template vs Working Copy:
Preserve master templates as read-only.
Users should never directly edit the master template.

When a template opens, provide:
1. View Master Template
2. Create Editable Working Copy

View Master Template mode:
- Read-only.
- Badge: “Master Template - Read Only”
- Disable add/delete/edit.
- Show “Create Working Copy” button.

Editable Working Copy mode:
- Badge: “Editable Copy”
- Allow inline editing.
- Allow adding new line items.
- Allow deleting only user-added rows.
- Preserve master rows and mark as “Master Row”.
- User-added rows marked as “Custom Row”.
- Allow reset working copy back to master.
- Add “Unsaved Changes” indicator.

Azure Agentic AI Estimation Page:
This is the first fully working template.

Use-case Scenario:
“Azure Cloud Specific Agentic AI implementation for Prior Authorization / Claims Review workflow.”

Sections:

A. Solution Overview
Fields:
- Use-case Name default: “Agentic AI Prior Authorization Assist”
- Cloud Provider: Azure
- Solution Type: Agentic Workflow + RAG + HITL + Q&T
- Business Goal textarea
- In-scope workflow:
  Intake request → Retrieve policy/guidelines → Extract evidence from documents → Match evidence to policy clauses → Generate recommendation → HITL review → Audit logging → Feedback loop

B. Azure Component Selection
Selectable component checklist:
- Azure OpenAI / Azure AI Foundry
- Azure AI Search
- Azure Document Intelligence
- Azure Functions
- Azure App Service
- Azure API Management
- Azure Blob Storage
- Azure Cosmos DB
- Azure SQL Database
- Azure Key Vault
- Entra ID
- Azure Monitor
- Log Analytics
- Azure DevOps
- Azure Communication Services optional
- Azure Cache for Redis optional

For each component show:
- Purpose
- Required / Optional
- Cost driver

C. Agentic Orchestration Design
Create visual cards for:
1. Intake Agent
2. Retrieval Agent
3. Evidence Extraction Agent
4. Policy Reasoning Agent
5. Recommendation Agent
6. Validation / Q&T Agent
7. HITL Review Agent
8. Audit and Feedback Agent

Each card should show:
- Agent responsibility
- Inputs
- Outputs
- Tools used
- Estimated calls per workflow

D. WBS Builder
Editable table columns:
- Phase
- Activity
- Deliverable
- Role
- Complexity
- Effort Days
- Dependency
- Acceptance Criteria
- Row Type: Master / Custom
- Include in Export checkbox

Preload master WBS rows:
1. Discovery and requirement validation
2. Current workflow analysis
3. Data and document inventory
4. Azure architecture design
5. Agent workflow design
6. Prompt and tool design
7. RAG ingestion pipeline
8. Document extraction pipeline
9. Policy and guideline retrieval
10. Evidence mapping logic
11. Recommendation generation
12. HITL review screen
13. Q&T evaluation setup
14. Security and PHI controls
15. DevOps pipeline setup
16. System integration
17. Testing and validation
18. UAT support
19. Deployment
20. Knowledge transfer

Rules:
- Add row only in Editable Working Copy mode.
- Delete only Custom Rows.
- Master Rows cannot be deleted.
- Allow duplicate row.
- Allow exclude selected rows from export.
- Allow reset to master.

E. Resource Loading
Editable table columns:
- Role
- Phase
- Allocation %
- Duration Weeks
- Effort Days
- Rate Placeholder
- Cost Placeholder
- Row Type
- Include in Export

Preload roles:
- Solution Architect
- GenAI Architect
- AI/ML Engineer
- Backend Engineer
- Data Engineer
- Cloud Engineer
- Frontend Engineer
- QA Engineer
- Q&T Engineer
- Business Analyst
- Healthcare SME
- Project Manager

Show calculated summary:
- Total Effort Days
- Total Person Weeks
- Estimated Build Duration
- Resource Cost Placeholder

F. Infra + Token Estimation
Inputs:
- Monthly users
- Concurrent users
- Requests per user per day
- Average documents per workflow
- Average pages per document
- Average prompt tokens
- Average retrieval context tokens
- Average completion tokens
- Agent steps per workflow
- Evaluation calls per workflow
- Environments: Dev, QA, UAT, Prod

Calculated outputs:
- Workflows per month
- LLM calls per month
- Input tokens per month
- Output tokens per month
- Embedding volume estimate
- OCR page volume
- Storage estimate
- Vector index estimate
- Monthly infra cost placeholder
- Monthly token cost placeholder
- Total monthly run cost placeholder

Use placeholder cost fields, not real pricing.
Allow user to type unit rates later.

G. Assumptions & Dependencies
Create editable lists with:
- Category
- Description
- Owner
- Impact
- Row Type
- Include in Export

Default Assumption Categories:
- Data Availability
- PHI/PII and Compliance
- SME Availability
- Ground Truth
- Cloud Environment
- Security Approval
- Model Performance
- Production Readiness
- Cost Estimate

Default Dependency Categories:
- Source System Access
- API Availability
- Azure Subscription
- Network / Security
- SME Review
- Test Data
- Ground Truth Dataset
- UAT Users
- Production Approval

H. Risks
Editable risk register:
- Risk ID
- Risk Description
- Probability
- Impact
- Mitigation
- Owner
- Row Type
- Include in Export

Default risks:
- Data quality issues may impact extraction and model performance.
- Lack of labeled or ground truth data may delay evaluation.
- PHI/PII controls may increase delivery timeline.
- Integration endpoint availability may delay implementation.
- Token costs may vary based on usage and model selection.
- SME availability may impact validation timelines.
- Hallucination risk requires Q&T and HITL controls.
- Scope creep may occur if production integrations expand.

Input Validation:
Add user input validation across all forms.

Use-case Intake:
- Client Name required before export.
- Use-case Name required.
- Market Segment required.
- Business Problem must be at least 30 characters.
- At least one Data Type must be selected.
- If PHI/PII is ON, Compliance Level cannot be Low.
- If Production Planning is selected, Governance Need should not be Basic.

Complexity Scoring:
- All dimensions must have a score.
- Score must be 1 to 5.
- Missing fields show red border and helper text.

Azure Agentic AI Estimation:
- Use-case Name required.
- At least one Azure component selected.
- At least one agent enabled.
- WBS must have at least one row.
- Each WBS row must have Phase, Activity, Role, Effort Days.
- Effort Days numeric and greater than 0.
- Resource rows must have Role, Allocation %, Duration Weeks, Effort Days.
- Allocation % between 1 and 100.
- Duration Weeks greater than 0.
- Token fields numeric and non-negative.
- Monthly users and requests per user per day greater than 0 before calculating monthly token cost.

Validation UX:
- Inline red text for errors.
- Amber warnings for optional gaps.
- Green check indicators for complete sections.
- Add “Validate Estimation” button.
- Add “Validation Passed” state before export.
- If exporting with warnings, show confirmation modal.

Export Center:
Create robust export center with:
1. Export Excel
2. Export Word Document
3. Export PDF
4. Export JSON
5. Export CSV Package

Export Preview Modal:
Before export show:
- Included sections
- Number of WBS rows
- Number of resource rows
- Number of assumptions
- Number of dependencies
- Number of risks
- Validation status
- Export format selected

Excel Export:
Generate workbook-style export with separate sheets/tabs:
- Opportunity Summary
- Use-case Classification
- Complexity Score
- Azure Component Selection
- Agentic Orchestration
- WBS
- Resource Loading
- Infra Estimation
- Token Estimation
- Assumptions
- Dependencies
- Risks
- Cost Summary

If true XLSX is unavailable, generate Excel-compatible CSV package but keep UI label “Export Excel”.

Word Export:
Generate Word-style document with:
- Cover Page
- Client / Opportunity Summary
- Solution Overview
- Recommended Architecture Pattern
- Azure Component List
- Agentic Workflow Description
- WBS Summary
- Resource Loading Summary
- Infra and Token Estimate Summary
- Assumptions
- Dependencies
- Risks
- Acceptance Criteria
- Appendix with detailed tables

If true DOCX is unavailable, generate Word-compatible formatted HTML that opens in a new tab.

PDF Export:
PDF export must include all pages and all content.
Do not crop long tables.
Do not cut off hidden sections.

Before PDF export:
- Expand all collapsed sections.
- Include all rows marked “Include in Export”.
- Use a print-safe layout.
- Repeat table headers where possible.
- Add page breaks between major sections.
- Add cover page and timestamp.
- Add footer with page number placeholder if possible.

If direct PDF generation is limited:
- Open print-friendly full export view in a new browser tab.
- Provide button: “Print / Save as PDF”.
- Ensure print view contains all sections and all rows.
- Add note: “Use browser Save as PDF to export full content.”

Print-Friendly Export View:
Create dedicated export page/view:
- White background
- No sidebar
- No interactive controls
- All sections expanded
- Tables full width
- Page-break styling
- Header with solution name
- Footer with confidentiality placeholder
- Include all content from editable working copy
- Open in a new tab when clicking “Open Print-Friendly PDF View”

Export File Naming:
Use:
<ClientName>_<UseCaseName>_<TemplateType>_<Date>

Example:
DemoClient_Agentic_PA_Assist_Azure_Estimation_2026-06-25

Export Integrity:
Ensure exports include:
- All visible and hidden sections selected for export.
- All custom rows.
- All master rows unless excluded.
- All validation warnings.
- Assumptions, dependencies and risks marked Include in Export.
- Full WBS and resource loading tables.
- Full infra and token estimate tables.
- User notes and client context.

Visual Enhancements:
- Dark mode toggle.
- Global template search.
- Validation icons per section.
- Status pills: Draft, Validated, Ready to Export.
- Master / Custom row badges.
- Available Now badge for Azure Agentic AI template.
- Planned badge for future templates.
- Sticky export actions on estimation pages.
- Unsaved changes indicator.

Important:
The prototype should demonstrate realistic behavior even if actual file generation is simulated.
Where browser limitations exist, use export previews, downloadable CSV/JSON/HTML, or print-friendly new tab output.
The core goal is to show the workflow and product experience for reusable proposal, SOW and estimation asset generation.