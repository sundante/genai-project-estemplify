import { type ReactNode, useState } from 'react'
import clsx from 'clsx'

interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const posClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  }[position]

  return (
    <div className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className={clsx('absolute z-50 px-2 py-1 text-xs text-white bg-slate-800 dark:bg-slate-900 rounded-md whitespace-nowrap pointer-events-none shadow-lg', posClass)}>
          {content}
        </div>
      )}
    </div>
  )
}
