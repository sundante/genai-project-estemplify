import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import clsx from 'clsx'
import { ExportDropdown } from '../components/common/ExportDropdown'

const TABS = [
  { label: 'A. Overview', path: '/estimation/overview' },
  { label: 'B. Components', path: '/estimation/components' },
  { label: 'C. WBS', path: '/estimation/wbs' },
  { label: 'D. Resources', path: '/estimation/resources' },
  { label: 'E. Assumptions', path: '/estimation/assumptions' },
  { label: 'F. Risks', path: '/estimation/risks' },
  { label: 'G. ROI', path: '/estimation/roi' },
  { label: 'H. Delivery', path: '/estimation/delivery' },
]

export function EstimationWorkspacePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex-shrink-0 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700 px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 mr-3 flex-shrink-0">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Estimation</span>
          </div>
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                clsx(
                  'flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white'
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ExportDropdown section="all" label="Export All" variant="primary" />
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
