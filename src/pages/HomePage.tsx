import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '../store/workspaceStore'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { formatDatetime } from '../utils/format'
import {
  ClipboardList, Layers, BarChart3, TrendingUp, Truck, Download,
  ArrowRight, Zap, RefreshCw, Play, ChevronRight,
} from 'lucide-react'

const WORKFLOW_STEPS = [
  { label: 'RFP / Discovery', color: 'bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300' },
  { label: 'Proposal Solutioning', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  { label: 'Architecture', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
  { label: 'Estimation', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
  { label: 'SOW Build', color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' },
  { label: 'ROI', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
  { label: 'Delivery Plan', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  { label: 'Export', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' },
]

const SUMMARY_CARDS = [
  { label: 'Intake', icon: ClipboardList, path: '/intake', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Solution Pattern', icon: Layers, path: '/classify', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { label: 'Estimation', icon: BarChart3, path: '/estimation', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { label: 'ROI', icon: TrendingUp, path: '/estimation/roi', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Delivery Model', icon: Truck, path: '/estimation/delivery', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Export', icon: Download, path: '/export', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { workspace, resetWorkspace, validationStatus } = useWorkspaceStore()

  const clientName = workspace.opportunity.clientName
  const useCaseName = workspace.opportunity.useCaseName
  const wbsCount = workspace.estimation.wbs.length
  const componentCount = workspace.estimation.components.length
  const riskCount = workspace.estimation.risks.length
  const hasData = !!(clientName || useCaseName || wbsCount || componentCount)

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Hero */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">GenAI Proposal & SOW Estimation Workbench</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">For Senior Solution Architects · AI Practice</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasData && (
            <Button variant="ghost" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => { if (confirm('Reset workspace? All unsaved data will be lost.')) resetWorkspace() }}>
              Reset
            </Button>
          )}
          <Button variant="primary" size="sm" icon={<Play className="h-3.5 w-3.5" />} onClick={() => navigate('/intake')}>
            {hasData ? 'Continue Workspace' : 'Start New Workspace'}
          </Button>
        </div>
      </div>

      {/* Workflow visual */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">Proposal Lifecycle</p>
        <div className="flex items-center flex-wrap gap-1">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${step.color}`}>{step.label}</span>
              {i < WORKFLOW_STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Section summary cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Workflow Sections</h2>
        <div className="grid grid-cols-3 gap-3">
          {SUMMARY_CARDS.map(({ label, icon: Icon, path, color, bg }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center gap-3 p-4 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all group text-left"
            >
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Workspace status */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Current Workspace</h2>
        {!hasData ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">No workspace data yet.</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Start by completing the Intake form.</p>
            <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('/intake')}>
              Start Intake
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-700">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{clientName || '—'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{useCaseName || 'Use case not set'}</p>
              </div>
              <Badge color={validationStatus === 'Ready to Export' ? 'emerald' : validationStatus === 'Incomplete' ? 'red' : validationStatus === 'Warnings' ? 'amber' : 'blue'}>
                {validationStatus}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: 'WBS Tasks', value: wbsCount },
                { label: 'Components', value: componentCount },
                { label: 'Resources', value: workspace.estimation.resources.length },
                { label: 'Risks', value: riskCount },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 dark:bg-navy-900 rounded-lg p-3">
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{value}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-600">
              Last updated: {formatDatetime(workspace.updatedAt)}
            </p>
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" icon={<ArrowRight className="h-4 w-4" />} iconRight={undefined} onClick={() => navigate('/intake')}>
          Go to Intake
        </Button>
        <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />} onClick={() => navigate('/export')}>
          Export Center
        </Button>
        <Button variant="ghost" size="md" icon={<BarChart3 className="h-4 w-4" />} onClick={() => navigate('/estimation')}>
          Estimation Workspace
        </Button>
      </div>
    </div>
  )
}
