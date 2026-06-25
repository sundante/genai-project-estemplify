import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Workspace, Opportunity, SolutionClassification, EstimationOverview,
  ComponentRow, AgentRow, WBSRow, ResourceRow, InfraTokenEstimate,
  AssumptionRow, DependencyRow, RiskRow, ROIBusinessCase, DeliveryModel,
  ValidationError, WorkspaceStatus,
} from '../types'
import {
  createEmptyWorkspace, createEmptyOpportunity, createEmptyClassification, createEmptyOverview,
  createEmptyROI, createEmptyDeliveryModel,
} from '../data/emptyWorkspace'
import { deriveWbsEffortDays, deriveWbsSchedule, calculateResourceEffort, calculateComponentCosts } from '../utils/calculations'
import { validateFullPackage, getValidationStatus } from '../utils/validation'
import { safeNum } from '../utils/format'

interface WorkspaceState {
  workspace: Workspace
  isDirty: boolean
  lastSaved: string | null

  // Workspace-level
  resetWorkspace: () => void
  applyExampleEstimation: (ws: Workspace) => void
  resetOpportunity: () => void
  resetClassification: () => void
  resetOverview: () => void
  resetComponents: () => void
  resetWbs: () => void
  resetResources: () => void
  resetAssumptions: () => void
  resetRisks: () => void
  resetROI: () => void
  resetDeliveryModel: () => void
  markSaved: () => void

  // Intake
  setOpportunity: (opp: Partial<Opportunity>) => void

  // Classification
  setClassification: (cls: Partial<SolutionClassification>) => void

  // Overview
  setOverview: (overview: Partial<EstimationOverview>) => void

  // Components
  addComponent: (row: ComponentRow) => void
  updateComponent: (id: string, updates: Partial<ComponentRow>) => void
  deleteComponent: (id: string) => void
  duplicateComponent: (id: string) => void

  // Legacy agents data, retained for imported workspace compatibility
  addAgent: (row: AgentRow) => void
  updateAgent: (id: string, updates: Partial<AgentRow>) => void
  deleteAgent: (id: string) => void
  duplicateAgent: (id: string) => void

  // WBS
  addWbsRow: (row: WBSRow) => void
  updateWbsRow: (id: string, updates: Partial<WBSRow>) => void
  deleteWbsRow: (id: string) => void
  duplicateWbsRow: (id: string) => void

  // Resources
  addResource: (row: ResourceRow) => void
  updateResource: (id: string, updates: Partial<ResourceRow>) => void
  deleteResource: (id: string) => void
  duplicateResource: (id: string) => void

  // Legacy infra token data, retained for imported workspace compatibility
  setInfraTokens: (data: Partial<InfraTokenEstimate>) => void

  // Assumptions
  addAssumption: (row: AssumptionRow) => void
  updateAssumption: (id: string, updates: Partial<AssumptionRow>) => void
  deleteAssumption: (id: string) => void
  addFinopsAssumption: (row: AssumptionRow) => void
  updateFinopsAssumption: (id: string, updates: Partial<AssumptionRow>) => void
  deleteFinopsAssumption: (id: string) => void

  // Dependencies
  addDependency: (row: DependencyRow) => void
  updateDependency: (id: string, updates: Partial<DependencyRow>) => void
  deleteDependency: (id: string) => void

  // Risks
  addRisk: (row: RiskRow) => void
  updateRisk: (id: string, updates: Partial<RiskRow>) => void
  deleteRisk: (id: string) => void
  duplicateRisk: (id: string) => void

  // ROI
  setROI: (data: Partial<ROIBusinessCase>) => void

  // Delivery Model
  setDeliveryModel: (data: Partial<DeliveryModel>) => void

  // Validation
  runValidation: () => ValidationError[]
  validationErrors: ValidationError[]
  validationStatus: WorkspaceStatus

  // Import
  importWorkspace: (ws: Workspace) => void
}

function patchArray<T extends { id: string }>(arr: T[], id: string, updates: Partial<T>): T[] {
  return arr.map(item => item.id === id ? { ...item, ...updates } : item)
}

