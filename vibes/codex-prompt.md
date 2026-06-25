# Codex Build Brief — Round 3: SOW Completeness & Healthcare Depth

> **Status:** Complete  
> **Prerequisite:** Rounds 1 and 2 are complete. `npm run build` passes with zero TypeScript errors.  
> **Scope:** 7 tasks — healthcare intake fields, preset, master row expansion, TCO view, pattern library link.
> **Implementation result:** All 7 tasks complete. WBS and TCO surfaces show effort in both days and hours.

---

## Context

This is a browser-only SPA (React 18, TypeScript, Vite, Tailwind v4, shadcn/ui) for Senior Solution Architects at an Internal AI Practice. It produces structured, exportable proposal packages (Excel, Word, PDF, JSON) for GenAI engagements. All state lives in localStorage. No backend, no auth, no database.

Codebase: `/Users/sun/2-Works/2-Citius/genai-project-estemplify/`. Path alias `@` maps to `./src`.

The 8-step SOW workflow is complete (Intake → Solution Identification → HLD → Estimation → Risk/Assumptions → ROI → Delivery → Export). This round adds **Healthcare/Clinical AI depth** to the existing structure and closes one outstanding navigation gap.

---

## What Must NOT Change

- All TypeScript interfaces remain in `WorkbenchContext.tsx`
- No MUI, no `@mui/material`, no `@emotion`
- No `tailwind.config.js` — Tailwind v4 via `postcss.config.mjs`
- No new utility files beyond those listed here
- Approved placeholders only: `"DemoClient"`, `"Sample Payer"`, `"Sample Provider"`, `"Internal AI Practice"`, `"Agentic AI Prior Authorization Assist"`
- No inline styles — Tailwind classes only
- No comments unless WHY is non-obvious

---

## Current State (confirmed by codebase read)

- WBS master rows: **w1–w20** (20 rows)
- Assumption master rows: **a1–a9** (9 rows)
- Dependency master rows: **d1–d9** (9 rows)
- Risk master rows: **R-01–R-08** (8 rows)
- Resource rows: **r1–r12** (12 rows, includes Healthcare SME)
- `IntakeData.compliance: string` — free text field
- `IntakeData.phiPii: boolean` — exists
- No `ehrSystem`, `fhirVersion`, `fdaPathway`, `clinicalValidationRequired` fields
- Home page has 4 presets: Advisory, Technical Proposal, Effort Estimate, Full SOW Build
- `/patterns-library` route is registered but has no UI entry point

---

## Task 1 — Pattern Library Link (P-5 close)

**File:** `src/app/components/SolutionClassificationPage.tsx`

In the page header, add a "Browse Pattern Library →" button to the right of the `<h1>` tag. Use `useNavigate` (already imported via react-router) and the `ExternalLink` icon from lucide-react.

Layout: wrap the `<h1>` and button in a flex row with `justify-between items-center`.

```tsx
<button
  onClick={() => navigate('/patterns-library')}
  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
>
  Browse Pattern Library <ExternalLink className="w-3.5 h-3.5" />
</button>
```

---

## Task 2 — Healthcare Intake Fields + Compliance Multi-Select

### Step A — WorkbenchContext.tsx

**Replace** `compliance: string` in `IntakeData` with `complianceFlags: string[]`:

```ts
complianceFlags: string[];   // replaces compliance: string
```

**Add** 4 new fields to `IntakeData`:

```ts
ehrSystem: string;                 // EHR platform in use
fhirVersion: string;               // Integration API standard
fdaPathway: string;                // Regulatory classification
clinicalValidationRequired: boolean;
```

**Update `defaultState.intake`:**

```ts
complianceFlags: [],
ehrSystem: '',
fhirVersion: '',
fdaPathway: '',
clinicalValidationRequired: false,
```

**Update `seedWorkspace`:**

```ts
complianceFlags: ['HIPAA', 'SOC 2 Type II'],
ehrSystem: 'Epic',
fhirVersion: 'FHIR R4',
fdaPathway: 'Not a medical device',
clinicalValidationRequired: true,
```

