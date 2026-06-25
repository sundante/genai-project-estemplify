
import { useWorkspaceStore } from '../../store/workspaceStore'
import { SectionActions } from '../common/SectionActions'
import { EditableTable } from '../common/EditableTable'
import { RESOURCE_COLUMNS } from '../../data/columnDefinitions'
import { createResourceRow } from '../../data/emptyWorkspace'
import { calculateResourceSummary } from '../../utils/calculations'
import { formatCurrency, formatNumber } from '../../utils/format'
import type { ResourceRow, WBSRow } from '../../types'
import { Button } from '../common/Button'
import { Layers, Wand2 } from 'lucide-react'

const AI_PRACTICE_DEFAULTS: Record<string, { fte: number; allocationPercent: number; ratePlaceholder: number; location: string }> = {
  'Solution Architect': { fte: 0.5, allocationPercent: 50, ratePlaceholder: 1200, location: 'Onshore' },
  'GenAI Architect': { fte: 0.5, allocationPercent: 60, ratePlaceholder: 1300, location: 'Onshore' },
  'AI/ML Engineer': { fte: 1, allocationPercent: 100, ratePlaceholder: 900, location: 'Offshore' },
  'ML Engineer': { fte: 1, allocationPercent: 100, ratePlaceholder: 900, location: 'Offshore' },
  'Data Engineer': { fte: 1, allocationPercent: 100, ratePlaceholder: 800, location: 'Offshore' },
  'Prompt Engineer': { fte: 0.5, allocationPercent: 60, ratePlaceholder: 750, location: 'Offshore' },
  'Full-stack Engineer': { fte: 1, allocationPercent: 100, ratePlaceholder: 800, location: 'Offshore' },
  'QA/Validation': { fte: 0.5, allocationPercent: 75, ratePlaceholder: 650, location: 'Offshore' },
  'PM/Scrum Master': { fte: 0.25, allocationPercent: 50, ratePlaceholder: 1000, location: 'Onshore' },
  'DevOps/MLOps': { fte: 0.5, allocationPercent: 60, ratePlaceholder: 850, location: 'Offshore' },
  'Security/Governance': { fte: 0.25, allocationPercent: 40, ratePlaceholder: 1100, location: 'Onshore' },
}

function roleKey(role: string, phase: string) {
  return `${role.trim().toLowerCase()}|${phase || 'Unassigned'}`
}

function groupWbsByRolePhase(rows: WBSRow[]) {
  const grouped = new Map<string, { role: string; phase: string; hours: number }>()
  rows.filter(row => row.includeInExport && row.ownerRole.trim()).forEach(row => {
    const role = row.ownerRole.trim()
    const phase = row.phase || 'Unassigned'
    const key = roleKey(role, phase)
    const current = grouped.get(key) ?? { role, phase, hours: 0 }
    current.hours += Number(row.hours || 0)
    grouped.set(key, current)
  })
  return [...grouped.values()]
}

function getDefaultForRole(role: string) {
  return AI_PRACTICE_DEFAULTS[role] ?? { fte: 0.5, allocationPercent: 75, ratePlaceholder: 800, location: 'Offshore' }
}

export function ResourcesTab() {
  const {
    workspace,
    addResource,
    updateResource,
    deleteResource,
    duplicateResource,
    resetResources,
  } = useWorkspaceStore()

  const rows = workspace.estimation.resources
  const wbsGroups = groupWbsByRolePhase(workspace.estimation.wbs)
  const resourceKeys = new Set(rows.map(row => roleKey(row.role, row.phase)))
  const wbsKeys = new Set(wbsGroups.map(row => roleKey(row.role, row.phase)))
  const missingFromResources = wbsGroups.filter(group => !resourceKeys.has(roleKey(group.role, group.phase)))
  const extraResources = rows.filter(row => row.role && !wbsKeys.has(roleKey(row.role, row.phase)))
  const summary = calculateResourceSummary(rows)

  const addBlankResource = () => addResource(createResourceRow())

  const buildFromWbs = () => {
    wbsGroups.forEach(group => {
      const existing = rows.find(row => roleKey(row.role, row.phase) === roleKey(group.role, group.phase))
      if (existing) {
        const durationWeeks = Math.max(1, Math.ceil(group.hours / 40))
        updateResource(existing.id, { durationWeeks })
        return
      }
      const defaults = getDefaultForRole(group.role)
      const row = createResourceRow()
      addResource({
        ...row,
        role: group.role,
        phase: group.phase,
        location: defaults.location,
        fte: defaults.fte,
        allocationPercent: defaults.allocationPercent,
        durationWeeks: Math.max(1, Math.ceil(group.hours / 40)),
        ratePlaceholder: defaults.ratePlaceholder,
      })
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Resource Loading</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI Practice resource loading aligned to WBS owner roles and phases.</p>
        </div>
        <SectionActions section="resources" onReset={resetResources} />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" icon={<Wand2 className="h-3.5 w-3.5" />} onClick={buildFromWbs} disabled={wbsGroups.length === 0}>
          Build from WBS
        </Button>
        <Button variant="secondary" size="sm" icon={<Layers className="h-3.5 w-3.5" />} onClick={addBlankResource}>
          Add Resource
        </Button>
        <span className="text-xs text-slate-400 dark:text-slate-600">
          {wbsGroups.length} WBS role-phase group{wbsGroups.length !== 1 ? 's' : ''}
        </span>
      </div>

      {(missingFromResources.length > 0 || extraResources.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {missingFromResources.length > 0 && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">WBS coverage gaps</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {missingFromResources.map(item => `${item.role} (${item.phase})`).join(', ')}
              </p>
            </div>
          )}
          {extraResources.length > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Resource rows not mapped to WBS</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {extraResources.map(item => `${item.role} (${item.phase || 'Unassigned'})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      <EditableTable<ResourceRow>
        columns={RESOURCE_COLUMNS}
        rows={rows}
        onRowAdd={addBlankResource}
        onRowChange={(id, key, value) => updateResource(id, { [key]: value } as Partial<ResourceRow>)}
        onRowDelete={deleteResource}
        onRowDuplicate={duplicateResource}
        emptyTitle="No resources loaded"
        emptyDescription="Add a resource row or build resource loading from WBS owner roles and phases."
        addLabel="Add Resource"
        maxHeight="560px"
      />

      {rows.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatNumber(summary.totalEffortHours)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Effort Hours</p>
          </div>
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatNumber(summary.totalEffortDays, 1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Effort Days</p>
          </div>
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{formatNumber(summary.personWeeks, 1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Person Weeks</p>
          </div>
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.totalCost)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Resource Cost</p>
          </div>
        </div>
      )}

      {Object.keys(summary.byRole).length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">By Role</h2>
            <div className="space-y-1">
              {Object.entries(summary.byRole).map(([role, data]) => (
                <div key={role} className="flex items-center justify-between border-b border-slate-100 dark:border-navy-700 py-2 text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{role}</span>
                  <span className="text-slate-500 dark:text-slate-400">{formatNumber(data.days, 1)} days · {formatCurrency(data.cost)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">By Phase</h2>
            <div className="space-y-1">
              {Object.entries(summary.byPhase).map(([phase, data]) => (
                <div key={phase} className="flex items-center justify-between border-b border-slate-100 dark:border-navy-700 py-2 text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{phase}</span>
                  <span className="text-slate-500 dark:text-slate-400">{formatNumber(data.hours)} hrs · {formatNumber(data.fte, 1)} FTE</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
