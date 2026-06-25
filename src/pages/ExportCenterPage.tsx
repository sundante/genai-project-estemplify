import { useState } from 'react'
import { useWorkspaceStore } from '../store/workspaceStore'
import { Card, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { exportWorkspaceAsJson } from '../utils/storage'
import { ExportDropdown } from '../components/common/ExportDropdown'

import { Download, FileJson, AlertTriangle, PackageCheck } from 'lucide-react'

export function ExportCenterPage() {
  const { workspace, runValidation, validationErrors, validationStatus } = useWorkspaceStore()
  const [ran, setRan] = useState(false)

  const opp = workspace.opportunity
  const est = workspace.estimation

  const counts = {
    components: est.components.filter(r => r.includeInExport).length,
    wbs: est.wbs.filter(r => r.includeInExport).length,
    resources: est.resources.filter(r => r.includeInExport).length,
    assumptions: est.assumptions.filter(r => r.includeInExport).length,
    risks: est.risks.filter(r => r.includeInExport).length,
  }

  const handleValidate = () => { runValidation(); setRan(true) }

  const handleJsonExport = () => exportWorkspaceAsJson(workspace)

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Download className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Export Center</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Generate your estimation package. All user-created content marked for export is included.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleValidate}>Run Validation</Button>
      </div>

      {/* Export preview */}
      <Card>
        <CardHeader title="Export Preview" subtitle="Summary of content that will be included in your export package" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Client</p>
            <p className="text-sm text-slate-800 dark:text-white">{opp.clientName || <span className="text-slate-400 italic">Not set</span>}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">Use Case</p>
            <p className="text-sm text-slate-800 dark:text-white">{opp.useCaseName || <span className="text-slate-400 italic">Not set</span>}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            {Object.entries(counts).map(([key, val]) => (
              <div key={key} className="bg-slate-50 dark:bg-navy-900 rounded-lg p-2.5">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{val}</p>
                <p className="text-[10px] text-slate-500 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-700 flex items-center gap-2">
          <span className="text-xs text-slate-500">Validation status:</span>
          <Badge color={validationStatus === 'Ready to Export' ? 'emerald' : validationStatus === 'Incomplete' ? 'red' : 'amber'}>
            {ran ? validationStatus : 'Not validated'}
          </Badge>
          {ran && validationErrors.length > 0 && (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {validationErrors.filter(e => e.severity === 'error').length} errors · {validationErrors.filter(e => e.severity === 'warning').length} warnings
            </span>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center flex-shrink-0">
              <PackageCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Proposal Package</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
                Export the consolidated proposal package with all included workspace sections.
              </p>
            </div>
          </div>
          <ExportDropdown section="all" label="Export Package" variant="primary" />
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-navy-900 flex items-center justify-center flex-shrink-0">
              <FileJson className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Workspace Backup</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
                Download the raw workspace data so this browser-stored work can be restored later.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={handleJsonExport}>
            Download Backup
          </Button>
        </div>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>Reminder:</strong> All workspace data is stored temporarily in your browser. Download a workspace backup to preserve your work.
      </div>
    </div>
  )
}
