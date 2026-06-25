# CLAUDE.md — GenAI Proposal & SOW Estimation Workbench

## What This Project Is

A browser-only SPA for Senior Solution Architects in the Internal AI Practice. It produces structured, exportable proposal packages (Excel, Word, PDF, JSON) for GenAI and Agentic AI engagements. No backend, no auth, no database — all state in localStorage.

---

## Non-Negotiable Constraint: Data Sanitisation

**Never use real client names, company names, or proprietary references anywhere** — not in code, UI text, seed data, comments, or export output.

Approved placeholder values only:
- `"DemoClient"`
- `"Sample Payer"`
- `"Sample Provider"`
- `"Internal AI Practice"`
- `"Agentic AI Prior Authorization Assist"`

---

## Tech Stack

| Layer | Version / Detail |
|---|---|
| React | 18.3.1 |
| TypeScript | via Vite |
| Vite | 6.x |
| Tailwind CSS | **v4** — configured via `postcss.config.mjs` and `@tailwindcss/vite` plugin. **No `tailwind.config.js`.** Dark mode uses CSS variables, not `darkMode: 'class'`. |
| shadcn/ui | Full Radix UI suite, installed at `src/app/components/ui/` |
| react-router | v7 — BrowserRouter + Outlet pattern |
| lucide-react | Icons |
| recharts | Charts (installed, used in ROI tab) |
| xlsx | Excel export |
| docx | Word export |
| jspdf + jspdf-autotable | PDF export |
| file-saver | File download trigger |
| next-themes | Available, not yet wired |
| MUI / @emotion | Installed (legacy from scaffold) — **do not use**, do not extend |

Path alias: `@` maps to `./src` (configured in `vite.config.ts`).

---

## Project Structure

```
src/
  app/
    App.tsx                         # Routes, WorkbenchProvider, BeforeUnloadWarning
    components/
      Layout.tsx                    # Sidebar, header, workspace banner
      WorkbenchContext.tsx          # Global state, localStorage, all TS interfaces, seed data
      HomePage.tsx
      UseCaseIntakePage.tsx
      SolutionClassificationPage.tsx
      ComplexityScoringPage.tsx
      SolutionPatternBuilderPage.tsx
      AzureEstimationPage.tsx       # 9-tab estimation (largest file, ~1100 lines)
      ExportCenterPage.tsx
      TemplateLibraryPage.tsx
      PrintFriendlyExportView.tsx
      ui/                           # shadcn/ui components — do not hand-edit
  utils/
    exports/                        # One file per section + core.ts + exportFullPackage.ts
      core.ts
      exportWbs.ts
      exportResources.ts
      exportAssumptions.ts
      exportRisks.ts
      exportComponents.ts
      exportAgents.ts
      exportInfra.ts
      exportRoi.ts
      exportOverview.ts
      exportFullPackage.ts
vibes/
  FeatureList.md                    # Full user story spec (source of truth for features)
  status.md                         # Implementation status tracker
  codex-prompt.md                   # Codex build brief (11 tasks)
```

---

## Architecture Patterns

### WorkbenchContext
Single source of truth. All TypeScript interfaces are defined inline in `WorkbenchContext.tsx`. The context exposes:
- `state` — full `WorkbenchState`
- `setIntake`, `setClassification`, `setComplexity`, `setAzure` — partial updaters
- `saveWorkspace` / `loadWorkspace` / `resetWorkspace` — localStorage operations
- `seedWorkspace` — loads sample DemoClient / Prior Auth scenario

localStorage key: `genai_sow_estimation_workspace_v1`

### Master / Working Copy Pattern
WBS, resource, assumption, dependency, and risk rows all have:
- `rowType: 'master' | 'custom'` — master rows are immutable originals
- `includeInExport: boolean` — only included rows appear in exports
- The working copy is a deep clone of master rows, editable by the user

### Azure Estimation Tabs
9 tabs: A. Overview, B. Components, C. Agents, D. WBS, E. Resources, F. Infra & Tokens, G. Assumptions, H. Risks, I. ROI

Each tab has a section-level export dropdown (Download icon → Excel / PDF / Word). Export functions live in `src/utils/exports/`.

---

## Key Rules for Code Changes

1. **Prefer editing existing files** over creating new ones. Avoid splitting components unless a file exceeds ~600 lines of meaningful logic.
2. **No inline styles** — use Tailwind classes. For dark mode, use `dark:` variants.
3. **Tailwind v4**: Do not add `tailwind.config.js`. Do not use `@apply` with arbitrary values. CSS variables for theming live in `src/styles/`.
4. **TypeScript interfaces** go in `WorkbenchContext.tsx` — do not scatter them into page files.
5. **No MUI** — do not import from `@mui/material` or `@emotion`. Use shadcn/ui + Tailwind.
6. **Export functions** take `WorkbenchState` as first argument. Only rows with `includeInExport === true` appear in output. File naming: `${clientName}_${useCaseName}_${section}_${YYYY-MM-DD}`.
7. **No comments** unless the WHY is non-obvious (hidden constraint, subtle invariant, workaround). No docstrings, no "added for X" comments.

---

## Dev Commands

```bash
npm run dev      # Start dev server (Vite, usually port 5173)
npm run build    # Production build to dist/
```

---

## Current Implementation Status

See [vibes/status.md](vibes/status.md) for the full gap analysis.

Summary (~70% complete):
- ✅ Full routing, layout, sidebar, dark mode toggle
- ✅ WorkbenchContext with all interfaces + seed data + localStorage
- ✅ Azure Estimation 9-tab UI with master/working-copy toggle
- ✅ BeforeUnload warning for unsaved changes
- ✅ Print-Friendly Export View (`/print-export` route)
- ✅ Export utilities (`src/utils/exports/`)
- 🟡 Home page — exists but being redesigned (orientation-first, seed button)
- 🟡 Export Center — partial (JSON/CSV work; Excel/PDF/Word need verification)
- 🟡 Intake form — 3 fields missing (Opportunity Name, Target Delivery Type, Desired Future State)
- ❌ Global search — UI-only, not wired to content
- ❌ ROI tab calculations — UI may exist but derived values need wiring to Infra estimator

## Pending Tasks (from vibes/codex-prompt.md)

1. Replace Home Page with orientation-first design + "Load Sample Scenario" seed button
2. Remove Export button from header (already done per App.tsx — verify Layout.tsx)
3. Install/verify export libraries (xlsx, docx, jspdf — now in package.json)
4. ROI tab calculations wired to Infra estimator values
5. Section-level export dropdowns on each Azure Estimation tab
6. Export Center redesign (full package cards + per-section rows + pre-export checklist)
7. Complete missing intake fields
8. Wire global search to real content

---

## Feature Spec & User Stories

Full feature list with user stories: [vibes/FeatureList.md](vibes/FeatureList.md)
