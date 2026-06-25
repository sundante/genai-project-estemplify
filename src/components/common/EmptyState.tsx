import { type ReactNode } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-navy-700 flex items-center justify-center mb-4">
        {icon ?? <PlusCircle className="h-6 w-6 text-slate-400 dark:text-slate-500" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs leading-relaxed mb-4">{description}</p>
      {action && (
        <Button
          variant="primary"
          size="sm"
          icon={action.icon ?? <PlusCircle className="h-3.5 w-3.5" />}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