`loadFromStorage` spread pattern (`{ ...defaultState.intake, ...parsed.intake }`) handles new fields automatically — no change needed there.

### Step B — UseCaseIntakePage.tsx

**Compliance field** — replace the current `<Input>` or `<Select>` for `compliance` with a checkbox group for `complianceFlags`. Options:

```ts
const COMPLIANCE_OPTIONS = ['HIPAA', 'SOC 2 Type II', 'GDPR', 'HITRUST', 'FDA 21 CFR Part 11', 'FedRAMP', 'PCI-DSS'];
```

Render as a `flex flex-wrap gap-2` row of toggle-style buttons (or checkboxes). Each click calls:
```ts
setIntake({
  complianceFlags: intake.complianceFlags.includes(flag)
    ? intake.complianceFlags.filter(f => f !== flag)
    : [...intake.complianceFlags, flag]
})
```

Selected flags show with a blue filled style; unselected are outlined. Keep this inside Section C (Data & Technical Context).

**New fields** — add to Section C below the compliance checkboxes, in a `grid grid-cols-1 md:grid-cols-3 gap-5` layout:

1. **EHR System** — `<Select>` options: `['Epic', 'Cerner / Oracle Health', 'Meditech', 'Athenahealth', 'Custom / Other', 'Not Applicable']` — calls `setIntake({ ehrSystem: value })`

2. **Integration Standard** — `<Select>` options: `['FHIR R4', 'FHIR R4B', 'FHIR DSTU2', 'Proprietary API', 'Not Applicable']` — calls `setIntake({ fhirVersion: value })`

3. **FDA Regulatory Pathway** — `<Select>` options: `['Not a medical device', 'Class I (exempt)', 'Class II (510k required)', 'Under Assessment', 'Not Applicable']` — calls `setIntake({ fdaPathway: value })`

4. **Clinical Validation Required** — `<Switch>` with label "Clinical Validation Required". Only enabled (not greyed out) when `intake.phiPii === true`. When disabled, show helper text: "Enable PHI/PII flag above to activate." Calls `setIntake({ clinicalValidationRequired: checked })`.

---

## Task 3 — Healthcare / Clinical AI Preset

**File:** `src/app/components/HomePage.tsx`

Add a 5th entry to the `PRESETS` array (after 'Full SOW Build'):

```ts
{
  name: 'Healthcare / Clinical AI',
  description: 'Full SOW for a regulated clinical GenAI engagement. Activates all phases and surfaces HIPAA, EHR integration, clinical validation, and PHI control rows throughout.',
  phases: ['intake', 'solution-id', 'hld', 'estimation', 'delivery', 'roi', 'risk-register', 'export'],
  outputs: ['Solution Brief', 'HLD', 'WBS', 'Resource Plan', 'Infra Cost', 'Risk Register', 'ROI Model', 'Delivery Plan'],
}
```

Selecting it calls `setEngagementConfig({ preset: 'Healthcare / Clinical AI', activePhases: [...all phases] })` — same pattern as 'Full SOW Build'.

**Grid adjustment:** The preset cards grid currently uses `grid-cols-2`. Change to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (or equivalent responsive classes) so 5 cards lay out cleanly without overflow on any screen size.

Optionally give the Healthcare card a teal left-border accent (`border-l-4 border-teal-500`) to visually distinguish it from the 4 generic presets.

---

## Task 4 — WBS Master Rows: Healthcare

**File:** `src/app/components/WorkbenchContext.tsx` — `defaultWbsRows` array

Append 8 rows **after w20**. All have `rowType: 'master'` and `includeInExport: false`. Match the exact shape of the existing w1–w20 entries (check the field names — likely `id`, `phase`, `task`, `role`, `hours`, `rowType`, `includeInExport`, and any other fields already on WBS rows).

