import { NavLink } from 'react-router-dom'
import {
  Home, ClipboardList, Layers, Zap, BarChart3,
  Download, BookOpen, Settings, ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/intake', icon: ClipboardList, label: 'Intake' },
  { to: '/classify', icon: Layers, label: 'Solution Pattern' },
  { to: '/estimation', icon: BarChart3, label: 'Estimation Workspace' },
  { to: '/export', icon: Download, label: 'Export Center' },
  { to: '/templates', icon: BookOpen, label: 'Example Estimations' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-navy-700 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200 dark:border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">GenAI Workbench</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Proposal & SOW</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('h-4 w-4 flex-shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300')} />
                <span className="flex-1 leading-tight">{label}</span>
                {isActive && <ChevronRight className="h-3 w-3 text-blue-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 dark:border-navy-700">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed">
          GenAI Proposal & SOW<br />Estimation Workbench v1.0
        </p>
      </div>
    </aside>
  )
}
