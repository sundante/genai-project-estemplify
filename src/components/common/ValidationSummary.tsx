import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { ValidationError } from '../../types'
import clsx from 'clsx'

interface ValidationSummaryProps {
  errors: ValidationError[]
  isOpen: boolean
  onClose: () => void
}

const ICON_MAP = {
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
}

const SECTION_COLOR: Record<string, string> = {
  error: 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800',
  warning: 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800',
  info: 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800',
}

export function ValidationSummary({ errors, isOpen, onClose }: ValidationSummaryProps) {
  if (!isOpen) return null

  const grouped = errors.reduce<Record<string, ValidationError[]>>((acc, e) => {
    acc[e.section] = acc[e.section] || []
    acc[e.section].push(e)
    return acc
  }, {})

  const errorCount = errors.filter(e => e.severity === 'error').length
  const warningCount = errors.filter(e => e.severity === 'warning').length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-navy-700">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Validation Summary</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {errorCount} error{errorCount !== 1 ? 's' : ''} · {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {errors.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-emerald-500 text-3xl mb-2">✓</div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All validations passed</p>
              <p className="text-xs text-slate-500 mt-1">Your workspace is ready to export.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([section, sectionErrors]) => (
              <div key={section}>
                <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">{section}</h3>
                <div className="space-y-1.5">
                  {sectionErrors.map(e => (
                    <div key={e.id} className={clsx('flex items-start gap-2 px-3 py-2.5 rounded-lg border text-xs', SECTION_COLOR[e.severity])}>
                      <span className="flex-shrink-0 mt-0.5">{ICON_MAP[e.severity]}</span>
                      <span className="text-slate-700 dark:text-slate-300">{e.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
