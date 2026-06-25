# GenAI Proposal & SOW Estimation Workbench — Implementation Status

> Last updated: 2026-06-25  
> Build: `npm run build` passes — zero TypeScript errors
> Dev server: `npm run dev` starts at `http://localhost:5173/`

---

## Round 1 — Initial Codex Build Brief (Complete)

| Area | Status | Notes |
|------|--------|-------|
| Home page redesign | ✅ Complete | Orientation-first page with outcomes, workflow stepper, sample seed, and workspace status card. |
| Workspace seed | ✅ Complete | `seedWorkspace()` loads DemoClient / Agentic AI Prior Auth Assist scenario. |
| Header cleanup | ✅ Complete | Export button removed from header. |
| Unsaved warning | ✅ Complete | Browser `beforeunload` fires when `state.azure.unsavedChanges === true`. |
| Export dependencies | ✅ Complete | `xlsx`, `docx`, `jspdf`, `jspdf-autotable`, `file-saver`, `@types/file-saver` installed. |
| ROI tab (Tab I) | ✅ Complete | Current-state inputs, improvement sliders, live calculated outcomes, narrative statement, notes. |
| Section export menus | ✅ Complete | All Azure Estimation tabs expose Excel, PDF, Word export dropdowns. |
| Export utilities | ✅ Complete | Per-section exporters + full-package workbook/PDF/Word in `src/utils/exports/`. |
| Print-friendly view | ✅ Complete | `/print-export` route reads from `genai_sow_estimation_workspace_v1`. |
| Export Center redesign | ✅ Complete | Full-package cards, individual section exports, CSV package, pre-export checklist. |
| Intake field completion | ✅ Complete | Opportunity Name, Target Delivery Type, Desired Future State, required validation, option values. |
| Global search | ✅ Complete | Grouped search overlay across templates, WBS, assumptions, risks, components, archetypes. |

---

## Round 2 — Workflow Restructure: RFP Intake to SOW Delivery (Complete)

| Task | Status | Files Changed | Notes |
|------|--------|---------------|-------|
| EngagementConfig interface + state | ✅ Complete | `WorkbenchContext.tsx` | `activePhases[]` + `preset` string; default = Full SOW Build with all 8 phases. |
| DeliveryState interface + state | ✅ Complete | `WorkbenchContext.tsx` | 20 fields covering pod, delivery model, support SLAs, RACI, training. |
| `setDelivery` + `setEngagementConfig` setters | ✅ Complete | `WorkbenchContext.tsx` | Follow same useCallback pattern as other setters. |
| 3 new IntakeData fields | ✅ Complete | `WorkbenchContext.tsx` | `engagementType`, `commercialModel`, `budgetIndicator`. |
| `executiveSummary` on AzureOverview | ✅ Complete | `WorkbenchContext.tsx` | Empty string default; seeded with sample value. |
| `loadFromStorage` spreads | ✅ Complete | `WorkbenchContext.tsx` | All new nested objects spread safely with defaults. |
| `seedWorkspace` updated | ✅ Complete | `WorkbenchContext.tsx` | Seeded: engagementConfig (Full SOW Build), Section D fields, delivery pod/SLAs, executiveSummary. |
| 6-step workflow stepper | ✅ Complete | `src/app/workflow.ts` | `ALL_WORKFLOW_STEPS` (6 steps), `WORKFLOW_STEPS` alias, `getActiveSteps()`, updated `getStepForPath()`. |
| Phase-aware WorkflowNav | ✅ Complete | `src/app/components/WorkflowNav.tsx` | Back/Next and step counter use `getActiveSteps()` — skips inactive phases. |
| Home page — Engagement Setup panel | ✅ Complete | `src/app/components/HomePage.tsx` | Preset cards + "Customise phases" collapsible checklist + Begin / Load Sample buttons. |
| Home page — dynamic stepper | ✅ Complete | `src/app/components/HomePage.tsx` | "How It Works" stepper renders from `getActiveSteps(activePhases)`. |
| Sidebar nav compression | ✅ Complete | `src/app/components/Layout.tsx` | 6 nav items; `/complexity` and `/patterns` removed from nav. |
| Phase-aware sidebar filtering | ✅ Complete | `src/app/components/Layout.tsx` | `Solution Identification` hidden if `solution-id` not active; `Estimation & Delivery` hidden if no estimation/delivery phases active. |
| Phase-aware progress bar | ✅ Complete | `src/app/components/Layout.tsx` | Uses `getActiveSteps()` for step count and indicator. |
| `/patterns` redirect | ✅ Complete | `src/app/App.tsx` | Redirects to `/estimation`; `/complexity` and `/patterns-library` still registered. |
| Intake Section D | ✅ Complete | `src/app/components/UseCaseIntakePage.tsx` | Engagement Type, Commercial Model, Budget Indicator selects; green completion indicator. |
| ComplexityScoringPage exports | ✅ Complete | `src/app/components/ComplexityScoringPage.tsx` | `dimensions`, `scoreLabels`, `getClassification` exported. |
| Solution Identification rename + complexity embed | ✅ Complete | `src/app/components/SolutionClassificationPage.tsx` | Heading renamed; Collapsible complexity calibration panel below pattern grid with 10-dim scorer. |
| Delivery section export (core.ts) | ✅ Complete | `src/utils/exports/core.ts` | `'delivery'` added to `SectionName` union; 21-row `sectionTable('delivery')` case. |
| Delivery in full-package export | ✅ Complete | `src/utils/exports/exportFullPackage.ts` | `'delivery'` appended to the `sections` array. |
| Tab J — Delivery & Support | ✅ Complete | `src/app/components/AzureEstimationPage.tsx` | 6-card tab: engagement context, team, delivery model, support SLAs, responsibilities, training. |
| Win Theme / Executive Summary field | ✅ Complete | `src/app/components/AzureEstimationPage.tsx` | Textarea added to Overview tab, binds to `overview.executiveSummary`. |
| Dynamic tab filtering (phase-aware) | ✅ Complete | `src/app/components/AzureEstimationPage.tsx` | `TAB_PHASE_MAP` + `visibleTabs` filter; defaults to first visible tab if URL param invalid. |
| Delivery sectionExporter | ✅ Complete | `src/app/components/AzureEstimationPage.tsx` | Wraps `exportSectionAsExcel/Pdf/Word('delivery', state)` from `core.ts`. |

