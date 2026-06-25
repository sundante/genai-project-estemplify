import { Sun, Moon, Search, Save, Download, CheckCircle } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { useSearchStore } from '../../store/searchStore'
import { getStatusColor, getStatusColorDark } from '../../utils/validation'
import { formatDatetime } from '../../utils/format'
import clsx from 'clsx'

export function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const { workspace, isDirty, lastSaved, markSaved, runValidation, validationStatus } = useWorkspaceStore()
  const { openSearch } = useSearchStore()

  const clientName = workspace.opportunity.clientName
  const useCaseName = workspace.opportunity.useCaseName

  const handleValidate = () => {
    runValidation()
    markSaved()
  }

  return (
    <header className="flex-shrink-0 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700 px-4 py-3 flex items-center gap-3">
      {/* Workspace identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-white truncate">
            {clientName || 'Untitled Client'}
          </h1>
          {clientName && useCaseName && (
            <>
              <span className="text-slate-300 dark:text-slate-600 text-sm">/</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{useCaseName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={clsx('text-[10px] px-1.5 py-0.5 rounded border font-medium', getStatusColor(validationStatus), getStatusColorDark(validationStatus))}>
            {validationStatus}
          </span>
          {isDirty && (
            <span className="text-[10px] text-amber-500 dark:text-amber-400 font-medium">● Unsaved changes</span>
          )}
          {lastSaved && !isDirty && (
            <span className="text-[10px] text-slate-400 dark:text-slate-600">Saved {formatDatetime(lastSaved)}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={openSearch}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Global Search (⌘K)"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          onClick={handleValidate}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Validate & Save"
        >
          <CheckCircle className="h-4 w-4" />
        </button>

        <button
          onClick={markSaved}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            isDirty
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700'
          )}
          title="Save workspace"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>

        <a
          href="/export"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </a>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>
    </header>
  )
}
