import { useWorkspaceStore } from '../../store/workspaceStore'
import { createComponentRow } from '../../data/emptyWorkspace'
import { COMPONENT_COLUMNS } from '../../data/columnDefinitions'
import { EditableTable } from '../common/EditableTable'
import { Card, CardHeader } from '../common/Card'
import { SectionActions } from '../common/SectionActions'
import type { ComponentRow } from '../../types'
import { calculateComponentCostSummary } from '../../utils/calculations'
import { formatCurrency } from '../../utils/format'
import { Layers } from 'lucide-react'

export function ComponentsTab() {
  const {
    workspace,
    addComponent,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    resetComponents,
  } = useWorkspaceStore()

  const rows = workspace.estimation.components
  const costSummary = calculateComponentCostSummary(rows)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Components</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Logical components, infra sizing, and LLM sub-costing.</p>
        </div>
        <SectionActions section="components" onReset={resetComponents} />
      </div>

      <Card padding="none">
        <div className="px-5 pt-5 pb-3">
          <CardHeader
            title="Component Inventory"
            subtitle="Define solution components, infra sizing, and LLM token sub-costing. Cloud provider mappings are user-defined; no vendor is assumed."
            icon={<div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" /></div>}
          />
        </div>
        <div className="px-5 pb-5">
          <EditableTable<ComponentRow>
            columns={COMPONENT_COLUMNS}
            rows={rows}
            onRowAdd={() => addComponent(createComponentRow())}
            onRowChange={(id, key, value) => updateComponent(id, { [key]: value } as Partial<ComponentRow>)}
            onRowDelete={deleteComponent}
            onRowDuplicate={duplicateComponent}
            emptyTitle="No components defined"
            emptyDescription="Add the logical components, infra resources, and LLM sub-costs for this GenAI solution."
            addLabel="Add Component"
            maxHeight="520px"
          />
        </div>
      </Card>

      {rows.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{rows.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Components</p>
          </div>
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{rows.filter(r => r.requiredOptional === 'Required').length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Required</p>
          </div>
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{rows.filter(r => r.includeInExport).length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Included in Export</p>
          </div>
          <div className="bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(costSummary.monthlyRunCost)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monthly Run Cost</p>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <Card>
          <CardHeader
            title="Infra & LLM Cost Summary"
            subtitle="Calculated from selected component rows marked for export."
          />
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 dark:bg-navy-900 rounded-lg p-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(costSummary.monthlyInfraCost)}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Infra / Month</p>
            </div>
            <div className="bg-slate-50 dark:bg-navy-900 rounded-lg p-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(costSummary.monthlyLlmCost)}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">LLM / Month</p>
            </div>
            <div className="bg-slate-50 dark:bg-navy-900 rounded-lg p-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(costSummary.monthlyRunCost)}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Total / Month</p>
            </div>
            <div className="bg-slate-50 dark:bg-navy-900 rounded-lg p-3">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(costSummary.annualRunCost)}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Annual Run Cost</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