---

## Round 3 — Tail Items (Complete)

These were not part of the core brief but were natural follow-ons identified during implementation:

| # | Item | File(s) | Status |
|---|------|---------|--------|
| P-1 | Add `executiveSummary` to overview `sectionTable()` rows | `src/utils/exports/core.ts` | ✅ Complete |
| P-2 | ExportCenterPage: include Delivery section in checklist and section list | `src/app/components/ExportCenterPage.tsx` | ✅ Complete |
| P-3 | PrintFriendlyExportView: include delivery fields and executiveSummary | `src/app/components/PrintFriendlyExportView.tsx` | ✅ Complete |
| P-4 | Global search: include intake Section D fields and delivery tab fields | `src/app/components/Layout.tsx` | ✅ Complete |
| P-5 | Pattern Library access: add a link from Solution Identification to `/patterns-library` | `src/app/components/SolutionClassificationPage.tsx` | ✅ Complete |

---

## Round 4 — SOW Completeness & Healthcare Depth (Complete)

| Task | Status | Files Changed | Notes |
|------|--------|---------------|-------|
| Healthcare intake fields | ✅ Complete | `WorkbenchContext.tsx`, `UseCaseIntakePage.tsx` | Replaced single compliance string with `complianceFlags[]`; added EHR system, FHIR/API version, FDA pathway, and PHI-gated clinical validation. |
| Healthcare / Clinical AI preset | ✅ Complete | `HomePage.tsx` | Added 5th preset with all phases active and responsive preset grid. |
| Healthcare WBS rows | ✅ Complete | `WorkbenchContext.tsx`, `AzureEstimationPage.tsx`, `core.ts` | Added w21–w28 as opt-in master rows; WBS UI/export show both effort days and effort hours. |
| Healthcare assumptions | ✅ Complete | `WorkbenchContext.tsx` | Added a10–a15 as opt-in master assumptions. |
| Healthcare risks | ✅ Complete | `WorkbenchContext.tsx` | Added R-09–R-13 as opt-in master risks. |
| Cost summary / TCO | ✅ Complete | `AzureEstimationPage.tsx`, `core.ts` | Overview tab and export include build labour cost, monthly infra run cost, 12-month TCO, and effort days/hours. |
| Pattern Library entry point | ✅ Complete | `SolutionClassificationPage.tsx` | Header button now reads “Browse Pattern Library” with external-link icon. |
| Saved workspace migration | ✅ Complete | `WorkbenchContext.tsx` | Old `compliance` value migrates to `complianceFlags`; missing healthcare master rows append without overwriting user edits. |
| Build verification | ✅ Complete | — | `npm run build` passes with zero TypeScript errors. |

