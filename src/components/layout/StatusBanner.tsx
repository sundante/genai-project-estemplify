import { AlertTriangle } from 'lucide-react'

export function StatusBanner() {
  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
        Temporary workspace only. Export your estimation package before closing or clearing browser data.
      </p>
    </div>
  )
}
