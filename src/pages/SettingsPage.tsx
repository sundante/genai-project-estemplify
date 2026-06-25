import { useWorkspaceStore } from '../store/workspaceStore'
import { useThemeStore } from '../store/themeStore'
import { Card, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { exportWorkspaceAsJson, importWorkspaceFromJson } from '../utils/storage'
import { formatDatetime } from '../utils/format'
import { Settings, Sun, Moon, Download, Upload, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function SettingsPage() {
  const { workspace, resetWorkspace, importWorkspace, lastSaved } = useWorkspaceStore()
  const { theme, toggleTheme } = useThemeStore()
  const [importing, setImporting] = useState(false)

  const handleImport = async () => {
    setImporting(true)
    const ws = await importWorkspaceFromJson()
    if (ws) {
      if (confirm('Replace current workspace with imported data?')) {
        importWorkspace(ws)
        alert('Workspace imported successfully.')
      }
    } else {
      alert('Could not read workspace file.')
    }
    setImporting(false)
  }

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Settings</h1>
      </div>

      {/* Theme */}
      <Card>
        <CardHeader title="Appearance" subtitle="Toggle between light and dark mode" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === 'light' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-400" />}
            <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{theme} Mode</span>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>
      </Card>

      {/* Workspace */}
      <Card>
        <CardHeader title="Workspace" subtitle="Export, import, or reset your estimation workspace" />
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-navy-700">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Workspace</p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">
                {workspace.opportunity.clientName || 'Untitled'} · Last saved: {lastSaved ? formatDatetime(lastSaved) : 'Never'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="h-3.5 w-3.5" />}
              onClick={() => exportWorkspaceAsJson(workspace)}
            >
              Export JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Upload className="h-3.5 w-3.5" />}
              onClick={handleImport}
              disabled={importing}
            >
              Import JSON
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => {
                if (confirm('Reset workspace? All data will be permanently cleared.')) resetWorkspace()
              }}
            >
              Reset Workspace
            </Button>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-600">
            Workspaces are stored in browser localStorage under key <code className="text-blue-500">genai_proposal_sow_workbench_v1</code>.
            Download a workspace backup to share or restore work between machines.
          </p>
        </div>
      </Card>

      {/* About */}
      <Card>
        <CardHeader title="About" />
        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <p><span className="font-medium text-slate-700 dark:text-slate-300">App:</span> GenAI Proposal & SOW Estimation Workbench</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Version:</span> 1.0.0-phase1</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Phase 1:</span> Core scaffold - Intake, Solution Pattern, Estimation workspace</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Phase 2:</span> Component costing, WBS, resources, ROI, delivery planning</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Phase 3:</span> Proposal package export utilities</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Phase 4:</span> Full validation, toast notifications, final polish</p>
          <p className="mt-2 text-slate-400 dark:text-slate-600">No backend · No authentication · All data local to this browser</p>
        </div>
      </Card>
    </div>
  )
}
