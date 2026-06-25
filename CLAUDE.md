# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**GenAI Proposal & SOW Estimation Workbench** — A browser-based internal tool for Senior Solution Architects to move from RFP/discovery intake through proposal solutioning, estimation, SOW preparation, ROI, delivery planning, and exportable proposal packages for GenAI/AI opportunities.

No backend. No auth. All data persisted in browser localStorage under key `genai_proposal_sow_workbench_v1`.

## Commands

```bash
npm install          # install dependencies
npm run dev          # dev server at localhost:5173
npm run build        # production build to dist/
npm run preview      # preview production build
npx tsc --noEmit     # type-check only
```

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v3 (`darkMode: 'class'`, custom navy color palette)
- Zustand with `persist` middleware for all workspace state
- React Router v6 with nested routes
- lucide-react, clsx, date-fns
- xlsx, docx, jspdf, jspdf-autotable, file-saver, jszip (export — Phase 3)

## Architecture

### State Management

Single Zustand store (`src/store/workspaceStore.ts`) holds the entire `Workspace` object and auto-persists to localStorage. `themeStore.ts` manages dark/light mode separately. `searchStore.ts` holds ephemeral search panel state (not persisted).

### Routing

`/print-preview` renders `PrintFriendlyView` with no shell. All other routes go through `AppShell` (Sidebar + Header + StatusBanner). The `/estimation` route is a nested layout (`EstimationWorkspacePage`) with 10 tab child routes (A–J).

### Data Flow

- `src/types/index.ts` — complete TypeScript interface definitions
- `src/data/emptyWorkspace.ts` — factory functions: `createEmptyWorkspace()`, `createWBSRow()`, etc.
- `src/data/dropdownOptions.ts` — all enum/dropdown values (healthcare/life sciences domain)
- `src/data/columnDefinitions.ts` — `ColumnDef<T>[]` arrays for all editable tables
- `src/utils/calculations.ts` — complexity band, WBS totals, resource effort, infra token volumes, ROI
- `src/utils/validation.ts` — per-section validators returning `ValidationError[]`

### EditableTable Component

`src/components/common/EditableTable.tsx` is a generic inline-edit table used by all 8 tabular sections. It accepts:

- `columns: ColumnDef<T>[]` from `columnDefinitions.ts`
- Row add/change/delete/duplicate callbacks wired to Zustand actions
- Optional `summaryRow` for totals (WBS, Resources)

Cell types: `text`, `textarea`, `number`, `select`, `checkbox`, `date`, `calculated` (read-only).

## Build Phases

### Phase 1 (Complete)

- Project scaffold, all configs, complete type system
- All dropdown/enum values, factory functions, column defs
- Zustand stores (workspace, theme, search)
- All calculation utilities (complexity, WBS, resources, infra, ROI)
- Full validation framework
- AppShell layout, Sidebar, Header, StatusBanner
- All common components: Card, Badge, Button, Modal, ConfirmDialog, EditableTable, EmptyState, ValidationSummary, SearchPanel, Tooltip, WorkflowStepper
- Estimation tabs A (Overview), B (Components), C (Agents), D (WBS) — fully functional
- Estimation tabs E–J — placeholder "Coming in Phase 2"
- All pages: Home, Intake, Classify, Complexity, EstimationWorkspace, ExportCenter, TemplateLibrary, Settings
- PrintFriendlyView (PDF fallback), JSON workspace export/import (fully working)

### Phase 2 (Next)

Estimation tabs E–J with full calculations:

- `ResourcesTab` + resource effort calculations
- `InfraTokensTab` + token/infra volume calculations
- `AssumptionsTab` (3 sections: General, Dependencies, FinOps)
- `RisksTab` (RAID register)
- `RoiTab` + NPV/payback/ROI calculations
- `DeliveryModelTab` (10 sub-sections)

### Phase 3 (Next)

Export utilities:

- `src/utils/exportExcel.ts` — 10-sheet xlsx workbook (+ CSV fallback)
- `src/utils/exportWord.ts` — docx (+ HTML blob fallback)
- `src/utils/exportPdf.ts` — jspdf-autotable (+ print-preview fallback)
- `src/utils/exportCsv.ts`, `exportJson.ts`
- Full `ExportCenterPage` with all formats enabled

### Phase 4 (Final)

- Full validation wiring end-to-end with toast notifications
- Cross-section global search (currently searches basic fields)
- Print CSS polish for PrintFriendlyView
- Final dark mode + accessibility pass

## Key Conventions

- **No sample/seed data anywhere.** All tables start empty. Factory functions in `emptyWorkspace.ts` return empty rows.
- **No cloud provider assumed.** Cloud fields are user-filled. `CLOUD_PROVIDERS` includes "Cloud Agnostic" as first option.
- **All row-level changes** go through Zustand actions (e.g. `updateWbsRow`, `updateComponent`) — never mutate workspace state directly.
- **Effort days auto-derive** from hours in `updateWbsRow` via `deriveWbsEffortDays`.
- **Resource cost auto-derives** from `calculateResourceEffort` in `updateResource`.
- **Dark mode** applied via `document.documentElement.classList.toggle('dark', ...)` — Tailwind `darkMode: 'class'` strategy.
- **File naming** for exports: `{ClientName}_{UseCaseName}_{Section}_{YYYY-MM-DD}.{ext}`. Falls back to `UntitledClient_UntitledUseCase_...` if names are empty.
