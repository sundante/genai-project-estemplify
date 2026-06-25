import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Download, FileDown, FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { Button } from './Button'
import { openPrintExport, type ExportSection } from '../../utils/exportSections'
import { exportWorkspaceDocument } from '../../utils/documentExports'
import { useWorkspaceStore } from '../../store/workspaceStore'

interface ExportDropdownProps {
  section: ExportSection
  label?: string
  variant?: 'primary' | 'secondary'
}

export function ExportDropdown({ section, label = 'Export', variant = 'secondary' }: ExportDropdownProps) {
  const { workspace } = useWorkspaceStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const items = [
    { label: 'Print View', icon: Printer, action: () => openPrintExport(section) },
    { label: 'Excel Workbook', icon: FileSpreadsheet, action: () => exportWorkspaceDocument(workspace, section, 'excel') },
    { label: 'Word Document', icon: FileText, action: () => exportWorkspaceDocument(workspace, section, 'doc') },
    { label: 'PDF', icon: FileDown, action: () => exportWorkspaceDocument(workspace, section, 'pdf') },
  ]

  return (
    <div ref={ref} className="relative inline-flex">
      <Button
        variant={variant}
        size="sm"
        icon={<Download className="h-3.5 w-3.5" />}
        iconRight={<ChevronDown className="h-3.5 w-3.5" />}
        onClick={() => setOpen(v => !v)}
      >
        {label}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-lg py-1">
          {items.map(({ label: itemLabel, icon: Icon, action }) => (
            <button
              key={itemLabel}
              type="button"
              onClick={() => {
                setOpen(false)
                action()
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800"
            >
              <Icon className="h-3.5 w-3.5 text-slate-400" />
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