| id | phase | task | role | hours |
|---|---|---|---|---|
| `w21` | `Build` | `PHI De-identification Pipeline` | `Data Engineer` | `40` |
| `w22` | `Build` | `FHIR R4 / EHR API Integration Layer` | `Backend Engineer` | `60` |
| `w23` | `Build` | `Audit Logging & PHI Access Trail` | `Cloud Engineer` | `24` |
| `w24` | `Build` | `Clinical Validation Dataset Preparation` | `Data Engineer` | `32` |
| `w25` | `Test` | `Clinical Validation Study (accuracy vs. gold standard)` | `Healthcare SME` | `40` |
| `w26` | `Test` | `Bias & Fairness Testing (demographic parity)` | `Q&T Engineer` | `24` |
| `w27` | `Deploy` | `Model Drift Monitoring Setup` | `Cloud Engineer` | `20` |
| `w28` | `Govern` | `Responsible AI Review & Documentation` | `Solution Architect` | `16` |

> **Note:** Look at the exact shape of existing WBS rows before writing these. The `phase` values must match the existing phase keys used in the WBS tab phase filter.

---

## Task 5 — Assumption Master Rows: Healthcare

**File:** `src/app/components/WorkbenchContext.tsx` — `defaultAssumptionRows` array

Append 6 rows **after a9**. All `rowType: 'master'`, `includeInExport: false`. Match the exact shape of a1–a9.

| id | category | description | owner | impact |
|---|---|---|---|---|
| `a10` | `Compliance` | `HIPAA BAA is signed with all vendors (Azure, OpenAI, vector DB provider) before project kickoff` | `Client + Legal` | `High` |
| `a11` | `Clinical` | `A named clinical champion with allocated time for UAT review and sign-off is identified at project start` | `Client Clinical Leadership` | `High` |
| `a12` | `Data` | `EHR API credentials and sandbox access are available at project kickoff — not gated on a separate procurement cycle` | `Client IT` | `High` |
| `a13` | `Regulatory` | `FDA has confirmed this use case does not constitute a Class II medical device requiring 510k clearance` | `Client + Legal` | `High` |
| `a14` | `Data` | `Training and test datasets are de-identified to HIPAA Safe Harbor standard before handover to the delivery team` | `Client Data Team` | `High` |
| `a15` | `Clinical` | `Clinical SME review cycles are time-boxed to 5 business days to prevent timeline slippage` | `Client Clinical Team` | `Medium` |

---

## Task 6 — Risk Master Rows: Healthcare

**File:** `src/app/components/WorkbenchContext.tsx` — `defaultRiskRows` array

Append 5 rows **after R-08**. All `rowType: 'master'`, `includeInExport: false`. Match the exact shape of R-01–R-08.

| id | risk | likelihood | impact | mitigation |
|---|---|---|---|---|
| `R-09` | `FDA pathway determination classifies the solution as a Class II medical device, converting a 3-month build into an 18-month regulated product program` | `Low` | `Critical` | `Complete FDA pathway assessment in Discovery; pause build if classification is uncertain` |
| `R-10` | `EHR vendor API changes or rate-limit policy updates break the integration mid-project` | `Medium` | `High` | `Abstract behind FHIR R4 adapter layer; document rollback and manual fallback plan` |
| `R-11` | `Clinical validation study reveals AI accuracy below clinical acceptance threshold, requiring model rework` | `Medium` | `High` | `Define acceptance threshold in PoC success criteria; gate P1 MVP entry on PoC validation pass` |
| `R-12` | `PHI inadvertently logged in LLM prompt or response traces, creating a HIPAA breach risk in dev/test environments` | `Medium` | `Critical` | `Implement PHI scrubbing middleware before data reaches the LLM; enforce in CI pipeline` |
| `R-13` | `Low physician adoption post-go-live due to workflow friction, resulting in projected ROI not being realised` | `High` | `High` | `Embed clinical workflow assessment in Discovery; involve clinical champion in UX walkthroughs during Build` |

---

## Task 7 — TCO Calculated View (Overview Tab + Export)

### Step A — AzureEstimationPage.tsx (OverviewTab component)

