import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useSearchStore } from '../../store/searchStore'
import { useWorkspaceStore } from '../../store/workspaceStore'

interface SearchResult {
  section: string
  label: string
  preview: string
}

function searchWorkspace(query: string, workspace: ReturnType<typeof useWorkspaceStore.getState>['workspace']): SearchResult[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const results: SearchResult[] = []

  const check = (section: string, label: string, text: string) => {
    if (text?.toLowerCase().includes(q)) results.push({ section, label, preview: text.slice(0, 80) })
  }

  // Intake
  check('Intake', 'Client Name', workspace.opportunity.clientName)
  check('Intake', 'Use Case Name', workspace.opportunity.useCaseName)
  check('Intake', 'Business Problem', workspace.opportunity.businessProblem)

  // WBS
  workspace.estimation.wbs.forEach(r => {
    check('WBS', r.task || 'Task', r.task)
    check('WBS', 'Deliverable', r.deliverable)
  })

  // Components
  workspace.estimation.components.forEach(r => {
    check('Components', r.logicalComponent || 'Component', r.logicalComponent)
    check('Components', 'Purpose', r.purpose)
  })

  // Assumptions
  workspace.estimation.assumptions.forEach(r => {
    check('Assumptions', 'Assumption', r.description)
  })

  // Risks
  workspace.estimation.risks.forEach(r => {
    check('Risks', r.riskId || 'Risk', r.description)
  })

  // Resources
  workspace.estimation.resources.forEach(r => {
    check('Resources', r.role || 'Role', r.role)
  })

  return results.slice(0, 30)
}

export function SearchPanel() {
  const { isOpen, query, setQuery, closeSearch } = useSearchStore()
  const { workspace } = useWorkspaceStore()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); useSearchStore.getState().openSearch() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  if (!isOpen) return null

  const results = searchWorkspace(query, workspace)
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    acc[r.section] = acc[r.section] || []
    acc[r.section].push(r)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={closeSearch} />
      <div className="relative w-full max-w-xl bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-navy-700">
          <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search workspace - WBS, components, resources, risks..."
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button onClick={closeSearch} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!query.trim() && (
            <p className="text-xs text-slate-400 dark:text-slate-600 text-center py-6">Start typing to search across your workspace</p>
          )}
          {query.trim() && results.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-600 text-center py-6">No matching results found.</p>
          )}
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 px-2 py-1">{section}</p>
              {items.map((item, i) => (
                <div key={i} className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-700 cursor-default">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{item.preview}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