function touch(ws: Workspace): Workspace {
  return { ...ws, updatedAt: new Date().toISOString() }
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspace: createEmptyWorkspace(),
      isDirty: false,
      lastSaved: null,
      validationErrors: [],
      validationStatus: 'Draft',

      resetWorkspace: () =>
        set({
          workspace: createEmptyWorkspace(),
          isDirty: false,
          lastSaved: null,
          validationErrors: [],
          validationStatus: 'Draft',
        }),

      applyExampleEstimation: (ws) =>
        set({
          workspace: ws,
          isDirty: true,
          lastSaved: null,
          validationErrors: [],
          validationStatus: 'Draft',
        }),

      resetOpportunity: () =>
        set(s => ({ workspace: touch({ ...s.workspace, opportunity: createEmptyOpportunity() }), isDirty: true })),

      resetClassification: () =>
        set(s => ({ workspace: touch({ ...s.workspace, classification: createEmptyClassification() }), isDirty: true })),

      resetOverview: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, overview: createEmptyOverview() } }), isDirty: true })),

      resetComponents: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, components: [] } }), isDirty: true })),

      resetWbs: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, wbs: [] } }), isDirty: true })),

      resetResources: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, resources: [] } }), isDirty: true })),

      resetAssumptions: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, assumptions: [], finopsAssumptions: [], dependencies: [] } }), isDirty: true })),

      resetRisks: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, risks: [] } }), isDirty: true })),

      resetROI: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, roi: createEmptyROI() } }), isDirty: true })),

      resetDeliveryModel: () =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, deliveryModel: createEmptyDeliveryModel() } }), isDirty: true })),

      markSaved: () => set({ isDirty: false, lastSaved: new Date().toISOString() }),

      setOpportunity: (opp) =>
        set(s => ({
          workspace: touch({ ...s.workspace, opportunity: { ...s.workspace.opportunity, ...opp } }),
          isDirty: true,
        })),

      setClassification: (cls) =>
        set(s => ({
          workspace: touch({ ...s.workspace, classification: { ...s.workspace.classification, ...cls } }),
          isDirty: true,
        })),

      setOverview: (overview) =>
        set(s => ({
          workspace: touch({
            ...s.workspace,
            estimation: { ...s.workspace.estimation, overview: { ...s.workspace.estimation.overview, ...overview } },
          }),
          isDirty: true,
        })),

      // ─── Components ───────────────────────────────────────────────────────
      addComponent: (row) =>
        set(s => ({
          workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, components: [...s.workspace.estimation.components, row] } }),
          isDirty: true,
        })),

      updateComponent: (id, updates) =>
        set(s => {
          const rows = patchArray(s.workspace.estimation.components, id, updates)
          const updated = rows.map(r => r.id === id ? { ...r, ...calculateComponentCosts(r) } : r)
          return {
            workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, components: updated } }),
            isDirty: true,
          }
        }),

      deleteComponent: (id) =>
        set(s => ({
          workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, components: s.workspace.estimation.components.filter(r => r.id !== id) } }),
          isDirty: true,
        })),

      duplicateComponent: (id) => {
        const row = get().workspace.estimation.components.find(r => r.id === id)
        if (!row) return
        const dup = { ...row, id: crypto.randomUUID() }
        set(s => ({
          workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, components: [...s.workspace.estimation.components, dup] } }),
          isDirty: true,
        }))
      },

      // ─── Legacy Agents ────────────────────────────────────────────────────
      addAgent: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, agents: [...s.workspace.estimation.agents, row] } }), isDirty: true })),

      updateAgent: (id, updates) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, agents: patchArray(s.workspace.estimation.agents, id, updates) } }), isDirty: true })),

      deleteAgent: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, agents: s.workspace.estimation.agents.filter(r => r.id !== id) } }), isDirty: true })),

      duplicateAgent: (id) => {
        const row = get().workspace.estimation.agents.find(r => r.id === id)
        if (!row) return
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, agents: [...s.workspace.estimation.agents, { ...row, id: crypto.randomUUID() }] } }), isDirty: true }))
      },

      // ─── WBS ──────────────────────────────────────────────────────────────
      addWbsRow: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, wbs: [...s.workspace.estimation.wbs, row] } }), isDirty: true })),

      updateWbsRow: (id, updates) => {
        const derived: Partial<WBSRow> = {}
        if ('hours' in updates) derived.effortDays = deriveWbsEffortDays(updates.hours as WBSRow['hours'])
        set(s => ({
          workspace: touch({
            ...s.workspace,
            estimation: {
              ...s.workspace.estimation,
              wbs: s.workspace.estimation.wbs.map(row => {
                if (row.id !== id) return row
                const updated = { ...row, ...updates, ...derived }
                return { ...updated, ...deriveWbsSchedule(updated) }
              }),
            },
          }),
          isDirty: true,
        }))
      },

      deleteWbsRow: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, wbs: s.workspace.estimation.wbs.filter(r => r.id !== id) } }), isDirty: true })),

      duplicateWbsRow: (id) => {
        const row = get().workspace.estimation.wbs.find(r => r.id === id)
        if (!row) return
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, wbs: [...s.workspace.estimation.wbs, { ...row, id: crypto.randomUUID() }] } }), isDirty: true }))
      },

      // ─── Resources ────────────────────────────────────────────────────────
      addResource: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, resources: [...s.workspace.estimation.resources, row] } }), isDirty: true })),

      updateResource: (id, updates) => {
        set(s => {
          const rows = patchArray(s.workspace.estimation.resources, id, updates)
          const updated = rows.map(r => {
            if (r.id !== id) return r
            const { effortHours, effortDays, cost } = calculateResourceEffort(r)
            return { ...r, effortHours, effortDays, costPlaceholder: safeNum(r.ratePlaceholder) > 0 ? cost : r.costPlaceholder }
          })
          return { workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, resources: updated } }), isDirty: true }
        })
      },

      deleteResource: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, resources: s.workspace.estimation.resources.filter(r => r.id !== id) } }), isDirty: true })),

      duplicateResource: (id) => {
        const row = get().workspace.estimation.resources.find(r => r.id === id)
        if (!row) return
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, resources: [...s.workspace.estimation.resources, { ...row, id: crypto.randomUUID() }] } }), isDirty: true }))
      },

      // ─── Legacy Infra Token Data ──────────────────────────────────────────
      setInfraTokens: (data) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, infraTokens: { ...s.workspace.estimation.infraTokens, ...data } } }), isDirty: true })),

      // ─── Assumptions ──────────────────────────────────────────────────────
      addAssumption: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, assumptions: [...s.workspace.estimation.assumptions, row] } }), isDirty: true })),

      updateAssumption: (id, updates) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, assumptions: patchArray(s.workspace.estimation.assumptions, id, updates) } }), isDirty: true })),

      deleteAssumption: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, assumptions: s.workspace.estimation.assumptions.filter(r => r.id !== id) } }), isDirty: true })),

      addFinopsAssumption: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, finopsAssumptions: [...s.workspace.estimation.finopsAssumptions, row] } }), isDirty: true })),

      updateFinopsAssumption: (id, updates) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, finopsAssumptions: patchArray(s.workspace.estimation.finopsAssumptions, id, updates) } }), isDirty: true })),

      deleteFinopsAssumption: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, finopsAssumptions: s.workspace.estimation.finopsAssumptions.filter(r => r.id !== id) } }), isDirty: true })),

      // ─── Dependencies ─────────────────────────────────────────────────────
      addDependency: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, dependencies: [...s.workspace.estimation.dependencies, row] } }), isDirty: true })),

      updateDependency: (id, updates) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, dependencies: patchArray(s.workspace.estimation.dependencies, id, updates) } }), isDirty: true })),

      deleteDependency: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, dependencies: s.workspace.estimation.dependencies.filter(r => r.id !== id) } }), isDirty: true })),

      // ─── Risks ────────────────────────────────────────────────────────────
      addRisk: (row) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, risks: [...s.workspace.estimation.risks, row] } }), isDirty: true })),

      updateRisk: (id, updates) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, risks: patchArray(s.workspace.estimation.risks, id, updates) } }), isDirty: true })),

      deleteRisk: (id) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, risks: s.workspace.estimation.risks.filter(r => r.id !== id) } }), isDirty: true })),

      duplicateRisk: (id) => {
        const row = get().workspace.estimation.risks.find(r => r.id === id)
        if (!row) return
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, risks: [...s.workspace.estimation.risks, { ...row, id: crypto.randomUUID() }] } }), isDirty: true }))
      },

      // ─── ROI ──────────────────────────────────────────────────────────────
      setROI: (data) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, roi: { ...s.workspace.estimation.roi, ...data } } }), isDirty: true })),

      // ─── Delivery Model ───────────────────────────────────────────────────
      setDeliveryModel: (data) =>
        set(s => ({ workspace: touch({ ...s.workspace, estimation: { ...s.workspace.estimation, deliveryModel: { ...s.workspace.estimation.deliveryModel, ...data } } }), isDirty: true })),

      // ─── Validation ───────────────────────────────────────────────────────
      runValidation: () => {
        const errors = validateFullPackage(get().workspace)
        const status = getValidationStatus(errors)
        set({ validationErrors: errors, validationStatus: status })
        return errors
      },

      // ─── Import ───────────────────────────────────────────────────────────
      importWorkspace: (ws) =>
        set({
          workspace: ws,
          isDirty: false,
          lastSaved: new Date().toISOString(),
          validationErrors: [],
          validationStatus: 'Draft',
        }),
    }),
    {
      name: 'genai_proposal_sow_workbench_v1',
      partialize: (state) => ({
        workspace: state.workspace,
        lastSaved: state.lastSaved,
        validationErrors: state.validationErrors,
        validationStatus: state.validationStatus,
      }),
    }
  )
)