---

## Files Added (Round 2)

| File | Purpose |
|------|---------|
| `src/app/workflow.ts` (new file, was inline before) | 6-step workflow definition, `getActiveSteps()`, `getStepForPath()`. |

---

## Files Updated (Round 2)

| File | Key changes |
|------|-------------|
| `src/app/components/WorkbenchContext.tsx` | `EngagementConfig`, `DeliveryState`, 3 intake fields, `executiveSummary`, setters, seed data. |
| `src/app/workflow.ts` | Rewritten: 6 steps, `getActiveSteps()`, updated `getStepForPath()`. |
| `src/app/components/WorkflowNav.tsx` | Phase-aware back/next navigation via `getActiveSteps()`. |
| `src/app/components/HomePage.tsx` | Engagement Setup panel, preset cards, phase checklist, dynamic stepper. |
| `src/app/components/Layout.tsx` | 6 nav items, phase-aware filtering, updated breadcrumb map. |
| `src/app/App.tsx` | `/patterns` redirect; `/patterns-library` route kept. |
| `src/app/components/UseCaseIntakePage.tsx` | Section D added; page title updated to "Project Intake". |
| `src/app/components/ComplexityScoringPage.tsx` | `dimensions`, `scoreLabels`, `getClassification` exported. |
| `src/app/components/SolutionClassificationPage.tsx` | Renamed to "Solution Identification"; complexity collapsible embedded. |
| `src/utils/exports/core.ts` | `'delivery'` in `SectionName`; delivery case in `sectionTable()`. |
| `src/utils/exports/exportFullPackage.ts` | `'delivery'` appended to sections array. |
| `src/app/components/AzureEstimationPage.tsx` | Tab J, executiveSummary field, `TAB_PHASE_MAP`, phase-filtered `visibleTabs`, delivery exporter. |

## Files Updated (Round 4)

| File | Key changes |
|------|-------------|
| `src/app/components/WorkbenchContext.tsx` | Healthcare intake fields, compliance flag migration, healthcare WBS/assumption/risk rows. |
| `src/app/components/UseCaseIntakePage.tsx` | Compliance multi-select, EHR/FHIR/FDA selects, clinical validation switch. |
| `src/app/components/HomePage.tsx` | Healthcare / Clinical AI preset and responsive preset grid. |
| `src/app/components/SolutionClassificationPage.tsx` | Browse Pattern Library button. |
| `src/app/components/AzureEstimationPage.tsx` | Overview TCO cards and WBS days/hours display. |
| `src/app/components/Layout.tsx` | Global search indexes healthcare intake fields. |
| `src/app/components/ExportCenterPage.tsx` | Overview row count updated for expanded export. |
| `src/utils/exports/core.ts` | Overview healthcare/TCO rows and WBS effort-hours column. |

---

## Architecture Notes

### Phase-Based Personalisation Pattern
`EngagementConfig.activePhases` is the single source of truth. It flows to:
- **Sidebar** (`Layout.tsx`) — `ALL_NAV_ITEMS` filtered at render
- **Workflow stepper** (`WorkflowNav.tsx`, `HomePage.tsx`) — `getActiveSteps(activePhases)`
- **Azure Estimation tabs** (`AzureEstimationPage.tsx`) — `TABS.filter(t => TAB_PHASE_MAP[t.id] in activePhases)`
- **WorkflowNav back/next** — navigates only within active steps

### Export Architecture
All section data is shaped in `src/utils/exports/core.ts` via `sectionTable(section, state)`.
Per-section files (`exportOverview.ts`, `exportWbs.ts`, etc.) are thin wrappers.
Full-package exports iterate the `sections` array in `exportFullPackage.ts`.
Adding a new section = one `SectionName` union entry + one `sectionTable()` case + one `sections[]` entry.
