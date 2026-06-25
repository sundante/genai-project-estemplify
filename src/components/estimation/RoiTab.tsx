
import { Construction } from 'lucide-react'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { SectionActions } from '../common/SectionActions'

export function RoiTab() {
  const { resetROI } = useWorkspaceStore()
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">ROI</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Business case and return model.</p>
        </div>
        <SectionActions section="roi" onReset={resetROI} />
      </div>
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <Construction className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Coming in Phase 2</h3>
        <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs leading-relaxed">
          This tab will be fully implemented in the next build phase.
        </p>
      </div>
    </div>
  )
}