Add a read-only "Cost Summary" callout box below the existing Overview fields, before the WorkflowNav. Style as a grey/slate rounded card (`bg-slate-50 dark:bg-slate-800/50 rounded-xl border p-4`).

Label: **"Cost Summary (auto-calculated)"**  
Three metric tiles in a `grid grid-cols-3 gap-4`:

```
Estimated Build Cost (Labour)    |    Monthly Run Cost (Infra)    |    12-Month TCO
   $XXX,XXX                      |        $XX,XXX / mo             |    $XXX,XXX
```

Computed values (compute inline in the component — no new utility functions):

```ts
// Build cost: sum of included resource rows (hours × rate where available)
const buildCost = state.azure.resources
  .filter(r => r.includeInExport)
  .reduce((sum, r) => sum + ((r.hours ?? 0) * (r.rate ?? 0)), 0);

// Monthly run cost: use existing infra total field
const monthlyRun = state.azure.infra?.totalMonthlyCost ?? 0;

// TCO
const tco12 = buildCost + (monthlyRun * 12);
```

> **Before writing:** Check `AzureInfraState` for the exact field name of the monthly total (`totalMonthlyCost` or similar). Check `WbsRow` / resource row shape for `hours` and `rate` field names. Only render the tile if the value is > 0, otherwise show `'—'`.

### Step B — src/utils/exports/core.ts (sectionTable 'overview' case)

After the existing rows in the `overview` case, append:

```ts
['Compliance Frameworks', intake.complianceFlags?.join(', ') || '—'],
['Estimated Build Cost (Labour)', buildCost > 0 ? `$${buildCost.toLocaleString()}` : '—'],
['Estimated Monthly Run Cost (Infra)', monthlyRun > 0 ? `$${monthlyRun.toLocaleString()}` : '—'],
['12-Month Total Cost of Ownership', tco12 > 0 ? `$${tco12.toLocaleString()}` : '—'],
```

Remove (or replace) any existing row that references the old `intake.compliance` string field — replace with `intake.complianceFlags?.join(', ')`.

---

## Implementation Order

Execute in this order — each step depends on the previous:

1. **Task 2A** (`WorkbenchContext.tsx`) — interface changes, new fields, updated seed. Everything depends on types being correct first.
2. **Task 7B** (`core.ts`) — update `compliance → complianceFlags` in overview export; add TCO rows.
3. **Task 2B** (`UseCaseIntakePage.tsx`) — new UI fields in Section C.
4. **Task 3** (`HomePage.tsx`) — 5th preset card.
5. **Task 1** (`SolutionClassificationPage.tsx`) — Pattern Library link.
6. **Task 4, 5, 6** (`WorkbenchContext.tsx`) — append WBS/Assumption/Risk rows (back to this file).
7. **Task 7A** (`AzureEstimationPage.tsx`) — TCO calculated cards.
8. **`npm run build`** — verify zero TypeScript errors before marking complete.

---

## Verification Checklist

- [x] `npm run build` — zero TypeScript errors
- [x] Healthcare preset appears as 5th card on Home page
- [x] Selecting Healthcare preset activates all phases
- [x] Intake Section C has EHR system, FHIR version, FDA pathway selects
- [x] Clinical validation toggle only active when phiPii = true
- [x] Compliance is a multi-select checkbox group (not free text)
- [x] WBS tab shows rows w21–w28 (unchecked by default, user can include)
- [x] Assumptions tab shows rows a10–a15 (unchecked by default)
- [x] Risks tab shows rows R-09–R-13 (unchecked by default)
- [x] Overview tab shows 3 read-only TCO metric tiles
- [x] Overview export row includes `complianceFlags` joined string
- [x] Overview export includes 3 TCO rows
- [x] Pattern Library reachable from Solution Identification page via link
- [x] Load Sample Scenario sets `complianceFlags: ['HIPAA', 'SOC 2 Type II']`, `ehrSystem: 'Epic'`
- [x] Dark mode renders all new UI correctly
