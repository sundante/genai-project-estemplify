import { useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  { label: 'Intake', path: '/intake' },
  { label: 'Solution Pattern', path: '/classify' },
  { label: 'Estimation', path: '/estimation' },
  { label: 'Export', path: '/export' },
]

export function WorkflowStepper() {
  const { pathname } = useLocation()

  const currentIndex = STEPS.findIndex(s => pathname.startsWith(s.path))

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex
        const isDone = i < currentIndex

        return (
          <div key={step.path} className="flex items-center gap-1">
            <div className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'
            )}>
              {isDone ? <Check className="h-3 w-3" /> : <span className="w-3 h-3 flex items-center justify-center">{i + 1}</span>}
              <span>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={clsx('w-4 h-px', i < currentIndex ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-slate-200 dark:bg-navy-700')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
