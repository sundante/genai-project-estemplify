import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { StatusBanner } from './StatusBanner'
import { SearchPanel } from '../common/SearchPanel'

export function AppShell() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-navy-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StatusBanner />
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <SearchPanel />
    </div>
  )
}
