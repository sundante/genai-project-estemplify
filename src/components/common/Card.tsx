import { type ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const paddingClass = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }[padding]
  return (
    <section className={clsx('bg-transparent', paddingClass, className)}>
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  icon?: ReactNode
}

export function CardHeader({ title, subtitle, actions, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
